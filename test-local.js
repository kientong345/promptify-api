import { handler } from './index.js';

console.log('🧪 Testing Promptify API locally...\n');

// Test 1: GET request (instructions)
console.log('📋 Test 1: GET / (Getting API instructions)');
const getEvent = {
    httpMethod: 'GET'
};

try {
    const getResponse = await handler(getEvent, {});
    console.log('Status:', getResponse.statusCode);
    console.log('Response:', JSON.stringify(JSON.parse(getResponse.body), null, 2));
    console.log('✅ Test 1 passed\n');
} catch (error) {
    console.error('❌ Test 1 failed:', error.message);
}

// Test 2: POST request with valid prompt
console.log('📋 Test 2: POST / (Improving a prompt)');
const postEvent = {
    httpMethod: 'POST',
    body: JSON.stringify({
        prompt: 'Viết code Python để sort một array'
    })
};

try {
    const postResponse = await handler(postEvent, {});
    console.log('Status:', postResponse.statusCode);
    const responseBody = JSON.parse(postResponse.body);

    if (responseBody.error) {
        console.log('Error Response:', JSON.stringify(responseBody, null, 2));
        console.log('⚠️  Test 2 returned an error (this is expected if API key is not set)\n');
    } else {
        console.log('Original Prompt:', responseBody.originalPrompt);
        console.log('Improved Prompt:', responseBody.improvedPrompt.substring(0, 200) + '...');
        console.log('✅ Test 2 passed\n');
    }
} catch (error) {
    console.error('❌ Test 2 failed:', error.message);
}

// Test 3: POST request with empty prompt
console.log('📋 Test 3: POST / (Empty prompt - should fail)');
const emptyPromptEvent = {
    httpMethod: 'POST',
    body: JSON.stringify({
        prompt: ''
    })
};

try {
    const emptyResponse = await handler(emptyPromptEvent, {});
    console.log('Status:', emptyResponse.statusCode);
    const responseBody = JSON.parse(emptyResponse.body);
    console.log('Response:', JSON.stringify(responseBody, null, 2));

    if (emptyResponse.statusCode === 500 && responseBody.error) {
        console.log('✅ Test 3 passed (correctly rejected empty prompt)\n');
    } else {
        console.log('⚠️  Test 3: unexpected response\n');
    }
} catch (error) {
    console.error('❌ Test 3 failed:', error.message);
}

// Test 4: POST request with missing prompt field
console.log('📋 Test 4: POST / (Missing prompt field - should fail)');
const missingPromptEvent = {
    httpMethod: 'POST',
    body: JSON.stringify({
        notPrompt: 'test'
    })
};

try {
    const missingResponse = await handler(missingPromptEvent, {});
    console.log('Status:', missingResponse.statusCode);
    const responseBody = JSON.parse(missingResponse.body);
    console.log('Response:', JSON.stringify(responseBody, null, 2));

    if (missingResponse.statusCode === 500 && responseBody.error) {
        console.log('✅ Test 4 passed (correctly rejected missing prompt)\n');
    } else {
        console.log('⚠️  Test 4: unexpected response\n');
    }
} catch (error) {
    console.error('❌ Test 4 failed:', error.message);
}

console.log('🎉 Local testing completed!');
console.log('\n💡 To test with actual API calls:');
console.log('   1. Create a .env file based on .env.example');
console.log('   2. Add your Gemini API key to .env');
console.log('   3. Run: npm test');
