import { ViewerProps } from '../../../sdk'
import { Card, CardBody, Input, FormGroup, Label, Table, Button } from 'reactstrap'
import { key2d, checkKey2d, encrypt, decrypt, Matrix, validateKey } from './hill'
import { useState } from 'react'

interface IMatrixComponent{
  matrix: Matrix<string>;
  style?: any;
}

const MatrixComponent = (props: IMatrixComponent) => {
  return (
    <table>
      {props.matrix.map((row, y) => (
        <tr key={y}>
          {row.map((element, x) => (
            <td key={x} style={{border: '1px solid black', padding: '10px'}}>
              {element}
            </td>
          ))}
        </tr>
      ))}
    </table>
  );
}

export default (props: ViewerProps) => {
  const [key, setKey] = useState(props.config.key);
  const [text, setText] = useState(props.config.text);
  const [isEncryptMode, setEncryptMode] = useState(props.config.encrypt);

  const isDataValid = validateKey(key);
  const IsInvalid = () => <p>Nieprawidłowa wartość</p>;
  const MatrixCalculation = () => {
    const keyMatrix = key2d(key);
    const transform = isEncryptMode ? encrypt : decrypt;
    const result = transform(text, keyMatrix);
    return (
      <FormGroup>
      <Label>{props.t('outputLabel')}:</Label>
      <Input value={result}  disabled/>
      </FormGroup>
    )
  }
  return (
    <div style={{overflowX : 'auto'}}>
      <FormGroup>
        <Label>{props.t('keyLabel')}:</Label>
        <Input value={key} placeholder = {props.t('keyLabel')} onChange={e => setKey(e.target.value)}/>
      </FormGroup>
      <FormGroup>
        <Label>{props.t('textLabel')}:</Label>
        <Input value={text} placeholder = {props.t('textLabel')} onChange={e => setText(e.target.value)}/>
      </FormGroup>
      <FormGroup switch>
        <Label check>{isEncryptMode ? props.t('encryptionEnabled') : props.t('decryptionEnabled')}</Label>
        <Input type="switch" role="switch" value={isEncryptMode ? '0': '1'} onChange={() => setEncryptMode(!isEncryptMode)} />
      </FormGroup>
      
      {isDataValid ? <MatrixCalculation/> : <IsInvalid/>}
    </div>
  )
}

