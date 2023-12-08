import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import styles from './SitsServiceCatalogue.module.scss';

//3rd party Modules
import { Icon } from '@fluentui/react/lib/Icon';

export default function GroupByByBox (props:any) {

    const [groupedbyHidden, setGroupedbyHidden] = useState(true)
    const groupedbyHiddenHandler = () => {
      setGroupedbyHidden(current => !current)
    }

    const [groupby,setGroupby] = useState(props.defaultgroupby)

    const groupByHandler = (option) => {
      if (option == groupby) {
        setGroupby("None")
        props.onGroup("None")
      } else {
        setGroupby(option)
        props.onGroup(option)
      }

    }

    const sortingOptions = [
      'Category',
      'Subcategory',
      'Status',
      'Owner'
    ]

    return (
      <div className={styles.sc__sort_box}>
      <button
        onClick={groupedbyHiddenHandler}
        className={styles.sc__sort} 
      > {groupby === "None" ? "Not grouped" : `Grouped by ${groupby}`}</button>
        <div 
          className={styles.sc__sort_buttons}
          style={{
            left: `${groupedbyHidden ?  "-100%" : "0%"}`
          }}
        >
                {sortingOptions.map((option,idx) => 
                  <button 
                    className={styles.sc__sort_button} 
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
