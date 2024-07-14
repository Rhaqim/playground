export interface SignUp {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: Roles;
}

export interface User extends SignUp {
    ID?: string;
    oauth_id?: string;
    email_confirmed?: boolean;
    referral_count?: number;
}

export interface SignIn {
    email: string;
    password: string;
}

export enum Roles {
    ADMIN = "admin",
    USER = "user",
    ARTIST = "artist",
}