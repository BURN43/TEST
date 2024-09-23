import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import settingsRoutes from './routes/settings.route.js';
import uploadRoute from './routes/upload.route.js'; 



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();


app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json()); // allows us to parse incoming requests:req.body
app.use(cookieParser()); // allows us to parse incoming cookies
app.get('/', (req, res) => {
	res.send('Welcome to my backend API server!');
  });
app.use("/api/auth", authRoutes);
app.use("/api/settings", settingsRoutes);
// Serve static files from the uploads directory
app.use('/uploads', express.static('uploads'));

// Use the upload route
app.use('/api', uploadRoute);
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 
 

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

app.listen(PORT, () => {
	connectDB();
	console.log("Server is running on port: ", PORT);
});
