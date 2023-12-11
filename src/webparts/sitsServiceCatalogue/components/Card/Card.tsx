import * as React from 'react';
import {useState,useEffect} from 'react';
import styles from '../SitsServiceCatalogue.module.scss';

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
      contentType,
      sp,
      siteurl,
      list
    } = props;

    //console.log(colroles)

    const title = colroles?.filter(col => col.role === "title")[0]?.column
    const category = colroles?.filter(col => col.role === "category")[0]?.column
    const subcategory = colroles?.filter(col => col.role === "subcategory")[0]?.column
    const status = colroles?.filter(col => col.role === "status")[0]?.column
    const content = colroles?.filter(col => col.role === "content")[0]?.column
    const label1 = colroles?.filter(col => col.role === "label1")[0]?.column
    //const label2 = colroles?.filter(col => col.role === "label2")[0]?.column

    const ownerField = colroles?.filter(col => col.role === "owner")[0]?.column

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


    return (
        <div 
        className={contentHidden ? `${styles.content}` : `${styles.content} ${styles.content_opened}`}
        >
          <button
            className={styles.product_service_button}
            onClick={contentHiddenHandler}>
            <div className={styles.product_service_button_top}>
              <div className={styles.service_cat_vertical}>
                <span>{service[subcategory]}</span>
                <h4>{service[title]}</h4>
              </div>
              <div className={styles.service_cat_horizontal}>
                <Icon 
                iconName={
                  catIcons.find(cat => cat.category === service[category]) ? 
                  catIcons.find(cat => cat.category === service[category]).cat_icon :
                  catIcons.find(cat => cat.category === "default").cat_icon
                  } 
                title={service[category]}/>
                <Icon 
                      iconName={icon} 
                      title={service[status]}
                      style={{
                        color: `${service[status] === "Active" ? "#02eb0a" : service[status] === "Archive" ? "#8f8f8f" : "#af00d6"}`,
                        marginLeft: '10px'
                      }}/>
                </div>
            </div>

            <div className={styles.content_products}>
                  {service[label1]?.map(product => <span className={styles.service_product}>{product}</span>)}
            </div>
          </button>
          {contentHidden === true ? null : 
           contentType ? 
           <ContentModal service = {service} content = {content} onCloseModal={contentHiddenHandler}/>:
           <Content service = {service} content = {content} />    
          }      
        </div>
    );
  }


