import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import styles from './SitsServiceCatalogue.module.scss';

//3rd party Modules
import { Icon } from '@fluentui/react/lib/Icon';

//Helpers
import iconHandler from '../helpers/iconHandler'

export default function ServiceCategories (props:any) {
    const {
      internal,
      categoriesList
    } = props;

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
         <ul className={styles.categories_tabs}>
            {categoriesList.map((category,idx) => 
              <li
                className={checkedState[idx] ? `${styles.category_button} ${styles.category_button_selected}` : `${styles.category_button}`}
                key={`${category}_${idx}`} 
                title={category}
                onClick={() => handleOnChange(idx)}
              > 
                <Icon iconName={iconHandler(category)} style={{fontSize:"35px", marginBottom:"5px"}}/>
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
