import * as React from 'react';
import { useEffect, useState, useContext } from 'react';
import styles from './ListToApp.module.scss';

import group_styles from './Grouped.module.scss';

//3rd party Modules
import { Icon } from '@fluentui/react/lib/Icon';
import "@pnp/graph/users";

//Components
import Card from './Card/Card'
import { AppContext } from "./ListToAppContext"

export default function Grouped (props) {

  const {settings} = useContext(AppContext)
  const {cr} = useContext(AppContext)

    const {
      level,
      grp,
      catgrp,
      sorting,
      grouping,
      subcategoriesList,
      filteredResults,
      filteredServicesList,
      sortingAsc,
      inputValue,
    } = props;

    const {
      cardsPerRow,
      catIcons,
      subcatIcons,
     } = settings;


    const [groupHidden, setGroupHidden] = useState(level === 1 ? false : true)
    const groupHiddenHandler = () => {
      setGroupHidden(current => !current)
    }

    const groupedServices = filteredServicesList
    .sort((a,b)=> a[sorting] > b[sorting] ? sortingAsc*1 : -sortingAsc*1)
    .filter(service => service[cr.category] === grp)

    const uniqueSubcategories = Array.from(new Set(groupedServices.map(item => item[cr.subcategory])))

     useEffect(()=>{
      setGroupHidden(level === 1 ? false : true)
    },[grouping])

    const column = "1fr "
    
    const catIconName = catIcons?.find(cat => cat.category === grp) ? 
                        catIcons?.find(cat => cat.category === grp) :
                        catIcons?.find(cat => cat.category === "default")
 
    const subcatIconName = subcatIcons?.find(subcat => subcat.subcategory === grp) ? 
                           subcatIcons?.find(subcat => subcat.subcategory === grp) :
                           subcatIcons?.find(subcat => subcat.subcategory === "default")


    const catGrpIconName = catgrp===null ? null : 
                           catIcons?.find(cat => cat.category === catgrp) ? 
                           catIcons?.find(cat => cat.category === catgrp) :
                           catIcons?.find(cat => cat.category === "default")


    return (
        <div className={`${level === 1 ? group_styles.Group1_wrapper :  group_styles.Group2_wrapper} ${groupHidden === true ? null : group_styles.group_opened}`}>
          <button 
            className={level === 1 ?  group_styles.Group1_heading : group_styles.Group2_heading} 
            onClick={groupHiddenHandler}>
            <div>
              <span>{groupHidden ? "▸ " : "▿ "} </span>
              <span>{grp} </span>
              <span>
                ({level === 1 ? 
                uniqueSubcategories.length : inputValue!==""? 
                filteredResults.filter(service => service[cr.subcategory] === grp).length :
                filteredServicesList.filter(service => service[cr.subcategory] === grp).length
                })
              </span>
            </div>
            {
              level === 1 ? 
              <Icon 
              iconName={catIconName.cat_icon} 
              className={group_styles.lta_category_icon}
              style={{
                color: `${catIconName.cat_icon_color}`,
                backgroundColor: `${catIconName.cat_icon_bg}`,
              }}
              /> :
              <Icon 
              iconName={subcatIconName.subcat_icon} 
              className={group_styles.lta_subcategory_icon}
              style={{
                color: `${catGrpIconName.cat_icon_color}`,
                backgroundColor: `${catGrpIconName.cat_icon_bg}`,
              }}
              />
            }
          </button>
          {groupHidden ? null :
           level === 1 && inputValue !== "" ? 
           uniqueSubcategories.map((subcat,idx)=>
            filteredResults.filter(service => service[cr.subcategory] === subcat).length < 1 ? null : 
            <Grouped
              key={idx}
              level={2}
              grp={subcat}
              cardsPerRow={cardsPerRow}
              sorting={sorting}
              grouping={grouping}
              subcategoriesList={subcategoriesList}
              filteredResults={filteredResults}
              filteredServicesList={filteredServicesList}
              sortingAsc={sortingAsc}
              inputValue={inputValue}
            />) :
            level === 1 && inputValue === "" ? 
            uniqueSubcategories.map((subcat,idx)=>
             <Grouped
               key={idx}
               level={2}
               grp={subcat}
               catgrp={grp}
               sorting={sorting}
               grouping={grouping}
               subcategoriesList={subcategoriesList}
               filteredResults={filteredResults}
               filteredServicesList={filteredServicesList}
               sortingAsc={sortingAsc}
               inputValue={inputValue}
             />) :
          <div 
            className={styles.service_catalogue_results}
            style={{
              gridTemplateColumns: `${column.repeat(cardsPerRow)}` 
            }}
          >
            {   
              inputValue !== "" ?
              filteredResults
              .sort((a,b)=> a[sorting] > b[sorting] ? sortingAsc*1 : -sortingAsc*1)
              .filter(service => service[cr.subcategory] === grp)
              .map((service,idx)=>
              <Card 
                  key={`${idx}_${service.Title}`} 
                  service={service} 
              />
              ) :
              filteredServicesList
              .sort((a,b)=> a[sorting] > b[sorting] ? sortingAsc*1 : -sortingAsc*1)
              .filter(service => service[cr.subcategory] === grp)
              .map((service,idx)=>
              <Card  
                  key={`${idx}_${service.Title}`} 
                  service={service}            
              />
              )
              
            }
          </div>
          }
        </div>
    );
  }