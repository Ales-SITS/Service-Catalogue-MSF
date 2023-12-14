import * as React from 'react';
import styles from './ButtonMsfv2.module.scss';
import Btn from './Btn'
import { useState} from 'react';

export default function ButtonMsfv2 (props) {
  
    const {
      buttons_header,
      buttons_collection,
      search_collection,
      webPartId
    } = props;

    const[searchTerm,setSearchTerm] = useState("")
    const setSearchTermHandler = (event):void => {
     setSearchTerm(event.target.value)
    }

    return (
      <div className={`btnmsf_${webPartId}_block`}>
          <div className={`btnmsf_${webPartId}_header`}>{buttons_header}</div>
          {search_collection[0].search_toggle ? 
            <div className={`btnmsf_${webPartId}_input_ wrapper`}>
              <input className={`btnmsf_${webPartId}_input`}
                  type="text"
                  onChange={setSearchTermHandler}
                  value={searchTerm}
                  placeholder={search_collection[0].placeholder}
                />
            </div> : null}
          <div className={`btnmsf_${webPartId}_buttons`}>
            {buttons_collection?.map((btn,idx)=>
              <Btn btn={btn} key={idx} webPartId={webPartId} search_collection={search_collection[0]} searchTerm={searchTerm}/>
            )}
          </div>
      </div>
    );
  }

