import { useAuth } from "@/app/auth/AuthContext";

interface ApiRequestConfig {
    endpoint: string;
    body?: any;
    headers?: Record<string, string>;
    isMultiPart:boolean;
}

export const BASE_URL: string = "http://localhost:3001/api/";

// Base function for API requests
const apiRequest = async ({ endpoint, method, body, headers ,isMultiPart}: ApiRequestConfig & { method: string }) => {
    const user:any = localStorage.getItem('user');
    try {
        // Prepare headers
        const configHeaders: HeadersInit = {
            ...headers,
        };
        if(!isMultiPart){
            configHeaders['Content-Type']='application/json';
        }
        if(user?.token){
            configHeaders['token']=user.token;
        }
        const config: RequestInit = {
            method,
            headers: configHeaders,
            body: body ?  isMultiPart ? body : JSON.stringify(body) : undefined,
        };
        console.log(config,"config")
        const response = await fetch(BASE_URL+endpoint, config);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "API Request Failed");
        }

        return data;
    } catch (error:any) {
        console.error("API Request Error:", error.message);
        throw error;
    }
};

// Method to perform GET requests
export const get = async (endpoint: string, headers?: Record<string, string>,isMultiPart =false) => {
    return apiRequest({ endpoint, method: 'GET', headers ,isMultiPart});
};

// Method to perform POST requests
export const post = async (endpoint: string, body: any, headers?: Record<string, string>|any , isMultiPart =false) => {
    return apiRequest({ endpoint, method: 'POST', body, headers ,isMultiPart});
};

// Method to perform PUT requests
export const put = async (endpoint: string, body: any, headers?: Record<string, string>|any,isMultiPart=false) => {
    return apiRequest({ endpoint, method: 'PUT', body, headers ,isMultiPart});
};

// Method to perform PATCH requests
export const patch = async (endpoint: string, body: any, headers?: Record<string, string>,isMultiPart =false) => {
    return apiRequest({ endpoint, method: 'PATCH', body, headers ,isMultiPart});
};

// Method to perform DELETE requests
export const del = async (endpoint: string, headers?: Record<string, string>,isMultiPart =false) => {
    return apiRequest({ endpoint, method: 'DELETE', headers ,isMultiPart});
};

export default { get, post, put, patch, del };
