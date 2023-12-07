import * as React from 'react';
import styles from './SitsServiceCatalogue.module.scss';

//3rd party Modules
import * as DOMPurify from 'dompurify';


export default function Content (props:any) {
    const {
        service,
        content    
    } = props;

    return (
        <div className={styles.service_content}>
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(service[content])}}/>
        </div>
    );
  }
