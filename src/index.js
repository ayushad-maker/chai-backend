import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js"; // ✅ Import your Express app

// ✅ Load environment variables
dotenv.config({
  path: "./.env", // Correct path to the .env file
});

// ✅ Connect to DB, then start server
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
  });


/*
(async ()=>{
try{
    await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
    app.on("error",(error)=>{
        console.log("ERRR:",error)
        throw error
    })
  
    app.listen

}catch(error){
    console.error("Error connecting to MongoDB:", error);
    throw error;
}
} )()

*/