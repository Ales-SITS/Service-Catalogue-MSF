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
                <Icon 
                iconName={catIconName.cat_icon} 
                  className={`lta_${webpartID}_category_icon`}
                  style={{
                    fontSize:"35px",
                    marginBottom:"5px",
                    color: `${catIconName.cat_icon_color}`,
                    backgroundColor: `${catIconName.cat_icon_bg}`,              
                    }}/>

    );
  }
