import multer from "multer";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const multerConfigStorage = multer.diskStorage({
  destination: path.join(__dirname, "../public/images"),
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const multerMiddleware = multer({
  storage: multerConfigStorage,
  dest: path.join(__dirname, "../public/images/"),
  limits: {
    fileSize: 20000000,
  },
  fileFilter: (req, file, cb) => {
    const validExt = /jpeg|jpg|png/;
    const mimeType = validExt.test(file.mimetype);
    const ext = validExt.test(path.extname(file.originalname));
    mimeType && ext ? cb(null, true) : cb("Archivo no valido");
  },
}).single("image");

export { multerConfigStorage, multerMiddleware };
