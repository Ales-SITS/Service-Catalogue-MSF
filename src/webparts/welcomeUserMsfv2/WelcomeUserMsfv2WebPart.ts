import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { PropertyFieldCollectionData, CustomCollectionFieldType } from '@pnp/spfx-property-controls/lib/PropertyFieldCollectionData';
import { PropertyFieldMonacoEditor } from '@pnp/spfx-property-controls/lib/PropertyFieldMonacoEditor';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import WelcomeUserMsfv2 from './components/WelcomeUserMsfv2';


export interface IWelcomeUserMsfv2WebPartProps {
  text_before: string;
  text_after: string;
  text_paragraph: string;
  welcome_css: string;
  call_buttons: any[];
}

export default class WelcomeUserMsfv2WebPart extends BaseClientSideWebPart<IWelcomeUserMsfv2WebPartProps> {



  public render(): void {
    const existingStyleElement = document.head.querySelector('style[data-webpart-styles]');
    if (existingStyleElement) {
      existingStyleElement.remove();
    }
    const webPartId = this.context.instanceId.replaceAll("-","")
    const dynamicStyles = document.createElement('style');
    const concatCSS = this.properties.welcome_css
    const dynamicStylesContent = concatCSS?.replaceAll(".wellmsf__",`.wellmsf_${webPartId}_`);
  
    dynamicStyles.textContent = dynamicStylesContent;


    const element: React.ReactElement<IWelcomeUserMsfv2WebPartProps> = React.createElement(
      WelcomeUserMsfv2,
      {
        userDisplayName: this.context.pageContext.user.displayName,
        text_before: this.properties.text_before,
        text_after: this.properties.text_after,
        text_paragraph: this.properties.text_paragraph,
        call_buttons: this.properties.call_buttons,
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
          header: {
            description: "With this webpart you can greet your users with a style. You have almost unlimited visual customization options with the implemented CSS editor. Advanced solutions like gradients and animations are also possible! And as a bonus you can also include one or more buttons to navigate your users further!"
          },
          groups: [
            {
              groupName: "Text settings",
              groupFields: [
                PropertyPaneTextField('text_before', {
                  label: "Text before the name:"
                }),
                PropertyPaneTextField('text_after', {
                  label: "Text after the name:"
                }),
                PropertyPaneTextField('text_paragraph', {
                  label: "Paragraph",
                  multiline: true,
                  resizable: true,
                  rows: 5
                }),
                PropertyFieldCollectionData("call_buttons", {
                  key: "call_collection",
                  label: "Call button settings",
                  panelHeader: "Call button settings",
                  manageBtnLabel: "Call button settings",
                  value: this.properties.call_buttons,
                  fields: [
                    {
                      id: "call_url",
                      title: "Call button url",
                      type: CustomCollectionFieldType.string,
                      required: true
                    },
                    {
                      id: "call_label",
                      title: "Call button label",
                      type: CustomCollectionFieldType.string,
                      required: true
                    },
                    {
                      id: "call_target",
                      title: "Open in new tab?",
                      type: CustomCollectionFieldType.boolean,
                      defaultValue: true,
                      required: true
                    },
                    {
                      id: "call_icon_toggle",
                      title: "Include fluent ui icon?",
                      type: CustomCollectionFieldType.boolean,
                      defaultValue: false,
                    },
                    {
                      id: "call_icon",
                      title: "Fluent UI Icon",
                      iconFieldRenderMode: "picker",
                      type: CustomCollectionFieldType.fabricIcon,
                    },
                    {
                      id: "call_icon_custom_toggle",
                      title: "Include custom icon?",
                      type: CustomCollectionFieldType.boolean,
                      defaultValue: false,
                    },
                    {
                      id: "call_icon_custom",
                      title: "Custom Icon Url",
                      iconFieldRenderMode: "picker",
                      type: CustomCollectionFieldType.url,
                    }
                  ],
                })
              ]
            },
            {
              groupName: "Visual settings",
              groupFields: [
                PropertyFieldMonacoEditor('welcome_css', {
                  key: 'buttons_css',
                  value: this.properties.welcome_css,
                  onChange: (code: string) => { this.properties.welcome_css = code; },
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
