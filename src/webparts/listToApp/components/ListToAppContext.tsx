import * as React from 'react';
import { createContext, useEffect, useState} from "react";

import ListToApp from "./ListToApp"
import { spfi, SPFx as SPFxsp} from "@pnp/sp";
import { SPFx as SPFxGraph, graphfi } from "@pnp/graph";



export const AppContext = createContext<any>(null);

export default function ListToAppContext (props) {
   
    const {colroles, context } = props
    const [internalDomain, setInternalDomain] = useState(false)

    const sp = spfi().using(SPFxsp(context))
    const graph = graphfi().using(SPFxGraph(context))

    useEffect(()=>{
        console.log("triggered")
        getCurrentUser()
      },[])
    
      const getCurrentUser = async() => {
        console.log("triggered 2")
        const current_user = await graph.me();
        console.log(current_user.userPrincipalName.split("@")[1])
      }


    const roles = {
        title : colroles?.filter(col => col.role === "Title")[0],
        category : colroles?.filter(col => col.role === "Category")[0],
        subcategory : colroles?.filter(col => col.role === "Subcategory")[0],
        status : colroles?.filter(col => col.role === "Status")[0],
        contentA : colroles?.filter(col => col.role === "ContentA")[0],
        contentB : colroles?.filter(col => col.role === "ContentB")[0],
        group1 : colroles?.filter(col => col.role === "Group1")[0],
        group2 : colroles?.filter(col => col.role === "Group2")[0],
        group3 : colroles?.filter(col => col.role === "Group3")[0],
        link: colroles?.filter(col => col.role === "Link")[0],
        owner: colroles?.filter(col => col.role === "Owner")[0],
        none : {uniqueId: '0', column: '', role: 'None', name: "None", sortIdx: 1}
    }

    const columns_roles = {
        title : roles.title?.column.replaceAll(" ",""),
        category : roles.category?.column.replaceAll(" ",""),
        subcategory : roles.subcategory?.column.replaceAll(" ",""),
        status : roles.status?.column.replaceAll(" ",""),
        contentA : roles.contentA?.column.replaceAll(" ",""),
        contentB : roles.contentB?.column.replaceAll(" ",""),
        Group1 : roles.group1?.column.replaceAll(" ",""),
        Group2 : roles.group2?.column.replaceAll(" ",""),
        Group3 : roles.group3?.column.replaceAll(" ",""),
        link: roles.link?.column.replaceAll(" ",""),
        owner: roles.owner?.column.replaceAll(" ","")
    }

    return (
        <AppContext.Provider value={{settings: props, cr: columns_roles, roles: roles, sp: sp, graph: graph}}>
           <ListToApp/>
        </AppContext.Provider> 
    )
}