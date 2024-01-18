import { useState } from "react";
import { withTranslation } from "react-i18next";
import { useHistory } from "react-router";

const SearchBar = (props: any) => {
  const history = useHistory();
  const [text, setText] = useState('');

  function handleSearch(event: any) {
    event.preventDefault();
    if (text.length > 0) {
      history.push(`/s/${text}`);
    }
  }

  return (
    <form className="app-search d-none d-lg-block" onSubmit={handleSearch}>
      <div className="position-relative">
      <input
        type="text"
        className="form-control"
        placeholder={props.t("Search...")}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button className="btn btn-primary">
        <i className="bx bx-search-alt align-middle" />
      </button>
      </div>
    </form>
  );
}

export default withTranslation()(SearchBar);

