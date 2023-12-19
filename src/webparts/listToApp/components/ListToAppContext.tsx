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

    const columns_roles = {
        title : colroles?.filter(col => col.role === "title")[0]?.column,
        category : colroles?.filter(col => col.role === "category")[0]?.column,
        subcategory : colroles?.filter(col => col.role === "subcategory")[0]?.column,
        status : colroles?.filter(col => col.role === "status")[0]?.column,
        content : colroles?.filter(col => col.role === "content")[0]?.column,
        label1 : colroles?.filter(col => col.role === "label1")[0]?.column,
        label2 : colroles?.filter(col => col.role === "label2")[0]?.column,
    }

    return (
        <AppContext.Provider value={{settings: props, cr: columns_roles, sp: sp, graph: graph}}>
           <ListToApp/>
        </AppContext.Provider> 
    )
}