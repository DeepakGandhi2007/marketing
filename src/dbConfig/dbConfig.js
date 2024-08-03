import mongoose from "mongoose";


  async function connect(){

    try{
        mongoose.connect(process.env.mongo_url);
        const connection = mongoose.connection;
        connection.setMaxListeners(15);
        connection.on('connected',() => {
            console.log("connected");
        })
        connection.on('error',(err) => {
            console.log(err);
            process.exit(1);
        })

    }
    catch(e){
        console.log(e);
    }
 }

 export default connect;
