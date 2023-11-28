import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import styles from './SitsServiceCatalogue.module.scss';

//3rd party Modules
import { useDraggable } from "react-use-draggable-scroll";

//Components
import SitsServiceContent from './SitsServiceContent'

export default function SitsServiceCatalogueByServices (props:any) {
    const {
      internal,
      servicesList,
      categoriesList
    } = props;

    console.log(categoriesList[0])

    const categoriesDrag = useRef();
    const { events } = useDraggable(categoriesDrag);

    const [selectedCategory, setSelectedcategory] = useState(categoriesList[0])
    const [selectedService,setSelectedService] = useState("")

    const [dynServiceFilter, setDynServiceFilter] = useState("")
    const dynServiceFilterHandler = (val):void => {
      if (val === "") {
        setSelectedcategory(categoriesList[0])
      } else {
        setSelectedcategory("")
        setSelectedService("")
      }
      setDynServiceFilter(val)
    }

    useEffect(()=>{
      setSelectedcategory(categoriesList[0])
    },[categoriesList])

    //Filter list of services based on user domain => sits.msf.org => display all, other => display all excepted "Archived"
    const servicesChecked = internal === true ? servicesList : servicesList?.filter(service => service.Status!=="Archived")

    //Filter serviceChecked basted on input
    const displayedServices = dynServiceFilter !== "" ? servicesChecked?.filter(service => service.Title.includes(dynServiceFilter)) : servicesList?.filter(service => service.ServicesCategory === selectedCategory)
    
    //Filter services based on selection
    const displayedService = servicesChecked?.filter(service => service.Title === selectedService)[0]

    return (
    <div>
        <input
          type="text" 
          name="service" 
          placeholder="Search for service"
          onChange={e => dynServiceFilterHandler (e.target.value)}      
        />
        <div 
          className={styles.categories_tabs} 
          {...events}
          ref={categoriesDrag}     
        >
            {categoriesList.map((category,idx) => (
              <button
                className={selectedCategory === category ? `${styles.category_button} ${styles.category_button_selected}` : `${styles.category_button}`}
                key={`${category}_${idx}`} 
                onClick={()=>{setSelectedcategory(category)}}
              >
                {category}
              </button>
            ))}
        </div>
        <div className={styles.services_box}>
            <ul className={styles.services_list}>
              {displayedServices.map((service,idx) => (
                <li            
                  key={`${service}_${idx}`}
                >
                  <button 
                    className = {selectedService === service.Title ? `${styles.service_button} ${styles.service_button_selected}` : `${styles.service_button}`}
                    onClick={()=>{setSelectedService(service.Title)}}
                  >
                    {service.Title}
                    </button>
                </li>
              ))
              }
            </ul>
              {displayedService && <SitsServiceContent service = {displayedService}/>}
        </div>
    </div>

    );
  }


  //PURIFY DOUBLECHECK

  //STATUS: Active/Archive/Upcoming