import React, { useContext, useState } from "react";
import styles from "./Header.module.scss";

interface HeaderProps {
  title: string;
  iconURL?: string;
  iconAction?: () => {};
  iconActionDetail?: string;
}

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  const [hovering, setHoverText] = useState(props.title);

  return (
    <div className={styles["main__container"]}>
      <div className={styles["inner__container"]}>
        <img src="/logos/novusys-logo.png" alt="" />
        <div className={styles["title__container"]}>
          {props.iconAction ? (
            <button
              onClick={props.iconAction}
              onMouseEnter={() => setHoverText(props.iconActionDetail || "")}
              onMouseLeave={() => setHoverText(props.title)}
              className={styles["button"]}
            >
              <div className={styles["title"]}>{hovering}</div>
              <img className={styles["icon"]} src={props.iconURL} alt="" />
            </button>
          ) : (
            <>
              <img className={styles["icon__normal"]} src={props.iconURL} alt="" />
              <div className={styles["title"]}>{props.title}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
