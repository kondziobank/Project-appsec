import { ViewerProps } from '../../../sdk'

export default (props: ViewerProps) => {
  return (
    <div>{props.t("yourNameIs")}: {props.config.text}</div>
  )
}
