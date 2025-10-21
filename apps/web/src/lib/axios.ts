import type { AxiosInstance } from 'axios'
import axios from 'axios'

/**
 * Base instance for Axios API calls.
 * Configured with a base URL, a timeout, and default headers.
 */
export const baseApiInstance: AxiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? 'https://app.spesia.com.br/api'
      : 'http://localhost:3000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  // `withCredentials` can be enabled if needed for cross-site Access-Control requests.
  // withCredentials: true,
})
