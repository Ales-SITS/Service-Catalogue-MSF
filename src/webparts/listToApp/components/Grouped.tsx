import * as React from 'react';
import { useEffect, useState, useContext } from 'react';
import styles from './ListToApp.module.scss';

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
      inputValue
    } = props;

    const {
      webpartID,
      cardsPerRow,
      catIcons,
      subcatIcons,
      groupCategoryExpanded,
      groupSubcategoryExpanded
    } = settings;

    const [groupExpanded, setGroupExpanded] = useState(level === 1 ? groupCategoryExpanded : groupSubcategoryExpanded)
    const groupExpandedHandler = () => {
      setGroupExpanded(current => !current)
    }

  
    const groupedServices = filteredServicesList
    .sort((a,b)=> a[sorting] > b[sorting] ? sortingAsc*1 : -sortingAsc*1)
    .filter(service => service[cr.category] === grp)

    const uniqueSubcategories = Array.from(new Set(groupedServices.map(item => item[cr.subcategory])))

     useEffect(()=>{
      setGroupExpanded(level === 1 ? groupCategoryExpanded : groupSubcategoryExpanded)
    },[grouping])

    const column = "1fr "
    
    const catIconName = catIcons?.find(cat => cat.category === grp) ? 
                        catIcons?.find(cat => cat.category === grp) :
                        catIcons?.find(cat => cat.category === "default")
 
    const subcatIconName = subcatIcons?.find(subcat => subcat.subcategory === grp) ? 
                           subcatIcons?.find(subcat => subcat.subcategory === grp) :
                           subcatIcons?.find(subcat => subcat.subcategory === "default")

    const catGrpIconName = catgrp === null ? null : 
                           catIcons?.find(cat => cat.category === catgrp) ? 
                           catIcons?.find(cat => cat.category === catgrp) :
                           catIcons?.find(cat => cat.category === "default")

    const catIconInSubcat = catIcons?.find(cat => cat.category === filteredServicesList.filter(service => service[cr.subcategory] === grp)[0]?.[cr.category]) ? 
                             catIcons?.find(cat => cat.category === filteredServicesList.filter(service => service[cr.subcategory] === grp)[0]?.[cr.category]) :
                             catIcons?.find(cat => cat.category === "default")


    return (
        <div className={
          level === 1 && groupExpanded === true ? 
          `lta_${webpartID}_groupbyCategory_wrapper lta_${webpartID}_groupbyCategory_wrapper_expanded` : 
          level === 1 && groupExpanded === false ?
          `lta_${webpartID}_groupbyCategory_wrapper` : 
          level === 2 && groupExpanded === true ? 
          `lta_${webpartID}_groupbySubcategory_wrapper lta_${webpartID}_groupbySubcategory_wrapper_expanded` :
          `lta_${webpartID}_groupbySubcategory_wrapper`
          }>
          <button 
            className={
              level === 1 ? 
              `lta_${webpartID}_groupbyCategory_heading` : 
              `lta_${webpartID}_groupbySubcategory_heading`

            } 
            onClick={groupExpandedHandler}>
            <div>
              <span>{groupExpanded ? "▸ " : "▿ "} </span>
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
              className={`lta_${webpartID}_groupby_category_icon`}
              style={{
                color: `${catIconName.cat_icon_color}`,
                backgroundColor: `${catIconName.cat_icon_bg}`,
              }}
              /> :
              <div>
                <Icon 
                  iconName={subcatIconName.subcat_icon} 
                  className={`lta_${webpartID}_groupby_subcategory_icon`}
                  style={{
                    color: `${catGrpIconName.cat_icon_color}`,
                    backgroundColor: `${catGrpIconName.cat_icon_bg}`,
                  }}
                />
                <Icon 
                  iconName={catIconInSubcat.cat_icon} 
                  className={`lta_${webpartID}_groupby_subcategory_icon`}
                  style={{
                    color: `${catGrpIconName.cat_icon_color}`,
                    backgroundColor: `${catGrpIconName.cat_icon_bg}`,
                  }}
                />
              </div>
            }
          </button>
          {groupExpanded ? 
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
          : null }
        </div>
    );
  }
