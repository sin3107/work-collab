export interface JwtPayload {
    id: number;
    email: string;
    role: string;
    refreshToken?: string;
}