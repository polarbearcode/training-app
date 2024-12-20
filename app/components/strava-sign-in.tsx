/** Sign in button for Strava */
import { signIn } from "../../auth"
 
export default function SignInStrava() {
  return (
    <div className="flex gap-4 items-center flex-col sm:flex-row">
        <form
            action={async () => {
                "use server"
                await signIn("strava");
            }}
        >
      <button className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-orange-400 bg-foreground text-background gap-2 hover:bg-[#FFA500] dark:hover:bg-[#FFAC1C] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5" type="submit">Signin with Strava</button>
    </form>

    </div>    
  )
} 