/** Links on the sidebar besides signout. Used in SideNav component, where the links are put onto the page. */

'use client'
import { ArrowLeftCircleIcon, HomeIcon } from "@heroicons/react/16/solid";
import { usePathname } from "next/navigation";
import clsx from 'clsx';
import Link from 'next/link';
import { PencilIcon, PlusCircleIcon, PresentationChartBarIcon, RocketLaunchIcon } from "@heroicons/react/24/outline";

const links = [
    {name: 'Profile', href: "/profile", icon: HomeIcon},
    {name: 'Edit', href: "/profile/edit", icon: PencilIcon},
    {name: 'Import', href:"/profile/import", icon: ArrowLeftCircleIcon},
    {name: 'Workouts', href: "/profile/workouts", icon: PresentationChartBarIcon},
    {name: 'Training', href: "/profile/training", icon: RocketLaunchIcon},
   
];

export default function NavLinks() {
    const pathname = usePathname();
    return (
        <>
            {links.map((link) => {
                const LinkIcon = link.icon;
                return (
                    <Link
                        key = {link.name}
                        href = {link.href}
                        className={clsx(
                            'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
                            {
                              'bg-sky-100 text-blue-600': pathname === link.href,
                            }
                        )}
                    >

                        <LinkIcon className="w-6" />
                        <p className="hidden md:block">{link.name}</p>
                    
                    </Link>
                )
            })}
        </>
    )
}