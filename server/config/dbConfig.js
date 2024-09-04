import mongoose from "mongoose";

const connectDB = async() => {
    try {
        const conn = await mongoose.connect( process.env.MONGO_URI, {
            // To avoid warnings in the console
            // useCreateIndex: true,
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useFindAndModify: true
        } );

        console.log( `DB Connected: ${ conn.connection.host }` );
        
        // Now verify the connection.
        conn.connection.on("error", () => {
            console.log("Error connecting to MongoDB database.");
        });
        conn.connection.on("connected", () => {
            console.log("Successfully connected to MongoDB database.");
        } );
        
    } catch ( error ) {
        console.error( `Error: ${error.message}` );
        process.exit( 1 );
    }
};

export default connectDB;
