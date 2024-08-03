import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

 const getDataFromToken = (request) =>{
    try{
        const token = request.cookies.get("token")?. value || '';
       const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
       console.log("decoed",decodedToken);
       return decodedToken.id;
    }
    catch(error){
        console.log(error.message);
    }
}
export default getDataFromToken


