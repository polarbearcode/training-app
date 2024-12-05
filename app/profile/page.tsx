
import UserInfo from "app/components/userInfo";
import { signOut } from "../../auth";
import { PowerIcon } from "@heroicons/react/16/solid";


/** User profile page when they log in */
export default async function ProfileHomePage() {

    return (
        <> 
            <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
                <UserInfo></UserInfo>
                <form
                action={async () => {
                    "use server"
                    await signOut();
                }}
                >
                <button className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
                    <PowerIcon className="w-6" />
                    <div className="hidden md:block">Sign Out</div>
                </button>
                </form>
            
            </div> 
            
        </>
    )
}