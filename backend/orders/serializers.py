from rest_framework import serializers
from .models import Order, OrderItem
from store.serializers import ProductSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    total_price = serializers.ReadOnlyField()

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'unit_price', 'total_price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'total_amount', 'status', 'shipping_address', 
            'created_at', 'updated_at', 'items'
        ]
        read_only_fields = ['created_at', 'updated_at']

class OrderCreateSerializer(serializers.Serializer):
    shipping_address = serializers.CharField(max_length=500)
    payment_method_id = serializers.CharField(max_length=200)