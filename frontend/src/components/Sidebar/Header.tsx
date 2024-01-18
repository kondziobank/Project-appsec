interface IHeader {
  className: string;
  id?: string;
  children?: any;
}

const Header = (props: IHeader) => {
  return (
    <ul className={props.className} id={props.id}>
      {props.children}
    </ul>
  );
};

export default Header;
