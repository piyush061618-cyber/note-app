import React from 'react'
import {Link, useNavigate} from 'react-router-dom';
export default function Navbar({user,setUser}) {
    const navigate =useNavigate();
    const handleLogout =() =>{
        localStorage.removeItem("token");
        setUser(null);
        navigate('/login')
    }
  return (
    <nav className='bg-gray-900 p-4 text-white shadow-lg'>
         <div className='container mx-auto flex items-center justify-between'>
         <Link to="/"> Notes App
           
         </Link>
         {user &&(
            
               <div>
                 <span>{user.username} </span>
                 <button onClick={handleLogout} 
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition" >
                    Logout</button>
               </div>
            
           )}
         </div>
    </nav>
  )
}
