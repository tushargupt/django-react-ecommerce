from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth.models import User

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    data = request.data
    
    # Validate required fields
    required_fields = ['username', 'email', 'password']
    for field in required_fields:
        if not data.get(field):
            return Response(
                {field: 'This field is required.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    # Check if username already exists
    if User.objects.filter(username=data['username']).exists():
        return Response(
            {'username': 'Username already exists.'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check if email already exists
    if User.objects.filter(email=data['email']).exists():
        return Response(
            {'email': 'Email already exists.'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Create user
    try:
        user = User.objects.create_user(
            username=data['username'],
            email=data['email'],
            password=data['password'],
            first_name=data.get('first_name', ''),
            last_name=data.get('last_name', '')
        )
        
        return Response(
            {'message': 'User created successfully'}, 
            status=status.HTTP_201_CREATED
        )
    except Exception as e:
        return Response(
            {'error': 'Failed to create user'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['GET'])
def get_user_profile(request):
    return Response({
        'id': request.user.id,
        'username': request.user.username,
        'email': request.user.email,
        'first_name': request.user.first_name,
        'last_name': request.user.last_name,
    })