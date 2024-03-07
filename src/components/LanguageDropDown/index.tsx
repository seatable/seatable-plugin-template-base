import React, { useEffect, useState } from 'react';
import styles from '../../styles/Modal.module.scss';
import { AVAILABLE_LOCALES } from '../../locale';
import { updateLanguageAndIntl } from '../..';

const LanguageDropdown: React.FC<any> = (props) => {
  const { lang } = props;
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');

  useEffect(() => {
    console.log('language', lang);
  }, [lang]);

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLang = event.target.value;
    setSelectedLanguage(selectedLang);
    updateLanguageAndIntl(selectedLang);
  };

  return (
    <select
      id="languageDropdown"
      onChange={handleLanguageChange}
      value={lang || selectedLanguage}
      className={styles.modal_header_select}>
      {Object.keys(AVAILABLE_LOCALES).map((langCode) => (
        <option key={langCode} value={langCode}>
          {langCode}
        </option>
      ))}
    </select>
  );
};

export default LanguageDropdown;
