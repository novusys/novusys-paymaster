import React, { useContext, useEffect, useState } from "react";
import styles from "./Receipt.module.scss";
import { PageCtx } from "../Widget/Widget";
import Header from "../Header/Header";
import axios from "axios";

interface ReceiptProps {
  method: string;
  address: string;
  function: string;
  total: string;
  chain: string;
  gas: string;
  hash: string;
  usdPrice: number;
}

const Receipt: React.FC<ReceiptProps> = (props: ReceiptProps) => {
  const { page, setPage } = useContext(PageCtx);
  const [usdTotal, setUSDTotal] = useState("...");

  useEffect(() => {
    setUSDTotal(((parseFloat(props.gas) + parseFloat(props.total)) * props.usdPrice).toFixed(2));
  }, []);

  const renderPage = () => {
    return (
      <div className={styles["main__container"]}>
        <Header title={props.method} />
        <div className={styles["inner__container"]}>
          <div className={styles["txn__title"]}>Receipt</div>
          <div className={styles["detail__container"]}>
            <div className={styles["detail__title"]}>{"Contract Address:"}</div>
            <div className={styles["detail__input"]}>
              {props.address.slice(0, 6) + "..." + props.address.slice(props.address.length - 4)}
            </div>
          </div>
          <div className={styles["detail__container"]}>
            <div className={styles["detail__title"]}>{"Function Call:"}</div>
            <div className={styles["detail__input"]}>{props.function}</div>
          </div>
          <div className={styles["detail__container"]}>
            <div className={styles["detail__title"]}>{"Transaction Hash:"}</div>
            <div className={styles["detail__input"]}>{props.hash.slice(0, 6) + "..." + props.hash.slice(props.hash.length - 4)}</div>
          </div>

          <div className={styles["cost__container"]}>
            <div className={styles["inner__cost__container"]}>
              <div className={styles["detail__title"]}>{"Subtotal:"}</div>
              <div className={styles["detail__input"]}>{props.total + " " + props.chain}</div>
            </div>
            <div className={styles["inner__cost__container"]}>
              <div className={styles["detail__title"]}>{"Gas Spent:"}</div>
              <div className={styles["detail__input"]}>{props.gas.slice(0, 6)} ETH</div>
            </div>

            <div className={styles["cost__spacer"]}>
              <div>━━━━━━</div>
            </div>

            <div className={styles["inner__cost__container"]}>
              <div className={styles["detail__title"]}>{`Total Cost (${props.chain}):`}</div>
              <div className={styles["detail__input"]}>
                {(parseFloat(props.gas) + parseFloat(props.total)).toString().slice(0, 6)} ETH
              </div>
            </div>

            <div className={styles["inner__cost__container"]}>
              <div className={styles["detail__title"]}>{"Total Cost (USD):"}</div>
              <div className={styles["detail__input"]}>{`~$${usdTotal}`}</div>
            </div>

            {/* Card info if Stripe else ERC-20 token  */}
            <div className={styles["inner__cost__container"]}>
              <div className={styles["detail__title"]}>{"Paid for with:"}</div>
              <div className={styles["detail__input"]}>...</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return renderPage();
};

export default Receipt;
