import React, { useContext } from "react";
import styles from "./Receipt.module.scss";
import { PageCtx } from "../Widget/Widget";
import Header from "../Header/Header";

interface ReceiptProps {
  method: string;
  address: string;
  function: string;
  total: string;
  chain: string;
  receipt: any;
}

const Receipt: React.FC<ReceiptProps> = (props: ReceiptProps) => {
  const { page, setPage } = useContext(PageCtx);

  const gas = "...";
  const finalTotal = "...";
  const txnHash = "...";

  const renderPage = () => {
    return (
      <div className={styles["main__container"]}>
        <Header title={props.method} />
        <div className={styles["inner__container"]}>
          <div className={styles["txn__title"]}>Receipt</div>
          <div className={styles["detail__container"]}>
            <div className={styles["detail__title"]}>{"Contract Address:"}</div>
            <div className={styles["detail__input"]}>
              {props.address.slice(0, 6) + "..." + props.address.slice(props.address.length - 5)}
            </div>
          </div>
          <div className={styles["detail__container"]}>
            <div className={styles["detail__title"]}>{"Function Call:"}</div>
            <div className={styles["detail__input"]}>{props.function}</div>
          </div>
          <div className={styles["detail__container"]}>
            <div className={styles["detail__title"]}>{"Transaction Hash:"}</div>
            <div className={styles["detail__input"]}>{txnHash}</div>
          </div>

          <div className={styles["cost__container"]}>
            <div className={styles["inner__cost__container"]}>
              <div className={styles["detail__title"]}>{"Subtotal:"}</div>
              <div className={styles["detail__input"]}>{props.total + " " + props.chain}</div>
            </div>
            <div className={styles["inner__cost__container"]}>
              <div className={styles["detail__title"]}>{"Gas Spent:"}</div>
              <div className={styles["detail__input"]}>{gas}</div>
            </div>

            <div className={styles["cost__spacer"]}>
              <div>━━━━━━</div>
            </div>

            <div className={styles["inner__cost__container"]}>
              <div className={styles["detail__title"]}>{`Total Cost (${props.chain}):`}</div>
              <div className={styles["detail__input"]}>{finalTotal}</div>
            </div>

            <div className={styles["inner__cost__container"]}>
              <div className={styles["detail__title"]}>{"Total Cost (USD):"}</div>
              <div className={styles["detail__input"]}>...</div>
            </div>

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
