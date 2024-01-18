import { useState, forwardRef, useImperativeHandle } from "react";
import { FormGroup, Input, Label, Form, Button, InputGroup, InputGroupText } from "reactstrap";
import Icon from '@ailibs/feather-react-ts'
import { ConfiguratorProps } from "../../../sdk";

const TempSeparator = () => <div style={{ height: '10px' }}></div>

interface IAnswerRow {
  answer: string;
  onAnswerChange(answer: string): void;

  correct: boolean;
  onCorrectChange(correct: boolean): void;

  multipleChoice: boolean;

  onRemoveAnswer(): void;
}

const AnswerRow = (props: IAnswerRow) => {
  return (
    <>
      <InputGroup>
        <InputGroupText>
          <Input type={props.multipleChoice ? 'checkbox' : 'radio'} checked={props.correct} onChange={e => props.onCorrectChange(e.target.checked)}/>
        </InputGroupText>
          <Input value={props.answer} onChange={e => props.onAnswerChange(e.target.value)} />
        <InputGroupText>
          <Icon name="trash-2" size="16px" onClick={() => props.onRemoveAnswer()}/>
        </InputGroupText>
      </InputGroup>
      <TempSeparator />
    </>
  )
}

export default forwardRef((props: ConfiguratorProps, ref: any) => {
  const [question, setQuestion] = useState(props.config.question)
  const [answers, setAnswers] = useState(props.config.answers)
  const [randomAnswersOrder, setRandomAnswersOrder] = useState(props.config.randomAnswersOrder)
  const [multipleChoice, setMultipleChoice] = useState(props.config.multipleChoice)

  useImperativeHandle(ref, () => ({
    save: async() => ({
      question,
      answers,
      randomAnswersOrder,
      multipleChoice
    })
  }))

  function addEmptyAnswer() {
    setAnswers([...answers, ''])
  }

  function setAnswerContent(index: number, content: string) {
    setAnswers(answers.map((currentAnswer: { answer: string, correct: boolean }, currentIndex: number) =>
      currentIndex === index
        ? { ...currentAnswer, answer: content }
        : currentAnswer
    ))
  }

  function setAnswerCorrect(index: number, correct: boolean) {
    setAnswers(answers.map((currentAnswer: { answer: string, correct: boolean }, currentIndex: number) =>
      currentIndex === index
        ? { ...currentAnswer, correct }
        : (multipleChoice ? currentAnswer : { ...currentAnswer, correct: false })
    ))
  }

  function removeAnswer(index: number) {
    setAnswers(answers.filter((_: any, currentIndex: number) => currentIndex !== index))
  }

  const moreThanOneCorrect = answers.filter((a: { answer: string, correct: true }) => a.correct).length > 1
  

  return (
    <Form>
      <FormGroup>
        <Label>{props.t('question')}</Label>
        <Input type="text" value={question} onChange={e => setQuestion(e.target.value)} />
      </FormGroup>

      <TempSeparator />

      <FormGroup>
        <Label>{props.t('answers')}</Label>
        {answers.map((answer: { answer: string, correct: true }, index: number) => (
          <AnswerRow
            key={index}
            answer={answer.answer}
            correct={answer.correct}
            onAnswerChange={answer => setAnswerContent(index, answer)}
            onCorrectChange={correct => setAnswerCorrect(index, correct)}
            onRemoveAnswer={() => removeAnswer(index)}
            multipleChoice={multipleChoice}
          />
        ))}
      </FormGroup>

      <Button
        size="sm"
        style={{ float: 'right' }}
        onClick={addEmptyAnswer}
      >
        {props.t('createAnswer')}
      </Button>

      <TempSeparator />

      <FormGroup check inline>
        <Input type='checkbox' checked={randomAnswersOrder} onChange={e => setRandomAnswersOrder(e.target.checked)}/>
        <Label check>{props.t('randomAnswersOrder')}</Label>
      </FormGroup>

      <TempSeparator />

      <FormGroup check inline>
        <Input type='checkbox' checked={multipleChoice} disabled={moreThanOneCorrect} onChange={e => setMultipleChoice(e.target.checked)}/>
        <Label check>{props.t('multipleChoice')}</Label>
      </FormGroup>
    </Form>
  )
})
