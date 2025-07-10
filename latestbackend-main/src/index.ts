import dotenv from "dotenv"
dotenv.config()

import express from "express"
import http from "http"
import cors from "cors"
import { Server } from "socket.io"
import { saveMessage } from "./services/messageService"

// Route imports
import authRoutes from "./routes/authRoutes"
import userRoutes from "./routes/userRoutes"
import campaignRoutes from "./routes/campaignRoutes"
import portfolioRoutes from "./routes/portfolioRoutes"
import conversationRoutes from "./routes/conversationRoutes"
import searchRoutes from "./routes/searchRoutes"
import adminRoutes from "./routes/adminRoutes"
import messageRoutes from "./routes/messageRoutes"
import stripeRoutes from "./routes/stripeRoutes"
import analyticsRoutes from "./routes/analyticsRoutes"
import dashboardRoutes from "./routes/dashboard"
import creatorRoutes from "./routes/creatorRoutes"
import session from "express-session"
import passport from "passport"
import uploadRoutes from "./routes/uploadRoutes"
import socialAuthRoutes from "./routes/socialAuth"

const app = express()
const server = http.createServer(app)


const allowedOrigins = [
  "http://localhost:3000", // local dev
]

app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin || // allow mobile apps / curl / Postman
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") // allow any Vercel preview
      ) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true,
  })
)


app.use(express.json())

// ✅ Social auth session setup
app.use(session({ secret: "session_secret", resave: false, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())

// ✅ All routes
app.use("/upload", uploadRoutes)
app.use("/uploads", express.static("uploads"))
app.use("/auth", socialAuthRoutes)
app.use("/auth", authRoutes)
app.use("/users", userRoutes)
app.use("/campaigns", campaignRoutes)
app.use("/portfolio", portfolioRoutes)
app.use("/conversation", conversationRoutes)
app.use("/messages", messageRoutes)
app.use("/search", searchRoutes)
app.use("/admin", adminRoutes)
app.use("/stripe", stripeRoutes)
app.use("/analytics", analyticsRoutes)
app.use("/dashboard", dashboardRoutes)
app.use("/creators", creatorRoutes)

// ✅ Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
})

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id)

  socket.on("join", (conversationId: string) => {
    socket.join(conversationId)
  })

  socket.on("message", async (data) => {
    const { conversationId, senderId, content } = data
    if (!conversationId || !senderId || !content) return

    try {
      const savedMessage = await saveMessage(conversationId, senderId, content)
      io.to(conversationId).emit("message", savedMessage)
    } catch (err) {
      console.error("Error saving message:", err)
    }
  })

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id)
  })
})

// ✅ Server listen
const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
