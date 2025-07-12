import mongoose from "mongoose";

/**
 * Establishes MongoDB connection
 * @param {string} mongodbLink - MongoDB connection Link
 * @returns {Promise<mongoose.Mongoose>}
 * @throws {Error} If connection fails
 */
const connectToDatabase = async (mongodbLink) => {
    try {
        const connection = await mongoose.connect(mongodbLink, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10,
        });
        console.log(`[MongoDB] Connected to ${connection.connection.host}`);
        return connection;
    } catch (error) {
        console.error(`[MongoDB] Connection error: ${error.message}`);
        throw new Error(`Database connection failed: ${error.message}`);
    }
};

export default connectToDatabase;