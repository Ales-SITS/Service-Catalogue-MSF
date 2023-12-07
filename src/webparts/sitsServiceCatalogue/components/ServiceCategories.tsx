import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import styles from './SitsServiceCatalogue.module.scss';

//3rd party Modules
import { Icon } from '@fluentui/react/lib/Icon';

export default function ServiceCategories (props:any) {
    const {
      internal,
      categoriesList,
      catIcons,
      context
    } = props;

    const webpartID = context.instanceId.replaceAll("-","")

    const [checkedState, setCheckedState] = useState([])

      const handleOnChange = (position) => {
        const updatedCheckedState = checkedState.map((item, index) =>
          index === position ? !item : item
        );  
        setCheckedState(updatedCheckedState);
        props.onCheckChange(updatedCheckedState)
       };
    
    useEffect(()=>{
      setCheckedState(new Array(categoriesList.length).fill(true))
      props.onCheckChange(new Array(categoriesList.length).fill(true))
    },[categoriesList])


    return (
         <ul className={`sc_${webpartID}_category_block`}>
            {categoriesList.map((category,idx) => 
              <li
                className={checkedState[idx] ? `sc_${webpartID}_category_button sc_${webpartID}_category_button_selected` : `sc_${webpartID}_category_button`}
                key={`${category}_${idx}`} 
                title={category}
                onClick={() => handleOnChange(idx)}
              > 
                <Icon 
                iconName={
                  catIcons.find(cat => cat.category === category) ? 
                  catIcons.find(cat => cat.category === category).cat_icon :
                  catIcons.find(cat => cat.category === "default").cat_icon
                  } 
                  className={`sc_${webpartID}_category_icon`}
                  style={{fontSize:"35px", marginBottom:"5px"}}/>
                <span className={`sc_${webpartID}_category_label`}>{category}</span>
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
