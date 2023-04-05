import multer from "multer"

const memoryStorage = multer.memoryStorage()
const multerMiddleware = multer({
  storage: memoryStorage,
})

export { multerMiddleware }
