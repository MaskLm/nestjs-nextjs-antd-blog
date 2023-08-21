import { diskStorage } from 'multer';

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
export default storage;
