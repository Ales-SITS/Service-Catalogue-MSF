import * as React from 'react';
import { useEffect, useState } from 'react';
import styles from './SitsServiceCatalogue.module.scss';

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
import Categories from './Categories'
import SortByBox from './SortByBox'
import GroupByBox from './GroupByBox'
import Grouped from './Grouped'

export default function Catalogue (props:any) {
    const {
      header,
      siteurl,
      list,
      colroles,
      defaultgroupby,

      contentType,
      cardsPerRow,
      catIcons,
      subcatIcons,
      
      context
    } = props;

    //API init variables
    const sp = spfi().using(SPFxsp(context))
    const graph = graphfi().using(SPFxGraph(context))
    const webpartID = context.instanceId.replaceAll("-","")

    //ROLES handlers
    const title = colroles?.filter(col => col.role === "title")[0]?.column
    const category = colroles?.filter(col => col.role === "category")[0]?.column
    const subcategory = colroles?.filter(col => col.role === "subcategory")[0]?.column
    const status = colroles?.filter(col => col.role === "status")[0]?.column
    const content = colroles?.filter(col => col.role === "content")[0]?.column
    const label1 = colroles?.filter(col => col.role === "label1")[0]?.column
    const label2 = colroles?.filter(col => col.role === "label2")[0]?.column

    const [internal,setInternal] = useState(false)
    const [servicesList,setServicesList] = useState<any[]>([])
    const [categoriesList,setCategoriesList] = useState<string[]>([])
    const [subcategoriesList,setSubcategoriesList] = useState<string[]>([])

    //READ CORE DATA
    async function getSITSInternal () {
      const currentUser = await graph.me()
      const currentUserDomain = currentUser.mail.split("@")[1].toLowerCase()
      currentUserDomain === "sits.msf.org" ? setInternal(true) : setInternal(false)     
    }

    async function getServices():Promise<any[]> {
      const listSite = Web([sp.web, `${siteurl}`])  
      const services: any[] = await listSite.lists.getById(`${list}`).items.getAll();
      
      return await services
    }

    async function getCategories():Promise<any[]> {
      const listSite = Web([sp.web, `${siteurl}`])  
      const categories = await listSite.lists.getById(`${list}`).fields.getByInternalNameOrTitle(`${category}`)();
         return await categories.Choices
    }

    async function getSubcategories():Promise<any[]> {
      const listSite = Web([sp.web, `${siteurl}`])  
      const subcategories = await listSite.lists.getById(`${list}`).fields.getByInternalNameOrTitle(`${subcategory}`)();
         return await subcategories.Choices
    }

    useEffect(() => {
      getSITSInternal() 

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

      groupHandler(defaultgroupby)

    }, []);

    //SEARCH
    function setSearchCategories (services) {
      const index = new MiniSearch({
        fields: [`${title}`, `${category}`, `${subcategory}`, `${content}`, `${label1}`],
        storeFields: [`${title}`, `${category}`, `${subcategory}`, `${content}`, `${label1}`, `${status}`],
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
      //console.log(MiniSearch.getDefault('tokenize'))
      setSearchIndexCategories(index);
    }

    function setSearchDescription(services) {
      const index = new MiniSearch({
        fields: [`${title}`, `${category}`, `${subcategory}`, `${content}`, `${label1}`],
        storeFields: [`${title}`, `${category}`, `${subcategory}`, `${content}`, `${label1}`, `${status}`],
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
    const sortHandler = (sort) => {
      const sorted = colroles?.filter(col => col.role === sort[0].toLowerCase())[0]?.column
      setSorting(sorted)
      const sortedAsc = sort[1] === true ? 1 : -1
      setSortingAsc(sortedAsc)
 }

// GROUPING functions
    const [grouping, setGrouping] = useState(defaultgroupby)
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
      defaultgroupby === "Category" ? setGroupingArr(categoriesFilter) : setGroupingArr(subcategoriesList)
    },[categoriesFilter.length, subcategoriesList.length])

    const column = "1fr "

      return (
      <section className={styles.service_catalogue}>
        <div className={styles.service_catalogue_top}>
          <h1>{header}</h1>
          <div className={styles.service_catalogue_top_options}>
          </div>
        </div>
        <input
            className={styles.sc__input} 
            type="text"
            onChange={handleSearch}
            value={inputValue}
            placeholder="Search"
          />
        <Categories 
          internal={internal}
          categoriesList={categoriesList}
          onCheckChange = {categoriesHandler}
          catIcons = {catIcons}
          context={context}
        />
        <SortByBox onSort={sortHandler}/>
        <GroupByBox onGroup={groupHandler} defaultgroupby={defaultgroupby}/>
        {     
        grouping !== "None" ?
        groupingArr.map((grp,idx)=>
        <Grouped
          key={idx}
          level={grouping === "Category" ? 1 : 2}
          grp={grp}
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
              colroles={colroles} 
              catIcons = {catIcons} 
              contentType = {contentType}

              sp = {sp}
              siteurl={siteurl}
              list={list}
          />
              ) : 
          filteredServicesList.sort((a,b)=> a[sorting] > b[sorting] ? sortingAsc*1 : -sortingAsc*1).map((service,idx) => 
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
      </section>
    );
  }
