import * as React from 'react';
import styles from './WelcomeUserMsfv2.module.scss';

//3rd party Modules
import { Icon } from '@fluentui/react/lib/Icon';

export default function WelcomeUserMsfv2 (props) {
    const {
      userDisplayName,
      text_before,
      text_after,
      text_paragraph,
      call_buttons,
      webPartId
    } = props

    console.log(call_buttons)

    return (
      <div className={`wellmsf_${webPartId}_wrapper`}>
          <div className={`wellmsf_${webPartId}_content`}>
          <h2 className={`wellmsf_${webPartId}_message`}>
            <span>{text_before}</span>
            <span>{userDisplayName}</span>
            <span>{text_after}</span>
          </h2>
          <p className={`wellmsf_${webPartId}_paragraph`}>
            {text_paragraph}
          </p>
          <div className={`wellmsf_${webPartId}_button_box`}>
            {call_buttons?.length < 1 ? null :
            call_buttons?.map((call,idx)=>
              <a 
              className={styles.link_reset}
              href={call.call_url} 
              key={idx}
              target={call.call_target ? "_blank":"_self"} 
              rel = {call.call_target ? "noreferrer" : ""} 
              >
               <div className={`wellmsf_${webPartId}_button`}>
                {call.call_icon_toggle ? 
                  <Icon 
                      iconName={call.call_icon}
                      className={`wellmsf_${webPartId}_button_icon`}
                  /> 
                  : null
                  }
                  {call.call_icon_custom_toggle ?
                  <img 
                      src={call.call_icon_custom}
                      className={`wellmsf_${webPartId}_button_icon_custom`}
                  />
                  : null
                  }
                  <span 
                    className={`wellmsf_${webPartId}_button_text`}>
                    {call.call_label}
                  </span>
                </div>    
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

