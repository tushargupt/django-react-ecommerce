from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.conf import settings
from django.core.mail import send_mail
from django.db import transaction
from store.models import CartItem
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderCreateSerializer
import stripe
import requests

stripe.api_key = settings.STRIPE_SECRET_KEY

class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    serializer = OrderCreateSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    cart_items = CartItem.objects.filter(user=request.user)
    if not cart_items.exists():
        return Response(
            {'error': 'Cart is empty'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Calculate total
    total_amount = sum(item.total_price for item in cart_items)
    
    try:
        with transaction.atomic():
            # Create Stripe PaymentIntent
            payment_intent = stripe.PaymentIntent.create(
                amount=int(total_amount * 100),  # Convert to cents
                currency='usd',
                payment_method=serializer.validated_data['payment_method_id'],
                confirm=True,
                return_url='http://localhost:3000/orders'
            )
            
            # Create order
            order = Order.objects.create(
                user=request.user,
                total_amount=total_amount,
                shipping_address=serializer.validated_data['shipping_address'],
                stripe_payment_intent_id=payment_intent.id,
                status='processing'
            )
            
            # Create order items and update inventory
            for cart_item in cart_items:
                if cart_item.product.inventory_count < cart_item.quantity:
                    raise Exception(f"Not enough inventory for {cart_item.product.name}")
                
                OrderItem.objects.create(
                    order=order,
                    product=cart_item.product,
                    quantity=cart_item.quantity,
                    unit_price=cart_item.product.price
                )
                
                # Update inventory
                cart_item.product.inventory_count -= cart_item.quantity
                cart_item.product.save()
            
            # Clear cart
            cart_items.delete()
            
            # Send order confirmation email
            send_order_confirmation_email(order)
            
            # Send Slack notification
            send_slack_notification(order)
            
            order_serializer = OrderSerializer(order)
            return Response(order_serializer.data, status=status.HTTP_201_CREATED)
            
    except stripe.error.StripeError as e:
        return Response(
            {'error': f'Payment failed: {str(e)}'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )

def send_order_confirmation_email(order):
    """Send order confirmation email"""
    subject = f'Order Confirmation #{order.id}'
    message = f"""
    Dear {order.user.first_name or order.user.username},
    
    Thank you for your order! Your order #{order.id} has been confirmed.
    
    Order Details:
    Total Amount: ${order.total_amount}
    Status: {order.get_status_display()}
    
    Items:
    """
    
    for item in order.items.all():
        message += f"- {item.product.name} x {item.quantity} = ${item.total_price}\n"
    
    message += f"\nShipping Address:\n{order.shipping_address}\n\nThank you for shopping with us!"
    
    try:
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [order.user.email],
            fail_silently=False,
        )
    except Exception as e:
        print(f"Failed to send email: {e}")

def send_slack_notification(order):
    """Send Slack notification for new order"""
    if not settings.SLACK_BOT_TOKEN or not settings.SLACK_CHANNEL_ID:
        return
    
    message = f":shopping_cart: New order #{order.id} for ${order.total_amount} by {order.user.username}"
    
    try:
        response = requests.post(
            'https://slack.com/api/chat.postMessage',
            headers={
                'Authorization': f'Bearer {settings.SLACK_BOT_TOKEN}',
                'Content-Type': 'application/json',
            },
            json={
                'channel': settings.SLACK_CHANNEL_ID,
                'text': message,
            }
        )
        response.raise_for_status()
    except Exception as e:
        print(f"Failed to send Slack notification: {e}")