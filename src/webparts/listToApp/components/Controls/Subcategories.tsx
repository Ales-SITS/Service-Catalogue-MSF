import * as React from 'react';
import { useEffect, useState, useContext } from 'react';

//3rd party Modules
import IconStyled from '../helpers/IconStyled'

import { AppContext } from "../ListToAppContext"

export default function ServiceCategories (props) {
  const {settings} = useContext(AppContext);
  const {webpartID} = settings
  const {subcategoriesList} = props;

  const [checkedState, setCheckedState] = useState([])

  const handleOnChange = (position) => {
      const updatedCheckedState = checkedState.map((item, index) =>
          index === position ? !item : item
        );  
        setCheckedState(updatedCheckedState);
        props.onCheckChange(updatedCheckedState)
  };
   
  
  useEffect(()=>{
      setCheckedState(new Array(subcategoriesList.length).fill(true))
      //props.onCheckChange(new Array(subcategoriesList.length).fill(true)) causes loop
  },[subcategoriesList])
  

  console.log(subcategoriesList)

  return (
         <ul className={`lta_${webpartID}_category_block`}>
            {subcategoriesList.map((category,idx) => 
              <li
                className={checkedState[idx] ? `lta_${webpartID}_category_button lta_${webpartID}_category_button_selected` : `lta_${webpartID}_category_button`}
                key={`${category}_${idx}`} 
                title={category}
                onClick={() => handleOnChange(idx)}
              > 
                   <IconStyled
                      category={category}
                    />
                <span className={`lta_${webpartID}_category_label`}>{category}</span>
                <input
                    type="checkbox"
                    name={category}
                    value={category}
                    checked={checkedState[idx]}
                    onChange={() => handleOnChange(idx)}
                  />
              </li>
            )}  
        </ul>
    );
  }
