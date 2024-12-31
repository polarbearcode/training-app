'use server'
import { z } from 'zod';
import {db} from "@vercel/postgres";
import { minutesSecondsToFloat } from '../utils';
import { P } from 'vitest/dist/chunks/environment.LoooBwUu.js';

/** Actions for updating user profile information */
const UpdateFormSchema = z.object({
    email: z.string(),
    minutes: z.coerce
      .number()
      .gt(0, {message: 'Please enter a valid pace'}),
    seconds: z.coerce
        .number()
        .gt(0, {message: 'Please enter a valid pace'})
        .lt(60, {message: 'Please enter a valid pace'}),
    startDate: z.coerce
        .date({message: "Please enter a date"})
  });
  
/** Used for updating user profile form components/user-profile/update-user-info-form.tsx */
export type UpdateFormState = {
    errors?: {
     email?: string[];
     minutes?: string[];
     seconds?: string[];
     startDate?: string[];  
    };

    message?: string;

    values?: {
        minutes?: number;
        seconds?: number;
        startDate?: string;
    }

    

  

};

export async function updateUserProfile(prevState: UpdateFormState, formData: FormData) : Promise<{
    errors?: {
        email?: string[];
        minutes?: string[];
        seconds?: string[];
        startDate?: string[];  
       };
   
       message?: string;
   
       values?: {
           minutes?: number;
           seconds?: number;
           startDate?: string;
       }
}> 
{

    console.log(formData.get("training-start-date"));
    const validatedFields = UpdateFormSchema.safeParse({
        email: formData.get("email"),
        minutes: formData.get("goal-pace-minutes"),
        seconds: formData.get("goal-pace-seconds"),
        startDate: formData.get("training-start-date"),
    });

   


    if (!validatedFields.success) {

      console.log(prevState)
        const enteredValues : {minutes?: number, seconds?: number, startDate?: string} = {}
        if (formData.get("goal-pace-minutes")) {
            enteredValues.minutes = parseInt(formData.get("goal-pace-minutes")?.toString()!);
        }
        if (formData.get("goal-pace-seconds")) {
            enteredValues.seconds = parseInt(formData.get("goal-pace-seconds")?.toString()!)
        }

        if (formData.get("training-start-date")) {
            enteredValues.startDate = formData.get("training-start-date")?.toString()!;
        }

        

        prevState.values = enteredValues;
       
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'No valid pace entered.',
            values: enteredValues
        };


    }

    const { email, minutes, seconds } = validatedFields.data;

    const goalPace = minutesSecondsToFloat(minutes, seconds);

    try {
        const client = await db.connect();
        await client.sql`
            INSERT INTO userProfile (goalPace)
            VALUES (${goalPace})
            ON CONFLICT (email) DO UPDATE
            SET goalPace = EXCLUDED.goalPace;
        `;
        
        return {
            message: "Update user information successful. "
        }

          
    } catch (error) {
        return {
            message: "Database error. Could not update user information."
        } 

    
    }


}