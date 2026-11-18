import jwt, { SignOptions } from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  role: string;
}

export const generateToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_SECRET || 'skillsync_jwt_super_secret_key_development_2026';
  const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'];

  const options: SignOptions = {
    expiresIn,
  };

  return jwt.sign(payload, secret, options);
};

export const verifyToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_SECRET || 'skillsync_jwt_super_secret_key_development_2026';
  return jwt.verify(token, secret) as TokenPayload;
};
