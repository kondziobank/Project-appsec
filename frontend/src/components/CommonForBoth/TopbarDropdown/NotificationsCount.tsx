import Icon from '@ailibs/feather-react-ts';

interface INotificationsCount {
  count: number;
}

const NotificationsCount = (props: INotificationsCount) => {
  const badgeColor = props.count === 0 ? 'bg-light' : 'bg-danger';

  return (
    <>
      <Icon name="bell" className="icon-lg" />
      <span className={`badge ${badgeColor} rounded-pill`}>
        {props.count}
      </span>
    </>
  );
}

export default NotificationsCount;
