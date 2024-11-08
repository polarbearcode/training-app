/** Form for users to register */
'use client';

import { useActionState } from "react";
import { UserState, registerUser } from "../lib/actions";

export default function SignUpForm() {
    const initialState: UserState = {message: null, errors: {}};
    const [state, formAction] = useActionState(registerUser, initialState);
    return (
        <>
          
            <div className="grid h-16 place-items-center min-h-screen bg-blue-50">
                <h1>SIGN UP</h1>
                <form action={formAction}>
                    {/* User's name */}
                    <div className="mb-4">
                        <label htmlFor="name">Name</label>
                        <input
                            id="name"
                            name="name"
                            type="string"
                            className="ml-2"
                        />
                    </div>

                    {/* User email */}
                    <div className="mb-4">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="string"
                            className="ml-2"
                        />
                    </div>

                    {/* User password*/}
                    <div className="mb-4">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="string"
                            className="ml-2"
                        />
                    </div>
                    <button type="submit">Register</button>
                </form>
            </div>
            
        </>
    )
}