/* User information to display when user is logged in.
* Only displaying the name from the session after logging in 
* from one of the OAuth providers.
*/

'use client'

import { useSession } from "next-auth/react";


export default function UserInfo() {

    const { data: session} = useSession(); 
 

    return (
        <>
            
            <p>Hello {session?.user?.name}</p>
        
           
        </>
       

       
    )

}