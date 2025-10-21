import type { AxiosInstance } from 'axios'
import { ApiResponse } from './api-response'

/**
 * Classe abstrata base para serviços de API.
 * Define a interface que todas as classes concretas devem implementar.
 */
export abstract class BaseApiService {
  protected api: AxiosInstance

  constructor(api: AxiosInstance) {
    this.api = api
  }

  protected abstract get<TResponse>(
    url: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse<TResponse>>

  protected abstract post<TRequest, TResponse>(
    url: string,
    data: TRequest,
    headers?: Record<string, string>
  ): Promise<ApiResponse<TResponse>>

  protected abstract patch<TRequest, TResponse>(
    url: string,
    data: TRequest,
    headers?: Record<string, string>
  ): Promise<ApiResponse<TResponse>>

  protected abstract delete<TResponse>(
    url: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse<TResponse>>

  protected abstract put<TRequest, TResponse>(
    url: string,
    data: TRequest,
    headers?: Record<string, string>
  ): Promise<ApiResponse<TResponse>>
}
