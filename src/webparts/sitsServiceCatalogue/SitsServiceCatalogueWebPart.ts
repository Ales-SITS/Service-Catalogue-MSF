import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { PropertyFieldListPicker, PropertyFieldListPickerOrderBy } from '@pnp/spfx-property-controls/lib/PropertyFieldListPicker';
import { PropertyFieldCollectionData, CustomCollectionFieldType } from '@pnp/spfx-property-controls/lib/PropertyFieldCollectionData';

import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IColumnReturnProperty, PropertyFieldColumnPicker, PropertyFieldColumnPickerOrderBy } from '@pnp/spfx-property-controls/lib/PropertyFieldColumnPicker';
import SitsServiceCatalogue from './components/SitsServiceCatalogue';
import { ISitsServiceCatalogueProps } from './components/ISitsServiceCatalogueProps';


//API
import { spfi, SPFx as SPFxsp} from "@pnp/sp";
import { Web } from "@pnp/sp/webs"; 
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";


export interface ISitsServiceCatalogueWebPartProps {
    header: string;
    siteurl: string;
    list: string;
    colroles: any[];
    multiColumn: string[];
    catIcons: any [];
    categories: any[]
}

export default class SitsServiceCatalogueWebPart extends BaseClientSideWebPart<ISitsServiceCatalogueWebPartProps> {

  private categories: any[] = []

  public render(): void {
    const element: React.ReactElement<ISitsServiceCatalogueProps> = React.createElement(
      SitsServiceCatalogue,
      {
        header: this.properties.header,
        siteurl: this.properties.siteurl,
        list: this.properties.list,
        columns: this.properties.multiColumn,
        colroles: this.properties.colroles,
        catIcons: this.properties.catIcons,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }


  public onInit(): Promise<void> {
    return this.getCategories()
  }

  //CUSTOM functions

  public async getCategories():Promise<void> {
    const category = this.properties.colroles?.filter(col => col.role === "category")[0]?.column
    const sp = spfi().using(SPFxsp(this.context))
    const listSite = Web([sp.web, `${this.properties.siteurl}`])  
    const cat = await listSite.lists.getById(`${this.properties.list}`).fields.getByInternalNameOrTitle(`${category}`)();
    this.categories = cat.Choices
  }

  public categoriesHandler(): void {
    console.log("TEST")
      this.getCategories().catch(error => {
        console.error('Error fetching categories:', error);
      });
  }

  // PROPERTY Pane

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: "Settings"
          },
          groups: [
            {
              groupName: "General settings",
              groupFields: [
                PropertyPaneTextField('header', {
                  label: "1. App header"
                }),
                PropertyPaneTextField('siteurl', {
                  label: "2. List site url"
                }),
                PropertyFieldListPicker('list', {
                  label: '3. Select a list',
                  selectedList: this.properties.list,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  baseTemplate: 100,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  context: this.context,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: 'listPickerFieldId',
                  webAbsoluteUrl: this.properties.siteurl,
                  disabled: this.properties.siteurl !== "" ? false : true 
                }),
                PropertyFieldColumnPicker('multiColumn', {
                  label: '4. Select columns',
                  context: this.context,
                  selectedColumn: this.properties.multiColumn,
                  listId: this.properties.list,
                  disabled: this.properties.list !== "" ? false : true,
                  orderBy: PropertyFieldColumnPickerOrderBy.Title,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: 'multiColumnPickerFieldId',
                  displayHiddenColumns: false,
                  columnReturnProperty: IColumnReturnProperty['Internal Name'],
                  multiSelect: true,
                  webAbsoluteUrl: this.properties.siteurl,
              }),
                PropertyFieldCollectionData("colroles", {
                  key: "colroles",
                  label: "5. Set columns roles",
                  panelHeader: "Columns roles",
                  manageBtnLabel: "Columns roles",
                  value: this.properties.colroles,
                  panelProps: {
                    customWidth: "300px",
                    onDismissed: () => this.categoriesHandler()
                  },
                  fields: [
                    {
                      id: "column",
                      title: "Column",
                      type: CustomCollectionFieldType.dropdown,
                      options: this.properties.multiColumn?.map(item => {
                        return { key: item, text: item };
                      }),
                      required: true
                    },
                    {
                      id: "role",
                      title: "Role",
                      type: CustomCollectionFieldType.dropdown,
                      options: [
                        {
                          key: "title",
                          text: "Title"
                        },
                        {
                          key: "category",
                          text: "Category"
                        },
                        {
                          key: "subcategory",
                          text: "Subcategory"
                        },
                        {
                          key: "content",
                          text: "Content"
                        },
                        {
                          key: "status",
                          text: "Status"
                        },
                        {
                          key: "label1",
                          text: "Label 1"
                        },
                        {
                          key: "label2",
                          text: "Label 2"
                        },
                        {
                          key: "owner",
                          text: "Owner"
                        }
                      ],
                      required: true
                    }
                  ],
                  disabled: this.properties.multiColumn.length < 1
                })
              ]
            },
            {
              groupName: "Roles visuals",
              groupFields: [
                PropertyFieldCollectionData("catIcons", {
                  key: "catIcons",
                  label: "1. Set icons for categories",
                  panelHeader: "Categories icons",
                  manageBtnLabel: "Categories icons",
                  value: this.properties.catIcons,
                    fields: [
                      {
                        id: 'category',
                        title: 'Category',
                        type: CustomCollectionFieldType.dropdown,
                        options: this.categories?.map(item => {
                          return { key: item, text: item };
                        }),
                      },
                      {
                        id: "cat_icon",
                        title: "Icon",
                        iconFieldRenderMode: "picker",
                        type: CustomCollectionFieldType.fabricIcon,
                      }                
                  ],
                  disabled: this.properties.colroles.filter(col => col.role === "category").length < 1 || this.categories.length === 0
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
