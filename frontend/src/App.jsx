// import { useState } from "react"
// import Navbar from "./components/Navbar"
// import { Route,Routes ,Navigate } from "react-router-dom"
// import Login from "./components/Login"
// import Register from "./components/Register"
// import Home from "./components/Home"
// import { useEffect } from "react"
// import axios from "axios";
// function App() {
//   const[user ,setUser] =useState(null)
//    const [loading, setLoading] = useState(true); // ✅ new loading state
//   useEffect(() =>{
//     const fetchUser =async () =>{
//        try{
//         const token =localStorage.getItem("token");
//         if(!token){
//           setLoading(false);
//            return;
//         }
//         const {data} =await axios.get("/api/users/me" ,{
//           headers: {Authorization :`Bearer ${token}`}
//         })
//        setUser(data);

//        }catch(error){
//          console.error("Error fetching user:", error);
//            localStorage.removeItem("token");
//        }finally{
//         setLoading(false); // ✅ always stop loading
//        }
//     }
//     fetchUser();
//   } ,[])
//   // 🕒 Show a loader until user is fetched
//   if (loading) {
//     return <div className="text-center text-white mt-10">Loading...</div>;
//   }
//   return (
//     <div className="min-h-screen bg-gray-500">
//         <Navbar user ={user} setUser ={setUser}/>
//         <Routes>
//            <Route 
//                path='/login'
//                 element= {user ?<Navigate to="/"/> :
//                 <Login setUser={setUser}/>} 
//             />
//             <Route 
//                path='/register'
//                 element= {user ?<Navigate to="/"/> :
//               <Register setUser={setUser}/>}
//            />
//            <Route path="/" element={user ?<Home/> :
//                <Navigate to="/login" />}
//            />
//         </Routes>
//     </div>
   
//   )
// }

// export default App

import { useState } from "react"
import Navbar from "./components/Navbar"
import { Route,Routes ,Navigate } from "react-router-dom"
import Login from "./components/Login"
import Register from "./components/Register"
import Home from "./components/Home"
import { useEffect } from "react"
import axios from "axios";
function App() {
  const[user ,setUser] =useState(null)
   const [loading, setLoading] = useState(true); // ✅ new loading state
  useEffect(() => {
    const fetchUser =async () =>{
       try{
        const token =localStorage.getItem("token");
        if(!token){
          setLoading(false);
           return;
        }
        const {data} =await axios.get("/api/users/me" ,{
          headers: {Authorization :`Bearer ${token}`}
        })
       setUser(data);

       }catch(error){
         console.error("Error fetching user:", error);
         // 💡 FIX: Only remove token if the error is explicitly an authentication issue (401)
         if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
         }
       }finally{
        setLoading(false); // ✅ always stop loading
       }
    }
    fetchUser();
  } ,[])
  // 🕒 Show a loader until user is fetched
  if (loading) {
    return <div className="text-center text-white mt-10">Loading...</div>;
  }
  return (
    <div className="min-h-screen bg-gray-500">
        <Navbar user ={user} setUser ={setUser}/>
        <Routes>
           <Route 
               path='/login'
                element= {user ?<Navigate to="/"/> :
                <Login setUser={setUser}/>} 
            />
            <Route 
               path='/register'
                element= {user ?<Navigate to="/"/> :
              <Register setUser={setUser}/>}
           />
           <Route path="/" element={user ?<Home/> :
               <Navigate to="/login" />}
           />
        </Routes>
    </div>
   
  )
}

export default App