import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'SitsServiceCatalogueWebPartStrings';
import SitsServiceCatalogue from './components/SitsServiceCatalogue';
import { ISitsServiceCatalogueProps } from './components/ISitsServiceCatalogueProps';

export interface ISitsServiceCatalogueWebPartProps {
  description: string;
}

export default class SitsServiceCatalogueWebPart extends BaseClientSideWebPart<ISitsServiceCatalogueWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ISitsServiceCatalogueProps> = React.createElement(
      SitsServiceCatalogue,
      {
        description: this.properties.description,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

/*
  protected onInit(): Promise<void> {
    return this._getEnvironmentMessage().then(message => {
      this._environmentMessage = message;
    });
  }
*/
 
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
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
