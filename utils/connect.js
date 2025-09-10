import mongoose from "mongoose";


const MONGO_LOCAL = process.env.MONGO_URI_LOCAL

async function ConnectToDB() {
  try {
    const connection = await mongoose.connect(MONGO_LOCAL)
    console.log('DataBase LOCAL Connected ✅')
    
  } catch (error) {
    console.error('error while connecting to the Database',error)
    
  }
}

export default ConnectToDB;