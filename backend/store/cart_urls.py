from django.urls import path
from . import views

urlpatterns = [
    path('', views.cart_list, name='cart-list'),
    path('add/', views.add_to_cart, name='add-to-cart'),
    path('<int:item_id>/', views.update_cart_item, name='update-cart-item'),
    path('<int:item_id>/remove/', views.remove_from_cart, name='remove-from-cart'),
]