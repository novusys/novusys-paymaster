import React, { useContext, useState, useEffect } from "react";
import styles from "./TxnPending.module.scss";
import { PageCtx } from "../Widget/Widget";
import { UserCtx } from "../AuthSplash/AuthSplash";
import Header from "../Header/Header";
import { useAAInterface } from "@/api/aaInterface";
import { ethers } from "ethers";
import { useConfig } from "@/api/config";
import Receipt from "../Receipt/Receipt";
import Pending from "../LoadSpin/Pending";

interface TxnPendingProps {
  address: string;
  function: string;
  total: string;
  chain: string;
  body: any;
  method: string;
  usdPrice: number;
}
const TxnPending: React.FC<TxnPendingProps> = (props: TxnPendingProps) => {
  const { page, setPage } = useContext(PageCtx);
  const { currUser, setCurrUser } = useContext(UserCtx);
  const [statusTitle, setTitle] = useState("Transaction Pending");
  const [status, setStatus] = useState("pending");
  const [showLoading, setShowLoading] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [gasFee, setGasFee] = useState("...");
  const [txnHash, setHash] = useState("...");
  const cid = props.body.cid;

  const { sendTxn, waitTransaction } = useAAInterface();
  const { chains } = useConfig();

  const handleReceipt = async () => {
    setShowLoading(true);
    const receipt = await provider.getTransactionReceipt(txnHash);
    const txn = await provider.getTransaction(txnHash);
    console.log("RECEIPT ", receipt);
    console.log("TXN ", txn);
    if (receipt) {
      let gasUsed = BigInt(receipt.gasUsed._hex).toString();
      // @ts-ignore
      let gasPrice = BigInt(txn.gasPrice._hex).toString();
      let fee = (parseFloat(gasUsed) * parseFloat(gasPrice)) / 10 ** 18;
      console.log("Gas Used: ", gasUsed);
      console.log("Gas Price: ", gasPrice);
      console.log("Fee: ", fee);
      setGasFee(fee.toString());
      setShowLoading(false);
      setShowReceipt(true);
    }
  };

  const provider = new ethers.providers.JsonRpcProvider(chains[cid].bundler);

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
          setHash(tx);
          waitTransaction(tx, provider, (r: any) => {
            if (r) {
              setStatus("success");
              setTitle("Transaction Confirmed");
              // approveSigs();
            } else {
              setStatus("fail");
              setTitle("Transaction Failed");
            }
          });
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
    if (showLoading) {
      return <Pending />;
    } else if (showReceipt) {
      return <Receipt {...props} gas={gasFee} hash={txnHash} usdPrice={props.usdPrice} />;
    } else {
      return (
        <div className={styles["main__container"]}>
          <Header title={props.method} />
          <div className={styles["txn__title"]}>{statusTitle}</div>
          <div className={styles["txn__subtitle"]}>
            Transaction Hash: {txnHash.slice(0, 6) + "..." + txnHash.slice(txnHash.length - 4)}
          </div>
          <div className={styles["txn__loader"]}>Loading...</div>
          {status == "success" && (
            <button onClick={() => handleReceipt()} className={styles["action__button"]}>
              View Receipt
            </button>
          )}
        </div>
      );
    }
  };

  return renderPage();
};

export default TxnPending;
