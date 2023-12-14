import * as React from 'react';
import { useEffect, useState } from 'react';
import styles from '../ListToApp.module.scss';

import group_styles from './Grouped.module.scss';

//3rd party Modules
import { Icon } from '@fluentui/react/lib/Icon';
import "@pnp/graph/users";

//Components
import Card from '../Card/Card'


export default function Grouped (props:any) {
    const {
      level,
      grp,
      cardsPerRow,
      sorting,
      grouping,
      category,
      subcategory,
      subcategoriesList,
      filteredResults,
      filteredServicesList,
      sortingAsc,
      inputValue,
      colroles,
      catIcons,
      subcatIcons,
      contentType,
      sp,
      siteurl,
      list,
      webpartID
    } = props;

    const [groupHidden, setGroupHidden] = useState(level === 1 ? false : true)
    const groupHiddenHandler = () => {
      setGroupHidden(current => !current)
    }

    const groupedServices = filteredServicesList
    .sort((a,b)=> a[sorting] > b[sorting] ? sortingAsc*1 : -sortingAsc*1)
    .filter(service => service[category] === grp)

    const uniqueSubcategories = Array.from(new Set(groupedServices.map(item => item[subcategory])))

    useEffect(()=>{
      setGroupHidden(level === 1 ? false : true)
    },[grouping])

    const column = "1fr "
    
    return (
        <div className={level === 1 ? group_styles.group1_wrapper :  group_styles.group2_wrapper}>
          <button 
            className={level === 1 ?  group_styles.group1_heading : group_styles.group2_heading} 
            onClick={groupHiddenHandler}>
            <div>
              <span>{groupHidden ? "▸ " : "▿ "} </span>
              <span>{grp} </span>
              <span>
                ({level === 1 ? 
                uniqueSubcategories.length : inputValue!==""? 
                filteredResults.filter(service => service[subcategory] === grp).length :
                filteredServicesList.filter(service => service[subcategory] === grp).length
                })
              </span>
            </div>
            <Icon 
                iconName={
                  catIcons.find(cat => cat.category === grp) ? 
                  catIcons.find(cat => cat.category === grp).cat_icon :
                  catIcons.find(cat => cat.category === "default").cat_icon
                  } 

                  className={level === 1 ?  group_styles.group1_icon : group_styles.group2_icon}
              />
          </button>
          {groupHidden ? null :
           level === 1 && inputValue !== "" ? 
           uniqueSubcategories.map((subcat,idx)=>
            filteredResults.filter(service => service[subcategory] === subcat).length < 1 ? null : 
            <Grouped
              key={idx}
              level={2}
              grp={subcat}
              cardsPerRow={cardsPerRow}
              sorting={sorting}
              grouping={grouping}
              category={category}
              subcategory={subcategory}
              subcategoriesList={subcategoriesList}
              filteredResults={filteredResults}
              filteredServicesList={filteredServicesList}
              sortingAsc={sortingAsc}
              inputValue={inputValue}
              colroles={colroles}
              catIcons={catIcons}
              subcatIcons={subcatIcons}
              contentType={contentType}
              sp={sp}
              siteurl={siteurl}
              list={list}
              webpartID={webpartID}
            />) :
            level === 1 && inputValue === "" ? 
            uniqueSubcategories.map((subcat,idx)=>
             <Grouped
               key={idx}
               level={2}
               grp={subcat}
               cardsPerRow={cardsPerRow}
               sorting={sorting}
               grouping={grouping}
               category={category}
               subcategory={subcategory}
               subcategoriesList={subcategoriesList}
               filteredResults={filteredResults}
               filteredServicesList={filteredServicesList}
               sortingAsc={sortingAsc}
               inputValue={inputValue}
               colroles={colroles}
               catIcons={catIcons}
               subcatIcons={subcatIcons}
               contentType={contentType}
               sp={sp}
               siteurl={siteurl}
               list={list}
               webpartID={webpartID}
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
              .filter(service => service[subcategory] === grp)
              .map((service,idx)=>
              <Card 
                  key={`${idx}_${service.Title}`} 
                  service={service} 
                  colroles={colroles} 
                  catIcons = {catIcons}
                  subcatIcons = {subcatIcons}
                  contentType = {contentType}

                  sp = {sp}
                  siteurl={siteurl}
                  list={list}
                  webpartID={webpartID}
              />
              ) :
              filteredServicesList
              .sort((a,b)=> a[sorting] > b[sorting] ? sortingAsc*1 : -sortingAsc*1)
              .filter(service => service[subcategory] === grp)
              .map((service,idx)=>
              <Card  
                  key={`${idx}_${service.Title}`} 
                  service={service} 
                  colroles={colroles} 
                  catIcons = {catIcons}
                  subcatIcons = {subcatIcons}
                  contentType = {contentType}

                  sp = {sp}
                  siteurl={siteurl}
                  list={list}   
                  webpartID={webpartID}          
              />
              )
              
            }
          </div>
          }
        </div>
    );
  }
