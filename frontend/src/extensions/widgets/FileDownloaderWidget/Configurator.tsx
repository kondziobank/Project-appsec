import { forwardRef, useImperativeHandle, useState, useRef } from 'react'
import { Input, Label, FormGroup, Spinner, Collapse } from 'reactstrap'
import { FileIcon, defaultStyles } from 'react-file-icon'
import Icon from '@ailibs/feather-react-ts'
import shortid from 'shortid'
import { filesize } from 'filesize'
import { ConfiguratorProps } from '../../../sdk'
import './style.scss'
import { uploadPublicFile } from 'src/helpers/api_helper'

interface Tagged<T> {
  id: string;
  data: T;
}

function extractExtension(filename: string): [string, string] {
  const parts = filename.split('.')
  const name = parts.slice(0, -1).join('.')
  const extension = parts[parts.length - 1]
  return [name, extension]
}

interface IUploadArea {
  onFilesUploaded(files: File[]): any;
}

const UploadArea = (props: IUploadArea) => {
  const ref = useRef(null);

  function onDragOver(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }

  function onDrop(event: any) {
    event.preventDefault();
    event.stopPropagation();

    const { files } = event.dataTransfer
    if (files != null && files.length > 0) {
      props.onFilesUploaded([...files])
    }
  }

  function onClick(event: any) {
    const input: any = ref.current;
    input.click();
  }

  function onChange(event: any) {
    const input: any = ref.current;
    props.onFilesUploaded([...input.files])
  }

  return (
    <div
      className='upload-area'
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={onClick}
    >
      Kliknij lub przeciągnij plik, który chcesz wgrać
      <input
        ref={ref}
        type="file"
        onChange={onChange}
        style={{ display: 'none' }}
        multiple
      />
    </div>
  )
}

interface ISingleFileUploader {
  file: File;
  onDelete(): any;
}

const SingleFileUploader = forwardRef((props: ISingleFileUploader, ref: any) => {
  const styles: any = defaultStyles;
  const [_title, extension] = extractExtension(props.file.name);
  const [title, setTitle] = useState(_title);
  const fileSize = filesize(props.file.size, { base: 2, standard: 'iec' });

  const [loading, setLoading] = useState(false);
  useImperativeHandle(ref, () => ({
    upload: async () => {
      setLoading(true);
      const { _id } = await uploadPublicFile({ name: title, public: true }, props.file);
      setLoading(false);
      return _id;
    }
  }))

  return (
    <li style={{ display: 'flex', alignItems: 'baseline' }}>
      <Collapse isOpen={loading} style={{ margin: '5px' }}>
        <Spinner size="sm" />
      </Collapse>
      <div style={{ width: '30px', height: '30px', margin: '5px' }}>
        <FileIcon extension={extension} {...styles[extension]} />
      </div>
      <div style={{ flex: '1', margin: '5px' }}>
        <Input value={title} onChange={e => setTitle(e.target.value)} />
      </div>
      <div style={{ margin: '5px' }}>
        {fileSize}
      </div>
      <div style={{ margin: '5px' }}>
        <Icon name="trash-2" onClick={props.onDelete} />
      </div>
    </li>
  )
})

export default forwardRef((props: ConfiguratorProps, ref: any) => {
  const uploaders = useRef<any>([]);
  const [uploadedFiles, setUploadedFiles] = useState<Tagged<File>[]>([])

  useImperativeHandle(ref, () => ({
    save: async () => {
      const fileIds = await uploadAll()
      return { fileIds }
    }
  }))

  function addUploadedFiles(files: File[]) {
    const newFiles: Tagged<File>[] = files.map(data => ({ id: shortid(), data }))
    setUploadedFiles([...uploadedFiles, ...newFiles])
  }

  function deleteUploadedFile(index: number) {
    const newUploadedFiles = uploadedFiles.filter((_: any, i: number) => i !== index)
    setUploadedFiles(newUploadedFiles)
  }

  async function uploadAll() {
    const keys = uploadedFiles.map(file => file.id)
    const promises = keys.map(key => uploaders.current[key].upload())
    return Promise.all(promises)
  }

  return (
    <FormGroup>
      <Label>{props.t('uploadFilesLabel')}</Label>
      <ol style={{ listStyleType: 'none', margin: '0', padding: '0' }}>
        {uploadedFiles.map((file, index) => (
          <SingleFileUploader
            ref={el => uploaders.current[file.id] = el}
            file={file.data}
            key={file.id}
            onDelete={() => deleteUploadedFile(index)}
          />
        ))}
      </ol>

      <div style={{ height: '30px' }}></div>

      <UploadArea onFilesUploaded={files => addUploadedFiles(files)} />
    </FormGroup> 
  )
})
