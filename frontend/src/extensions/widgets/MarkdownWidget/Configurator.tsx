import moment from "moment";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Editor } from '@bytemd/react'
import { ConfiguratorProps } from "../../../sdk";
import VendorConfigProvider from "./VendorConfigProvider";
import { uploadPublicFile } from "src/helpers/api_helper";


export default forwardRef((props: ConfiguratorProps, ref: any) => {
  const [config, setConfig] = useState(props.config)
  useImperativeHandle(ref, () => ({
    save: async () => config
  }))

  function updateText(text: string) {
    setConfig({ ...config, text })
  }

  async function uploadImages(files: File[]) {
    const uploadedFiles = await Promise.all(files.map(file => uploadPublicFile({
      name: `Picture ${moment()}`,
      public: true
    }, file)));

    return uploadedFiles.map(({ url }) => ({ url }));
  }

  return (
    <React.Fragment>
      <VendorConfigProvider
        lang={props.lang}
        theme={props.theme}
        component={(locale: any, plugins: any) =>
          <Editor
            value={config.text}
            plugins={plugins}
            locale={locale.editor}
            editorConfig={{ lineNumbers: true }}
            onChange={v => updateText(v)}
            uploadImages={uploadImages}
          />
        }
      />
    </React.Fragment>
  );
});
