import { ViewerProps } from '../../../sdk'
import { Card, CardBody, Input, FormGroup, Label, Table, Button } from 'reactstrap'
import { CaesarX, validateKey } from './caesar'
import { useState } from 'react'

export default (props: ViewerProps) => {
  const [key, setKey] = useState(props.config.key);
  const [text, setText] = useState(props.config.text);

  const isDataValid = validateKey(key);
  const IsInvalid = () => <p>Nieprawidłowa wartość</p>;
  const CaesarCalculation = () => {
    const keyInt = parseInt(key);
    const result = CaesarX(text, keyInt);
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
      
      {isDataValid ? <CaesarCalculation/> : <IsInvalid/>}
    </div>
  )
}

