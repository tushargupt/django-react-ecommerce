# users/admin.py (Optional - Enhanced user management)
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from store.models import CartItem
from orders.models import Order

# Unregister the default User admin
admin.site.unregister(User)

@admin.register(User)
class EnhancedUserAdmin(BaseUserAdmin):
    list_display = [
        'username', 'email', 'first_name', 'last_name', 
        'is_staff', 'is_active', 'date_joined', 'last_login',
        'total_orders', 'cart_items_count'
    ]
    list_filter = [
        'is_staff', 'is_superuser', 'is_active', 'date_joined', 'last_login'
    ]
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering = ['-date_joined']
    
    def total_orders(self, obj):
        return Order.objects.filter(user=obj).count()
    total_orders.short_description = "Total Orders"
    
    def cart_items_count(self, obj):
        return CartItem.objects.filter(user=obj).count()
    cart_items_count.short_description = "Cart Items"