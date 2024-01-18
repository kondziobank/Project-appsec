import { useEffect, useState } from 'react';
import { FileIcon, defaultStyles } from 'react-file-icon'
import { Link } from 'react-router-dom';
import { ViewerProps } from 'src/sdk'
import { getFileMetadata } from 'src/helpers/api_helper'

interface IFileRow {
  fileId: string;
}

function getFileExtensionFromFilename(filename: string) {
  const parts = filename.split('.');
  return parts[parts.length - 1];
}

const FileRow = (props: any) => {
  const [meta, setMeta] = useState<any>(null)
  useEffect(() => {
    getFileMetadata(props.fileId).then((meta: any) => setMeta(meta))
  }, [])

  if (meta === null) {
    return <div>Ładuje się...</div>;
  }

  const styles: any = defaultStyles
  const fileExtension = getFileExtensionFromFilename(meta.meta.originalName);

  return (
    <li style={{ display: 'flex', alignItems: 'baseline' }}>
      <div style={{ width: '30px', height: '30px', margin: '10px' }}>
        <FileIcon extension={fileExtension} {...styles[fileExtension]} />
      </div>
      <div>
        <a href={meta.publicUrl}>{meta.name}</a>
      </div>
    </li>
  )
}

export default (props: ViewerProps) => {
  const { config } = props
  return (
    <div style={{ padding: '15px 20px', border: '1px solid #eee' }}>
      <h5 style={{ margin: '0', padding: 0 }}>
        {props.t(config.fileIds.length > 1 ? 'filesToDownload' : 'fileToDownload')}
      </h5>

      <div style={{ height: '10px' }}></div>

      <ol style={{ listStyleType: 'none', margin: '0', padding: '0' }}>
        {config.fileIds.map((fileId: string, index: number) => <FileRow key={index} fileId={fileId} />)}
      </ol>
    </div>
  )
}
