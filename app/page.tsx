/** Landing page */
import Login from '@/app/components/login';
import { auth, signOut } from '@/auth'
import SignIn from './components/signin';
import { PowerIcon } from '@heroicons/react/16/solid';
import CredentialsSignInComp from './components/CredentialsSignInComp';

export default async function Home() {
  const session = await auth()
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
       <h1 className="text-2xl">Ultimate Training App</h1>
      {/* Github login button */}
      <SignIn></SignIn>

      {/* Credentials Login button */}
      <button className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5" type="submit">
        <a href="/login">Sign In</a>
      </button>

      {/* Register button */}
      <button className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5" type="submit">
        <a href="/register">Register</a>
      </button>
  
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        
      </footer>
    </div>
  );
}
