# 🚀 Promptify API

API serverless để cải thiện prompt sử dụng Google Gemini AI.

## 📋 Tổng quan

Promptify API giúp bạn biến đổi các prompt cơ bản thành các prompt chi tiết, có cấu trúc và hiệu quả hơn cho các mô hình AI tạo sinh.

**Ví dụ:**
- **Input:** `Viết code Python để sort array`
- **Output:** `Bạn là một lập trình viên Python chuyên nghiệp với nhiều năm kinh nghiệm. Nhiệm vụ của bạn là viết một hàm Python để sắp xếp (sort) một mảng (array/list)...` (và nhiều hơn nữa)

## ✨ Tính năng

- ✅ Cải thiện prompt tự động sử dụng Google Gemini 2.0
- ✅ RESTful API đơn giản (GET, POST)
- ✅ Validation và error handling đầy đủ
- ✅ CORS support cho browser access
- ✅ Tương thích với AWS Lambda và Google Cloud Functions
- ✅ Response format chuẩn JSON

## 🛠️ Công nghệ

- **Runtime:** Node.js 18+
- **AI Model:** Google Gemini 2.0 Flash
- **Dependencies:** dotenv
- **Deployment:** AWS Lambda / Google Cloud Functions

## 📦 Cài đặt Local

### 1. Clone repository

```bash
git clone <your-repo-url>
cd promptify_api
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Tạo file .env

```bash
cp .env.example .env
```

Sau đó mở file `.env` và thêm API key của bạn:

```env
LLM_API_KEY=your_actual_gemini_api_key_here
LLM_MODEL=gemini-2.0-flash-exp
```

> 💡 **Lấy API key:** Truy cập [Google AI Studio](https://makersuite.google.com/app/apikey) để tạo API key miễn phí.

### 4. Test local

```bash
npm test
```

## 🌐 API Usage

### Endpoint: GET /

Lấy hướng dẫn sử dụng API.

**Response:**
```json
{
  "name": "Promptify API",
  "version": "1.0.0",
  "description": "API để cải thiện prompt sử dụng Google Gemini AI",
  "endpoints": { ... },
  "examples": { ... }
}
```

### Endpoint: POST /

Cải thiện prompt.

**Request:**
```json
{
  "prompt": "Viết code Python để sort array"
}
```

**Response (Success):**
```json
{
  "success": true,
  "originalPrompt": "Viết code Python để sort array",
  "improvedPrompt": "Bạn là một lập trình viên Python chuyên nghiệp...",
  "model": "gemini-2.0-flash-exp",
  "timestamp": "2025-12-07T00:00:00.000Z"
}
```

**Response (Error):**
```json
{
  "error": "Invalid request",
  "message": "Missing required field: prompt"
}
```

### cURL Examples

**Get instructions:**
```bash
curl https://your-api-endpoint.com
```

**Improve a prompt:**
```bash
curl -X POST https://your-api-endpoint.com \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Viết code Python để sort array"}'
```

## 📝 Giới hạn

- **Max prompt length:** 5,000 ký tự
- **Rate limiting:** Tùy theo cấu hình của platform (AWS/GCP)
- **Model limits:** Theo quota của Google Gemini API

## 🧪 Testing

Chạy test suite:

```bash
npm test
```

## 📄 License

ISC

## 👤 Author

kt345 + Claude

## 🤝 Contributing

Contributions, issues và feature requests đều được chào đón!

---

Made with ❤️ using Google Gemini AI

*this line is written by a human (me)*
