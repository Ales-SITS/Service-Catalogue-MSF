import * as React from 'react';
import { useEffect, useState, useContext } from 'react';

//3rd party Modules
import SubcatIconStyled from '../helpers/SubcatIconStyled'

import { AppContext } from "../ListToAppContext"

export default function ServiceCategories (props) {
  const {settings} = useContext(AppContext);
  const {webpartID} = settings
  const {subcategoriesList} = props;

  const checkArray = new Array(subcategoriesList.length).fill(true)

  const [checkedState, setCheckedState] = useState(checkArray)
  const handleOnChange = (position) => {
      const updatedCheckedState = checkedState.map((item, index) =>
          index === position ? !item : item
        );  
        setCheckedState(updatedCheckedState);
        props.onCheckChange(updatedCheckedState)
  };
   
  useEffect(()=>{
      setCheckedState(new Array(subcategoriesList.length).fill(true))
      //props.onCheckChange(new Array(subcategoriesList.length).fill(true)) //causes loop
  },[subcategoriesList.length])

  return (
         <ul className={`lta_${webpartID}_subcategory_block`}>
            {subcategoriesList.map((subcategory,idx) => 
              <li
                className={checkedState[idx] ? `lta_${webpartID}_subcategory_button lta_${webpartID}_subcategory_button_selected` : `lta_${webpartID}_subcategory_button`}
                key={`${subcategory}_${idx}`} 
                title={subcategory}
                onClick={() => handleOnChange(idx)}
              > 
                   <SubcatIconStyled
                      subcategory={subcategory}
                    />
                <span className={`lta_${webpartID}_subcategory_label`}>{subcategory}</span>
                <input
                    type="checkbox"
                    name={subcategory}
                    value={subcategory}
                    checked={checkedState[idx]}
                    onChange={() => handleOnChange(idx)}
                  />
              </li>
            )}  
        </ul>
    );
  }
