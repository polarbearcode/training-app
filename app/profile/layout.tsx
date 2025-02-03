/** Default layout for all pages after the user logins */
import CustomSessionProvider from "app/components/custom-session-provider";
import SideNav from "app/components/side-nav";


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
   
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-64">
          <SideNav />
        </div>
        <CustomSessionProvider>
            <div className="grow p-6 md:overflow-y-auto md:p-12">{children}</div>
        </CustomSessionProvider>
      </div>
  
      
    );
}
  