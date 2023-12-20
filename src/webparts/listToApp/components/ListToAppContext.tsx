import * as React from 'react';
import { createContext, useState } from "react";

import ListToApp from "./ListToApp"
import { spfi, SPFx as SPFxsp} from "@pnp/sp";
import { SPFx as SPFxGraph, graphfi } from "@pnp/graph";



export const AppContext = createContext<any>(null);

export default function ListToAppContext (props) {
   
    const {colroles, context } = props

    const sp = spfi().using(SPFxsp(context))
    const graph = graphfi().using(SPFxGraph(context))

    const roles = {
        title : colroles?.filter(col => col.role === "Title")[0],
        category : colroles?.filter(col => col.role === "Category")[0],
        subcategory : colroles?.filter(col => col.role === "Subcategory")[0],
        status : colroles?.filter(col => col.role === "Status")[0],
        content : colroles?.filter(col => col.role === "Content")[0],
        Group1 : colroles?.filter(col => col.role === "Group1")[0],
        Group2 : colroles?.filter(col => col.role === "Group2")[0],
        link: colroles?.filter(col => col.role === "Link")[0],
        none : {uniqueId: '0', column: '', role: 'none', name: "None", sortIdx: 1}
    }

    const columns_roles = {
        title : roles.title?.column.replaceAll(" ",""),
        category : roles.category?.column.replaceAll(" ",""),
        subcategory : roles.subcategory?.column.replaceAll(" ",""),
        status : roles.status?.column.replaceAll(" ",""),
        content : roles.content?.column.replaceAll(" ",""),
        Group1 : roles.Group1?.column.replaceAll(" ",""),
        Group2 : roles.Group2?.column.replaceAll(" ",""),
        link: roles.link?.column.replaceAll(" ","")
    }

    return (
        <AppContext.Provider value={{settings: props, cr: columns_roles, roles: roles, sp: sp, graph: graph}}>
           <ListToApp/>
        </AppContext.Provider> 
    )
}