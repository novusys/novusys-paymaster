import React, { useContext, createContext, useState, useEffect } from "react";
import styles from "./Widget.module.scss";
import { Auth0Provider } from "@auth0/auth0-react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import AuthSplash from "../AuthSplash/AuthSplash";

interface WidgetProps {
  address: string;
  function: string;
  total: string;
  chain: string;
}

const PageCtx = createContext({ page: "auth", setPage: (state: string) => {} });

const Widget: React.FC<WidgetProps> = (props: WidgetProps) => {
  const [page, setPage] = useState("auth");

  const renderPage = () => {
    return <AuthSplash {...props} />;
  };
  return (
    <Auth0Provider
      domain="dev-27jeufvx256r244q.us.auth0.com"
      clientId="wNheV0owDeWeWr3KViFVQ9dGPqCilm7M"
      authorizationParams={{
        redirect_uri: "http://localhost:3000/",
      }}
    >
      <PageCtx.Provider value={{ page, setPage }}>
        <div className={styles["main__container"]}>{renderPage()}</div>
      </PageCtx.Provider>
    </Auth0Provider>
  );
};

export { PageCtx };
export default Widget;
