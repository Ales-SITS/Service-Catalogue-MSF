import * as React from 'react';
import { useState, useContext } from 'react';
import styles from './ListToApp.module.scss';

import { AppContext } from "./ListToAppContext"

export default function GroupByByBox (props) {

    const {roles} = useContext(AppContext);

    const [groupedbyHidden, setGroupedbyHidden] = useState(true)
    const groupedbyHiddenHandler = () => {
      setGroupedbyHidden(current => !current)
    }

    const [groupby,setGroupby] = useState([roles[props.defaultgroupby.toLowerCase()].role,roles[props.defaultgroupby.toLowerCase()].name])

    const groupByHandler = (option) => {
      if (option[0] === groupby[0]) {
        setGroupby(["None","None"])
        props.onGroup("None")
      } else {
        setGroupby(option)
        props.onGroup(option[0])
      }
    }

    const groupingOptions = [
      [roles.category.role,roles.category.name ? roles.category.name : "Category"],
      [roles.subcategory.role,roles.subcategory.name ? roles.subcategory.name : "Subcategory"]
    ]

    return (
      <div className={styles.lta__sort_box}>
      <button
        onClick={groupedbyHiddenHandler}
        className={styles.lta__sort} 
        > 
        {groupby[0] === "None" ? "Not grouped" : `Grouped by ${groupby[1]}`}</button>
        <div 
          className={styles.lta__sort_buttons}
          style={{
            left: `${groupedbyHidden ?  "-100%" : "0%"}`,
            opacity: `${groupedbyHidden ?  "0" : "1"}`
          }}
        >
                {groupingOptions.map((option,idx) => 
                  <button 
                    className={styles.lta__sort_button} 
                    key={idx} 
                    onClick={()=>groupByHandler(option)}
                    style={{
                      borderBottom:`${option[0] !== groupby[0] ? "0px solid white" : "1px solid red"}` 
                    }}
                    >
                      {option[1]}
                  </button>
                )}
                
        </div>
   
    </div>
    );
  }
