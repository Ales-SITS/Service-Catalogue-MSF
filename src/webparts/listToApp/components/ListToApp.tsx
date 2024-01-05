import * as React from 'react';
import { useEffect, useState, useContext} from 'react';
import styles from './ListToApp.module.scss';

//API
import { spfi, SPFx as SPFxsp} from "@pnp/sp";
import { Web } from "@pnp/sp/webs"; 
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";
import "@pnp/sp/items/get-all";

import { SPFx as SPFxGraph, graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/groups";
import "@pnp/graph/members";

//3rd party Modules
//import { Icon } from '@fluentui/react/lib/Icon';
import MiniSearch from 'minisearch'
import "@pnp/graph/users";

//Components
import Card from './Card/Card'
import Categories from './Controls/Categories'
import Subcategories from './Controls/Subcategories'
import SortByBox from './Controls/SortByBox'
import GroupByBox from './Controls/GroupByBox'
import Grouped from './Grouped'

import { AppContext } from "./ListToAppContext"

export default function ListtoApp () {

    const {settings} = useContext(AppContext)
    const {cr} = useContext(AppContext)
    const {sp} = useContext(AppContext)
    const {roles} = useContext(AppContext)

    const {
      header,
      siteurl,
      list,
      colroles,
      defaultGroupby,

      searchToggle,
      catFilterToggle,
      subcatFilterToggle,
      sortingToggle,
      groupingToggle,

      cardsPerRow,
      webpartID,
    } = settings


    const [servicesList,setServicesList] = useState<any[]>([])
    const [categoriesList,setCategoriesList] = useState<string[]>([])
    const [subcategoriesList,setSubcategoriesList] = useState<string[]>([])

   //READ CORE DATA
    async function getServices():Promise<any[]> {
      const listSite = Web([sp.web, `${siteurl}`])  
      const services: any[] = await listSite.lists.getById(`${list}`).items.getAll();
      
      return await services
    }

    async function getCategories():Promise<any[]> {
      const listSite = Web([sp.web, `${siteurl}`])
      const categories = await listSite.lists.getById(`${list}`).fields.getByInternalNameOrTitle(`${cr.category}`)();
      return await categories.Choices
    }

    async function getSubcategories():Promise<any[]> {
      const listSite = Web([sp.web, `${siteurl}`])  
      const subcategories = await listSite.lists.getById(`${list}`).fields.getByInternalNameOrTitle(`${cr.subcategory}`)();
      return await subcategories.Choices
    }

    useEffect(() => {
      getServices().then(services => {
        setServicesList(services)
        setSearchCategories(services)
        setSearchDescription(services)
      })

      getCategories().then(categories => {
        setCategoriesList(categories)
      })

      getSubcategories().then(subcategories => {
        setSubcategoriesList(subcategories)
      })

      groupHandler(defaultGroupby)

    }, []);

    //SEARCH
    function setSearchCategories (services) {
      const index = new MiniSearch({
        fields: [`${cr.title}`, `${cr.category}`, `${cr.subcategory}`, `${cr.content}`, `${cr.Group1}`],
        storeFields: [`${cr.title}`, `${cr.category}`, `${cr.subcategory}`, `${cr.content}`, `${cr.Group1}`, `${cr.status}`],
        extractField: (service, fieldName) => {
          if (Array.isArray(fieldName)) {
           return service[fieldName].join(' ')
          } else {
           return service[fieldName]
         }
        },
        idField: 'ID',
        searchOptions: {
          prefix: true,
          fuzzy: 0.25,
        },
      });

      index.addAll(services);
      setSearchIndexCategories(index);
    }

    function setSearchDescription(services) {
      const index = new MiniSearch({
        fields: [`${cr.title}`, `${cr.category}`, `${cr.subcategory}`, `${cr.content}`, `${cr.Group1}`],
        storeFields: [`${cr.title}`, `${cr.category}`, `${cr.subcategory}`, `${cr.content}`, `${cr.Group1}`, `${cr.status}`],
        tokenize: (string, _fieldName) => string.split('>'),
        idField: 'ID',
        searchOptions: {
          prefix: true,
          fuzzy: 0.25,
        },
      });

      index.addAll(services);
      setSearchIndexDescription(index);
    }

//SEARCH AND RESULTS 
    const [inputValue, setInputValue] = useState("");

    const [results,setResults] = useState([])

    const [searchIndexCategories, setSearchIndexCategories] = useState(null);
    const [searchIndexDescription, setSearchIndexDescription] = useState(null);

    const handleSearch = (e) => {
      const newResultsCategories = searchIndexCategories?.search(e.target.value, {});
      const newResultsDescription = searchIndexDescription?.search(e.target.value, {});

      setInputValue(e.target.value);

      const merged = newResultsCategories.concat(newResultsDescription)
      const unique = merged.reduce((acc, obj) => {
        if (!acc.some(item => item.Title === obj.Title)) {
          acc.push(obj);
        }
        return acc;
      }, []);

      setResults(unique)
    };

//FILTERS
    const [categoriesFilter,setCategoriesFilter] = useState(categoriesList)
    function categoriesHandler(arr){
      const filtered = categoriesList.filter((_, i) => arr[i]);

      setCategoriesFilter(filtered)
    }


//List of services filtered by search and by selected categories
    let filteredResults = results.filter(obj => {
      for(let cat of categoriesFilter) {
        if (obj.ServicesCategory.includes(cat)) {
          return true
        }
      }
      return false
    })

//List of services filtered by selected categories
    let filteredServicesList = servicesList.filter(obj => {
      for(let cat of categoriesFilter) {
        if (obj.ServicesCategory.includes(cat)) {
          return true
        }
      }
      return false
    })

// SORTING functions
    const [sorting, setSorting] = useState("Title")
    const [sortingAsc, setSortingAsc] = useState(1)
    const sortHandler = (sortVal) => {
      const sorted = colroles?.filter(col => col.role === sortVal[0])[0]?.column
      setSorting(sorted)
      const sortedAsc = sortVal[1] === true ? 1 : -1
      setSortingAsc(sortedAsc)
    }

// GROUPING functions
    const [grouping, setGrouping] = useState(defaultGroupby)
    const [groupingArr,setGroupingArr] = useState([])
    const groupHandler = (group) => {
      if (group === "Category") {
        setGroupingArr(categoriesFilter)
      } else {
        setGroupingArr(subcategoriesList)
      }
      setGrouping(group) 
    }

    useEffect(()=>{
      defaultGroupby === "Category" ? setGroupingArr(categoriesFilter) : setGroupingArr(subcategoriesList)
    },[categoriesFilter.length, subcategoriesList.length])

    const column = "1fr "

    //Sorting for grouped option, changes only if Category or Subcategory is selected.
    const sortedGroupingArrCategories = roles.category?.column === sorting ? groupingArr.sort((a,b)=> a > b ? sortingAsc*1 : -sortingAsc*1) : groupingArr
    const sortedGroupingArrSubcategories = roles.subcategory?.column === sorting ? groupingArr.sort((a,b)=> a > b ? sortingAsc*1 : -sortingAsc*1) : groupingArr
    const sortedGroupingArr = grouping === "Category" ? sortedGroupingArrCategories : sortedGroupingArrSubcategories

    //FILTERES SUBCATEGORY
    const filteredSubcategoriesList = subcategoriesList.filter(subcategory =>
      filteredServicesList.some(service => service[cr.subcategory] === subcategory))

    console.log(filteredSubcategoriesList)

    const [subcategoriesFilter,setSubcategoriesFilter] = useState(filteredSubcategoriesList)
    function subcategoriesHandler(arr){
      const filtered = filteredSubcategoriesList.filter((_, i) => arr[i]);

      setCategoriesFilter(filtered)
    }

     return (     
      <div className={`${styles.lta} lta_${webpartID}_wrapper`}>
        <div className={`lta_${webpartID}_header`}>
          <h1>{header}</h1>
        </div>
        {searchToggle ?
        <input
            className={`lta_${webpartID}_input`} 
            type="text"
            onChange={handleSearch}
            value={inputValue}
            placeholder="Search"
          /> : null}
        {catFilterToggle ? 
        <Categories 
          categoriesList={categoriesList}
          onCheckChange = {categoriesHandler}
        /> : null}
        {subcatFilterToggle ? 
        <Subcategories 
          subcategoriesList={filteredSubcategoriesList}
          onCheckChange = {subcategoriesHandler}
        /> : null}
        {
        sortingToggle?
        <SortByBox onSort={sortHandler}/> : null}
        {
        groupingToggle?
        <GroupByBox onGroup={groupHandler} defaultGroupby={defaultGroupby}/>
         : null}
        {grouping !== "None" && inputValue !== "" ?
        sortedGroupingArr.map((grp,idx)=>
        filteredResults.filter(service => service[cr.category] === grp).length === 0 ? null : 
          <Grouped
            key={idx}
            level={grouping === "Category" ? 1 : 2}
            grp={grp}
            catgrp={grouping === "Category" ? null : grp}
            sorting={sorting}
            grouping={grouping}
            subcategoriesList={subcategoriesList}
            filteredResults={filteredResults}
            filteredServicesList={filteredServicesList}
            sortingAsc={sortingAsc}
            inputValue={inputValue} 
            />
        ) :
        grouping !== "None" && inputValue === "" ? 
        sortedGroupingArr.map((grp,idx)=>
        <Grouped
          key={idx}
          level={grouping === "Category" ? 1 : 2}
          grp={grp}
          catgrp={grouping === "Category" ? null : grp}
          sorting={sorting}
          grouping={grouping}
          subcategoriesList={subcategoriesList}
          filteredResults={filteredResults}
          filteredServicesList={filteredServicesList}
          sortingAsc={sortingAsc}
          inputValue={inputValue}
          />
        ) :
        <div 
            className={styles.service_catalogue_results}
            style={{
              gridTemplateColumns: `${column.repeat(cardsPerRow)}` 
            }}
            >
          {
          inputValue !== "" ? 
          filteredResults.sort((a,b)=> a[sorting] > b[sorting] ? sortingAsc*1 : -sortingAsc*1).map((service,idx) => 
          <Card 
              key={`${idx}_${service.Title}`} 
              service={service} 
          />
              ) : 
          filteredServicesList.sort((a,b)=> a[sorting] > b[sorting] ? sortingAsc*1 : -sortingAsc*1).map((service,idx) => 
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
