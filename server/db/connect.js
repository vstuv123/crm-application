import mongoose from "mongoose"

const connection = () => {
    try {
        mongoose.connect(process.env.MONGO_URL);
        console.log("Database connected successfully");
    } catch (error) {
        console.log(`Error while connecting to database is ${error.message}`);
    }
}

export default connection;