import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import styles from './ListToApp.module.scss';

//3rd party Modules
import { Icon } from '@fluentui/react/lib/Icon';

export default function SortByBox (props:any) {

    const [sortedbyHidden, setSortedbyHidden] = useState(true)
    const sortedbyHiddenHandler = () => {
      setSortedbyHidden(current => !current)
    }

    const [sortedby,setSortedby] = useState('Title')
    const [sortedbyAsc,setSortedbyAsc] = useState(true)

    const sortedByHandler = (option) => {
      if (option === sortedby) {
        setSortedbyAsc(current => !current)
      } else {
        setSortedby(option)
        setSortedbyAsc(true)
      }
    }

    useEffect(()=>{
      props.onSort([sortedby,sortedbyAsc])
    },[sortedbyAsc, sortedby])

    const sortingOptions = [
      'Title',
      'Category',
      'Subcategory',
      'Status'
    ]

    return (
      <div className={styles.lta__sort_box}>
      <button
        onClick={sortedbyHiddenHandler}
        className={styles.lta__sort} 
      > Sorted by {sortedby} {sortedbyAsc ? "↓" : "↑"}</button>
        <div 
        className={styles.lta__sort_buttons}
        style={{
          left: `${sortedbyHidden ?  "-100%" : "0%"}`,
          opacity: `${sortedbyHidden ?  "0" : "1"}`
        }}
        >
                {sortingOptions.map((option,idx) => 
                  <button 
                    className={styles.lta__sort_button} 
                    key={idx} 
                    onClick={()=>sortedByHandler(`${option}`)}
                    style={{
                      borderBottom:`${option !== sortedby ? "0px solid white" : "1px solid red"}` 
                    }}
                    >
                      {option} {option !== sortedby ? "↓" : sortedbyAsc ? "↓" : "↑"}
                  </button>
                )}
                
        </div>
   
    </div>
    );
  }
