import express, { urlencoded } from "express"
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js"
import commentRouter from "./routes/comment.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import likeRouter from "./routes/like.routes.js"
import videoRouter from "./routes/video.routes.js"
import healthcheckRouter  from "./routes/healthcheck.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"
import subcriptionRouter from "./routes/subscription.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import paymentRouter from "./routes/payment.routes.js"

const app = express();

app.use(cors({
  origin: "http://localhost:5173", // frontend origin
  credentials: true,               // allow cookies & auth headers
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({limit:"16kb"}))
app.use(urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//routes 

app.use("/api/v1/users",userRouter)
app.use("/api/v1/comments",commentRouter)
app.use("/api/v1/tweets",tweetRouter)
app.use("/api/v1/likes",likeRouter)
app.use("/api/v1/videos",videoRouter)
app.use("/api/v1/healthchecks",healthcheckRouter)
app.use("/api/v1/dashboards",dashboardRouter)
app.use("/api/v1/subscriptions",subcriptionRouter)
app.use("/api/v1/playlists",playlistRouter)
app.use("/api/v1/payments",paymentRouter)
export { app }