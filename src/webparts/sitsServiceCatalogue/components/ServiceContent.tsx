import * as React from 'react';
import styles from './SitsServiceCatalogue.module.scss';

//3rd party Modules
import * as DOMPurify from 'dompurify';


export default function ServiceContent (props:any) {
    const {service} = props;

    const icon = service.Status === "Active" ? "CompletedSolid" : service.Status === "Archive" ? "RepoSolid" : "SkypeCircleClock"

    return (
        <div className={styles.service_content}>
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(service?.ServiceDescription)}}/>
        </div>
    );
  }
