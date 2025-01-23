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

/**
 * Update the details of the user's saved profile based on the update-user-info-form
 * @param prevState {UpdateFormState}  The previous state of the form to display default/entered values
 * and error messages.
 * @param formData {FormData} the values the user entered from the form.
 * @returns {Promise<{errors?, messages?, values?}>} a state of the form
 }>}
 */
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

 
    const validatedFields = UpdateFormSchema.safeParse({
        email: formData.get("email"),
        minutes: formData.get("goal-pace-minutes"),
        seconds: formData.get("goal-pace-seconds"),
        startDate: formData.get("training-start-date"),
    });

   


    if (!validatedFields.success) {

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

    const { email, minutes, seconds, startDate } = validatedFields.data;


    try {
        const client = await db.connect();
        await client.sql`
            INSERT INTO UserProfile (email, pace_minutes, pace_seconds, training_start_date)
            VALUES (${email}, ${minutes}, ${seconds}, ${startDate.toDateString()})
            ON CONFLICT (email) DO UPDATE
            SET pace_minutes=${minutes}, pace_seconds=${seconds}, training_start_date=${startDate.toDateString()};
        `;
        
        return {
            message: "Update user information successful. "
        }

          
    } catch (error) {
        console.log(error);
        return {
            message: "Database error. Could not update user information."
        } 

    
    }


}