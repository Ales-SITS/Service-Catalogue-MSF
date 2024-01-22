import * as React from 'react';
import {useState,useEffect, useContext} from 'react';

import cardstyles from './Card.module.scss';

//3rd party Modules
import { Icon } from '@fluentui/react/lib/Icon';
import CardContent from './CardContent'
import { Person } from '@microsoft/mgt-react/dist/es6/spfx';
import { ViewType } from '@microsoft/mgt-spfx';

//API
import { Web } from "@pnp/sp/webs"; 
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

import { AppContext } from "../ListToAppContext"

export default function Card (props:any) {
    const {settings} = useContext(AppContext)
    const {cr} = useContext(AppContext)
    const {sp} = useContext(AppContext)

    const {service} = props;

    const {
      catIcons,
      subcatIcons,
      statusIcons,
      siteurl,
      list,
      webpartID,
      cardCategoryToggle,
      cardSubcategoryToggle,
    } = settings
   
    const serviceObj = {
      title: service[cr.title]             ? service[cr.category]     : null,
      category: service[cr.category]       ? service[cr.category]     : null,
      subcategory: service[cr.subcategory] ? service[cr.subcategory]  : null,
      status: service[cr.status]           ? service[cr.status]       : null,
      contentA: service[cr.contentA]       ? service[cr.contentA]     : null,
      contentB: service[cr.contentB]       ? service[cr.contentB]     : null,
      Group1: service[cr.Group1]           ? service[cr.Group1]       : null,
      Group2: service[cr.Group2]           ? service[cr.Group2]       : null,
      Group3: service[cr.Group3]           ? service[cr.Group3]       : null,
      owner: service[cr.owner]             ? service[cr.owner]        : null,
      link: service[cr.link]               ? service[cr.link]         : null
    }

    const [contentHidden, setContentHidden] = useState(true)
    const contentHiddenHandler = () => {
      setContentHidden(current => !current)
    }

    const [owner,setOwner] = useState("")
     
    async function getOwner():Promise<void> {
      const listSite = Web([sp.web, `${siteurl}`]) 
      const owner =  await listSite.lists.getById(`${list}`).items.getById(service.ID).select(`${cr.owner}/EMail`).expand(`${cr.owner}`)()
      setOwner(owner.ServiceOwner.EMail)
      return Promise.resolve()
    }

    useEffect(()=>{
      getOwner()
    },[])

    const catIconName =   catIcons?.find(cat => cat.category === service[cr.category]) ? 
                          catIcons?.find(cat => cat.category === service[cr.category]) :
                          catIcons?.find(cat => cat.category === "default")
      
    const subcatIconName = subcatIcons?.find(subcat => subcat.subcategory === service[cr.subcategory]) ? 
                           subcatIcons?.find(subcat => subcat.subcategory === service[cr.subcategory]) :
                           subcatIcons?.find(subcat => subcat.subcategory === "default")                    

    const statIconName = statusIcons?.find(stat => stat.status === service[cr.status]) ?  
                         statusIcons?.find(stat => stat.status === service[cr.status]) :
                         statusIcons?.find(stat => stat.status === "default")         

    return (
        <div 
          className={contentHidden ? `lta_${webpartID}_card_wrapper` : `lta_${webpartID}_card_wrapper lta_${webpartID}_card_wrapper_opened`}
        >
          <button
            className={`lta_${webpartID}_card_heading`}
            onClick={contentHiddenHandler}>
              <h2 className={`lta_${webpartID}_card_title`}>{service[cr.title]}</h2>   
              <div className={cardstyles.lta__card_iconbox}>
                {!cardSubcategoryToggle ? null :
                <Icon 
                  iconName={subcatIconName.subcat_icon} 
                  title={serviceObj.subcategory}
                  className={cardstyles.lta_icon}
                  style={{
                    color: `${catIconName.cat_icon_color}`,
                    backgroundColor: `${catIconName.cat_icon_bg}`,
                  }}
                />}
                {!cardCategoryToggle ? null :
                <Icon 
                  iconName={catIconName.cat_icon} 
                  title={serviceObj.category}
                  className={cardstyles.lta_icon}
                  style={{
                    color: `${catIconName.cat_icon_color}`,
                    backgroundColor: `${catIconName.cat_icon_bg}`,
                  }}
                />}
                {
                <Icon 
                      iconName={statIconName.status_icon} 
                      title={serviceObj.status}
                      className={cardstyles.lta_icon}
                      style={{
                        color: `${statIconName.status_icon_color}`,
                        backgroundColor: `${statIconName.status_icon_bg}`,
                  }}
                />}
                <Person personQuery={`${owner}`} view={ViewType.image}></Person>  
                {serviceObj.link === null ? null :
                  <a href={serviceObj.link.Url}>
                  <Icon 
                        iconName="Link12"
                        title={serviceObj.link?.Description}
                        className={`lta_${webpartID}_link`}
                  />
                  </a>
                }
                </div>
          </button>
          {contentHidden === true ? null : 
           <CardContent
            catIconName={catIconName}
            subcatIconName={subcatIconName}
            statIconName={statIconName}
            serviceObj = {serviceObj}
            owner = {owner}
            onCloseModal={contentHiddenHandler}
           />  
          }      
        </div>
    );
  }


