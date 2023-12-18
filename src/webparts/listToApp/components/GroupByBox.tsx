import * as React from 'react';
import { useState } from 'react';
import styles from './ListToApp.module.scss';

//3rd party Modules
//import { Icon } from '@fluentui/react/lib/Icon';

export default function GroupByByBox (props:any) {

    const [groupedbyHidden, setGroupedbyHidden] = useState(true)
    const groupedbyHiddenHandler = () => {
      setGroupedbyHidden(current => !current)
    }

    const [groupby,setGroupby] = useState(props.defaultgroupby)

    const groupByHandler = (option) => {
      if (option === groupby) {
        setGroupby("None")
        props.onGroup("None")
      } else {
        setGroupby(option)
        props.onGroup(option)
      }

    }

    const sortingOptions = [
      'Category',
      'Subcategory'
    ]

    return (
      <div className={styles.lta__sort_box}>
      <button
        onClick={groupedbyHiddenHandler}
        className={styles.lta__sort} 
      > {groupby === "None" ? "Not grouped" : `Grouped by ${groupby}`}</button>
        <div 
          className={styles.lta__sort_buttons}
          style={{
            left: `${groupedbyHidden ?  "-100%" : "0%"}`,
            opacity: `${groupedbyHidden ?  "0" : "1"}`
          }}
        >
                {sortingOptions.map((option,idx) => 
                  <button 
                    className={styles.lta__sort_button} 
                    key={idx} 
                    onClick={()=>groupByHandler(option)}
                    style={{
                      borderBottom:`${option !== groupby ? "0px solid white" : "1px solid red"}` 
                    }}
                    >
                      {option}
                  </button>
                )}
                
        </div>
   
    </div>
    );
  }
