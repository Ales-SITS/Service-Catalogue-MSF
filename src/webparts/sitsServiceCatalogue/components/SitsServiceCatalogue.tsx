import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import styles from './SitsServiceCatalogue.module.scss';

//API
import { spfi, SPFx as SPFxsp} from "@pnp/sp";
import { Web } from "@pnp/sp/webs"; 
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

import { SPFx as SPFxGraph, graphfi } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/groups";
import "@pnp/graph/members";

//3rd party Modules
import { Icon } from '@fluentui/react/lib/Icon';

//Components
import SitsServiceCatalogueByServices from './SitsServiceCatalogueByServices';
import SitsServiceCatalogueByProduct from './SitsServiceCatalogueByProducts';


export default function SitsServiceCatalogue (props:any) {
    const {
      description,
      context
    } = props;

    const sp = spfi().using(SPFxsp(context))
    const graph = graphfi().using(SPFxGraph(context))

    const [searchby,setSearchby] = useState(1)
    const [servicelist,setServicelist] = useState<any[]>([])
    const [internal,setInternal] = useState(false)

    async function getListItems():Promise<any[]> {
      const listSite = Web([sp.web, 'https://msfintl.sharepoint.com/sites/GRP-SITS-Crossroad'])  
      const items: any[] = await listSite.lists.getById("91133e8a-e37c-42cb-bf65-b4a0cc0da7e2").items();
   
      return await items 
    }


    async function getSITSInternal () {
      const currentUser = await graph.me()
      const currentUserDomain = currentUser.mail.split("@")[1].toLowerCase()
      currentUserDomain === "sits.msf.org" ? setInternal(true) : setInternal(false)     
    }

    useEffect(() => {
      getSITSInternal()
      getListItems().then(services => {
        setServicelist(services)
      })
    }, []);



    return (
      <section className={styles.service_catalogue}>
        <div className={styles.service_catalogue_top}>
          <h1>{description}</h1>
          <div className={styles.service_catalogue_top_options}>
            <button 
                onClick={()=>setSearchby(1)}
                title="Search by services"
                style={{
                  color: searchby === 1 ? "white" : "black",
                  backgroundColor: searchby === 1 ? "red" : "white"
                }}
                >
              <Icon
                  iconName="EngineeringGroup" 
                  title="Search by services"/>
            </button>
            <button  
                onClick={()=>setSearchby(2)} 
                title="Search by products"
                style={{
                  color: searchby === 1 ? "black" : "white",
                  backgroundColor: searchby === 1 ? "white" : "red"
                }}
                >
              <Icon
                  iconName="OfficeLogo" 
                  title="Search by products"
            /></button>
          </div>
        </div>
        {searchby === 1 ? 
        <SitsServiceCatalogueByServices internal={internal} servicelist={servicelist}/>:
        <SitsServiceCatalogueByProduct internal={internal} servicelist={servicelist}/>
        }     
      </section>
    );
  }


  //PURIFY DOUBLECHECK

  //STATUS: Active/Archive/Upcoming