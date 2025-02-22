interface ApiRequestConfig {
    endpoint: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
    headers?: Record<string, string>;
}
const BASE_URL: string = "http://localhost/"
const apiRequest = async ({ endpoint, method = 'GET', body, headers = {}}: ApiRequestConfig) => {
    try {
        const config: RequestInit = {
            method: method as RequestInit['method'], // Ensure TypeScript understands the method type
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: body ? JSON.stringify(body) : undefined,
        };

        const response = await fetch(`/api/${endpoint}`, config);
        
        let data;
        try {
            data = await response.json();
        } catch {
            throw new Error('Invalid JSON response');
        }

        if (!response.ok) {
            throw new Error(data?.message || 'Something went wrong');
        }

        return data;
    } catch (error: any) {
        console.error('API Request Error:', error.message);
        return { success: false, error: error.message };
    }
};

export default apiRequest;
