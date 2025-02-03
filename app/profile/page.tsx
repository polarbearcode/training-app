'use server'

import CustomSessionProvider from "app/components/custom-session-provider";
import UserInfo from "app/components/user-info";
import { getStravaUserCodeRedirect } from "app/lib/actions/strava-activities";
import { auth } from "auth";
import { getSession } from "next-auth/react";



/** User profile page when they log in */
export default async function ProfileHomePage() {

    const session = await auth();

    return (
        <> 

            <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
                <div>          
                    Hello {session?.user?.name}             
                </div>

            </div> 

            
            
        </>
    )
}