import * as React from 'react';
import {useContext} from 'react';

//3rd party Modules
import { Icon } from '@fluentui/react/lib/Icon';

//Context
import { AppContext } from "../ListToAppContext"

export default function IconStyled (props:any) {
    const {settings} = useContext(AppContext)
    const {category} = props;
    const {catIcons, webpartID} = settings

    const catIconName =   catIcons?.find(cat => cat.category === category) ? 
                          catIcons?.find(cat => cat.category === category) :
                          catIcons?.find(cat => cat.category === "default")

    return (
      <>
      {catIconName.cat_icon_toggle === true ? 
                  <img 
                  src={catIconName.cat_icon_custom}
                  className={`lta_${webpartID}_category_icon_custom`}
                  />
                  :
                <Icon 
                iconName={catIconName.cat_icon} 
                  className={`lta_${webpartID}_category_icon`}
                  style={{
                    color: `${catIconName.cat_icon_color}`,
                    backgroundColor: `${catIconName.cat_icon_bg}`,              
                    }}/>
        }
      </> 
    );
  }
