import mongoose from "mongoose";


const MONGO_CLOUD = process.env.MONGO_URI_CLOUD

async function ConnectToDB() {
  try {
    const connection = await mongoose.connect(MONGO_CLOUD)
    console.log('DataBase CLOUD Connected ✅')
    
  } catch (error) {
    console.error('error while connecting to the Database',error)
    
  }
}

export default ConnectToDB;