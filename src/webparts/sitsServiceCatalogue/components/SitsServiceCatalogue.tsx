import * as React from 'react';
import { useEffect, useState } from 'react';
import styles from './SitsServiceCatalogue.module.scss';

//API
import { spfi, SPFx as SPFxsp} from "@pnp/sp";
import { Web } from "@pnp/sp/webs"; 
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
//import type { ISitsServiceCatalogueProps } from './ISitsServiceCatalogueProps';

//import parse from 'html-react-parser';
import * as DOMPurify from 'dompurify';

export default function SitsServiceCatalogue (props:any) {
    const {
      description,
      context
    } = props;

    const sp = spfi().using(SPFxsp(context))

    const [selectedCategory, setSelectedcategory] = useState("")
    const [serviceCategories,setServiceCategories] = useState<string[]>([])
    const [services,setServices] = useState<any[]>([])
    const [selectedService,setSelectedService] = useState("")


    async function getListItems ():Promise<any[]> {
      const listSite = Web([sp.web, 'https://msfintl.sharepoint.com/sites/GRP-SITS-Crossroad'])  
      const items: any[] = await listSite.lists.getById("91133e8a-e37c-42cb-bf65-b4a0cc0da7e2").items();
      console.log(items);
      return await items 
    }

    async function getUniqueCategories(): Promise<string[]> {
      const items = await getListItems(); 
      // Extracting unique categories
      setServices(items)
      const uniqueCategories: string[] = Array.from(
          new Set(items.map(item=> item.ServicesCategory))
      )
      return uniqueCategories;
    }

    useEffect(() => {  
      getUniqueCategories().then(uniqueCategories => {
        setServiceCategories(uniqueCategories)
        const filteredCategories = uniqueCategories.filter(category => category !== null);
            setServiceCategories(filteredCategories);
            setSelectedcategory(filteredCategories[0])
    }).catch(error => {
        // Handle errors if any
        console.error('Error fetching categories:', error);
    });
    }, []);

    const [dynServiceFilter, setDynServiceFilter] = useState("")
    const dynServiceFilterHandler = (val):void => {
   
      if (val === "") {
        setSelectedcategory(serviceCategories[0])
      } else {
        setSelectedcategory("")
        setSelectedService("")
      }
      setDynServiceFilter(val)
    }

    const displayedServices = dynServiceFilter !== "" ? services?.filter(service => service.Title.includes(dynServiceFilter)) : services?.filter(service => service.ServicesCategory === selectedCategory)
    const displayedService = services?.filter(service => service.Title === selectedService)

    return (
      <section>
        <h1>{description}</h1>
        <div className={styles.categories_tabs}>
            {serviceCategories.map((category,idx) => (
              <button
                className = {selectedCategory === category && styles.category_button_selected}
                key={`${category}_${idx}`} 
                onClick={()=>{setSelectedcategory(category)}}
              >
                {category}
              </button>
            ))}
        </div>
        <input
          type="text" 
          name="service" 
          placeholder="Search for service"
          onChange={e => dynServiceFilterHandler (e.target.value)}      
        />
        <div className={styles.services_box}>
            <ul className={styles.services_list}>
              {displayedServices.map((service,idx) => (
                <li 
                  
                  key={`${service}_${idx}`}
                >
                  <button 
                    className = {selectedService === service.Title && styles.service_button_selected}
                    onClick={()=>{setSelectedService(service.Title)}}
                  >
                    {service.Title}
                    </button>
                </li>
              ))
              }
            </ul>
            <div className={styles.service_content}>
              {displayedService.length > 0 && 
              <div>
                <h3>{displayedService[0]?.Title}</h3>
                {displayedService[0]?.Products?.split(';').map(product => <span className={styles.service_product}>{product}</span>)}
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(displayedService[0]?.ServiceDescription)}}/>
              </div>
              }
            </div>
        </div>
      </section>
    );
  }


  //PURIFY DOUBLECHECK