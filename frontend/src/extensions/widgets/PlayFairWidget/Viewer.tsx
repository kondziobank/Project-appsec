import { useEffect, useState } from 'react'
import { ViewerProps } from '../../../sdk'
import { Card, CardBody, Input, FormGroup, Label } from 'reactstrap'
import { sanitize, generateKeyTable, prepareText, encryptByPlayfairCipher, decryptByPlayfairCipher } from './playfair';
import './style.scss'

function *chunks<T>(array: T[], size: number) {
  for (let i = 0; i < array.length; i += size) {
    yield array.slice(i, i + size);
  }
}

export default (props: ViewerProps) => {
  const [key, setKey] = useState(props.config.key);
  const [text, setText] = useState(props.config.text);
  const [encryptionEnabled, setEncryptionEnabled] = useState(true);
  const [chunksSeparation, setChunksSeparation] = useState(true);

  const matrix = generateKeyTable(sanitize(key));
  const transform = encryptionEnabled ? encryptByPlayfairCipher : decryptByPlayfairCipher;
  let output = transform(matrix, prepareText(sanitize(text)));
  if (chunksSeparation) {
    output = Array.from(chunks(output.split(''), 2)).map(e => e.join('')).join(' ')
  }

  function renderMatrix() {
    return (
      <table className="matrix">
        <tbody>
          {matrix.map((row, y) => (
            <tr key={y} className="matrix-row">
              {row.map((cell, x) => (
                <td key={x} className="matrix-cell">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  return (
    <Card>
      <CardBody>
        <h5>{props.t('name')}</h5>
        <div style={{ height: '10px' }}></div>
        <FormGroup>
            <Label>{props.t('keyLabel')}</Label>
            <Input
              type="text"
              placeholder={props.t('keyLabel')}
              value={key}
              onChange={e => setKey(e.target.value)}
            />
        </FormGroup>

        <div style={{ display: 'flex' }}>
          <FormGroup switch>
            <Label check>{encryptionEnabled ? props.t('encryptionEnabled') : props.t('decryptionEnabled')}</Label>
            <Input type="switch" role="switch" value={encryptionEnabled ? '0': '1'} onChange={() => setEncryptionEnabled(!encryptionEnabled)} />
          </FormGroup>
          <FormGroup switch style={{ marginLeft: '10px' }}>
            <Label check>{'Podział na dwuznaki'}</Label>
            <Input type="switch" role="switch" value={chunksSeparation ? '0': '1'} onChange={() => setChunksSeparation(!chunksSeparation)} />
          </FormGroup>
        </div>


        <div style={{ display: 'flex', marginTop: '10px' }}>
          <div>
            {renderMatrix()}
          </div>
          <div style={{ flex: '1px', marginLeft: '20px' }}>
            <FormGroup>
              <Label>{encryptionEnabled ? props.t('textToEncrypt') : props.t('textToDecrypt')}</Label>
              <Input
                type="text"
                placeholder={props.t('textLabel')}
                value={text}
                onChange={e => setText(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label>{props.t('output')}</Label>
              <Input
                type="text"
                value={output}
                disabled
              />
            </FormGroup>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
