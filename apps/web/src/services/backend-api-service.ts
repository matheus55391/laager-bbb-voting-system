import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse } from '../types/api-response';
import { BaseApiService } from '../types/base-api-service';

export class BackendApiService extends BaseApiService {
    constructor(api: AxiosInstance) {
        super(api);
        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        this.api.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                if (error.response?.status === 401) {
                    console.error('Unauthorized request');
                }
                return Promise.reject(error);
            }
        );
    }

    protected async get<TResponse>(
        url: string,
        headers?: Record<string, string>
    ): Promise<ApiResponse<TResponse>> {
        const response: AxiosResponse<TResponse> = await this.api.get(url, {
            headers,
        });
        return { status: response.status, data: response.data };
    }

    protected async post<TRequest, TResponse>(
        url: string,
        data: TRequest,
        headers?: Record<string, string>
    ): Promise<ApiResponse<TResponse>> {
        const response: AxiosResponse<TResponse> = await this.api.post(
            url,
            data,
            {
                headers,
            }
        );
        return { status: response.status, data: response.data };
    }

    protected async patch<TRequest, TResponse>(
        url: string,
        data: TRequest,
        headers?: Record<string, string>
    ): Promise<ApiResponse<TResponse>> {
        const response: AxiosResponse<TResponse> = await this.api.patch(
            url,
            data,
            {
                headers,
            }
        );
        return { status: response.status, data: response.data };
    }

    protected async delete<TResponse>(
        url: string,
        headers?: Record<string, string>
    ): Promise<ApiResponse<TResponse>> {
        const response: AxiosResponse<TResponse> = await this.api.delete(url, {
            headers,
        });
        return { status: response.status, data: response.data };
    }

    protected async put<TRequest, TResponse>(
        url: string,
        data: TRequest,
        headers?: Record<string, string>
    ): Promise<ApiResponse<TResponse>> {
        const response: AxiosResponse<TResponse> = await this.api.put(
            url,
            data,
            {
                headers,
            }
        );
        return { status: response.status, data: response.data };
    }
}
