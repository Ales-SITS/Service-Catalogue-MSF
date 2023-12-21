import * as React from 'react';
import styles from '../ListToApp.module.scss';
import cardstyles from './Card.module.scss';
import { useContext} from 'react';

//3rd party Modules
import * as DOMPurify from 'dompurify';
import { findDOMNode } from 'react-dom';

//Components
import { Icon } from '@fluentui/react/lib/Icon';

import { AppContext } from "../ListToAppContext"

export default function Content (props) {

    const {settings} = useContext(AppContext)
    const {roles} = useContext(AppContext)

    const {
        serviceObj,
        catIconName,
        subcatIconName,
        statIconName
    } = props;

    const {
        cardType,
        webpartID,
        cardCategoryToggle,
        cardSubcategoryToggle,
        cardGroup1Toggle,
        cardGroup2Toggle,
        cardLinkToggle
        } = settings

    const categoryName = roles.category?.name ? roles.category.name : "Category"
    const subcategoryName = roles.subcategory?.name ? roles.subcategory.name : "Subcategory"
    const Group1Name = roles.Group1?.name ? roles.Group1.name : "Group 1"
    const Group2Name = roles.Group2?.name ? roles.Group2.name : "Group 2"

    console.log(serviceObj)

    return (
        <div className={cardType ? cardstyles.lta__card_overlay : cardstyles.content} onClick={props.onCloseModal}>
            <div className={`lta_${webpartID}_card`} onClick={e => e.stopPropagation()}>
                <div className={cardstyles.lta__card_modal_close_wrapper}>
                    <button 
                        className={cardstyles.lta__card_modal_close}
                        onClick={props.onCloseModal}
                    >
                    ✖
                    </button> 
                </div>
                <h2 className={`lta_${webpartID}_card_title`}>{serviceObj.title}</h2>
                <div className={`lta_${webpartID}_card_details_box`}>
                    <div className={cardstyles.lta_details_info}>                   
                        <div className={styles.service_cat_horizontal}>
                            {!cardCategoryToggle ? null :
                            <div className={cardstyles.lta_detail}>
                                <span className={`lta_${webpartID}_card_detail_label`}>{categoryName}</span>
                                <span className={`lta_${webpartID}_card_detail_value`}>
                                    <Icon 
                                    iconName={catIconName.cat_icon} 
                                    className={cardstyles.lta_icon}
                                    style={{
                                        color: `${catIconName.cat_icon_color}`,
                                        backgroundColor: `${catIconName.cat_icon_bg}`,
                                      }}
                                    />
                                    {serviceObj.category}
                                </span>
                            </div>
                            }
                            {!cardSubcategoryToggle ? null :
                            <div className={cardstyles.lta_detail}>
                                <span className={`lta_${webpartID}_card_detail_label`}>{subcategoryName}</span>
                                <span className={`lta_${webpartID}_card_detail_value`}>
                                    <Icon 
                                    iconName={subcatIconName.subcat_icon}
                                    className={cardstyles.lta_icon}
                                    style={{
                                        color: `${catIconName.cat_icon_color}`,
                                        backgroundColor: `${catIconName.cat_icon_bg}`,
                                    }}
                                    />
                                    {serviceObj.subcategory}
                                </span>                           
                            </div>
                            }           
                        </div>
                        {!cardGroup1Toggle ? null : 
                        <div className={cardstyles.lta_detail}>
                            <span className={`lta_${webpartID}_card_detail_label`}>{Group1Name}</span>
                            <div className={cardstyles.lta__card_group_items}>
                                {serviceObj.Group1?.map((item,idx) => 
                                <span key={idx} className={`lta_${webpartID}_card_detail_group1_item`}>{item}</span>
                                )}
                            </div>
                        </div>
                        }
                        {!cardGroup2Toggle ? null :
                        <div className={cardstyles.lta_detail}>
                            <span className={`lta_${webpartID}_card_detail_label`}>{Group2Name}</span>
                            <div className={cardstyles.lta__card_group_items}>
                                {serviceObj.Group2?.map((item,idx) => 
                                <span key={idx} className={`lta_${webpartID}_card_detail_group2_item`}>{item}</span>
                                )}
                            </div>
                        </div>
                        }
                    </div>
                   
                    <div className={cardstyles.lta_details_link}>
                        <Icon 
                            iconName={statIconName.status_icon} 
                            title={serviceObj.status}
                            className={cardstyles.lta_icon}
                            style={{
                                color: `${statIconName.status_icon_color}`,
                                backgroundColor: `${statIconName.status_icon_bg}`,
                                fontSize: '20px'
                        }}/>
                        {!cardLinkToggle ? null : 
                        serviceObj.link === null ? null :
                            <a 
                                href={serviceObj.link.Url}

                            >
                                <Icon 
                                    iconName="Link12"
                                    title={serviceObj.link?.Description}
                                    className={`lta_${webpartID}_link`}
                                />
                            </a>
                        }
                    </div>
                </div>
                <div className={cardstyles.lta_content_box}>
                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(serviceObj.content)}}/>
                </div>
            </div>
        </div>
    );
  }