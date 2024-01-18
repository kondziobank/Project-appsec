import { forwardRef, useImperativeHandle, useState } from 'react'
import { Input, Label, FormGroup } from 'reactstrap'
import { ConfiguratorProps } from '../../../sdk'

export default forwardRef((props: ConfiguratorProps, ref: any) => {
  const [text, setText] = useState(props.config.text)

  useImperativeHandle(ref, () => ({
    save: async () => ({
      text
    })
  }))

  return (
    <FormGroup>
      <Label>{props.t("giveYourName")}</Label>
      <Input value={text} onChange={event => setText(event.target.value)} />
    </FormGroup> 
  )
})
