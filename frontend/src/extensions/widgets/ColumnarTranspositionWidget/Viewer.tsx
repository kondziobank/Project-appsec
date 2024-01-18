import { ViewerProps } from '../../../sdk'
import { Card, CardBody, Input, FormGroup, Label, Table, Button } from 'reactstrap'
import { makeMatrix, columnarTranspositionMatrix, revKey, readFromMatrix, Matrix, validateKey, getRevKey } from './ct'
import { useState } from 'react'
import { table } from 'console';

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

  const isDataValid = validateKey(key);
  const IsInvalid = () => <p>Nieprawidłowa wartość</p>;
  const MatrixCalculation = () => {
    const matrix = makeMatrix(key, text);
    const reversedKey = revKey(key);
    const transpositedMatrix = columnarTranspositionMatrix(reversedKey, matrix);
    const result = readFromMatrix(transpositedMatrix);
    const reverseMode = () => {
      setKey(getRevKey(reversedKey))
      setText(result)
    }
    return (
      <><div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <FormGroup>
          <Label>{props.t('originalMatrixLabel')}:</Label>
          <MatrixComponent matrix = {matrix}/>
        </FormGroup>
        <FormGroup>
          <Label>{props.t('transpositionedMatrixLabel')}:</Label>
          <MatrixComponent matrix = {transpositedMatrix}/>
        </FormGroup>
        </div>
        <div>
          <FormGroup>
            <Label>{props.t('result')}:</Label>
            <Input value={result} disabled/>
          </FormGroup>
        </div>
        <Button onClick={reverseMode}>
          {props.t('reverse')}
        </Button>
      </>
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
      
      {isDataValid ? <MatrixCalculation/> : <IsInvalid/>}
    </div>
  )
}
