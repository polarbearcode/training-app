/** Sign in with Github component */
import { signIn } from "../../auth"
 
export default function SignIn() {
  return (
    <div className="flex gap-4 items-center flex-col sm:flex-row">
        <form
            action={async () => {
                "use server"
                await signIn("github")
            }}
        >
      <button className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-green-300 bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5" type="submit">Signin with GitHub</button>
    </form>

    </div>    
  )
} 