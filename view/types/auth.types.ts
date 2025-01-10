export interface SignUpReq {
  email: string;
  name?: string;
  password: string;
}

export interface LoginReq {
  email: string;
  password: string;
}

export interface AuthRes {
  access_token: string;
}
