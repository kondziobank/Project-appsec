import { ViewerProps } from '../../../sdk'
import { Card, CardBody, Input, FormGroup, Label, Table, Button } from 'reactstrap'
import { ROT13 } from './rot13'
import { useState } from 'react'

export default (props: ViewerProps) => {
  const [text, setText] = useState(props.config.text);

  const CaesarCalculation = () => {
    const result = ROT13(text);
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
        <Label>{props.t('textLabel')}:</Label>
        <Input value={text} placeholder = {props.t('textLabel')} onChange={e => setText(e.target.value)}/>
      </FormGroup>
      
      {<CaesarCalculation/>}
    </div>
  )
}

