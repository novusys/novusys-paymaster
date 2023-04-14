import React, { useContext } from "react";
import styles from "./Header.module.scss";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  return (
    <div className={styles["main__container"]}>
      <div className={styles["inner__container"]}>
        <img src="/logos/novusys-logo.png" alt="" /> <div className={styles["title"]}>{props.title}</div>
      </div>
    </div>
  );
};

export default Header;
