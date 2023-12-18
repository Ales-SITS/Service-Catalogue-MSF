import * as React from 'react';
import {useState,useEffect} from 'react';

import styles from '../ListToApp.module.scss';
import cardstyles from './Card.module.scss';


//3rd party Modules
import { Icon } from '@fluentui/react/lib/Icon';
import Content from './Content'
import ContentModal from './ContentModal'

//API
import { Web } from "@pnp/sp/webs"; 
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";


export default function Card (props:any) {
    const {
      service,
      colroles,
      catIcons,
      subcatIcons,
      cardType,
      sp,
      siteurl,
      list
    } = props;


    const title = colroles?.filter(col => col.role === "title")[0]?.column
    const category = colroles?.filter(col => col.role === "category")[0]?.column
    const subcategory = colroles?.filter(col => col.role === "subcategory")[0]?.column
    const status = colroles?.filter(col => col.role === "status")[0]?.column
    const content = colroles?.filter(col => col.role === "content")[0]?.column
    const label1 = colroles?.filter(col => col.role === "label1")[0]?.column
    const label2 = colroles?.filter(col => col.role === "label2")[0]?.column
    const ownerField = colroles?.filter(col => col.role === "owner")[0]?.column
    const link = colroles?.filter(col => col.role === "link")[0]?.column

    const serviceObj = {
      title: service[title],
      category: service[category],
      subcategory: service[subcategory],
      status: service[status],
      content: service[content],
      label1: service[label1],
      label2: service[label2],
      ownerField: service[ownerField],
      link: service[link]
    }

    const [contentHidden, setContentHidden] = useState(true)
    const contentHiddenHandler = () => {
      setContentHidden(current => !current)
    }

    const icon = service[status] === "Active" ? "CompletedSolid" : service[status]  === "Archive" ? "RepoSolid" : "SkypeCircleClock"
    
    async function getOwner():Promise<any[]> {
      const listSite = Web([sp.web, `${siteurl}`]) 
      const owner =  await listSite.lists.getById(`${list}`).items.getById(service.ID).select(`${ownerField}/EMail`).expand(`${ownerField}`)()
      return await owner.ServiceOwner.EMail
    }

    useEffect(()=>{
      getOwner().then(res=>console.log(res))
    },[])

    const catIconName =   catIcons.find(cat => cat.category === service[category]) ? 
                          catIcons.find(cat => cat.category === service[category]) :
                          catIcons.find(cat => cat.category === "default")

      
    const subcatIconName =   subcatIcons.find(subcat => subcat.subcategory === service[subcategory]) ? 
                             subcatIcons.find(subcat => subcat.subcategory === service[subcategory]) :
                             subcatIcons.find(subcat => subcat.subcategory === "default")                    

    return (
        <div 
          className={contentHidden ? `${cardstyles.content}` : `${cardstyles.content} ${cardstyles.content_opened}`}
        >
          <button
            className={cardstyles.product_service_button}
            onClick={contentHiddenHandler}>
            <div className={cardstyles.product_service_button_top}>
              <div className={styles.service_cat_vertical}>
                <h4>{service[title]}</h4>
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
                      iconName={icon} 
                      title={serviceObj.status}
                      style={{
                        color: `${serviceObj.status === "Active" ? "#02eb0a" : serviceObj.status === "Archive" ? "#8f8f8f" : "#af00d6"}`,
                        marginLeft: '10px'
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
            cardType = {cardType}
            catIconName={catIconName}
            subcatIconName={subcatIconName}
            serviceObj = {serviceObj}
            onCloseModal={contentHiddenHandler}
           />  
          }      
        </div>
    );
  }


