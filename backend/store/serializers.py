from rest_framework import serializers
from .models import Product, CartItem
from django.contrib.auth.models import User

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'inventory_count', 
            'image_url', 'category', 'created_at', 'updated_at', 'is_in_stock'
        ]
        read_only_fields = ['created_at', 'updated_at', 'is_in_stock']

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    total_price = serializers.ReadOnlyField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'total_price', 'created_at']
        read_only_fields = ['created_at']

    def validate_product_id(self, value):
        try:
            product = Product.objects.get(id=value)
            if not product.is_in_stock:
                raise serializers.ValidationError("Product is out of stock")
            return value
        except Product.DoesNotExist:
            raise serializers.ValidationError("Product does not exist")

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("Quantity must be greater than 0")
        return value