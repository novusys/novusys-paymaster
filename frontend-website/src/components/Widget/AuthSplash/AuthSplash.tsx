import React, { createContext, useContext, useState, useEffect } from "react";
import styles from "./AuthSplash.module.scss";
import Header from "../Header/Header";
import { useAuth0 } from "@auth0/auth0-react";
import { Alchemy, Network } from "alchemy-sdk";
import axios from "axios";
import { ethers } from "ethers";

import Pending from "../LoadSpin/Pending";
import TxnPending from "../TxnPending/TxnPending";
import StripeContainer from "../StripeContainer/StripeContainer";
import Receipt from "../Receipt/Receipt";
import { PageCtx } from "../Widget/Widget";

// const config = {
//   apiKey: process.env.ALCHEMY_API_KEY,
//   network: Network.ETH_MAINNET,
// };
// const alchemy = new Alchemy(config);

interface AuthSplashProps {
  req: any;
  address: string;
  function: string;
  total: string;
  chain: string;
}

const UserCtx = createContext({ currUser: {}, setCurrUser: (obj: object) => {} });

const AuthSplash: React.FC<AuthSplashProps> = (props: AuthSplashProps) => {
  const { user, isLoading, isAuthenticated, getAccessTokenWithPopup, getAccessTokenSilently, logout, loginWithPopup, error } =
    useAuth0();
  const { page, setPage } = useContext(PageCtx);
  const [currUser, setCurrUser] = useState({});
  const [gas, setGas] = useState("...");
  const [loginChange, setLoginChange] = useState(false);
  const [finalTotal, setTotal] = useState("...");
  const [usdTotal, setUSDTotal] = useState("...");
  const [usdConversion, setConversion] = useState(1);

  useEffect(() => {
    const fetchAccessToken = async () => {
      // Use getAccessTokenSilenty in production to avoid popup
      // Popup method necessary as localhost is not considered a first party app

      const res = await getAccessTokenWithPopup({
        authorizationParams: {
          audience: "https://dev-27jeufvx256r244q.us.auth0.com/api/v2/",
          scope: "openid",
        },
      });

      return res;
    };

    const getUSDConversion = async (total: any, symbol: string) => {
      try {
        const res = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
        if (res) {
          let data = res.data;
          if (data) {
            let price = data.ethereum.usd;
            setConversion(price);
            return price * total;
          }
        }
      } catch (error) {
        console.log(error);
      }

      return null;
    };

    if (user && isAuthenticated) {
      setCurrUser(user);
    }

    if (user && user != currUser) {
      console.log("Successful login: ", user);
      setCurrUser(user);
      try {
        // Get access token
        fetchAccessToken()
          .then((res) => {
            const token = res;

            // Calculate gas
            var gas_amount = 0.005;
            setGas(`+ ${gas_amount} ${props.chain}`);

            // Calculate total
            var subtotal_amount = parseFloat(props.total);
            var total = subtotal_amount + gas_amount;
            setTotal(`${total} ${props.chain}`);

            // Convert to USD
            getUSDConversion(total, props.chain).then((res) => {
              if (res) {
                setUSDTotal(res.toFixed(2));
              }
            });

            //   .then((res) => {
            //     console.log(res);
            //   })
            //   .catch((err) => console.log("USD Conversion Err: ", err));
          })
          .catch((err) => {
            console.log("Access token err: ", err);
          });
      } catch (error) {
        console.log("Parsing txn details err: ", error);
      }
    }
  }, [isAuthenticated]);

  if (error) {
    console.log("Error loading auth0: ", error);
  }

  const handleLogin = async () => {
    try {
      loginWithPopup();
      setLoginChange(!loginChange);
    } catch (error) {
      console.log("login err: ", error);
    }
  };

  const handleLogout = async () => {
    try {
      logout();
    } catch (error) {
      console.log("logout err: ", error);
    }
  };

  const renderHeader = () => {
    if (user) {
      return (
        <Header
          title={user.nickname || "Account"}
          iconURL={user.picture || "/assets/defaultaccount.png"}
          iconAction={handleLogout}
          iconActionDetail="logout"
        />
      );
    } else {
      return <Header title="Smart Account" />;
    }
  };

  const renderPage = () => {
    console.log("PAGE: ", page);
    if (isLoading) {
      return <Pending />;
    } else if (page == "stripe") {
      return <StripeContainer title="Pay with Stripe" amount={usdTotal} user={user} />;
    } else if (page == "txn_pending_stripe") {
      return <TxnPending {...props} body={props.req} method="Stripe Transaction" usdPrice={usdConversion} />;
    } else if (page == "txn_pending_erc20") {
      return <TxnPending {...props} body={props.req} method="ERC-20 Transaction" usdPrice={usdConversion} />;
    } else {
      return (
        <div className={styles["main__container"]}>
          {renderHeader()}
          <div className={styles["inner__container"]}>
            <div className={styles["txn__title"]}>Transaction Title</div>
            <div className={styles["detail__container"]}>
              <div className={styles["detail__title"]}>Contract Address:</div>
              <div className={styles["detail__input"]}>
                {props.address.slice(0, 6) + "..." + props.address.slice(props.address.length - 5)}
              </div>
            </div>
            <div className={styles["detail__container"]}>
              <div className={styles["detail__title"]}>Function Call:</div>
              <div className={styles["detail__input"]}>{props.function}</div>
            </div>

            <div className={styles["cost__container"]}>
              <div className={styles["inner__cost__container"]}>
                <div className={styles["detail__title"]}>Subtotal:</div>
                <div className={styles["detail__input"]}>{props.total + " " + props.chain}</div>
              </div>
              <div className={styles["inner__cost__container"]}>
                <div className={styles["detail__title"]}>Estimated Gas:</div>
                <div className={styles["detail__input"]}>{gas}</div>
              </div>

              <div className={styles["cost__spacer"]}>
                <div>━━━━━━</div>
              </div>

              <div className={styles["inner__cost__container"]}>
                <div className={styles["detail__title"]}>{`Estimated Cost (${props.chain}):`}</div>
                <div className={styles["detail__input"]}>{finalTotal}</div>
              </div>

              <div className={styles["inner__cost__container"]}>
                <div className={styles["detail__title"]}>{"Estimated Cost (USD):"}</div>
                <div className={styles["detail__input"]}>{`~$${usdTotal}`}</div>
              </div>
            </div>
          </div>
          <div className={styles["button__container"]}>
            {user ? (
              <div className={styles["payment__container"]}>
                <button
                  onClick={() => {
                    setPage("stripe");
                  }}
                  className={styles["payment__button"]}
                >
                  <img className={styles["icon"]} src="/assets/card.png" alt="" />
                  <div className={styles["button__title"]}>Credit Card</div>
                </button>

                <button
                  onClick={() => {
                    setPage("erc20");
                  }}
                  className={styles["payment__button"]}
                >
                  <img className={styles["icon"]} src="/assets/token.png" alt="" />
                  <div className={styles["button__title"]}>ERC-20</div>
                </button>
              </div>
            ) : (
              <button onClick={() => handleLogin()} className={styles["action__button"]}>
                Login to Account
              </button>
            )}
          </div>
        </div>
      );
    }
  };

  return <UserCtx.Provider value={{ currUser, setCurrUser }}>{renderPage()}</UserCtx.Provider>;
};

export { UserCtx };
export default AuthSplash;
