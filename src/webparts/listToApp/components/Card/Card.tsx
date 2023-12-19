import * as React from 'react';
import {useState,useEffect, useContext} from 'react';

import styles from '../ListToApp.module.scss';
import cardstyles from './Card.module.scss';

//3rd party Modules
import { Icon } from '@fluentui/react/lib/Icon';
import ContentModal from './ContentModal'

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
      list
    } = settings
   
    const serviceObj = {
      title: service[cr.title]             ? service[cr.category]     : null,
      category: service[cr.category]       ? service[cr.category]     : null,
      subcategory: service[cr.subcategory] ? service[cr.subcategory]  : null,
      status: service[cr.status]           ? service[cr.status]       : null,
      content: service[cr.content]         ? service[cr.content]      : null,
      label1: service[cr.label1]           ? service[cr.label1]       : null,
      label2: service[cr.label2]           ? service[cr.label2]       : null,
      ownerField: service[cr.ownerField]   ? service[cr.ownerField]   : null,
      link: service[cr.link]               ? service[cr.link]         : null
    }

    const [contentHidden, setContentHidden] = useState(true)
    const contentHiddenHandler = () => {
      setContentHidden(current => !current)
    }
    
    async function getOwner():Promise<any[]> {
      const listSite = Web([sp.web, `${siteurl}`]) 
      const owner =  await listSite.lists.getById(`${list}`).items.getById(service.ID).select(`${cr.ownerField}/EMail`).expand(`${cr.ownerField}`)()
      return await owner.ServiceOwner.EMail
    }

    useEffect(()=>{
      getOwner().then(res=>console.log(res))
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
          className={contentHidden ? `${cardstyles.content}` : `${cardstyles.content} ${cardstyles.content_opened}`}
        >
          <button
            className={cardstyles.product_service_button}
            onClick={contentHiddenHandler}>
            <div className={cardstyles.product_service_button_top}>
              <div className={styles.service_cat_vertical}>
                <h4>{service[cr.title]}</h4>
              </div>
              <div className={styles.service_cat_horizontal}>
                <Icon 
                  iconName={subcatIconName.subcat_icon} 
                  title={serviceObj.subcategory}
                  className={cardstyles.lta_icon}
                  style={{
                    color: `${catIconName.cat_icon_color}`,
                    backgroundColor: `${catIconName.cat_icon_bg}`,
                  }}
                />
                <Icon 
                  iconName={catIconName.cat_icon} 
                  title={serviceObj.category}
                  className={cardstyles.lta_icon}
                  style={{
                    color: `${catIconName.cat_icon_color}`,
                    backgroundColor: `${catIconName.cat_icon_bg}`,
                  }}
                />
                <Icon 
                      iconName={statIconName.status_icon} 
                      title={serviceObj.status}
                      className={cardstyles.lta_icon}
                      style={{
                        color: `${statIconName.status_icon_color}`,
                        backgroundColor: `${statIconName.status_icon_bg}`,
                  }}
                />
                {serviceObj.link === null ? null :
                  <a href={serviceObj.link.Url}>
                  <Icon 
                        iconName="Link12"
                        title={serviceObj.link?.Description}
                        className={cardstyles.lta_icon}
                        style={{
                          color: `${serviceObj.status === "Active" ? "#02eb0a" : serviceObj.status === "Archive" ? "#8f8f8f" : "#af00d6"}`,
                          marginLeft: '10px'
                    }}
                  />
                  </a>
                }
                </div>
            </div>

            <div className={cardstyles.content_products}>
                  {serviceObj.label1?.map(product => <span className={cardstyles.service_product}>{product}</span>)}
            </div>
          </button>
          {contentHidden === true ? null : 
           <ContentModal
            catIconName={catIconName}
            subcatIconName={subcatIconName}
            statIconName={statIconName}
            serviceObj = {serviceObj}
            onCloseModal={contentHiddenHandler}
           />  
          }      
        </div>
    );
  }


