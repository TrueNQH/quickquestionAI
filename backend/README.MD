# API Management System

Hệ thống quản lý API với Node.js, Express và MySQL.

## Cài đặt

1. Clone repository:

## API Endpoints

### 🔐 Authentication

#### 1. Đăng ký tài khoản
POST /api/auth/register
json
{
"email": "user@example.com",
"password": "password123",
"name": "User Name"
}
**Response:**
json
{
"success": true,
"message": "Đăng ký thành công",
"data": {
"user": {
"id": 1,
"name": "User Name",
"email": "user@example.com",
"balance": 0,
"free_trial_expiry": "2024-03-10T00:00:00.000Z"
},
"token": "jwt_token"
}
}

#### 2. Đăng nhập
POST /api/auth/login
json
{
"email": "user@example.com",
"password": "password123"
}
**Response:**
json
{
"success": true,
"message": "Đăng nhập thành công",
"data": {
"user": {
"id": 1,
"name": "User Name",
"email": "user@example.com",
"balance": 100,
"free_trial_expiry": "2024-03-10T00:00:00.000Z"
},
"token": "jwt_token"
}
}

#### 3. Lấy thông tin user hiện tại
GET /api/auth/me
**Response:**
json
{                   
    "success": true,
    "message": "Lấy thông tin user thành công",
    "data": {
        "user": {
            "id": 1,
            "name": "User Name",
            "email": "user@example.com",
            "balance": 100, 
            "free_trial_expiry": "2024-03-10T00:00:00.000Z"
        }
    }
}

### 🔑 API Key Management       

#### 1. Tạo API Key mới
POST /api/generate-api-key
**Response:**
json
{
"success": true,
"message": "Tạo API Key thành công",
"data": {
"apiKey": "your_new_api_key"
}
}

#### 2. Vô hiệu hóa API Key
POST /api/revoke-api-key/:apiKey
**Response:**
json
{
    "success": true,
    "message": "Vô hiệu hóa API Key thành công"
}

#### 3. Liệt kê tất cả các API Key
GET /api/api-keys
**Response:**
json
{   
    "success": true,
    "message": "Lấy danh sách API Key thành công",
    "data": {
        "apiKeys": [
            {
                "apiKey": "api_key_1",
                "status": "active"
            },
            {   
                
                "apiKey": "api_key_2",
                "status": "inactive"
            }
        ]
    }
}

#### 4. Kiểm tra số dư
GET /api/check-balance
**Response:**
json    
{
    "success": true,
    "message": "Kiểm tra số dư thành công",
    "data": {
        "balance": 100
    }
}

### 📊 API Usage Tracking

#### 1. Ghi log sử dụng API
POST /api/log-api-usage
json

