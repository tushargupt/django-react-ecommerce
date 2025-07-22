# store/admin.py
from django.contrib import admin
from .models import Product, CartItem

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'name', 'price', 'inventory_count', 
        'category', 'is_in_stock', 'created_at'
    ]
    list_filter = ['category', 'created_at', 'updated_at']
    search_fields = ['name', 'description', 'category']
    list_editable = ['price', 'inventory_count']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'category')
        }),
        ('Pricing & Inventory', {
            'fields': ('price', 'inventory_count')
        }),
        ('Media', {
            'fields': ('image_url',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def is_in_stock(self, obj):
        return "✅" if obj.is_in_stock else "❌"
    is_in_stock.short_description = "In Stock"

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'product', 'quantity', 'total_price', 'created_at']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['user__username', 'product__name']
    readonly_fields = ['total_price', 'created_at', 'updated_at']
    ordering = ['-created_at']
    
    def total_price(self, obj):
        return f"${obj.total_price:.2f}"
    total_price.short_description = "Total Price"