export interface ApiResponse<T> {
  data: T | null;
  errors?: string[];
  timestamp?: string;
  isSuccess: boolean;
}
