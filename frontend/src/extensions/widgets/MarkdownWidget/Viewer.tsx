import React from "react";
import { Viewer } from '@bytemd/react'
import { ViewerProps } from "../../../sdk";
import VendorConfigProvider from './VendorConfigProvider'
import defaultText from '!!raw-loader!./example.md'

export default (props: ViewerProps) => {
  const text = props.config?.text ?? defaultText
  return (
    <React.Fragment>
      <VendorConfigProvider
        lang={props.lang}
        theme={props.theme}
        component={(locale: any, plugins: any) =>
          <Viewer
            value={text}
            plugins={plugins}
          />
        }
      />
    </React.Fragment>
  );
};
