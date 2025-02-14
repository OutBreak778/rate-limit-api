import mongoose from "mongoose";
 
const mongodb = process.env.MONGO_URI;
if (!mongodb) {
  throw new Error(
    "Please provide a valid URL of MongoDb to access the Database."
  );
}

const connectToDb = async () => {
  try {
    await mongoose
      .connect(mongodb)
      .then(() => console.log("Connected to Database"))
      .catch((error) => console.log(`Error in database:  ${error.message}`))
  } catch (error) {
    console.log(error.message);
  }
};

export default connectToDb;
