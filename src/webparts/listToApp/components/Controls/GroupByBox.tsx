import * as React from 'react';
import { useState, useContext } from 'react';

import { AppContext } from "../ListToAppContext"

export default function GroupByByBox (props) {

    const {roles} = useContext(AppContext);
    const {settings} = useContext(AppContext)
    const {webpartID} = settings

    const {subcategoryIncluded} = props

    const [groupedbyHidden, setGroupedbyHidden] = useState(true)
    const groupedbyHiddenHandler = () => {
      setGroupedbyHidden(current => !current)
    }

    const [groupby,setGroupby] = useState([
      roles[props.defaultGroupby.toLowerCase()]?.role ? roles[props.defaultGroupby.toLowerCase()].role : "None",
      roles[props.defaultGroupby.toLowerCase()]?.name ? roles[props.defaultGroupby.toLowerCase()].name : roles[props.defaultGroupby.toLowerCase()].role
    ])

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
      [roles.category?.role ? roles.category?.role : "Category" , roles.category?.name ? roles.category.name : "Category"],
      [roles.subcategory?.role ? roles.subcategory?.role : "Subcategory", roles.subcategory?.name ? roles.subcategory.name : "Subcategory"] 
    ]

    return (
      <div className={`lta_${webpartID}_groupby_box`}>
      <button
        onClick={groupedbyHiddenHandler}
        className={`lta_${webpartID}_groupby_button`} 
        > 
        {groupby[0] === "None" ? "Not grouped" : `Grouped by ${groupby[1]}`}</button>
        <div 
          className={`lta_${webpartID}_groupby_choices`}
          style={{
            left: `${groupedbyHidden ?  "-100%" : "0%"}`,
            opacity: `${groupedbyHidden ?  "0" : "1"}`
          }}
        >

          {subcategoryIncluded === true ? 
                groupingOptions.map((option,idx) => 
                  <button 
                    className={option[0] !== groupby[0] ? `lta_${webpartID}_groupby_choice` : `lta_${webpartID}_groupby_choice lta_${webpartID}_groupby_choice_selected`} 
                    key={idx} 
                    onClick={()=>groupByHandler(option)}
                    >
                      {option[1]}
                  </button>
                )   : 
                <button 
                    className={groupingOptions[0][0] !== groupby[0] ? `lta_${webpartID}_groupby_choice` : `lta_${webpartID}_groupby_choice lta_${webpartID}_groupby_choice_selected`} 
              
                    onClick={()=>groupByHandler(groupingOptions[0])}
                    >
                      {groupingOptions[0][1]}
                  </button>
                }       
        </div>
   
    </div>
    );
  }
