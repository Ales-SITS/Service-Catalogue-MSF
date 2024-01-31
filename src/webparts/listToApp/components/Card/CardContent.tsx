import * as React from 'react';
import styles from '../ListToApp.module.scss';
import cardstyles from './Card.module.scss';
import { useContext} from 'react';

//3rd party Modules
import * as DOMPurify from 'dompurify';
//import { findDOMNode } from 'react-dom';

import { Person } from '@microsoft/mgt-react';
import { ViewType } from '@microsoft/mgt-spfx';

//Components
import { Icon } from '@fluentui/react/lib/Icon';

import { AppContext } from "../ListToAppContext"

export default function CardContent (props) {

    const {settings} = useContext(AppContext)
    const {roles} = useContext(AppContext)

    const {
        serviceObj,
        catIconName,
        subcatIconName,
        statIconName,
        PersonA,
    } = props;

    const {
        cardType,
        webpartID,
        cardCategoryToggle,
        cardSubcategoryToggle,
        cardStatusToggle,
        cardGroupAToggle,
        cardGroupBToggle,
        cardGroupCToggle,
        cardLinkToggle,
        cardPersonAToggle,
        cardPersonAPresenceToggle
        } = settings

    const categoryName = roles.category?.name ? roles.category.name : "Category"
    const subcategoryName = roles.subcategory?.name ? roles.subcategory.name : "Subcategory"
    const GroupAName = roles.GroupA?.name ? roles.GroupA.name : "Group A"
    const GroupBName = roles.GroupB?.name ? roles.GroupB.name : "Group B"
    const GroupCName = roles.GroupC?.name ? roles.GroupB.name : "Group C"
    const PersonAName = roles.PersonA?.name ? roles.PersonA.name : "Person A"

    //console.log(Person)

    return (
        <div className={cardType ? cardstyles.lta__card_overlay : `lta_${webpartID}_card_wrapper`} onClick={props.onCloseModal}>
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
                                    {
                                        catIconName.cat_icon_toggle === true ? 
                                        <img 
                                          className={cardstyles.lta_icon}
                                          src={catIconName.cat_icon_custom}
                                        /> :
                                    <Icon 
                                    iconName={catIconName.cat_icon} 
                                    className={cardstyles.lta_icon}
                                    style={{
                                        color: `${catIconName.cat_icon_color}`,
                                        backgroundColor: `${catIconName.cat_icon_bg}`,
                                      }}
                                    />
                                    }
                                    {serviceObj.category}
                                </span>
                            </div>
                            }
                            {!cardSubcategoryToggle ? null :
                            <div className={cardstyles.lta_detail}>
                                <span className={`lta_${webpartID}_card_detail_label`}>{subcategoryName}</span>
                                <span className={`lta_${webpartID}_card_detail_value`}>
                                    {
                                    subcatIconName.subcat_icon_toggle === true ? 
                                        <img 
                                        className={cardstyles.lta_icon}
                                        src={subcatIconName.subcat_icon_custom}
                                        /> :
                                        <Icon 
                                        iconName={subcatIconName.subcat_icon}
                                        className={cardstyles.lta_icon}
                                        style={{
                                            color: `${catIconName.cat_icon_color}`,
                                            backgroundColor: `${catIconName.cat_icon_bg}`,
                                        }}
                                    />}
                                    {serviceObj.subcategory}
                                </span>                           
                            </div>
                            }           
                        </div>
                        {!cardGroupAToggle ? null : 
                        <div className={cardstyles.lta_detail}>
                            <span className={`lta_${webpartID}_card_detail_label`}>{GroupAName}</span>
                            <div className={cardstyles.lta__card_group_items}>
                                {serviceObj.GroupA?.map((item,idx) => 
                                <span key={idx} className={`lta_${webpartID}_card_detail_GroupA_item`}>{item}</span>
                                )}
                            </div>
                        </div>
                        }
                        {!cardGroupBToggle ? null :
                        <div className={cardstyles.lta_detail}>
                            <span className={`lta_${webpartID}_card_detail_label`}>{GroupBName}</span>
                            <div className={cardstyles.lta__card_group_items}>
                                {serviceObj.GroupB?.map((item,idx) => 
                                <span key={idx} className={`lta_${webpartID}_card_detail_GroupB_item`}>{item}</span>
                                )}
                            </div>
                        </div>
                        }
                        {!cardGroupCToggle ? null :
                        <div className={cardstyles.lta_detail}>
                            <span className={`lta_${webpartID}_card_detail_label`}>{GroupCName}</span>
                            <div className={cardstyles.lta__card_group_items}>
                                {serviceObj.GroupB?.map((item,idx) => 
                                <span key={idx} className={`lta_${webpartID}_card_detail_GroupC_item`}>{item}</span>
                                )}
                            </div>
                        </div>
                        }
                        {!cardPersonAToggle ? null :
                        <div className={cardstyles.lta_detail}>
                            <span className={`lta_${webpartID}_card_detail_label`}>{PersonAName}</span>
                            <Person 
                                personQuery={`${PersonA}`} 
                                view={ViewType.threelines} 
                                showPresence={cardPersonAPresenceToggle} 
                                personCardInteraction={1}
                                avatarSize='large'
                                ></Person>  
                        </div> }
                    </div>      
                    <div className={cardstyles.lta_details_link}>
                        {statIconName.status_icon_toggle === true ? 
                            <img 
                                className={cardstyles.lta_icon}
                                src={statIconName.status_icon_custom}
                            /> :
                            <Icon 
                                iconName={statIconName.status_icon} 
                                title={serviceObj.status}
                                className={cardstyles.lta_icon}
                                style={{
                                    color: `${statIconName.status_icon_color}`,
                                    backgroundColor: `${statIconName.status_icon_bg}`,
                                    fontSize: '18px'
                            }}/>
                        }
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
                <div className={`lta_${webpartID}_card_content_box_wrapper`}>
                    <div className={`lta_${webpartID}_card_contentA_box`}>
                        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(serviceObj.contentA)}}/>
                    </div>
                    <div className={`lta_${webpartID}_card_contentB_box`}>
                        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(serviceObj.contentB)}}/>
                    </div>
                </div>
            </div>
        </div>
    );
  }
