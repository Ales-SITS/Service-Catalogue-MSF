import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { PropertyFieldCollectionData, CustomCollectionFieldType } from '@pnp/spfx-property-controls/lib/PropertyFieldCollectionData';
import { PropertyFieldMonacoEditor } from '@pnp/spfx-property-controls/lib/PropertyFieldMonacoEditor';
import { PropertyPaneWebPartInformation } from '@pnp/spfx-property-controls/lib/PropertyPaneWebPartInformation';

import ButtonMsfv2 from './components/ButtonMsfv2';


export interface IButtonMsfv2WebPartProps {
  buttons_header: string;
  buttons_collection: any[];
  buttons_css: string;
  search_collection: any[]
}

export default class ButtonMsfv2WebPart extends BaseClientSideWebPart<IButtonMsfv2WebPartProps> {

  public render(): void {

    const existingStyleElement = document.head.querySelector('style[data-webpart-styles]');
    if (existingStyleElement) {
      existingStyleElement.remove();
    }
    const webPartId = this.context.instanceId.replaceAll("-","")
    const dynamicStyles = document.createElement('style');
    const concatCSS = this.properties.buttons_css?.concat(" ",this.properties.buttons_css)
    const dynamicStylesContent = concatCSS?.replaceAll(".btnmsf__",`.btnmsf_${webPartId}_`);
  
    dynamicStyles.textContent = dynamicStylesContent;

    const element: React.ReactElement<IButtonMsfv2WebPartProps> = React.createElement(
      ButtonMsfv2,
      {
        buttons_header: this.properties.buttons_header,
        buttons_collection: this.properties.buttons_collection,
        search_collection: this.properties.search_collection,
        webPartId: webPartId
      }
    );

    document.head.appendChild(dynamicStyles);

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    return Promise.resolve()
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
          groups: [
            {
              groupName: "",
              groupFields: [
                PropertyPaneWebPartInformation({
                  description: `Create modern and visually appealing buttons for your SharePoint solution. With CSS editor and present CSS classes.`,
                  videoProperties: {
                    embedLink: `https://msfintl.sharepoint.com/_layouts/15/embed.aspx?UniqueId=c78a468b-656d-4a72-91cf-b6a8c9300154&embed=%7B%22ust%22%3Atrue%2C%22hv%22%3A%22CopyEmbedCode%22%7D&referrer=StreamWebApp&referrerScenario=EmbedDialog.Create`,
                    properties: { 
                      allowFullScreen: true,
                      autoplay: false
                    
                    }
                  },
                  key: 'webPartInfoId'
                })
              ]
            },
            {
              groupName: "General settings",
              groupFields: [
                PropertyPaneTextField('buttons_header', {
                  label: "Set buttons field header"
                }),
                PropertyFieldCollectionData("buttons_collection", {
                  key: "buttons_header",
                  label: "Set your buttons",
                  panelHeader: "Buttons Settings",
                  manageBtnLabel: "Buttons Settings",
                  enableSorting: true,
                  value: this.properties.buttons_collection,
                  panelProps: {
                    customWidth: "300px" 
                  },
                  fields: [
                    {
                      id: "button_url",
                      title: "Target url",
                      type: CustomCollectionFieldType.url,
                      required: true
                    },
                    {
                      id: "button_target",
                      title: "Open in a new tab?",
                      type: CustomCollectionFieldType.boolean,
                      defaultValue: true
                    },
                    {
                      id: "button_label",
                      title: "Label",
                      type: CustomCollectionFieldType.string,
                    },
                    {
                      id: "button_icon_toggle",
                      title: "Include Fluent UI icon?",
                      type: CustomCollectionFieldType.boolean,
                      defaultValue: true
                    },
                    {
                      id: "button_icon",
                      title: "Fluent UI Icon",
                      iconFieldRenderMode: "picker",
                      type: CustomCollectionFieldType.fabricIcon,
                    },
                    {
                      id: "button_icon_custom_toggle",
                      title: "Include custom icon?",
                      type: CustomCollectionFieldType.boolean,
                      defaultValue: false,
                    },
                    {
                      id: "button_icon_custom",
                      title: "Custom Icon Url",
                      iconFieldRenderMode: "picker",
                      type: CustomCollectionFieldType.url,
                    },
                    {
                      id: "button_img",
                      title: "Button backgorund img url",
                      type: CustomCollectionFieldType.url,
                    },
                    {
                      id: "button_title",
                      title: "Text of hover",
                      type: CustomCollectionFieldType.string,
                    }
                  ],
                }),
                PropertyFieldCollectionData("search_collection", {
                  key: "search_collection",
                  label: "Set your search input field",
                  panelHeader: "Search input field Settings",
                  manageBtnLabel: "Search input field Settings",
                  disableItemCreation: true,
                  disableItemDeletion: true,
                  value: this.properties.search_collection,
                  fields: [
                    {
                      id: "search_toggle",
                      title: "Include search field?",
                      type: CustomCollectionFieldType.boolean,
                      defaultValue: true,
                      required: true
                    },
                    {
                      id: "search_placeholder",
                      title: "Input field placeholder text",
                      type: CustomCollectionFieldType.string,
                      required: true
                    },
                    {
                      id: "search_suffix",
                      title: "Search term suffix (*)",
                      type: CustomCollectionFieldType.string,
                      required: true
                    }
                  ],
                })
  
              ]
            },
            {
              groupName: "Visual settings",
              groupFields: [
                PropertyFieldMonacoEditor('buttons_css', {
                  key: 'buttons_css',
                  value: this.properties.buttons_css,
                  onChange: (code: string) => { this.properties.buttons_css = code; },
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
