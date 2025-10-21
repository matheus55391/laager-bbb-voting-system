/**
 * Interface que representa a resposta da API.
 */
export interface ApiResponse<TData> {
  status: number // Status da resposta, como "success" ou "error"
  message?: string // Mensagem de erro ou sucesso
  data?: TData // Dados retornados pela API
}
