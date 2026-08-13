import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/User.js";

dotenv.config();

const testDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected.");

        const user = await User.create({
            name: "Test User",
            email: "test@rewynd.com",
            passwordHash: "test-hash"
        });

        console.log("User created:");
        console.log(user);

    } catch (error) {
        console.error("Database test failed:", error.message);

    } finally {
        await mongoose.disconnect();
        console.log("MongoDB disconnected.");
    }
};

testDatabase();