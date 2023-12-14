import * as React from 'react';
import styles from '../ListToApp.module.scss';
import cardstyles from './Card.module.scss';


//3rd party Modules
import * as DOMPurify from 'dompurify';
import { findDOMNode } from 'react-dom';

//Components
import { Icon } from '@fluentui/react/lib/Icon';


export default function Content (props:any) {
    const {
        serviceObj,
        catIconName,
        subcatIconName,
        webpartID
    } = props;

    console.log(serviceObj)
    const icon = serviceObj.status === "Active" ? "CompletedSolid" : serviceObj.status  === "Archive" ? "RepoSolid" : "SkypeCircleClock"

    return (
        <div className={cardstyles.content_modal_overlay} onClick={props.onCloseModal}>
            <div className={cardstyles.content_modal} onClick={e => e.stopPropagation()}>
                <div className={cardstyles.content_modal_close_wrapper}>
                    <Icon 
                      iconName={icon} 
                      title={serviceObj.status}
                      style={{
                        color: `${serviceObj.status === "Active" ? "#02eb0a" : serviceObj.status === "Archive" ? "#8f8f8f" : "#af00d6"}`,
                      }}/>
                    <button 
                    className={cardstyles.content_modal_close}
                    onClick={props.onCloseModal}
                    >
                    ✖
                    </button> 
                </div>
                <h2>{serviceObj.title}</h2>
                <div className={cardstyles.service_card_details}>
                    <div className={styles.service_cat_horizontal}>
                        <div className={cardstyles.service_card_detail}>
                            <span className={cardstyles.service_card_detail_label}>Category</span>
                            <span className={cardstyles.service_card_detail_value}><Icon iconName={catIconName}  className={`sc_${webpartID}_category_icon`}/>{serviceObj.category}</span>
                        </div>
                        <div className={cardstyles.service_card_detail}>
                            <span className={cardstyles.service_card_detail_label}>Subcategory</span>
                            <span className={cardstyles.service_card_detail_value}><Icon iconName={subcatIconName}/>{serviceObj.subcategory}</span>                           
                        </div>
                    </div>

                    <div className={cardstyles.service_card_detail}>
                        <span className={cardstyles.service_card_detail_label}>Assets</span>
                        <div className={cardstyles.content_products}>
                            {serviceObj.label1?.map(product => 
                            <span className={cardstyles.service_product}>{product}</span>
                            )}
                        </div>
                    </div>
                    <div className={cardstyles.service_card_detail}>
                        <span className={cardstyles.service_card_detail_label}>Types</span>
                        <div className={cardstyles.content_products}>
                            {serviceObj.label2?.map(product => 
                            <span className={cardstyles.service_product}>{product}</span>
                            )}
                        </div>
                    </div>
                </div>
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(serviceObj.content)}}/>
            </div>
        </div>
    );
  }
