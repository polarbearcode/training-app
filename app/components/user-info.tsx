/* User information to display when user is logged in. */

'use client'

import { auth } from "../../auth";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function UserInfo() {

    const { data: session, status} = useSession(); 
 

    return (
        <>
            
            <p>Hello {session?.user?.name}</p>
           
            
          
           
        </>
       

       
    )

}