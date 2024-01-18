import * as jwt from 'jsonwebtoken';

const secretPassword = 'secret_key';

const generateToken = (user: string) => {
  const token: string = jwt.sign({ data: user }, secretPassword, { algorithm: 'HS256' });
  return token;
};

interface TokenPayload {
  data: string;
}

const checkToken = (authorization: string): TokenPayload | { hasError: true; error: jwt.JsonWebTokenError } => {
  try {
    const payload = jwt.verify(authorization, secretPassword) as TokenPayload;
    return payload;
  } catch (error: any) {
    return { hasError: true, error };
  }
};

const getUserFromToken = (token: string) => {
  const user = jwt.decode(token);
  return user;
};

export {
  generateToken,
  checkToken,
  getUserFromToken,
};