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
import * as strings from 'SitsServiceCatalogueWebPartStrings';
import SitsServiceCatalogue from './components/SitsServiceCatalogue';
import { ISitsServiceCatalogueProps } from './components/ISitsServiceCatalogueProps';
import { thProperties } from '@fluentui/react';

export interface ISitsServiceCatalogueWebPartProps {
    header: string;
    siteurl: string;
    list: string;
    collectionData: any[];
    multiColumn: string;
}

export default class SitsServiceCatalogueWebPart extends BaseClientSideWebPart<ISitsServiceCatalogueWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ISitsServiceCatalogueProps> = React.createElement(
      SitsServiceCatalogue,
      {
        header: this.properties.header,
        siteurl: this.properties.siteurl,
        list: this.properties.list,
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

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: "Settings"
          },
          groups: [
            {
              groupName: "Sources",
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
                  columnReturnProperty: IColumnReturnProperty.Title,
                  multiSelect: true,
                  webAbsoluteUrl: this.properties.siteurl,
              }),
                PropertyFieldCollectionData("collectionData", {
                  key: "collectionData",
                  label: "Collection data",
                  panelHeader: "Collection data panel header",
                  manageBtnLabel: "Manage collection data",
                  value: this.properties.collectionData,
                  fields: [
                    {
                      id: "Title",
                      title: "Firstname",
                      type: CustomCollectionFieldType.string,
                      required: true
                    },
                    {
                      id: "Age",
                      title: "Age",
                      type: CustomCollectionFieldType.number,
                      required: true
                    },
                    {
                      id: "City",
                      title: "Favorite city",
                      type: CustomCollectionFieldType.dropdown,
                      options: [
                        {
                          key: "antwerp",
                          text: "Antwerp"
                        },
                        {
                          key: "helsinki",
                          text: "Helsinki"
                        },
                        {
                          key: "montreal",
                          text: "Montreal"
                        }
                      ],
                      required: true
                    },
                    {
                      id: "Sign",
                      title: "Signed",
                      type: CustomCollectionFieldType.boolean
                    }
                  ],
                  disabled: false
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
