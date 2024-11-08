/** Form for users to register */
'use client';

import { useActionState } from "react";
import { UserState, registerUser } from "../lib/actions";

export default function signUpForm() {
    const initialState: UserState = {message: null, errors: {}};
    const [state, formAction] = useActionState(registerUser, initialState);

    return (
        <>
            <div>
                <h1>SIGN UP</h1>
            </div>
            <form action={formAction}>
            {/* User's name */}
            <div>
                <label htmlFor="name">Name</label>
                <input
                    id="name"
                    name="name"
                    type="string"
                />
            </div>

            {/* User email */}
            <div>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    type="string"
                />
            </div>

              {/* User password*/}
              <div>
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    name="password"
                    type="string"
                />
            </div>
        </form>
 
        </>
    )
}