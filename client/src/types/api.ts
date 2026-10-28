export interface ApiResponse<T> { data: T }
export interface PageMeta { total: number; page: number; limit: number; totalPages: number }
export interface Paginated<T> { data: T[]; meta: PageMeta }
export interface FieldIssue { path: string; message: string }

export class ApiError extends Error {
  constructor(public status: number, message: string, public errors: FieldIssue[] = []) {
    super(message);
  }
}
