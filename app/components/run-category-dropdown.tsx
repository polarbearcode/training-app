import { Dispatch, SetStateAction } from "react";

/** Drop down menu to select the type of run.  */
export default function RunCategoryDropdown({optionsList, setterFunction} : 
    {
        optionsList: string[], 
        setterFunction: Dispatch<SetStateAction<string>>
    }
   
) {
    return (
        <>
            <select>
                {optionsList.map((optionItem, k) => {
                    return <option key={k}>{optionItem}</option>
                })}
            </select>
        </>
    )

}