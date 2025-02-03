
import CustomSessionProvider from "app/components/custom-session-provider"
import UpdateUserForm from "app/components/user-profile/update-user-info-form"


/** Form to add user profile data
 * Marathon goal time, last data fetch from Strava (hidden)
 */
export default async function page() {
        
    return (
      <CustomSessionProvider>
        <UpdateUserForm></UpdateUserForm>
      </CustomSessionProvider>
            
      
        
    )
}