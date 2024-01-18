import React, { forwardRef, createElement } from "react";

// Base types
export type WidgetConfiguration = any;

export interface WidgetProps {
  theme: string;
  lang: string;
}

interface CommonProps extends WidgetProps {
  t(label: string): any;
}

export interface MetadataProps extends CommonProps {
}

export interface ViewerProps extends CommonProps {
  config: WidgetConfiguration;
}

export interface ConfiguratorProps extends ViewerProps {
  onConfigSave(configuration: WidgetConfiguration): void;
}



// Translator
export interface LanguageDefinition {
    [key: string]: any;
}

export interface TranslatorConfig {
    [key: string]: LanguageDefinition;
}

export const translator = (config: TranslatorConfig) =>
    (lang: string) =>
        (label: string) =>
            config?.[lang]?.[label] ?? 'Missing translation'


// Widget factory
export interface WidgetFactoryConfig {
    translations: TranslatorConfig;
    metadata(props: MetadataProps): any;
    viewer(props: ViewerProps): any;
    configurator?: (props: ConfiguratorProps) => any;
}

export const makeWidget = (widgetFactoryConfig: WidgetFactoryConfig) => {
  const translations = translator(widgetFactoryConfig.translations);

  return (widgetProps: WidgetProps) => {
    const translation = translations(widgetProps.lang);
    const commonProps = { ...widgetProps, t: translation };
    const injectProps = (props: any) => ({ ...props, ...commonProps });

    return {
      metadata: widgetFactoryConfig.metadata(commonProps),
      viewer: (props: ViewerProps) => widgetFactoryConfig.viewer(injectProps(props)),
      configurator: widgetFactoryConfig.configurator !== undefined
        ? forwardRef((props: ConfiguratorProps, ref: any) => createElement(widgetFactoryConfig.configurator ?? '', { ...injectProps(props), ref }))
        : undefined
    }
  }
}

export interface CategoryFactoryConfig {
  translations: TranslatorConfig;
  metadata(props: MetadataProps): any;
}

export interface CategoryProps {
  theme: string;
  lang: string;
}

export const makeCategory = (categoryFactoryConfig: CategoryFactoryConfig) => {
  const translations = translator(categoryFactoryConfig.translations);

  return (categoryProps: CategoryProps) => {
    const translation = translations(categoryProps.lang);
    const commonProps = { ...categoryProps, t: translation };

    return {
      metadata: categoryFactoryConfig.metadata(commonProps),
    }
  }
}
