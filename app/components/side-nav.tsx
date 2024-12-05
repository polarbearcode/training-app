/** Side Bar for navigation
 * Contains links for signout, import
 */

import Link from 'next/link';
import NavLinks from './nav-links';
import { signOut } from "../../auth";
import { PowerIcon } from '@heroicons/react/16/solid';

export default function SideNav() {
    return (
        <div className="flex h-full flex-col px-3 py-4 md:px-2">
           <div className='relative '>
                <NavLinks></NavLinks>
           </div>
                
            <form className='fixed bottom-0'
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
        
    )
}