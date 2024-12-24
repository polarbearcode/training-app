/** Configuration options for NextAuth */
import type { NextAuthConfig, Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import Strava from 'next-auth/providers/strava';
 
export const authConfig = {
  pages: {
    signIn: '/', //redirect user to here when they are redirected for logging in
  },
  
  // URLs with /profile can't be accessed unless logged in
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProfilePage = nextUrl.pathname.startsWith('/profile'); // This has to match with the Response.redirect
      if (isProfilePage) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page (signIn)
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/profile', nextUrl)); // redirect to this URL after successful login
      }
      return true;
    },

    /*
    async jwt({token, account, user}) {
      console.log(account);
      return token;
    }, 

   

    async session({session, token}: {session: Session, token:JWT}) {
      console.log("session \n");
      console.log(session);
     
      //session.customField = "hello";

      // const userCode = fetch(Strava authorize page)
      //const {accessToken, refreshToken} = fetch(callback api)
      //set session accessToken, refreshToken, expiration
    
      return session;
    } */

    

  },
  providers: [GitHub, Credentials, Strava],
} satisfies NextAuthConfig;