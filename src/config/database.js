import mongoose from 'mongoose';

async function connectToDB() {
    try{
        await mongoose.connect(process.env.DB_CONNECTION_STRING);

        console.log('Connected to DB...');
        return mongoose.connection;
    } catch(err){
        console.error("Failed to connect to DB", err);
        process.exit(1);
    }
}

export default connectToDB;