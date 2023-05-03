import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: 'nestjs_jwt_secret',
  signOptions: {
    // see expiresIn: https://github.com/vercel/ms
    expiresIn: '1d',
  },
}));
