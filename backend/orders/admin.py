# orders/admin.py
from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['total_price']
    fields = ['product', 'quantity', 'unit_price', 'total_price']
    
    def total_price(self, obj):
        return f"${obj.total_price:.2f}"
    total_price.short_description = "Total Price"

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'user', 'total_amount', 'status', 
        'created_at', 'stripe_payment_intent_id'
    ]
    list_filter = ['status', 'created_at', 'updated_at']
    search_fields = ['user__username', 'user__email', 'stripe_payment_intent_id']
    list_editable = ['status']
    readonly_fields = ['stripe_payment_intent_id', 'created_at', 'updated_at']
    ordering = ['-created_at']
    inlines = [OrderItemInline]
    
    fieldsets = (
        ('Order Information', {
            'fields': ('user', 'status', 'total_amount')
        }),
        ('Shipping', {
            'fields': ('shipping_address',)
        }),
        ('Payment', {
            'fields': ('stripe_payment_intent_id',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def total_amount(self, obj):
        return f"${obj.total_amount:.2f}"
    total_amount.short_description = "Total Amount"

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'order', 'product', 'quantity', 'unit_price', 'total_price']
    list_filter = ['order__created_at', 'product__category']
    search_fields = ['order__id', 'product__name', 'order__user__username']
    readonly_fields = ['total_price']
    
    def total_price(self, obj):
        return f"${obj.total_price:.2f}"
    total_price.short_description = "Total Price"