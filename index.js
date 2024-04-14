import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";
import "dotenv/config";
import UserRoutes from "./Users/routes.js";

mongoose.connect("mongodb://127.0.0.1:27017/pin-point");
const app = express();
app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
}));
app.use(express.json());

const sessionOptions = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
};
if (process.env.NODE_ENV !== "development") {
    sessionOptions.proxy = true;
    sessionOptions.cookie = {
        sameSite: "none",
        secure: true,
        domain: process.env.HTTP_SERVER_DOMAIN,
    };
}
app.use(session(sessionOptions));
UserRoutes(app);
app.listen(4000);
