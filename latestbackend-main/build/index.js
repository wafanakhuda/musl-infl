"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const messageService_1 = require("./services/messageService");
// Route imports
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const campaignRoutes_1 = __importDefault(require("./routes/campaignRoutes"));
const portfolioRoutes_1 = __importDefault(require("./routes/portfolioRoutes"));
const conversationRoutes_1 = __importDefault(require("./routes/conversationRoutes"));
const searchRoutes_1 = __importDefault(require("./routes/searchRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const messageRoutes_1 = __importDefault(require("./routes/messageRoutes"));
const stripeRoutes_1 = __importDefault(require("./routes/stripeRoutes"));
const analyticsRoutes_1 = __importDefault(require("./routes/analyticsRoutes"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const creatorRoutes_1 = __importDefault(require("./routes/creatorRoutes"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const socialAuth_1 = __importDefault(require("./routes/socialAuth"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const allowedOrigins = [
    "http://localhost:3000", // local dev
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || // allow mobile apps / curl / Postman
            allowedOrigins.includes(origin) ||
            origin.endsWith(".vercel.app") // allow any Vercel preview
        ) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));
app.use(express_1.default.json());
// ✅ Social auth session setup
app.use((0, express_session_1.default)({ secret: "session_secret", resave: false, saveUninitialized: true }));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// ✅ All routes
app.use("/upload", uploadRoutes_1.default);
app.use("/uploads", express_1.default.static("uploads"));
app.use("/auth", socialAuth_1.default);
app.use("/auth", authRoutes_1.default);
app.use("/users", userRoutes_1.default);
app.use("/campaigns", campaignRoutes_1.default);
app.use("/portfolio", portfolioRoutes_1.default);
app.use("/conversation", conversationRoutes_1.default);
app.use("/messages", messageRoutes_1.default);
app.use("/search", searchRoutes_1.default);
app.use("/admin", adminRoutes_1.default);
app.use("/stripe", stripeRoutes_1.default);
app.use("/analytics", analyticsRoutes_1.default);
app.use("/dashboard", dashboard_1.default);
app.use("/creators", creatorRoutes_1.default);
// ✅ Socket.IO setup
const io = new socket_io_1.Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
    },
});
io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);
    socket.on("join", (conversationId) => {
        socket.join(conversationId);
    });
    socket.on("message", (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { conversationId, senderId, content } = data;
        if (!conversationId || !senderId || !content)
            return;
        try {
            const savedMessage = yield (0, messageService_1.saveMessage)(conversationId, senderId, content);
            io.to(conversationId).emit("message", savedMessage);
        }
        catch (err) {
            console.error("Error saving message:", err);
        }
    }));
    socket.on("disconnect", () => {
        console.log("🔴 User disconnected:", socket.id);
    });
});
// ✅ Server listen
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
