import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';

//Property panes
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider,
  PropertyPaneChoiceGroup
} from '@microsoft/sp-property-pane';
import { PropertyFieldListPicker, PropertyFieldListPickerOrderBy } from '@pnp/spfx-property-controls/lib/PropertyFieldListPicker';
import { PropertyFieldCollectionData, CustomCollectionFieldType } from '@pnp/spfx-property-controls/lib/PropertyFieldCollectionData';
import { CalloutTriggers } from '@pnp/spfx-property-controls/lib/Callout';
import { PropertyFieldMonacoEditor } from '@pnp/spfx-property-controls/lib/PropertyFieldMonacoEditor';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IColumnReturnProperty, PropertyFieldColumnPicker, PropertyFieldColumnPickerOrderBy } from '@pnp/spfx-property-controls/lib/PropertyFieldColumnPicker';
import { PropertyPaneWebPartInformation } from '@pnp/spfx-property-controls/lib/PropertyPaneWebPartInformation';
import { PropertyFieldToggleWithCallout } from '@pnp/spfx-property-controls/lib/PropertyFieldToggleWithCallout';
import { PropertyFieldLabelWithCallout } from '@pnp/spfx-property-controls/lib/PropertyFieldLabelWithCallout';

//API
import { spfi, SPFx as SPFxsp} from "@pnp/sp";
import { Web } from "@pnp/sp/webs"; 
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";

//Components
import ListToApp from './components/ListToApp';
import ListToAppContext from './components/ListToAppContext';

export interface IListToAppWebPartProps {
    toggleInfoHeaderValue: boolean;

    header: string;
    siteurl: string;
    list: string;
    colroles: any[];
    multiColumn: string[];
    categories: any[];
    defaultgroupby: string;

    cardsPerRow: number;
    cardType: boolean;

    searchToggle: boolean;
    catFilterToggle: boolean;
    subcatFilterToggle: boolean;
    sortingToggle: boolean;
    groupingToggle: boolean;
    generalCSS: string;

    catIcons: any [];
    catCSS: string;
    subcatIcons: any [];
    subcatCSS: string;
    statusIcons: any [];
    statusCSS: string;

    cardCSS:string;


}


export default class ListToAppWebPart extends BaseClientSideWebPart<IListToAppWebPartProps> {

  private categories: any[] = ["default"]
  private subcategories: any[] = ["default"]
  private statuses: any[] = ["default"]

  public render(): void {
    const existingStyleElement = document.head.querySelector('style[data-webpart-styles]');
    if (existingStyleElement) {
      existingStyleElement.remove();
    }
    const webPartId = this.context.instanceId.replaceAll("-","")
    const dynamicStyles = document.createElement('style');
    const concatCSS = this.properties.generalCSS + " " + this.properties.catCSS + " " + this.properties.subcatCSS + " " + this.properties.statusCSS + " " + this.properties.cardCSS
    const dynamicStylesContent = concatCSS?.replaceAll(".lta__",`.lta_${webPartId}_`);
        
    dynamicStyles.textContent = dynamicStylesContent;

    const element: React.ReactElement<IListToAppWebPartProps> = React.createElement(
      ListToAppContext,
      {
        header: this.properties.header,
        siteurl: this.properties.siteurl,
        list: this.properties.list,
        columns: this.properties.multiColumn,
        colroles: this.properties.colroles,
        defaultgroupby: this.properties.defaultgroupby,

        searchToggle: this.properties.searchToggle,
        catFilterToggle: this.properties.catFilterToggle,
        subcatFilterToggle: this.properties.subcatFilterToggle,
        sortingToggle: this.properties.sortingToggle,
        groupingToggle: this.properties.groupingToggle,

        cardsPerRow: this.properties.cardsPerRow,
        cardType: this.properties.cardType,
        catIcons: this.properties.catIcons,
        subcatIcons: this.properties.subcatIcons,
        statusIcons: this.properties.statusIcons,

        webpartID : this.context.instanceId.replaceAll("-",""),

        context: this.context
      }
    );

    document.head.appendChild(dynamicStyles);

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }


  public onInit(): Promise<void> {
    this.choicesHandler()
    return Promise.resolve()
  }

  //CUSTOM functions

  public async getCategories():Promise<void> {
    const category = this.properties.colroles?.filter(col => col.role === "category")[0]?.column
    const sp = spfi().using(SPFxsp(this.context))
    const listSite = Web([sp.web, `${this.properties.siteurl}`]) 
    try {
      const cat = await listSite.lists.getById(`${this.properties.list}`).fields.getByInternalNameOrTitle(`${category}`)()
      this.categories = ["default", ...cat.Choices]
    } catch (error) {
      
    } 
    
  }

  public async getSubcategories():Promise<void> {
    const subcategory = this.properties.colroles?.filter(col => col.role === "subcategory")[0]?.column
    const sp = spfi().using(SPFxsp(this.context))
    const listSite = Web([sp.web, `${this.properties.siteurl}`]) 
    try {
      const subcat = await listSite.lists.getById(`${this.properties.list}`).fields.getByInternalNameOrTitle(`${subcategory}`)()
      this.subcategories = ["default", ...subcat.Choices]
    } catch (error) {
      
    } 
    
  }

  public async getStatuses():Promise<void> {
    const status = this.properties.colroles?.filter(col => col.role === "status")[0]?.column
    const sp = spfi().using(SPFxsp(this.context))
    const listSite = Web([sp.web, `${this.properties.siteurl}`]) 
    try {
      const stat = await listSite.lists.getById(`${this.properties.list}`).fields.getByInternalNameOrTitle(`${status}`)()
      this.statuses = ["default", ...stat.Choices]
    } catch (error) {
      
    } 
    
  }

  public choicesHandler(): void {
      this.getCategories().catch(error => {
        console.error('Error fetching categories:', error);
      });
      this.getSubcategories().catch(error => {
        console.error('Error fetching categories:', error);
      });
      this.getStatuses().catch(error => {
        console.error('Error fetching categories:', error);
      });

  }

  // PROPERTY Pane

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          groups: [
            {
              groupName: "",
              groupFields: [
                PropertyPaneWebPartInformation({
                  description: `This is webart helps you to create dynamic and modern layouts based on data stored in a SharePoint list. It is fully customizable by CSS</br></br>
                                Property pane pages:
                                <ul>
                                  <li>Page 1 - <strong>General settings</strong></li>
                                  <li>Page 2 - <strong>Roles settings</strong></li>
                                  <li>Page 3 - <strong>Card settings</strong></li>
                                </ul>`,
                  moreInfoLink: `https://msfintl.sharepoint.com/sites/SITSExternalPortal`,
                  videoProperties: {
                    embedLink: `https://www.youtube.com/embed/d_9o3tQ90zo`,
                    properties: { allowFullScreen: true}
                  },
                  key: 'webPartInfoId'
                })
              ]
            },
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
                    onDismissed: () => this.choicesHandler()
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
                          text: "Category (choice column)"
                        },
                        {
                          key: "subcategory",
                          text: "Subcategory (choice column)"
                        },
                        {
                          key: "content",
                          text: "Content"
                        },
                        {
                          key: "status",
                          text: "Status (choice column)"
                        },
                        {
                          key: "label1",
                          text: "Label 1 (choice column)"
                        },
                        {
                          key: "label2",
                          text: "Label 2 (choice column)"
                        },
                        {
                          key: "owner",
                          text: "Owner (person column)"
                        },
                        {
                          key: "link",
                          text: "link (url)"
                        }
                      ],
                      required: true
                    }
                  ],
                  disabled: this.properties.multiColumn.length < 1
                }),
                PropertyPaneChoiceGroup("defaultgroupby", {
                  label: '6. Set default grouping',
                  options: [
                    {key: "None", text: "None", checked: true},
                    {key: "Category", text: "Category"},
                    {key: "Subcategory", text: "Subcategory"},
                   /* {key: "Status", text: "Status"},
                    {key: "Owner", text: "Owner"}*/
                  ]
                })
              ]
            },

          ]
        },
        {
          displayGroupsAsAccordion:true,
          groups: [
            {
              groupName: "1. General visuals",
              isCollapsed: false,
              groupFields: [
                PropertyFieldToggleWithCallout('searchToggle', {
                  calloutTrigger: CalloutTriggers.Hover,
                  calloutWidth: 300,
                  key: 'searchToggleFieldId',
                  label: 'Display search field',
                  calloutContent: React.createElement('p', {}, 'Search field automatically filteres results based on the information included in columns with Content, Category, Subcategory and Label1 role.'),
                  onText: 'On',
                  offText: 'Off',
                  checked: this.properties.searchToggle
                }),
                PropertyFieldToggleWithCallout('catFilterToggle', {
                  calloutTrigger: CalloutTriggers.Hover,
                  calloutWidth: 300,
                  key: 'catFilterToggleFieldId',
                  label: 'Display categories filters',
                  calloutContent: React.createElement('p', {}, 'Category filters automatically filteres results based on the information included in column assigned to Category role.'),
                  onText: 'On',
                  offText: 'Off',
                  checked: this.properties.catFilterToggle
                }),
                PropertyFieldToggleWithCallout('subcatFilterToggle', {
                  calloutTrigger: CalloutTriggers.Hover,
                  calloutWidth: 300,
                  key: 'subcatFilterToggleFieldId',
                  label: 'Display subcategories filters',
                  calloutContent: React.createElement('p', {}, 'Subcategory filters automatically filteres results based on the information included in column assigned to Category role.'),
                  onText: 'On',
                  offText: 'Off',
                  checked: this.properties.subcatFilterToggle
                }),
                PropertyFieldToggleWithCallout('sortingToggle', {
                  calloutTrigger: CalloutTriggers.Hover,
                  calloutWidth: 300,
                  key: 'sortingToggleId',
                  label: 'Display sorting options',
                  calloutContent: React.createElement('p', {}, 'Your users will be able to change sorting by Title, Category, Subcategory and Status roles. Ascending and descending options are included.'),
                  onText: 'On',
                  offText: 'Off',
                  checked: this.properties.sortingToggle
                }),
                PropertyFieldToggleWithCallout('groupingToggle', {
                  calloutTrigger: CalloutTriggers.Hover,
                  calloutWidth: 300,
                  key: 'groupingToggleId',
                  label: 'Display sorting options',
                  calloutContent: React.createElement('p', {}, 'Your users will be able to change grouping to group by Category, Subcategory roles or turn off.'),
                  onText: 'On',
                  offText: 'Off',
                  checked: this.properties.groupingToggle
                }),
                //sortingToggle: boolean;
                //groupingToggle: boolean;
                PropertyFieldLabelWithCallout('generalCSSlabel', {
                  calloutTrigger: CalloutTriggers.Hover,
                  key: 'LabelWithCalloutFieldId',
                  calloutContent: React.createElement('p', {}, "This application has preset CSS classes which you can use to customize its visuals. You can set earch part or role in its dedicated CSS editor, but you can also paste your solution to this general CSS editor. Each webpart has unique ID, so CSS in this solution won't affect other List To App webpart."),
                  calloutWidth: 300,
                  text: 'Set general visuals with CSS'
                }),
                PropertyFieldMonacoEditor('generalCSS', {
                  key: 'generalCSS',
                  value: this.properties.generalCSS,
                  onChange: (code: string) => { this.properties.generalCSS = code; },
                  showMiniMap: true,
                  language:"css",
                  showLineNumbers:true,
                  theme: 'vs-dark'
                })
              ]
            },
            {
              groupName: "2. Roles Visuals",
              groupFields: [
                PropertyFieldCollectionData("catIcons", {
                  key: "catIcons",
                  label: "Set visuals for categories",
                  panelHeader: "Categories icons",
                  manageBtnLabel: "Categories icons",
                  value: this.properties.catIcons,
                    fields: [
                      {
                        id: 'category',
                        title: 'Select category',
                        type: CustomCollectionFieldType.dropdown,
                        options: this.categories?.map(item => {
                          return { key: item, text: item };
                        }),
                      },
                      {
                        id: "cat_icon",
                        title: "Select icon",
                        iconFieldRenderMode: "picker",
                        type: CustomCollectionFieldType.fabricIcon,
                      },
                      {
                        id: "cat_icon_color",
                        title: "Select icon color",
                        type: CustomCollectionFieldType.color,
                      },
                      {
                        id: "cat_icon_bg",
                        title: "Select icon background",
                        type: CustomCollectionFieldType.color,
                      }                  
                  ],
                  disabled: this.properties.colroles?.filter(col => col.role === "category").length < 1 || this.categories.length === 0
                }),
                PropertyFieldMonacoEditor('catCSS', {
                  key: 'catCSS',
                  value: this.properties.catCSS,
                  onChange: (code: string) => { this.properties.catCSS = code; },
                  language:"css",
                  showLineNumbers:true,
                  theme: 'vs-dark'
                }),
                PropertyFieldCollectionData("subcatIcons", {
                  key: "subcatIcons",
                  label: "Set visuals for subcategories",
                  panelHeader: "Subcategories icons",
                  manageBtnLabel: "Subcategories icons",
                  value: this.properties.subcatIcons,
                    fields: [
                      {
                        id: 'subcategory',
                        title: 'Select subcategory',
                        type: CustomCollectionFieldType.dropdown,
                        options: this.subcategories?.map(item => {
                          return { key: item, text: item };
                        }),
                      },
                      {
                        id: "subcat_icon",
                        title: "Select icon",
                        iconFieldRenderMode: "picker",
                        type: CustomCollectionFieldType.fabricIcon,
                      },
                      {
                        id: "subcat_icon_color",
                        title: "Select icon color",
                        type: CustomCollectionFieldType.color,
                      },
                      {
                        id: "subcat_icon_bg",
                        title: "Select icon background",
                        type: CustomCollectionFieldType.color,
                      }                     
                  ],
                  disabled: this.properties.colroles?.filter(col => col.role === "subcategory").length < 1 || this.subcategories.length === 0
                }),
                PropertyFieldMonacoEditor('subcatCSS', {
                  key: 'subcatCSS',
                  value: this.properties.subcatCSS,
                  onChange: (code: string) => { this.properties.subcatCSS = code; },
                  showMiniMap: true,
                  language:"css",
                  showLineNumbers:true,
                  theme: 'vs-dark'
                }),
                PropertyFieldCollectionData("statusIcons", {
                  key: "statusIcons",
                  label: "Set visuals for categories",
                  panelHeader: "Status icons",
                  manageBtnLabel: "Status icons",
                  value: this.properties.statusIcons,
                    fields: [
                      {
                        id: 'status',
                        title: 'Select status',
                        type: CustomCollectionFieldType.dropdown,
                        options: this.statuses?.map(item => {
                          return { key: item, text: item };
                        }),
                      },
                      {
                        id: "status_icon",
                        title: "Select icon",
                        iconFieldRenderMode: "picker",
                        type: CustomCollectionFieldType.fabricIcon,
                      },
                      {
                        id: "status_icon_color",
                        title: "Select icon color",
                        type: CustomCollectionFieldType.color,
                      },
                      {
                        id: "status_icon_bg",
                        title: "Select icon background",
                        type: CustomCollectionFieldType.color,
                      }                  
                  ],
                  disabled: this.properties.colroles?.filter(col => col.role === "status").length < 1 || this.statuses.length === 0
                }),
                PropertyFieldMonacoEditor('statusCSS', {
                  key: 'statusCSS',
                  value: this.properties.statusCSS,
                  onChange: (code: string) => { this.properties.statusCSS = code; },
                  language:"css",
                  showLineNumbers:true,
                  theme: 'vs-dark'
                }),
              ]
            }
          ]
        },
        {
          groups: [
            {
              groupName: "Card settings",
              groupFields: [
                PropertyFieldToggleWithCallout('cardType', {
                  calloutTrigger: CalloutTriggers.Hover,
                  calloutWidth: 200,
                  key: 'toggleInfoHeaderFieldId',
                  label: '1. Set the card type',
                  calloutContent: React.createElement('p', {}, 'With this control you can set if the content displays as a modal window with the flow of the app (Main window).'),
                  onText: 'Modal window',
                  offText: 'Main window',
                  checked: this.properties.cardType
                }),
                PropertyPaneSlider('cardsPerRow',{  
                  label: '2. Set number of cards per row',  
                  min:1,  
                  max:5,  
                  value:1,  
                  showValue:true,  
                  step:1                
                }),
                PropertyFieldMonacoEditor('cardCSS', {
                  key: 'cardCSS',
                  value: this.properties.cardCSS,
                  onChange: (code: string) => { this.properties.cardCSS = code; },
                  showMiniMap: true,
                  language:"css",
                  showLineNumbers:true,
                  theme: 'vs-dark'
                })

              ]
            }
          ]
        }
      ]
    };
  }
}
