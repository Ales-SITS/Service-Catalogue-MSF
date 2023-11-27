import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import styles from './SitsServiceCatalogue.module.scss';

//3rd party Modules
import * as DOMPurify from 'dompurify';
import { Icon } from '@fluentui/react/lib/Icon';

export default function SitsServiceContent (props:any) {
    const {service} = props;

    const icon = service.Status === "Active" ? "CompletedSolid" : service.Status === "Archive" ? "RepoSolid" : "SkypeCircleClock"

    return (
        <div className={styles.service_content}>
            <span>{service.ServicesCategory}</span>
            <div className={styles.service_content_header}>
                  <h3>{service?.Title}</h3>
                  <Icon 
                  iconName={icon} 
                  title={service.Status}
                  className={styles.service_content_status_icon}
                  style={{
                    color: `${service.Status === "Active" ? "#02eb0a" : service.Status === "Archive" ? "#8f8f8f" : "#af00d6"}`
                  }}
                  />
            </div>
            <div className={styles.service_content_products}>
                  {service?.Products?.split(';').map(product => <span className={styles.service_product}>{product}</span>)}
            </div>
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(service?.ServiceDescription)}}/>
        </div>
    );
  }


  //PURIFY DOUBLECHECK

  //STATUS: Active/Archive/Upcoming