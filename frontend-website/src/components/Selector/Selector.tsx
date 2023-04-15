import React, { useState } from "react";
import styles from "./Selector.module.scss";

interface Option {
  value: string;
  label: string;
}

interface Props {
  options: Option[];
  defaultOption: string;
  onChange?: (option: string) => void;
}

const Selector: React.FC<Props> = ({ options, defaultOption, onChange }) => {
  const [selectedOption, setSelectedOption] = useState(defaultOption);

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
    if (onChange) {
      onChange(option);
    }
  };

  return (
    <div className={styles.dropdown}>
      <select
        value={selectedOption}
        onChange={(e) => handleOptionChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Selector;
