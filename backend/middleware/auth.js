// import User from "../models/User.js";
// import jwt from 'jsonwebtoken';

// export const protect =async (req ,res ,next) =>{
//    let token;

//    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
//      try{
//         token = req.headers.authorization.split(" ")[1];

//         const decoded =jwt.verify(token ,process.env.JWT_SECRET)

//         req.user = await User.findById(decoded.id).select("-password");
//         return next();
//      }catch(err) {
//         console.log("Token verifcation failed :",err.message);
//         return res.status(401).json({message : "Not authorised ,token "})
//      }
//    }
//     return res.status(401).json({message : "Not authorised ,token "})
// }
 
import User from "../models/User.js";
import jwt from 'jsonwebtoken';

export const protect =async (req ,res ,next) =>{
   let token;

   if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
     try{
        token = req.headers.authorization.split(" ")[1];

        const decoded =jwt.verify(token ,process.env.JWT_SECRET)

        req.user = await User.findById(decoded.id).select("-password");
        return next();
     }catch(err) {
        // IMPROVEMENT 1: Handle JWT verification failure (e.g., token expired/invalid)
        console.log("Token verification failed:", err.message);
        return res.status(401).json({message : "Not authorized, token failed or expired."})
     }
   }
    // IMPROVEMENT 2: Handle case where no token is provided in the headers
    return res.status(401).json({message : "Not authorized, no token provided."})
}
