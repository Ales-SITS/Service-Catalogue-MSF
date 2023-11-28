import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import styles from './SitsServiceCatalogue.module.scss';


//Components
import SitsServiceContent from './SitsServiceContent'

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
    const [dynServiceFilter, setDynServiceFilter] = useState("")

    const dynProductFilterHandler = (val):void => {
      if (val === "") {
        setSelectedProduct("")
      } else {
        setSelectedProduct("")
        setSelectedService("")
      }
      setDynServiceFilter(val)
    }

    return (
    <div>
        <input
          type="text" 
          name="service" 
          placeholder="Search by product"
          onChange={e => dynProductFilterHandler (e.target.value)}      
        />
        {productsList.map((product)=> 
          <span>{product}</span>  
        )}
    </div>

    );
  }


  //PURIFY DOUBLECHECK

  //STATUS: Active/Archive/Upcoming