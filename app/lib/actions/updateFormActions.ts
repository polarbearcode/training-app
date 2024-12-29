'use server'
import { z } from 'zod';
import {db} from "@vercel/postgres";

/** Actions for updating user profile information */
const UpdateFormSchema = z.object({
    email: z.string(),
    goalPace: z.coerce
      .number()
      .gt(0, {message: 'Please enter a valid pace.'})
  });
  
/** Used for updating user profile form components/user-profile/update-user-info-form.tsx */
export type UpdateFormState = {
errors?: {
    email?: string[];
    marathonGoal?: string[];
};

message?: string | null;
};
  
export async function updateUserProfile(prevState: UpdateFormState, formData: FormData) {
    const validatedFields = UpdateFormSchema.safeParse({
        email: formData.get("email"),
        goalPace: formData.get("goalPace")
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'No valid pace entered.'
        };
    }

    const { email, goalPace } = validatedFields.data;

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