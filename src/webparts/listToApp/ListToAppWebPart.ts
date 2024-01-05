import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';

//Property panes
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider,
  PropertyPaneChoiceGroup,
  PropertyPaneToggle,
  PropertyPaneLabel
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
import ListToAppContext from './components/ListToAppContext';

export interface IListToAppWebPartProps {
    toggleInfoHeaderValue: boolean;

    header: string;
    siteurl: string;
    list: string;
    colroles: any[];
    multiColumn: string[];
    categories: any[];

    searchToggle: boolean;
    catFilterToggle: boolean;
    subcatFilterToggle: boolean;
    sortingToggle: boolean;
    groupingToggle: boolean;
    generalCSS: string;

    catIcons: any [];
    catfilterCSS: string;
    subcatIcons: any [];
    subcatfilterCSS: string;
    statusIcons: any [];
    statusCSS: string;
    groupbyControlCSS: string;    
    sortbyControlCSS: string;

    defaultGroupby: string;
    groupCategoryExpanded: boolean;
    groupSubcategoryExpanded: boolean;
    groupbyCSS: string;


    cardType: boolean;
    cardsPerRow: number;
    cardCategoryToggle: boolean;
    cardSubcategoryToggle: boolean;
    cardGroup1Toggle: boolean;
    cardGroup2Toggle: boolean;
    cardGroup3Toggle: boolean;
    cardLinkToggle: boolean;
    cardCSS:string;

    multiSelect:string[]

}


export default class ListToAppWebPart extends BaseClientSideWebPart<IListToAppWebPartProps> {

  private categories: string[] = ["default"]
  private subcategories: string[] = ["default"]
  private statuses: string[] = ["default"]
  private columns: any[] = []
  private filteredColumns: any[] = []

  public render(): void {
    const existingStyleElement = document.head.querySelector('style[data-webpart-styles]');
    if (existingStyleElement) {
      existingStyleElement.remove();
    }
    const webPartId = this.context.instanceId.replaceAll("-","")
    const dynamicStyles = document.createElement('style');
   
    const concatfilterCSS = this.properties.generalCSS + " " + this.properties.catfilterCSS + " " + this.properties.subcatfilterCSS + " " + this.properties.statusCSS + " " + this.properties.groupbyControlCSS + " " + this.properties.sortbyControlCSS + " " + this.properties.groupbyCSS + " " + this.properties.cardCSS
    const dynamicStylesContent = concatfilterCSS?.replaceAll(".lta__",`.lta_${webPartId}_`);
        
    dynamicStyles.textContent = dynamicStylesContent;
    
    const element: React.ReactElement<IListToAppWebPartProps> = React.createElement(
      ListToAppContext,
      {
        header: this.properties.header,
        siteurl: this.properties.siteurl,
        list: this.properties.list,
        colroles: this.properties.colroles,

        searchToggle: this.properties.searchToggle,
        catFilterToggle: this.properties.catFilterToggle,
        subcatFilterToggle: this.properties.subcatFilterToggle,
        sortingToggle: this.properties.sortingToggle,
        groupingToggle: this.properties.groupingToggle,


        catIcons: this.properties.catIcons,
        subcatIcons: this.properties.subcatIcons,
        statusIcons: this.properties.statusIcons,

        defaultGroupby: this.properties.defaultGroupby,
        groupCategoryExpanded: this.properties.groupCategoryExpanded,
        groupSubcategoryExpanded: this.properties.groupSubcategoryExpanded,

        cardsPerRow: this.properties.cardsPerRow,
        cardType: this.properties.cardType,
        cardCategoryToggle: this.properties.cardCategoryToggle,
        cardSubcategoryToggle: this.properties.cardSubcategoryToggle,
        cardGroup1Toggle: this.properties.cardGroup1Toggle,
        cardGroup2Toggle: this.properties.cardGroup2Toggle,
        cardGroup3Toggle: this.properties.cardGroup3Toggle,
        cardLinkToggle: this.properties.cardLinkToggle,

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
  public async getColumns():Promise<void> {
    const sp = spfi().using(SPFxsp(this.context))
    const listSite = Web([sp.web, `${this.properties.siteurl}`]) 
    try {
      const columns = await listSite.lists.getById(`${this.properties.list}`).fields()
      this.columns = columns
    } catch (error) {
      console.log('Error fetching columns:', error)
    } 
  }

  public async getCategories():Promise<void> {
    const category = this.properties.colroles?.filter(col => col.role === "Category")[0]?.column
    const sp = spfi().using(SPFxsp(this.context))
    const listSite = Web([sp.web, `${this.properties.siteurl}`]) 
    try {
      const cat = await listSite.lists.getById(`${this.properties.list}`).fields.getByInternalNameOrTitle(`${category}`)()
      this.categories = ["default", ...cat.Choices]
    } catch (error) {  
    }    
  }

  public async getSubcategories():Promise<void> {
    const subcategory = this.properties.colroles?.filter(col => col.role === "Subcategory")[0]?.column
    const sp = spfi().using(SPFxsp(this.context))
    const listSite = Web([sp.web, `${this.properties.siteurl}`]) 
    try {
      const subcat = await listSite.lists.getById(`${this.properties.list}`).fields.getByInternalNameOrTitle(`${subcategory}`)()
      this.subcategories = ["default", ...subcat.Choices]
    } catch (error) {   
    }  
  }

  public async getStatuses():Promise<void> {
    const status = this.properties.colroles?.filter(col => col.role === "Status")[0]?.column
    const sp = spfi().using(SPFxsp(this.context))
    const listSite = Web([sp.web, `${this.properties.siteurl}`]) 
    try {
      const stat = await listSite.lists.getById(`${this.properties.list}`).fields.getByInternalNameOrTitle(`${status}`)()
      this.statuses = ["default", ...stat.Choices]
    } catch (error) {     
    }   
  }

  /*
  Picks selected columns from the full list based on column id.
  For the next functions and usage, Internal name is needed, PropertyFieldColumnPicker ('multicolumn') can return either Name, id, or Internal name.
  Logical is to use Internal name, but it is often different than the name and it makes the next step in PropertyFieldCollectionData confusing for users,
  because they might see seemingly different choices than they have selected.
  With this middle step, the application picks columns by ID which is the safest and the PropertyFieldCollectionData can then handle the full column object.
  */
  public filterColumns(){
      const filtered = this.columns.filter(column => this.properties.multiColumn.includes(column.Id))
      this.filteredColumns = filtered
  }

  public choicesHandler(): void {
      this.getColumns().catch(error => {
        console.error('Error fetching columns:', error);
      })
      this.getCategories().catch(error => {
        console.error('Error fetching categories:', error);
      });
      this.getSubcategories().catch(error => {
        console.error('Error fetching subcategories:', error);
      });
      this.getStatuses().catch(error => {
        console.error('Error fetching statuses:', error);
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
                  description: `This web part facilitates the creation of dynamic and modern layouts using data from a SharePoint list. It offers full customization through CSS.</br></br>
                                Property pane pages:
                                <ul>
                                  <li>Page 1 - <strong>General settings</strong></li>
                                  <li>Page 2 - <strong>Basic Visuals and Roles settings</strong></li>
                                  <li>Page 3 - <strong>Grouping and sorting settings</strong></li>
                                  <li>Page 4 - <strong>Card settings</strong></li>
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
                  onPropertyChange: ()=> {
                    this.onPropertyPaneFieldChanged.bind(this)
                    this.getColumns()
                  },
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
                  onPropertyChange: () => {
                    this.onPropertyPaneFieldChanged.bind(this)
                    this.filterColumns()
                  },
                  properties: this.properties,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: 'multiColumnPickerFieldId',
                  displayHiddenColumns: false,
                  columnReturnProperty: IColumnReturnProperty.Id,//['Internal Name'],
                  multiSelect: true,
                  webAbsoluteUrl: this.properties.siteurl,
                }),
                PropertyFieldCollectionData("colroles", {
                  key: "colroles",
                  label: "5. Set columns roles",
                  panelHeader: "Columns roles",
                  panelDescription: "This application provides a predefined list of roles that you can assign to the columns selected in the previous step. These roles define the functions of each column within the application. For sorting and grouping, utilize roles such as Category, Subcategory, or Status. Each role can be applied only once.",
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
                      options: this.filteredColumns.sort((a, b) => a.Title < b.Title ? -1 : a.Title > b.Title ? 1 : 0).map(item => {
                        return { key: item.InternalName, text: item.Title };
                      }),
                      required: true
                    },
                    {
                      id: "role",
                      title: "Role",
                      type: CustomCollectionFieldType.dropdown,
                      options: [
                        {
                          key: "Title",
                          text: "Title (single line of text)"
                        },
                        {
                          key: "Category",
                          text: "Category (choice)"
                        },
                        {
                          key: "Subcategory",
                          text: "Subcategory (choice)"
                        },
                        {
                          key: "ContentA",
                          text: "Content A (multiple line of text)"
                        },
                        {
                          key: "ContentB",
                          text: "Content B (multiple line of text)"
                        },
                        {
                          key: "Status",
                          text: "Status (choice)"
                        },
                        {
                          key: "Group1",
                          text: "Group 1 (multiple choice)"
                        },
                        {
                          key: "Group2",
                          text: "Group 2 (multiple choice)"
                        },
                        {
                          key: "Group3",
                          text: "Group 3 (multiple choice)"
                        },
                        {
                          key: "Owner",
                          text: "Owner (person)"
                        },
                        {
                          key: "Link",
                          text: "Link (hyperlink)"
                        }
                      ],
                      required: true
                    },
                    {
                      id: "name",
                      title: "Name",
                      type: CustomCollectionFieldType.string,
                      required: false
                    },
                  ],
                  disabled: this.properties.multiColumn.length < 1
                })
                
              ]
            },
          ]
        },
        {
          header: {
            description: "Within this property pane page, you can do your first visual customization. Start with general display options, then proceed to customizing controls (and roles you have assigned to your columns)."
          },
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
                  calloutContent: React.createElement('p', {}, 'Search field automatically filteres results based on the information included in columns with Content, Category, Subcategory and Group1 role.'),
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
                  calloutContent: React.createElement('p', {}, 'Your users will be able to sort by Title, Category, Subcategory or Status roles. Ascending and descending options are included.'),
                  onText: 'On',
                  offText: 'Off',
                  checked: this.properties.sortingToggle
                }),
                PropertyFieldToggleWithCallout('groupingToggle', {
                  calloutTrigger: CalloutTriggers.Hover,
                  calloutWidth: 300,
                  key: 'groupingToggleId',
                  label: 'Display grouping options',
                  calloutContent: React.createElement('p', {}, 'Your users will be able to group the content by Category or Subcategory roles or turn it off.'),
                  onText: 'On',
                  offText: 'Off',
                  checked: this.properties.groupingToggle
                }),
                PropertyFieldLabelWithCallout('generalCSSlabel', {
                  calloutTrigger: CalloutTriggers.Hover,
                  key: 'LabelWithCalloutFieldId',
                  calloutContent: React.createElement('p', {}, "This application offers preset CSS classes for customizing its visuals. You have an option to modify each part or role in its dedicated CSS editor. Alternatively, you can paste your full solution into the general CSS editor. Each web part has a unique ID, ensuring that CSS modifications in this solution will only affect the specified List To App web part and not others."),
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
              groupName: "2. Controls Visuals",
              groupFields: [
                PropertyFieldCollectionData("catIcons", {
                  key: "catIcons",
                  label: "Set Categories filteres visuals",
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
                  disabled: this.properties.colroles?.filter(col => col.role === "Category").length < 1 || this.categories.length === 0
                }),
                PropertyFieldMonacoEditor('catfilterCSS', {
                  key: 'catfilterCSS',
                  value: this.properties.catfilterCSS,
                  onChange: (code: string) => { this.properties.catfilterCSS = code; },
                  language:"css",
                  showLineNumbers:true,
                  theme: 'vs-dark'
                }),
                PropertyFieldCollectionData("subcatIcons", {
                  key: "subcatIcons",
                  label: "Set Subcategories filteres visuals",
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
                  disabled: this.properties.colroles?.filter(col => col.role === "Subcategory").length < 1 || this.subcategories.length === 0
                }),
                PropertyFieldMonacoEditor('subcatfilterCSS', {
                  key: 'subcatfilterCSS',
                  value: this.properties.subcatfilterCSS,
                  onChange: (code: string) => { this.properties.subcatfilterCSS = code; },
                  showMiniMap: true,
                  language:"css",
                  showLineNumbers:true,
                  theme: 'vs-dark'
                }),
                PropertyFieldCollectionData("statusIcons", {
                  key: "statusIcons",
                  label: "Set Status filteres visuals",
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
                  disabled: this.properties.colroles?.filter(col => col.role === "Status").length < 1 || this.statuses.length === 0
                }),
                PropertyFieldMonacoEditor('statusCSS', {
                  key: 'statusCSS',
                  value: this.properties.statusCSS,
                  onChange: (code: string) => { this.properties.statusCSS = code; },
                  language:"css",
                  showLineNumbers:true,
                  theme: 'vs-dark'
                }),
                PropertyPaneLabel('sortbyControlCSSlabel', {
                  text: "Set visuals for Sort by control"
                }),
                PropertyFieldMonacoEditor('sortbyControlCSS', {
                  key: 'sortbyControlCSS',
                  value: this.properties.sortbyControlCSS,
                  onChange: (code: string) => { this.properties.sortbyControlCSS = code; },
                  language:"css",
                  showLineNumbers:true,
                  theme: 'vs-dark'
                }),
                PropertyPaneLabel('groupbyControlCSSlabel', {
                  text: "Set visuals for Group by control"
                }),
                PropertyFieldMonacoEditor('groupbyControlCSS', {
                  key: 'groupbyControlCSS',
                  value: this.properties.groupbyControlCSS,
                  onChange: (code: string) => { this.properties.groupbyControlCSS = code; },
                  language:"css",
                  showLineNumbers:true,
                  theme: 'vs-dark'
                })               
              ]
            }
          ]
        },
        {
          header: {
            description: "Within this property pane page, you can customize default grouping and sorting options."
          },
          groups: [
            {
              groupName: "1. Grouping settings", 
              groupFields: [
                PropertyPaneChoiceGroup("defaultGroupby", {
                  label: 'Set default grouping',
                  options: [
                    {key: "None", text: "None", checked: true},
                    {key: "Category", text: "Category"},
                    {key: "Subcategory", text: "Subcategory"},
                  /*{key: "Status", text: "Status"},
                    {key: "Owner", text: "Owner"}*/
                  ]
                })
              ]
            },
            {
              groupName: "2. Grouping visuals", 
              groupFields: [
                PropertyPaneToggle('groupCategoryExpanded',{
                  label: 'Default Category group display',
                  onText: 'Expanded',
                  offText: 'Collapsed',
                }),
                PropertyPaneToggle('groupSubcategoryExpanded',{
                  label: 'Default Subcategory group display',
                  onText: 'Expanded',
                  offText: 'Collapsed',
                }),
                PropertyFieldMonacoEditor('groupby', {
                  key: 'groupby',
                  value: this.properties.groupbyCSS,
                  onChange: (code: string) => { this.properties.groupbyCSS = code; },
                  language:"css",
                  showLineNumbers:true,
                  theme: 'vs-dark'
                }),
              ]
            },
          ]
        },
        {
          header: {
            description: "Within this property pane page, you can customize the visuals of individual cards, which display specific details about each element."
          },
          groups: [
            {
              groupName: "1. Card settings",
              groupFields: [
                PropertyFieldToggleWithCallout('cardType', {
                  calloutTrigger: CalloutTriggers.Hover,
                  calloutWidth: 200,
                  key: 'toggleInfoHeaderFieldId',
                  label: 'Set the card type',
                  calloutContent: React.createElement('p', {}, "This control allows you to choose between displaying the content as a modal window or integrating it within the app's flow (Main window)."),
                  onText: 'Modal window',
                  offText: 'Main window',
                  checked: this.properties.cardType
                }),
                PropertyPaneSlider('cardsPerRow',{  
                  label: 'Set number of cards per row',  
                  min:1,  
                  max:5,  
                  value:1,  
                  showValue:true,  
                  step:1                
                }),   
                PropertyPaneToggle('cardCategoryToggle',{
                  label: 'Display Category',
                  onText: 'On',
                  offText: 'Off',
                }),
                PropertyPaneToggle('cardSubcategoryToggle',{
                  label: 'Display Subcategory',
                  onText: 'On',
                  offText: 'Off',
                }),
                PropertyPaneToggle('cardStatusToggle',{
                  label: 'Display Status',
                  onText: 'On',
                  offText: 'Off',
                }),
                PropertyPaneToggle('cardGroup1Toggle',{
                  label: 'Display Group1',
                  onText: 'On',
                  offText: 'Off',
                }),
                PropertyPaneToggle('cardGroup2Toggle',{
                  label: 'Display Group2',
                  onText: 'On',
                  offText: 'Off',
                }),
                PropertyPaneToggle('cardGroup3Toggle',{
                  label: 'Display Group3',
                  onText: 'On',
                  offText: 'Off',
                }),
                PropertyPaneToggle('cardLinkToggle',{
                  label: 'Display Link',
                  onText: 'On',
                  offText: 'Off',
                })
              ],
             },
            {
              groupName: "2. Card visuals",
              groupFields: [
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
