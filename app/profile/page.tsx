
import UserInfo from "app/components/user-info";
import { getStravaUserCodeRedirect } from "app/lib/actions";



/** User profile page when they log in */
export default async function ProfileHomePage() {

    return (
        <> 
            <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
                <div>
                    <UserInfo></UserInfo>
                </div>

                <div>
                    <form
                        action = {async() => {
                            "use server"
                            await getStravaUserCodeRedirect();
                        }}
                    >
                        <button className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-orange-400 bg-foreground text-background gap-2 hover:bg-[#FFA500] dark:hover:bg-[#FFAC1C] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5" type="submit">Import Activities</button>
                    </form>
                </div>
            </div> 

            
            
        </>
    )
}