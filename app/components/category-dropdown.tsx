import { Dispatch, SetStateAction } from "react";

/** Generalized dropdown menu component.
 * Uses: select run type, filter workouts on the workout page
  */
export default function CategoryDropdown({optionsList, setterFunction} : 
    {
        optionsList: string[], 
        setterFunction: Dispatch<SetStateAction<string>>
    }

    

    
   
) {
    function changeStateValue() {
        const e  = document.getElementById("option-selection");
        console.log((e as HTMLInputElement).value);
        setterFunction((e as HTMLInputElement).value);
    }

    return (
        <>
            <select id="option-selection" onChange={() => changeStateValue()}>
                {optionsList.map((optionItem, k) => {
                    return <option key={k}>{optionItem}</option>
                })}
            </select>
        </>
    )

}