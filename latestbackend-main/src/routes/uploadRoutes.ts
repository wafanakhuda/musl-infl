import express, { Request, Response } from "express"
import multer, { StorageEngine } from "multer"
import path from "path"
import fs from "fs"

const router = express.Router()

const storage: StorageEngine = multer.diskStorage({
  destination: function (_req: Request, _file: Express.Multer.File, cb) {
    const dir = path.join(__dirname, "..", "..", "uploads")
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true }) // ✅ Ensure nested folders can be created
    }
    cb(null, dir)
  },
  filename: function (_req: Request, file: Express.Multer.File, cb) {
    const ext = path.extname(file.originalname)
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`
    cb(null, filename)
  },
})

const upload = multer({ storage })

// ✅ Upload Route
router.post("/upload", upload.single("file"), (req: Request, res: Response): void => {
  const file = req.file
  if (!file) {
    res.status(400).json({ error: "No file uploaded." })
    return
  }

  const fileUrl = `/uploads/${file.filename}`
  res.status(200).json({ url: fileUrl })
})

export default router
