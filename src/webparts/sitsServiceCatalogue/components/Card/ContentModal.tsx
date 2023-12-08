import * as React from 'react';
import styles from '../SitsServiceCatalogue.module.scss';

//3rd party Modules
import * as DOMPurify from 'dompurify';


export default function Content (props:any) {
    const {
        service,
        content    
    } = props;

    return (
        <div className={styles.content_modal_overlay} onClick={props.onCloseModal}>
            <div className={styles.content_modal} onClick={e => e.stopPropagation()}>
                <button onClick={props.onCloseModal}>CLOSE</button>
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(service[content])}}/>
            </div>
        </div>
    );
  }
