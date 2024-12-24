
import UserInfo from "app/components/user-info";



/** User profile page when they log in */
export default async function ProfileHomePage() {

    return (
        <> 
            <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
                <UserInfo></UserInfo>
            </div> 
            
        </>
    )
}