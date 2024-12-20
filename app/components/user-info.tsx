/* User information to display when user is logged in. */

'use client'

import { useSession } from "next-auth/react";

export default function UserInfo() {

    const { data: session, status } = useSession(); 

    return (
        <>
            <p>Hello {session?.user?.name}</p>
           
        </>
       

       
    )

}