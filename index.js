import 'dotenv/config';

// Configuration from environment variables
const LLM_API_KEY = process.env.LLM_API_KEY || '';
const LLM_MODEL = process.env.LLM_MODEL || 'gemini-2.0-flash-exp';
const LLM_URL = `https://generativelanguage.googleapis.com/v1beta/models/${LLM_MODEL}:generateContent?key=${LLM_API_KEY}`;

// System prompt for improving user prompts
const SYSTEM_PROMPT = `Bạn là một chuyên gia về kỹ thuật prompt, một bậc thầy trong việc tạo ra các câu lệnh chi tiết và hiệu quả cho các mô hình AI tạo sinh (văn bản, hình ảnh, code). Nhiệm vụ của bạn là nhận một prompt cơ bản từ người dùng và biến nó thành một prompt chi tiết, có cấu trúc và hiệu quả hơn.

Khi cải thiện prompt, hãy tuân theo các nguyên tắc sau:
1.  **Xác định vai trò (Persona):** Giao cho AI một vai trò cụ thể (ví dụ: "Bạn là một nhà văn khoa học viễn tưởng...", "Bạn là một lập trình viên Python cao cấp...").
2.  **Cung cấp ngữ cảnh (Context):** Đưa ra thông tin nền tảng cần thiết để AI hiểu rõ bối cảnh của yêu cầu.
3.  **Làm rõ nhiệm vụ (Task):** Nêu rõ ràng, chính xác nhiệm vụ AI cần thực hiện. Sử dụng các động từ mạnh.
4.  **Chỉ định định dạng (Format):** Mô tả cấu trúc đầu ra mong muốn (ví dụ: "trả về dưới dạng JSON", "viết một danh sách có gạch đầu dòng", "tạo một bảng markdown").
5.  **Thêm ví dụ (Examples):** Cung cấp một hoặc hai ví dụ (nếu có thể) để minh họa cho yêu cầu.
6.  **Xác định giới hạn (Constraints):** Đặt ra các quy tắc hoặc giới hạn (ví dụ: "giới hạn trong 200 từ", "không sử dụng biệt ngữ kỹ thuật", "tập trung vào...").

Mục tiêu cuối cùng là tạo ra một prompt không chỉ rõ ràng mà còn truyền cảm hứng, giúp AI tạo ra kết quả tốt nhất có thể, vượt xa mong đợi ban đầu. Trả về chỉ prompt đã được cải thiện, không thêm bất kỳ lời giải thích hay lời chào nào.`;

// Main handler for Google Cloud Functions
export const handler = async (req, res) => {
    // Set CORS headers
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(204).send('');
    }

    try {
        // Check if API key is configured
        if (!LLM_API_KEY) {
            return res.status(500).json({
                error: 'Server configuration error',
                message: 'LLM_API_KEY is not configured'
            });
        }

        // Get HTTP method from GCP Cloud Functions request
        const httpMethod = req.method;

        switch (httpMethod) {
            case 'GET':
                const instructions = getInstruction();
                return res.status(200).json(instructions);

            case 'POST':
                try {
                    const requestData = req.body;
                    const result = await getImprovedPrompt(requestData);
                    return res.status(200).json(result);
                } catch (parseError) {
                    return res.status(400).json({
                        error: 'Invalid request',
                        message: parseError.message
                    });
                }

            default:
                return res.status(405).json({
                    error: 'Method not allowed',
                    message: `HTTP method ${httpMethod} is not supported`
                });
        }
    } catch (error) {
        console.error('Handler error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
};

// Returns API usage instructions and examples
function getInstruction() {
    return {
        name: 'Promptify API',
        version: '1.0.0',
        description: 'API để cải thiện prompt sử dụng Google Gemini AI',
        endpoints: {
            'GET /': {
                description: 'Lấy hướng dẫn sử dụng API',
                response: 'API documentation (this message)'
            },
            'POST /': {
                description: 'Cải thiện prompt của bạn',
                requestBody: {
                    prompt: 'string (required) - Prompt gốc cần cải thiện'
                },
                response: {
                    success: 'boolean',
                    originalPrompt: 'string - Prompt gốc',
                    improvedPrompt: 'string - Prompt đã được cải thiện',
                    model: 'string - Model AI được sử dụng'
                }
            }
        },
        examples: {
            curl: `curl -X POST https://your-api-endpoint.com \\
                -H "Content-Type: application/json" \\
                -d '{"prompt":"Viết code Python để sort array"}'`,
            response: {
                success: true,
                originalPrompt: 'Viết code Python để sort array',
                improvedPrompt: 'Bạn là một lập trình viên Python chuyên nghiệp...',
                model: LLM_MODEL
            }
        },
        limits: {
            maxPromptLength: 5000,
            rateLimit: 'Tùy thuộc vào cấu hình serverless platform'
        }
    };
}

// Processes the prompt improvement request
async function getImprovedPrompt(requestData) {
    // Validate input
    if (!requestData || !requestData.prompt) {
        throw new Error('Missing required field: prompt');
    }

    const rawPrompt = requestData.prompt.trim();

    // Validate prompt length
    if (rawPrompt.length === 0) {
        throw new Error('Prompt cannot be empty');
    }

    if (rawPrompt.length > 5000) {
        throw new Error('Prompt exceeds maximum length of 5000 characters');
    }

    // Call Gemini API to improve the prompt
    const improvedPrompt = await callLlmApi(rawPrompt);

    return {
        success: true,
        originalPrompt: rawPrompt,
        improvedPrompt: improvedPrompt,
        model: LLM_MODEL,
        timestamp: new Date().toISOString()
    };
}

// Calls Google Gemini API to improve the prompt
async function callLlmApi(userPrompt) {
    const requestBody = {
        contents: [
            {
                role: 'user',
                parts: [
                    {
                        text: SYSTEM_PROMPT
                    }
                ]
            },
            {
                role: 'model',
                parts: [
                    {
                        text: 'Tôi hiểu. Tôi sẽ cải thiện prompt của bạn theo các nguyên tắc đã nêu.'
                    }
                ]
            },
            {
                role: 'user',
                parts: [
                    {
                        text: userPrompt
                    }
                ]
            }
        ],
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048
        }
    };

    try {
        const response = await fetch(LLM_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Gemini API error (${response.status}): ${errorText}`);
        }

        const data = await response.json();

        // Extract the improved prompt from the response
        if (data.candidates && data.candidates.length > 0) {
            const candidate = data.candidates[0];
            if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
                return candidate.content.parts[0].text;
            }
        }

        throw new Error('Unexpected API response format');
    } catch (error) {
        console.error('LLM API call failed:', error);
        throw new Error(`Failed to improve prompt: ${error.message}`);
    }
}
