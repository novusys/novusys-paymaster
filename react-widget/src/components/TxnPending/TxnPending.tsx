import React, { useContext, useState, useEffect } from "react";
import styles from "./TxnPending.module.scss";
import { PageCtx } from "../Widget/Widget";
import { UserCtx } from "../AuthSplash/AuthSplash";
import Header from "../Header/Header";
import { useAAInterface } from "@/api/aaInterface";
import { ethers } from "ethers";
import { useConfig } from "@/api/config";

interface TxnPendingProps {
  body: any;
  method: string;
}
const TxnPending: React.FC<TxnPendingProps> = (props: TxnPendingProps) => {
  const { page, setPage } = useContext(PageCtx);
  const { currUser, setCurrUser } = useContext(UserCtx);
  const [confirmed, setConfirmed] = useState(false);
  const [status, setStatus] = useState("pending");
  const [transaction, setTransaction] = useState({});
  const [txnHash, setHash] = useState("...");
  const cid = props.body.cid;

  const { sendTxn, waitTransaction } = useAAInterface();
  const { chains } = useConfig();

  const handleReceipt = () => {
    if (page == "txn_pending_stripe") {
      setPage("receipt_stripe");
    } else {
      setPage("receipt_erc20");
    }
  };

  const txn = () => {
    console.log("Sending txn ", props.body);
    sendTxn(
      //@ts-ignore
      currUser.sub,
      props.body.target != undefined ? props.body.target : "0x6d06Eb861809551087F5b37272f36ceF459C5338",
      props.body.value,
      props.body.data,
      chains[cid].bundler,
      chains[cid].entryPoint,
      chains[cid].factory,
      cid,
      setStatus,
      (tx: string) => {
        console.log("TRANSACTION RECEIVED ", tx);
        if (tx != null) {
          setTransaction(tx);
          waitTransaction(tx, new ethers.providers.JsonRpcProvider(chains[cid].bundler), (r: any) => {
            if (r) {
              setStatus("success");
              // approveSigs();
            } else {
              setStatus("fail");
            }
          });
          setStatus("launching");
        }
      },
      new ethers.providers.JsonRpcProvider(chains[cid].bundler),
      true,
      chains[cid].paymasterAddress
    )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log("sendTxn err: ", err);
      });
  };

  useEffect(() => {
    txn();
  }, []);

  useEffect(() => {
    console.log("Status change ", status);
  }, [status]);

  const renderPage = () => {
    return (
      <div className={styles["main__container"]}>
        <Header title={props.method} />
        <div className={styles["txn__title"]}>Transaction Pending</div>
        <div className={styles["txn__subtitle"]}>Transaction Hash: {txnHash}</div>
        <div className={styles["txn__loader"]}>Loading...</div>
        {!confirmed && (
          <button onClick={() => handleReceipt()} className={styles["action__button"]}>
            View Receipt
          </button>
        )}
      </div>
    );
  };

  return renderPage();
};

export default TxnPending;
