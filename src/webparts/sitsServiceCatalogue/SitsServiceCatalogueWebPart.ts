import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { PropertyFieldListPicker, PropertyFieldListPickerOrderBy } from '@pnp/spfx-property-controls/lib/PropertyFieldListPicker';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'SitsServiceCatalogueWebPartStrings';
import SitsServiceCatalogue from './components/SitsServiceCatalogue';
import { ISitsServiceCatalogueProps } from './components/ISitsServiceCatalogueProps';
import { thProperties } from '@fluentui/react';

export interface ISitsServiceCatalogueWebPartProps {
    header: string;
    siteurl: string;
    list: string | string[];
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
                  label: "App header"
                }),
                PropertyPaneTextField('siteurl', {
                  label: "List site url"
                }),
                PropertyFieldListPicker('list', {
                  label: 'Select a list',
                  selectedList: this.properties.list,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  baseTemplate: 100,
                  disabled: false,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  context: this.context,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: 'listPickerFieldId',
                  webAbsoluteUrl: this.properties.siteurl
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
