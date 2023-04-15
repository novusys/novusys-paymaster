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

  // Sig is generated in TxnPending
  const body = {
    cid: 5,
    target: props.address,
    value: ethers.utils.parseEther(props.total)._hex,
    data: "0x",
    provider: "https://node.stackup.sh/v1/rpc/9bf24b7d46a1e044c3244088dfe8dee6c87bb2399278bbb3c3f9935c00451f4e",
    epAddr: "0x0576a174D229E3cFA37253523E645A78A0C91B57",
    factoryAddr: "0x2bC52aEd814Ee695c9FD7B7EB4F8B9821E710ceF",
    withPm: true,
  };

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
      //   let options = {
      //     amount: total.toString(),
      //     symbol: symbol,
      //     convert: "USD",
      //   };
      //   let queryString = new URLSearchParams(options).toString();
      //   const res = axios.get(`https://pro-api.coinmarketcap.com/v2/tools/price-conversion?${queryString}`, {
      //     headers: { Accept: "text/plain", "X-CMC_PRO_API_KEY": process.env.COINMARKET },
      //   });
      //   return res;
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
            setUSDTotal("25");
            // getUSDConversion(total, props.chain)
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
      return <TxnPending body={body} method="Stripe Transaction" />;
    } else if (page == "txn_pending_erc20") {
      return <TxnPending body={body} method="ERC-20 Transaction" />;
    } else if (page == "receipt_stripe") {
      return <Receipt method="Stripe Transaction" receipt={{}} {...props} />;
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
                <div className={styles["detail__input"]}>...</div>
              </div>
            </div>
          </div>
          <div className={styles["button__container"]}>
            {user ? (
              <div className={styles["payment__container"]}>
                <button
                  onClick={() => {
                    setPage("txn_pending_stripe");
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
