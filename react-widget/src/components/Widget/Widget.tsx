import React, { useContext, createContext, useState, useEffect } from "react";
import styles from "./Widget.module.scss";
import AuthSplash from "../AuthSplash/AuthSplash";

interface WidgetProps {}

const PageCtx = createContext({ page: "auth", setPage: (state: string) => {} });

const Widget: React.FC<WidgetProps> = (props: WidgetProps) => {
  const [page, setPage] = useState("auth");

  const renderPage = () => {
    switch (page) {
      case "auth":
        return <AuthSplash />;

      default:
        return <div>hello world</div>;
    }
  };

  return (
    <PageCtx.Provider value={{ page, setPage }}>
      <div className={styles["main__container"]}>{renderPage()}</div>
    </PageCtx.Provider>
  );
};

export { PageCtx };
export default Widget;
