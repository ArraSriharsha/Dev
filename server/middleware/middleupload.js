import multer from 'multer';
import os from 'os';
import path from 'path';

const uploadfile = multer({
  dest: path.join(os.tmpdir(), 'uploads', 'problems'),
});


export default uploadfile;
