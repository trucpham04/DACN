export type Role = "ADMIN" | "LECTURER" | "STUDENT";

export interface AccountProfile {
  profileId: number;
  fullName: string | null;
  email: string | null;
  avatar: string | null;
  status: string | null;
}

export interface Account {
  accountId: number;
  username: string;
  role: Role;
  profile: AccountProfile | null;
}

export interface GetAccountListParams {
  page?: number;
  limit?: number;
  role?: Role;
}

export interface CreateAccountInput {
  username: string;
  email: string;
  password: string;
  role: Role;
}

export interface UpdateAccountInput {
  username?: string;
  role?: Role;
}
