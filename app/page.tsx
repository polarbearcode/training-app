/** Landing page */

import SignIn from './components/github-sign-in';
import SignInStrava from './components/strava-sign-in';


export default async function Home() {

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
       <h1 className="text-2xl">Ultimate Training App</h1>
        <div className='grid grid-cols-4 gap-x-8'>
            {/* Strava sign in button
          <SignInStrava></SignInStrava> */}
        
          {/* Github login button */}
          <SignIn></SignIn>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        
      </footer>
    </div>
  );
}
