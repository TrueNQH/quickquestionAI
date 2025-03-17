401: Kiểm tra lại token/API key
400: Kiểm tra dữ liệu gửi lên
403: Kiểm tra quyền truy cập

**POST /api/auth/register
json
{
"email": "user@example.com",
"password": "password123",
"name": "User Name"
}
json responsive
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
"token": "jwt_token" // user.token
}
}
**POST /api/auth/login
json
{
"email": "user@example.com",
"password": "password123"
}
**GET /api/auth/me
Authorization: Bearer <jwt_token>
**POST /api/generate-api-key
Authorization: Bearer <jwt_token>
json
{
"success": true,
"message": "Tạo API key thành công",
"data": {
"apiKey": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
}
POST /api/revoke-api-key/:apiKey
Authorization: Bearer <jwt_token>
GET /api/api-keys
Authorization: Bearer <jwt_token>
json
{
"success": true,
"data": {
"apiKeys": [
{
"api_key": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
"status": "active",
"created_at": "2024-03-07T00:00:00.000Z"
}
]
}
}
**POST /api/subscribe-daily-plan
Authorization: Bearer <jwt_token>
json
{
"days": 30
}
json
{
"success": true,
"message": "Đăng ký gói thành công",
"data": {
"remainingBalance": 70000,
"expiryDate": "2024-04-06T00:00:00.000Z"
}
}
GET /api/check-balance
Authorization: Bearer <jwt_token>
json
{
"success": true,
"data": {
"balance": 70000,
"free_trial_expiry": "2024-03-10T00:00:00.000Z"
}
}
GET /api/test-api
Authorization: Bearer <jwt_token>
X-API-Key: your_api_key
json
{
"success": true,
"message": "API hoạt động bình thường",
"data": {
"timestamp": "2024-03-07T00:00:00.000Z",
"apiKey": "your_api_key"
}
}
File README.md này cung cấp:

## Pricing & Limits

1. **Gói dùng thử:**
   - Miễn phí trong 3 ngày đầu tiên
   - Không giới hạn số lượng request

2. **Gói thường:**
   - 10,000 VND/ngày
   - Không giới hạn số lượng request
   - Có thể gia hạn theo số ngày mong muốn

## Lưu ý

1. Tất cả các API endpoints (trừ đăng ký và đăng nhập) đều yêu cầu JWT token trong header
2. Các API endpoints liên quan đến sử dụng dịch vụ yêu cầu cả JWT token và API key
3. API key sẽ bị vô hiệu hóa nếu:
   - User chủ động vô hiệu hóa
   - Hết hạn gói dùng thử và không có số dư
   - Vi phạm điều khoản sử dụng

## Error Codes

- 400: Bad Request - Dữ liệu gửi lên không hợp lệ
- 401: Unauthorized - Chưa đăng nhập hoặc token/API key không hợp lệ
- 403: Forbidden - Không có quyền truy cập
- 404: Not Found - Không tìm thấy tài nguyên
- 500: Internal Server Error - Lỗi server

## Support

Nếu bạn cần hỗ trợ, vui lòng liên hệ:
- Email: support@example.com
- Phone: 1900-xxx-xxx