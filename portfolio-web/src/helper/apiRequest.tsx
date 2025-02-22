interface ApiRequestConfig {
    endpoint: string;
    body?: any;
    headers?: Record<string, string>;
}

const BASE_URL: string = "http://localhost:3001/api/";

// Base function for API requests
const apiRequest = async ({ endpoint, method, body, headers }: ApiRequestConfig & { method: string }) => {
    try {
        const config: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: body ? JSON.stringify(body) : undefined,
        };

        const response = await fetch(`${BASE_URL}${endpoint}`, config);
        console.log(response,"resp")
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

// Method to perform GET requests
export const get = async (endpoint: string, headers?: Record<string, string>) => {
    return apiRequest({ endpoint, method: 'GET', headers });
};

// Method to perform POST requests
export const post = async (endpoint: string, body: any, headers?: Record<string, string>) => {
    return apiRequest({ endpoint, method: 'POST', body, headers });
};

// Method to perform PUT requests
export const put = async (endpoint: string, body: any, headers?: Record<string, string>) => {
    return apiRequest({ endpoint, method: 'PUT', body, headers });
};

// Method to perform PATCH requests
export const patch = async (endpoint: string, body: any, headers?: Record<string, string>) => {
    return apiRequest({ endpoint, method: 'PATCH', body, headers });
};

// Method to perform DELETE requests
export const del = async (endpoint: string, headers?: Record<string, string>) => {
    return apiRequest({ endpoint, method: 'DELETE', headers });
};

export default { get, post, put, patch, del };
