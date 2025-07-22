from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from decimal import Decimal

class Product(models.Model):
    name = models.CharField(max_length=200, db_index=True)
    description = models.TextField()
    price = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    inventory_count = models.PositiveIntegerField(default=0, db_index=True)
    image_url = models.URLField(max_length=500)
    category = models.CharField(max_length=100, default='General', db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['category', 'price']),
            models.Index(fields=['inventory_count']),
        ]

    def __str__(self):
        return self.name

    @property
    def is_in_stock(self):
        return self.inventory_count > 0

class CartItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cart_items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user', 'product']
        indexes = [
            models.Index(fields=['user', 'created_at']),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.product.name} ({self.quantity})"

    @property
    def total_price(self):
        return self.quantity * self.product.price