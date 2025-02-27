import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import bodyParser from 'body-parser';

import UserRoutes from "./routes/UserRoutes.js";
import PostRoutes from "./routes/PostRoutes.js";
import AdRoutes from "./routes/AdRoutes.js";

const CONNECTION_STRING = process.env.DB_CONNECTION_STRING || 'mongodb://127.0.0.1:27017/pinpoint';
mongoose.connect(CONNECTION_STRING);

const app = express();
app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
UserRoutes(app);
PostRoutes(app);
AdRoutes(app);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));