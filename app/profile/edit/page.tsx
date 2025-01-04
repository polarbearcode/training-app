'use client'

import UpdateUserForm from "app/components/user-profile/update-user-info-form"
import { getUserProfile } from "app/lib/actions/actions";
import { getActivitesFromDB } from "app/lib/actions/strava-activities"
import { UpdateFormState, updateUserProfile } from "app/lib/actions/updateFormActions";
import { useSession } from "next-auth/react";
import { useState, useActionState, useEffect } from "react";



/** Form to add user profile data
 * Marathon goal time, last data fetch from Strava (hidden)
 */
export default function page() {
    const {data: session} = useSession();
    
    if (session == null) {
        return <p>Loading</p>
    }
    
    return (
        <UpdateUserForm></UpdateUserForm>
    )
}