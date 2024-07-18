import { User } from "./auth.type";

declare interface ReferralCode {
	ID: number;
	code: string;
	user_id: number;
	is_used: boolean;
	used_by: number;
	created_at: string;
	updated_at: string;
}

export interface ReferralSignUp {
	user: User;
	referral_code: string;
}

export default ReferralCode;
