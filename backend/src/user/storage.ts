import { diskStorage } from 'multer';
import { HttpException } from '@nestjs/common';

const storage = diskStorage({
  destination: './public/avatar/',
  filename: (req, file, callback) => {
    const name =
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9) +
      '-' +
      file.originalname;
    callback(null, name);
  },
});

export const fileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
    callback(new HttpException('Invalid file type!', 400), false);
    return;
  }
  callback(null, true);
};
export default storage;
