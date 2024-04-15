import 'express';
import { type JwtData } from './guard/login.guard';
// type JwtData = import('./guard/login.guard').JwtData;

declare module 'express' {
  interface Request {
    user: Omit<JwtData, 'exp'>;
  }
}
