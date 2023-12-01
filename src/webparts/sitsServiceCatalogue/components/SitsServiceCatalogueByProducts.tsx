import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import styles from './SitsServiceCatalogue.module.scss';


//Components
import ProductContent from './ProductContent'


export default function SitsServiceCatalogueByProduct (props:any) {
    const {
      internal,
      servicesList,
      categoriesList,
      productsList
    } = props;

    const [selectedProduct, setSelectedProduct] = useState("")
    const [serviceCategories,setServiceCategories] = useState<string[]>([])
    const [selectedService,setSelectedService] = useState("")
    const [dynProductFilter, setDynProductFilter] = useState("")

    const dynProductFilterHandler = (val):void => {
      if (val === "") {
        setSelectedProduct("")
      } else {
        setSelectedProduct("")
        setSelectedService("")
      }
      setDynProductFilter(val)
    }

    const displayedServices = servicesList?.filter(service => service.Assetsincludedintheservicedelive?.includes(selectedProduct))

    //const displayedService = servicesChecked?.filter(service => service.Title === selectedService)[0]

    const displayedProducts = dynProductFilter === "" ? productsList : productsList.filter(product => product.includes(dynProductFilter))

    return (
    <div>
        <input
          className={styles.service_catalogue_input} 
          type="text" 
          name="service" 
          placeholder="Search by product"
          onChange={e => dynProductFilterHandler(e.target.value)}      
        />
        <div className={styles.services_box}>
          <ul className={styles.services_list}>
          {displayedProducts.map((product)=> 
            <li>
              <button
               className={selectedProduct === product ? `${styles.service_button} ${styles.service_button_selected}` : `${styles.service_button}`}
               onClick={()=>{setSelectedProduct(product)}}>
                {product}
              </button>
            </li>  
          )}
          </ul>
          <div className={styles.product_services_box}>
            <h2>{selectedProduct}</h2>
            {displayedServices.map((service, idx) => 
              <ProductContent key={`${idx}_${service}`} service={service}/>
            )}
          </div>
        </div>


    </div>

    );
  }


  //PURIFY DOUBLECHECK

  //STATUS: Active/Archive/Upcoming

  // 