import * as React from 'react';
import { createContext, useEffect, useState} from "react";

import ListToApp from "./ListToApp"
import { spfi, SPFx as SPFxsp} from "@pnp/sp";
import { SPFx as SPFxGraph, graphfi } from "@pnp/graph";



export const AppContext = createContext<any>(null);

export default function ListToAppContext (props) {
   
    const {
        colroles,
        context,
    } = props

    const [currentUserDomain, setCurrentUserDomain] = useState("")

    const sp = spfi().using(SPFxsp(context))
    const graph = graphfi().using(SPFxGraph(context))

    useEffect(()=>{
        getCurrentUser()
      },[])
    
      const getCurrentUser = async() => {
        const current_user = await graph.me();
        const domain = current_user.userPrincipalName.toLowerCase()
        setCurrentUserDomain(domain)
      }

    const roles = {
        title : colroles?.filter(col => col.role === "Title")[0],
        category : colroles?.filter(col => col.role === "Category")[0],
        subcategory : colroles?.filter(col => col.role === "Subcategory")[0],
        status : colroles?.filter(col => col.role === "Status")[0],
        contentA : colroles?.filter(col => col.role === "ContentA")[0],
        contentB : colroles?.filter(col => col.role === "ContentB")[0],
        GroupA : colroles?.filter(col => col.role === "GroupA")[0],
        GroupB : colroles?.filter(col => col.role === "GroupB")[0],
        GroupC : colroles?.filter(col => col.role === "GroupC")[0],
        link: colroles?.filter(col => col.role === "Link")[0],
        PersonA: colroles?.filter(col => col.role === "PersonA")[0],
        none : {uniqueId: '0', column: '', role: 'None', name: "None", sortIdx: 1}
    }

    const columns_roles = {
        title : roles.title?.column.replaceAll(" ",""),
        category : roles.category?.column.replaceAll(" ",""),
        subcategory : roles.subcategory?.column.replaceAll(" ",""),
        status : roles.status?.column.replaceAll(" ",""),
        contentA : roles.contentA?.column.replaceAll(" ",""),
        contentB : roles.contentB?.column.replaceAll(" ",""),
        GroupA : roles.GroupA?.column.replaceAll(" ",""),
        GroupB : roles.GroupB?.column.replaceAll(" ",""),
        GroupC : roles.GroupC?.column.replaceAll(" ",""),
        link: roles.link?.column.replaceAll(" ",""),
        PersonA: roles.PersonA?.column.replaceAll(" ","")
    }

    return (
        <AppContext.Provider value={{settings: props, cr: columns_roles, roles: roles, sp: sp, graph: graph, currentUserDomain}}>
           <ListToApp/>
        </AppContext.Provider> 
    )
}