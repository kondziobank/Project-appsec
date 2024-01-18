import { useState } from 'react'
import { Card, CardBody, CardTitle, FormGroup, Label, Input, CardSubtitle, Row, Col } from 'reactstrap';
import Icon from '@ailibs/feather-react-ts'
import { ConfiguratorProps } from "../../../sdk";


const TempSeparator = () => <div style={{ height: '10px' }}></div>

function shuffle<T>(array: T[]) {
  return array.sort(() => Math.random() - 0.5)
}

interface IAnswer {
  answer: string;
  checked: boolean;
  disabled: boolean;
  multipleChoice: boolean;
  onChange(): void;
  style: any;
}

const Answer = (props: IAnswer) => {
  return (
    <FormGroup style={props.style} check>
      <Input
        type={props.multipleChoice ? 'checkbox' : 'radio'}
        checked={props.checked}
        disabled={props.disabled}
        onChange={props.onChange}
      />
      {' '}
      <Label check>
        {props.answer}
      </Label>
    </FormGroup>
  )
};

enum ResultColor {
  Success = '#a8feb4',
  Fail = '#ffb8b8'
}

interface IQuestion {
  question: string;
  answers: { answer: string, correct: boolean }[];
  multipleChoice: boolean;
  t(label: string): any;
}

const Question = (props: IQuestion) => {
  const [checkedAnswers, _setCheckedAnswers] = useState(props.answers.map(_ => false));
  
  function resetQuestion() {
    _setCheckedAnswers(props.answers.map(_ => false))
  }

  function giveUp() {
    _setCheckedAnswers(props.answers.map(_ => true))
  }


  function setAnswerChecked(index: number) {
    _setCheckedAnswers(checkedAnswers.map((value, i) =>
      i === index
        ? true
        : value
    ))
  }

  function getWholeWidgetBackgroundColor() {
    if (props.multipleChoice || !checkedAnswers.some(e => e)) {
      return undefined;
    } else if (checkedAnswers.every((checked, index) => props.answers[index].correct === checked)) {
      return ResultColor.Success;
    } else {
      return ResultColor.Fail;
    }
  }

  function getSingleAnswerBackgroundColor(index: number) {
    if (!props.multipleChoice || !checkedAnswers[index]) {
      return undefined;
    } else if (props.answers[index].correct) {
      return ResultColor.Success;
    } else {
      return ResultColor.Fail;
    }
  }



  return (
    <Card style={{ background: getWholeWidgetBackgroundColor(), marginBottom: '0' }}>
      <CardBody style={{ display: 'flex', 'alignItems': 'flex-start', 'justifyContent': 'space-between' }}>
        <div style={{ flex: '1' }}>
          <CardTitle>
            {props.question}
          </CardTitle>
          <CardSubtitle>
            {props.multipleChoice ? props.t('multipleChoice') : props.t('singleChoice')}
          </CardSubtitle>
          <TempSeparator/>
          {props.answers.map((answer: { answer: string, correct: boolean }, index: number) => 
            <Answer
              answer={answer.answer}
              onChange={() => setAnswerChecked(index)}
              disabled={props.multipleChoice ? checkedAnswers[index] : checkedAnswers.some(e => e)}
              checked={checkedAnswers[index]}
              multipleChoice={props.multipleChoice}
              key={index}
              style={{ background: getSingleAnswerBackgroundColor(index) }}
            />
        )}
        </div>
        <div style={{ flex: '1' }}>
          <div style={{ float: 'right' }}>
            <div style={{ marginBottom: '10px' }}>
              <Icon name="refresh-cw" onClick={() => resetQuestion()}/>
            </div>
            <div>
              <Icon name="flag" onClick={() => giveUp()}/>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default (props: ConfiguratorProps) => {
  const config = props.config
  const answers = config.randomAnswersOrder
    ? shuffle(config.answers)
    : config.answers

  return (
    <Question
      question={config.question}
      answers={answers}
      multipleChoice={config.multipleChoice}
      t={props.t}
    />
  )
}
