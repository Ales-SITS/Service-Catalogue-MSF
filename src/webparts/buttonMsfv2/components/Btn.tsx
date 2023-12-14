import * as React from 'react';
import styles from './ButtonMsfv2.module.scss';

//3rd party Modules
import { Icon } from '@fluentui/react/lib/Icon';

export default function Btn (props) {
  
    const {
        btn,
        webPartId,
        search_collection,
        searchTerm
    } = props;

   
    let searchTermOption 
    
    if (!search_collection.search_toggle){
      searchTermOption = `${(btn.button_url)}`
    } else {
      searchTermOption = `${btn.button_url}${searchTerm}${search_collection.search_suffix}`
    }  
    
    const url = searchTermOption.includes("amp;")? searchTermOption.replace("amp;","") : searchTermOption

    console.log(btn)

    return (
        <a 
            className={`${styles.link_reset}`}
            href={url}
            title={btn.button_title}
            target={btn.button_target ? "_blank":"_self"} 
            rel = {btn.button_target? "noreferrer" : ""} 
            data-interception="off"
            style={btn.button_img !== "" ? { backgroundImage:`url(${btn.button_img})`} : null }
        >
            <div className={`btnmsf_${webPartId}_button`}>
            {btn.button_icon_toggle ? 
            <Icon 
                iconName={btn.button_icon}
                className={`btnmsf_${webPartId}_button_icon`}
            /> 
            : null
            }
            {btn.button_icon_custom_toggle ?
            <img 
                src={btn.button_icon_custom}
                className={`btnmsf_${webPartId}_button_icon_custom`}
            />
            : null
            }
            <span 
                className={`btnmsf_${webPartId}_button_text`}>
                {btn.button_label}
            </span>         
           </div>
        </a>
    );
  }
