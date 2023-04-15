import React, { useContext } from "react";
import styles from "./Temp.module.scss";
import { PageCtx } from "../Widget/Widget";

interface TempProps {}

const Temp: React.FC<TempProps> = (props: TempProps) => {
  const { page, setPage } = useContext(PageCtx);

  const renderPage = () => {
    return <div className={styles["main__container"]}></div>;
  };

  return renderPage();
};

export default Temp;
