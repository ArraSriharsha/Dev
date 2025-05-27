import multer from 'multer';
import os from 'os';
import path from 'path';

const uploadfile = multer({
  dest: path.join(os.tmpdir(), 'uploads', 'problems'),
});
console.log('Temp upload dir:', os.tmpdir());


export default uploadfile;
