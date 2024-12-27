import { Dispatch, SetStateAction } from "react";

/** Generalized dropdown menu component.
 * Uses: select run type, filter workouts on the workout page
  */
export default function CategoryDropdown({optionsList, setterFunction} : 
    {
        optionsList: string[], // parent component specifies options
        setterFunction: Dispatch<SetStateAction<string>> // a set function from useState
    }

 
   
) {
    /**
     * Utilize the passed down setterFunction from parent to change state value.
     */
    function changeStateValue() {
        const e  = document.getElementById("option-selection"); // select the dropdown element in return statement
        setterFunction((e as HTMLInputElement).value); // casting e to HTMLInputElement
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