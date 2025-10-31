export interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  avatar: string;
  role: string;
}

export interface JwtPayload {
  phone: string;
  exp: number;
  fullName: string;
  iat: number;
  role: string;
  sub: string;
}
