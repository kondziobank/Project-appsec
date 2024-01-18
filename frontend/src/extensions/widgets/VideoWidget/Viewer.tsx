import { ViewerProps } from "../../../sdk";
import React from "react";
import { Card, CardBody } from 'reactstrap'

const VideoWidget = (props: ViewerProps) => {
  return (
    <React.Fragment>
      <Card>
      <CardBody>
      <div className="embed-responsive embed-responsive-16by9 ratio ratio-16x9">
        <iframe
          src={props.config.videoUrl}
          title="test"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
      </div>
      </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default VideoWidget;
