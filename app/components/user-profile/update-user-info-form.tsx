'use client'


import { getUserProfile } from "app/lib/actions/actions";
import { updateUserProfile, UpdateFormState} from "app/lib/actions/updateFormActions"
import { useSession } from "next-auth/react";
import { useActionState, useEffect, useState } from "react";


/** Form to add or update user profile data
 * used in profile/edit/page.tsx
 */

export default function UpdateUserForm() {


    const [initialState, setInitialState] = useState<UpdateFormState>({message: "", errors: {}, values:{minutes: 0, seconds: 0, startDate: new Date().toString()}});
    const [state, formAction] = useActionState(updateUserProfile, initialState);
    const {data: session} = useSession();
    

    /** Runs the effect once and then when email changes */
        useEffect(() => {
            let ignore = false;
            if (session) {
                getUserProfile(session.user?.email!).then(result => {
                    if (!ignore) {
                        const newState = {...initialState}
                        newState.values = {};
                        newState.values.minutes = result.pace_minutes;
                        newState.values.seconds = result.pace_seconds;
                        newState.values.startDate = result.training_start_date.toString();
                        setInitialState(newState);
                        
                    }
                }).catch(error => {
                    console.log(error);
                });
            } 
    
            return () => {ignore = true;}; //figure out if I need to return anything here
        }, [session?.user]); 



    return (
        <>
            <form action={formAction} className="grid grid-cols-1 justify-items-center">
                <h1 className="mb-6 text-lg">Update User Profile</h1>
                {session?.user?.name && <p className="mb-6">{session.user.name}</p>}
                <legend className="mb-6">Marathon Goal Pace</legend>
                <fieldset id="pace" className="grid mb-4 justify-items-center">
                    <div id="minutes" className="flex justify-items-center p-2">
                        <label htmlFor="goal-pace-minutes" className="mr-6">Minutes</label>
                        <input name="goal-pace-minutes" type="number" className="border-solid border-black border-2 w-1/4 h-1/2  p-3" 
                            defaultValue={state.values?.minutes == 0 ? initialState.values?.minutes : state.values?.minutes}
                            key = {state.values?.minutes == 0 ? initialState.values?.minutes : state.values?.minutes}/>
                    </div>

                    <div id="pace-error">
                        {state.errors?.minutes && 
                        state.errors.minutes.map((error: string) => {
                            return <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
                        })}
                    </div>
                    <div id="seconds" className="flex">
                        <label htmlFor="goal-pace-seconds" className="mr-6">Seconds</label>
                        <input name="goal-pace-seconds" type="number" className="border-solid border-black border-2 w-1/4 h-1/2  p-3" 
                            defaultValue={state.values?.seconds == 0 ? initialState.values?.seconds : state.values?.seconds}
                            key = {state.values?.seconds == 0 ? initialState.values?.seconds : state.values?.seconds}/>
                    </div>
                    <div id="pace-error">
                        {state.errors?.seconds && 
                        state.errors.seconds.map((error: string) => {
                            return <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
                        })}
                    </div>
                </fieldset>
                <fieldset className="mb-4">
                    <label htmlFor="training-start-date" className="mr-6">Training Start Date</label>
                    <input name="training-start-date" type="date" className="border-solid border-black border-2 p-2" 
                    defaultValue={state.values?.startDate}
                    key={state.values?.startDate ? state.values.startDate : initialState.values?.startDate}/>

                    <div id="date-error">
                        {state.errors?.startDate && 
                        state.errors.startDate.map((error: string) => {
                            return <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
                        })}
                    </div>
                </fieldset>

                <input name="email" type="hidden" value={session?.user?.email || ''} readOnly/>     


                <button type="submit" className="bg-yellow-50 p-2 rounded-md border-black border-2">Submit</button>
                
            </form>

        </>
    )
}