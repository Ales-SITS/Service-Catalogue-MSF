import * as React from 'react';
import {useContext} from 'react';

//3rd party Modules
import { Icon } from '@fluentui/react/lib/Icon';

//Context
import { AppContext } from "../ListToAppContext"

export default function SubcatIconStyled (props:any) {
    const {settings} = useContext(AppContext)
    const {subcategory} = props;
    const {subcatIcons, webpartID} = settings

    const subcatIconName =  subcatIcons?.find(subcat => subcat.subcategory === subcategory) ? 
                            subcatIcons?.find(subcat => subcat.subcategory === subcategory) :
                            subcatIcons?.find(subcat => subcat.subcategory === "default")

    return (
                <Icon 
                iconName={subcatIconName.subcat_icon} 
                  className={`lta_${webpartID}_subcategory_icon`}
                  style={{
                    color: `${subcatIconName.subcat_icon_color}`,
                    backgroundColor: `${subcatIconName.subcat_icon_bg}`,              
                    }}/>

    );
  }
