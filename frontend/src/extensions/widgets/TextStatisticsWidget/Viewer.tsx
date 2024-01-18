import { useState, useMemo } from 'react'
import unidecode from 'unidecode'
import debounce from 'lodash.debounce'
import ApexChart from 'react-apexcharts'
import { Card, CardTitle, CardBody, CardSubtitle, Input, Label, FormGroup } from 'reactstrap'
import { ViewerProps } from '../../../sdk'

function key(keyExtractor: any): any {
  return (a: any, b: any) => keyExtractor(a) - keyExtractor(b)
}

function counter(text: string): { [key: string]: number } {
  return text.split('').reduce((accumulator: any, letter) => ({
    ...accumulator,
    [letter]: (accumulator[letter] ?? 0) + 1
  }), {})
}

const TempSeparator = () => (<div style={{ height: '10px'}}></div>)

export default (props: ViewerProps) => {
  const [text, setText] = useState(props.config.text)
  const onTextUpdate = (event: any) => setText(event.target.value)
  const debouncedTextUpdate = useMemo(() => debounce(onTextUpdate, 300), [])

  const [caseSensitive, setCaseSensitive] = useState(false)
  const [unidecoded, setUnidecoded] = useState(false)
  const sanitize = (text: string) => {
    let result = text;
    if (!caseSensitive) {
      result = result.toLocaleUpperCase();
    }
    if (unidecoded) {
      result = unidecode(result)
    }
    return result
  }
 
  const charsWhitelistFields = [
    { name: props.t('letters'), regex: /\p{L}/u },
    { name: props.t('digits'), regex: /\p{N}/u },
    { name: props.t('whitespaces'), regex: /\p{Z}/u },
  ]
  const [whitelist, setWhitelist] = useState(charsWhitelistFields.map(_ => false))
  const resetWhiteList = () => setWhitelist(charsWhitelistFields.map(_ => false))
  const toggleWhitelist = (index: number) => setWhitelist(whitelist.map((e, i) => index === i ? (!e) : e))
  const countAll = !whitelist.some(e => e)
  const regexes = charsWhitelistFields.filter((_, index) => whitelist[index]).map(type => type.regex)
  const filteredText = [...text].filter(letter => regexes.length === 0 || regexes.some(regex => regex.test(letter))).join('')

  const sanitizedText = sanitize(filteredText)
  const histogram = Object.fromEntries(Object.entries(counter(sanitizedText)).map(e => {
    const invisibleCharsMapping: { [key: string]: string } = {
      ' ': props.t('space'),
      "\t": props.t('tab'),
      "\n": props.t('newline'),
    }
    return [invisibleCharsMapping[e[0]] ?? e[0], e[1]]
  }))
  const categories = Object.entries(histogram).sort(key((e: any) => -e[1])).map(e => e[0])
  const data = categories.map(e => histogram[e])


  const plotOptions = {
    chart: {
      id: "basic-bar"
    },
    xaxis: {
      categories
    }
  };

  const plotSeries = [
    {
      name: "Liczba powtórzeń",
      data
    }
  ];

  return (
    <Card style={{ marginBottom: '0' }}>
      <CardBody>
        <CardTitle>{props.t('name')}</CardTitle>
        <CardSubtitle>{props.t('subtitle')}</CardSubtitle>

        <TempSeparator />

        <FormGroup>
          <Label>{props.t('insertText')}</Label>
          <Input type="textarea" defaultValue={text} onChange={debouncedTextUpdate} rows="5" spellCheck="false" placeholder={props.t('insertText')} />
        </FormGroup>

        <TempSeparator />

        <Label>{props.t('plotLabel')}</Label>

        <ApexChart options={plotOptions} series={plotSeries} type="bar" height={350} />

        <TempSeparator />


        <div style={{ display: 'flex' }}>
          <div style={{ marginRight: '40px' }}>
            <Label>{props.t('whitelistLabel')}</Label>
            <FormGroup check>
              <Input
                type="checkbox"
                checked={countAll}
                disabled={countAll}
                onChange={resetWhiteList}
              />
              {' '}
              <Label check>{props.t('all')}</Label>
            </FormGroup>

            {charsWhitelistFields.map(({ name }, index) => (
              <FormGroup check key={index}>
                <Input
                  type="checkbox"
                  checked={whitelist[index]}
                  onChange={() => toggleWhitelist(index)}
                />
                {' '}
                <Label check>{name}</Label>
              </FormGroup>
            ))}
          </div>
          <div>
            <Label>{props.t('otherSettingsLabel')}</Label>
            <FormGroup check>
              <Input
                type="checkbox"
                checked={caseSensitive}
                onChange={() => setCaseSensitive(!caseSensitive)}
              />
              {' '}
              <Label check>{props.t('caseSensitive')}</Label>
            </FormGroup>
            <FormGroup check>
              <Input
                type="checkbox"
                checked={unidecoded}
                onChange={() => setUnidecoded(!unidecoded)}
              />
              {' '}
              <Label check>{props.t('unidecode')}</Label>
            </FormGroup>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
