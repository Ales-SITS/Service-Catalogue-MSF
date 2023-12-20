import * as React from 'react';
import { useEffect, useState, useContext} from 'react';
import styles from './ListToApp.module.scss';

import { AppContext } from "./ListToAppContext"

export default function SortByBox (props) {

    const {roles} = useContext(AppContext);

    const [sortedbyHidden, setSortedbyHidden] = useState(true)
    const sortedbyHiddenHandler = () => {
      setSortedbyHidden(current => !current)
    }

    const [sortedby,setSortedby] = useState(['Title','Title'])
    const [sortedbyAsc,setSortedbyAsc] = useState(true)

    const sortedByHandler = (option) => {
      if (option[0] === sortedby[0]) {
        setSortedbyAsc(current => !current)
      } else {
        setSortedby([option[0],option[1]])
        setSortedbyAsc(true)
      }
    }

    useEffect(()=>{
      props.onSort([sortedby[0],sortedbyAsc])
    },[sortedbyAsc, sortedby])

    const sortingOptions = [
      [roles.title.role,roles.title.name ? roles.title.name : "Title"],
      [roles.category.role,roles.category.name ? roles.category.name : "Category"],
      [roles.subcategory.role,roles.subcategory.name ? roles.subcategory.name : "Subcategory"],
      [roles.status.role,roles.status.name ? roles.status.name : "Status"]
    ]

    return (
      <div className={styles.lta__sort_box}>
      <button
        onClick={sortedbyHiddenHandler}
        className={styles.lta__sort} 
      > Sorted by {sortedby[1]} {sortedbyAsc ? "↓" : "↑"}</button>
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
                    onClick={()=>sortedByHandler(option)}
                    style={{
                      borderBottom:`${option[0] !== sortedby[0] ? "0px solid white" : "1px solid red"}` 
                    }}
                    >
                      {option[1]} {option[0] !== sortedby[0] ? "↓" : sortedbyAsc ? "↓" : "↑"}
                  </button>
                )}
                
        </div>
   
    </div>
    );
  }
