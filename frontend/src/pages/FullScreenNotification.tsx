interface IFullScreenNotification {
  children: any;
}

const FullScreenNotification = (props: IFullScreenNotification) => {
  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', width: '500px' }}>
        {props.children}
      </div>
    </div>
  );
}

export default FullScreenNotification;
