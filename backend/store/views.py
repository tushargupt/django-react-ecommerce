from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import Product, CartItem
from .serializers import ProductSerializer, CartItemSerializer

class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = []

    def get_queryset(self):
        queryset = Product.objects.filter(inventory_count__gt=0)
        
        # Search functionality
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(description__icontains=search)
            )
        
        # Category filter
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__icontains=category)
        
        # Price range filter
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        return queryset

class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = []

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def cart_list(request):
    cart_items = CartItem.objects.filter(user=request.user)
    serializer = CartItemSerializer(cart_items, many=True)
    total = sum(item.total_price for item in cart_items)
    return Response({
        'items': serializer.data,
        'total': total,
        'count': cart_items.count()
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    serializer = CartItemSerializer(data=request.data)
    if serializer.is_valid():
        product_id = serializer.validated_data['product_id']
        quantity = serializer.validated_data['quantity']
        
        try:
            product = Product.objects.get(id=product_id)
            if product.inventory_count < quantity:
                return Response(
                    {'error': 'Not enough inventory'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            cart_item, created = CartItem.objects.get_or_create(
                user=request.user,
                product=product,
                defaults={'quantity': quantity}
            )
            
            if not created:
                cart_item.quantity += quantity
                if cart_item.quantity > product.inventory_count:
                    return Response(
                        {'error': 'Not enough inventory'}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                cart_item.save()
            
            response_serializer = CartItemSerializer(cart_item)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
            
        except Product.DoesNotExist:
            return Response(
                {'error': 'Product not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_cart_item(request, item_id):
    cart_item = get_object_or_404(CartItem, id=item_id, user=request.user)
    
    quantity = request.data.get('quantity')
    if not quantity or quantity <= 0:
        return Response(
            {'error': 'Valid quantity required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if cart_item.product.inventory_count < quantity:
        return Response(
            {'error': 'Not enough inventory'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    cart_item.quantity = quantity
    cart_item.save()
    
    serializer = CartItemSerializer(cart_item)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request, item_id):
    cart_item = get_object_or_404(CartItem, id=item_id, user=request.user)
    cart_item.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)