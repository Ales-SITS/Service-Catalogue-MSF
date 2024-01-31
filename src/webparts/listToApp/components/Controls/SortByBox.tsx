import * as React from 'react';
import { useEffect, useState, useContext} from 'react';

import { AppContext } from "../ListToAppContext"

export default function SortByBox (props) {

    const {roles} = useContext(AppContext);
    const {settings} = useContext(AppContext)
    const {webpartID} = settings

    const {subcategoryIncluded} = props

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
      [roles.title?.role ? roles.title?.role : "Title", roles.title?.name ? roles.title.name : "Title"],
      [roles.category?.role ? roles.category?.role : "Category", roles.category?.name ? roles.category.name : "Category"],
      [roles.subcategory?.role ? roles.subcategory?.role : "SubCategory", roles.subcategory?.name ? roles.subcategory.name : "Subcategory"],
      [roles.status?.role ? roles.status?.role : "Status", roles.status?.name ? roles.status.name : "Status"]
    ]

    const sortingOptionsB = [
      [roles.title?.role ? roles.title?.role : "Title", roles.title?.name ? roles.title.name : "Title"],
      [roles.category?.role ? roles.category?.role : "Category", roles.category?.name ? roles.category.name : "Category"],
      [roles.status?.role ? roles.status?.role : "Status", roles.status?.name ? roles.status.name : "Status"]
    ]


    return (
      <div className={`lta_${webpartID}_sortby_box`}>
      <button
        onClick={sortedbyHiddenHandler}
        className={`lta_${webpartID}_sortby_button`} 
      > Sorted by {sortedby[1]} {sortedbyAsc ? "↓" : "↑"}</button>
        <div 
        className={`lta_${webpartID}_sortby_choices`}
        style={{
          left: `${sortedbyHidden ?  "-100%" : "0%"}`,
          opacity: `${sortedbyHidden ?  "0" : "1"}`
        }}
        >

{subcategoryIncluded === true ? 

              sortingOptions.map((option,idx) => 
                  <button 
                    className={option[0] !== sortedby[0] ? `lta_${webpartID}_sortby_choice` : `lta_${webpartID}_sortby_choice lta_${webpartID}_sortby_choice_selected`} 
                    key={idx} 
                    onClick={()=>sortedByHandler(option)}
                      >
                      {option[1]} {option[0] !== sortedby[0] ? "↓" : sortedbyAsc ? "↓" : "↑"}
                  </button>
                ) :
                sortingOptionsB.map((option,idx) => 
                <button 
                  className={option[0] !== sortedby[0] ? `lta_${webpartID}_sortby_choice` : `lta_${webpartID}_sortby_choice lta_${webpartID}_sortby_choice_selected`} 
                  key={idx} 
                  onClick={()=>sortedByHandler(option)}
                    >
                    {option[1]} {option[0] !== sortedby[0] ? "↓" : sortedbyAsc ? "↓" : "↑"}
                </button>
              ) }


                
        </div>
   
    </div>
    );
  }
