import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type : String ,
        required : true ,
    },
    email : {
        type : String ,
        unique : true ,
        required : true 
    },
    password : {
        type : String ,
        unique : true,
    },
},{timestamps : true} );


//export the model 
export default mongoose.model("User",userSchema) ;