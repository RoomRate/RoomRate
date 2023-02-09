import axios, { AxiosError } from 'axios';

interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

export type ErrorResponse = AxiosError<ApiError>;

export const Axios = axios.create({
  baseURL: `/api`,
});