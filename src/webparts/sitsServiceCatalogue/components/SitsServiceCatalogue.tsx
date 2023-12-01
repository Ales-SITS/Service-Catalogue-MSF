import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import styles from './SitsServiceCatalogue.module.scss';

//API
import { spfi, SPFx as SPFxsp} from "@pnp/sp";
import { Web } from "@pnp/sp/webs"; 
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";

import { SPFx as SPFxGraph, graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/groups";
import "@pnp/graph/members";

//3rd party Modules
import { Icon } from '@fluentui/react/lib/Icon';
import MiniSearch from 'minisearch'

//Components
import ProductContent from './ProductContent'
import ServiceCategories from './ServiceCategories'

export default function SitsServiceCatalogue (props:any) {
    const {
      header,
      siteurl,
      list,
      context
    } = props;

  
    const sp = spfi().using(SPFxsp(context))
    const graph = graphfi().using(SPFxGraph(context))

    const [internal,setInternal] = useState(false)
    const [servicesList,setServicesList] = useState<any[]>([])
    const [categoriesList,setCategoriesList] = useState<string[]>([])
    const [productsList,setProductsList] = useState<string[]>([])

    async function getSITSInternal () {
      const currentUser = await graph.me()
      const currentUserDomain = currentUser.mail.split("@")[1].toLowerCase()
      currentUserDomain === "sits.msf.org" ? setInternal(true) : setInternal(false)     
    }

    async function getServices():Promise<any[]> {
      const listSite = Web([sp.web, `${siteurl}`])  
      const services: any[] = await listSite.lists.getById(`${list}`).items();
      
      return await services
    }

    async function getCategories():Promise<any[]> {
      const listSite = Web([sp.web, 'https://msfintl.sharepoint.com/sites/GRP-SITS-Crossroad'])  
      const categories = await listSite.lists.getById("91133e8a-e37c-42cb-bf65-b4a0cc0da7e2").fields.getByTitle("Services Category")();
   
      return await categories.Choices
    }

    async function getProducts():Promise<any[]> {
      const listSite = Web([sp.web, 'https://msfintl.sharepoint.com/sites/GRP-SITS-Crossroad'])  
      const products = await listSite.lists.getById("91133e8a-e37c-42cb-bf65-b4a0cc0da7e2").fields.getByTitle("Products")();
   
      return await products.Choices
    }

    function setSearchCategories (services) {
      const index = new MiniSearch({
        fields: ["Title", "ServicesCategory", "ServiceDescription", "Assetsincludedintheservicedelive"],
        storeFields: ["Title", "ServicesCategory", "ServiceDescription","Assetsincludedintheservicedelive", "Status"],
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
        fields: ["Title", "ServicesCategory", "ServiceDescription", "Assetsincludedintheservicedelive"],
        storeFields: ["Title", "ServicesCategory", "ServiceDescription","Assetsincludedintheservicedelive", "Status"],
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

      getProducts().then(products => {
        setProductsList(products)
      })

    }, []);

 console.log(servicesList)

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

    return (
      <section className={styles.service_catalogue}>
        <div className={styles.service_catalogue_top}>
          <h1>{header}</h1>
          <div className={styles.service_catalogue_top_options}>
          </div>
        </div>
        <input
          className={styles.service_catalogue_input} 
          type="text"
          onChange={handleSearch}
          value={inputValue}
          placeholder="Search"
        />
        <ServiceCategories
          internal={internal}
          categoriesList={categoriesList}
          onCheckChange = {categoriesHandler}
        />
        <div 
            className={styles.service_catalogue_results}  >
          {
          inputValue !== "" ? 
          filteredResults.map((service,idx) => 
          <ProductContent key={`${idx}_${service.Title}`} service={service}/>
              ) : 
          filteredServicesList.map((service,idx) => 
          <ProductContent key={`${idx}_${service.Title}`} service={service}/>
              )
          }
        </div>    
      </section>
    );
  }
