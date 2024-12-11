export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data: T | null;
}

export interface UserRequest {
    userId: string;
    token: string;
}
