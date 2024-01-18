import React, { forwardRef, useState, useImperativeHandle } from "react";
import {
  Card,
  CardBody,
  FormGroup,
  Label,
  Input
} from "reactstrap";

import { ConfiguratorProps } from "../../../sdk"

export default forwardRef((props: ConfiguratorProps, ref: any) => {
  const [videoUrl, setVideoUrl] = useState(props.config.videoUrl)

  useImperativeHandle(ref, () => ({
    save: async () => ({ videoUrl })
  }))

  return (
    <React.Fragment>
    <Card style={{ marginBottom: '0' }}>
      <CardBody>
        <FormGroup>
          <Label for="videoUrl">{props.t("videoUrl")}</Label>
          <Input
            type="url"
            name="videoUrl"
            id="videoUrl"
            placeholder={props.t("videoUrl")}
            value={videoUrl}
            onChange={e => setVideoUrl(e.target.value)}
          />
        </FormGroup>
      </CardBody>
    </Card>
  </React.Fragment>
  )
})
