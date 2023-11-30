import * as React from 'react';
import { useState} from 'react';
import styles from './SitsServiceCatalogue.module.scss';

//3rd party Modules
import { Icon } from '@fluentui/react/lib/Icon';
import ServiceContent from './ServiceContent'

//Helpers
import iconHandler from '../helpers/iconHandler'

export default function ProductContent (props:any) {
    const {service} = props;

    const [serviceHidden, setServiceHidden] = useState(true)
    const serviceHiddenHandler = () => {
      setServiceHidden(current => !current)
    }

    const icon = service.Status === "Active" ? "CompletedSolid" : service.Status === "Archive" ? "RepoSolid" : "SkypeCircleClock"
    
    return (
        <div 
        className={serviceHidden ? `${styles.service_content}` : `${styles.service_content} ${styles.service_content_opened}`}
        >
          <button
            className={styles.product_service_button}
            onClick={serviceHiddenHandler}>
            <div  className={styles.product_service_button_top}>
              <span>{service.Title}</span>
              <div>
                <Icon iconName={iconHandler(service.ServicesCategory)} title={service.ServicesCategory}/>
                <Icon 
                      iconName={icon} 
                      title={service.Status}
                      style={{
                        color: `${service.Status === "Active" ? "#02eb0a" : service.Status === "Archive" ? "#8f8f8f" : "#af00d6"}`,
                        marginLeft: '10px'
                      }}/>
                </div>
            </div>

            <div className={styles.service_content_products}>
                  {service?.ProductsCheck?.map(product => <span className={styles.service_product}>{product}</span>)}
            </div>
          </button>
          {serviceHidden === true ? null : <ServiceContent service = {service}/>}
        </div>
    );
  }


