import { registerAs } from '@nestjs/config';
import { diskStorage } from 'multer';
import { resolve } from 'node:path';

const savePath = resolve(process.cwd(), process.env.UPLOAD_DIR);

export default registerAs('upload', () => ({
  // https://github.com/expressjs/multer#multeropts
  storage: diskStorage({
    destination: savePath,
    filename(_req, file, cb) {
      const filename = [
        Date.now(),
        '_',
        Math.floor(Math.random() * 1000),
        '.',
        file.originalname.split('.').pop(),
      ].join('');
      cb(null, filename);
    },
  }),
}));
