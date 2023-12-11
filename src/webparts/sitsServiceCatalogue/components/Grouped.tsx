import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import styles from './SitsServiceCatalogue.module.scss';

import group_styles from './Grouped.module.scss';

//3rd party Modules
import { Icon } from '@fluentui/react/lib/Icon';
import MiniSearch from 'minisearch'
import "@pnp/graph/users";

//Components
import Card from './Card/Card'


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

    //console.log(filteredServicesList)

    const column = "1fr "

    const [groupHidden, setGroupHidden] = useState(level === 1 ? false : true)
    const groupHiddenHandler = () => {
      setGroupHidden(current => !current)
    }

    const groupedServices = filteredServicesList
    .sort((a,b)=> a[sorting] > b[sorting] ? sortingAsc*1 : -sortingAsc*1)
    .filter(service => service[category] === grp)

    const uniqueSubcategories = Array.from(new Set(groupedServices.map(item => item[subcategory])));

      return (
        <div className={level === 1 ? group_styles.group1_wrapper :  group_styles.group2_wrapper}>
          <button 
            className={level === 1 ?  group_styles.group1_heading : group_styles.group2_heading} 
            onClick={groupHiddenHandler}>
            {groupHidden ? "▶ " : "▼ "}
            <Icon 
                iconName={
                  level === 1 ? 
                  catIcons.find(cat => cat.category === grp) ? 
                  catIcons.find(cat => cat.category === grp).cat_icon :
                  catIcons.find(cat => cat.category === "default").cat_icon :
                  subcatIcons.find(subcat => subcat.subcategory === grp) ? 
                  subcatIcons.find(subcat => subcat.subcategory === grp).subcat_icon :
                  subcatIcons.find(subcat => subcat.subcategory === "default").subcat_icon
                  } 

                  className={`sc_${webpartID}_category_icon`}
                  style={{fontSize: level === 1 ? "25px" : "20px"}}/>
            {grp}
          </button>
          {groupHidden ? null :
           level === 1 ? 
           uniqueSubcategories.map((cat,idx)=>
           <Grouped
            key={idx}
            level={2}
            grp={cat}
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
                  contentType = {contentType}

                  sp = {sp}
                  siteurl={siteurl}
                  list={list}
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
                  contentType = {contentType}

                  sp = {sp}
                  siteurl={siteurl}
                  list={list}
               
              />
              )
              
            }
          </div>
          }
        </div>
    );
  }
