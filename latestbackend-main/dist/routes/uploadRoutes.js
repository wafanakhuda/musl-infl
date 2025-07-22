"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: function (_req, _file, cb) {
        const dir = path_1.default.join(__dirname, "..", "..", "uploads");
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (_req, file, cb) {
        const ext = path_1.default.extname(file.originalname);
        const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, filename);
    },
});
const upload = (0, multer_1.default)({ storage });
router.post("/upload", upload.single("file"), (req, res) => {
    const file = req.file;
    if (!file) {
        res.status(400).json({ error: "No file uploaded." });
        return;
    }
    const fileUrl = `/uploads/${file.filename}`;
    res.status(200).json({ url: fileUrl });
});
exports.default = router;
