import { useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import { get, map } from "lodash";
import { withTranslation } from "react-i18next";

import i18n from "src/i18n";
import languages from "src/common/languages";

const LanguageDropdown = () => {
  const [menu, setMenu] = useState<boolean>(false);

  const changeLanguageAction = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const toggleDropdown = () => setMenu(!menu);

  function getLangParam(language: string, param: string) {
    return get<any,any>(languages, `${language}.${param}`)
  }

  return (
    <>
      <Dropdown isOpen={menu} toggle={toggleDropdown} className="d-inline-block">
        <DropdownToggle className="btn header-item " tag="button">
          <img
            src={getLangParam(i18n.language, 'flag')}
            height="16"
            className="me-1"
          />
        </DropdownToggle>
        <DropdownMenu className="language-switch dropdown-menu-end">
          {map(Object.keys(languages), key => (
            <DropdownItem
              key={key}
              onClick={() => changeLanguageAction(key)}
              className={`notify-item ${
                i18n.language === key ? "active" : "none"
              }`}
            >
              <img
                src={getLangParam(key, 'flag')}
                alt="Skote"
                className="me-1"
                height="12"
              />
              <span className="align-middle">
                {getLangParam(key, `label`)}
              </span>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </>
  );
};

export default withTranslation()(LanguageDropdown);
