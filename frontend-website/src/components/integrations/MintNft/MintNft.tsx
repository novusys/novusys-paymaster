import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "./MintNft.module.scss";
import DarkMode from "@material-design-icons/svg/outlined/dark_mode.svg";
import LightMode from "@material-design-icons/svg/outlined/light_mode.svg";
import { useEffect, useState } from "react";
import Widget from "@/components/Widget/Widget/Widget";
import { ethers } from "ethers";

const MintNft: React.FC = () => {
  const address = "0xc0f70D98eC6aD9767d49341dB57674F1E2305B87";

  const body = {
    cid: 5,
    target: address,
    value: ethers.utils.parseEther("0.01")._hex,
    data: "0x",
    provider: "https://node.stackup.sh/v1/rpc/9bf24b7d46a1e044c3244088dfe8dee6c87bb2399278bbb3c3f9935c00451f4e",
    epAddr: "0x0576a174D229E3cFA37253523E645A78A0C91B57",
    factoryAddr: "0x2bC52aEd814Ee695c9FD7B7EB4F8B9821E710ceF",
    withPm: true,
  };
  return (
    <div className={styles["out__container"]}>
      <div className={styles["integration__setup"]}>
        <div className={styles["integration__title"]}>Mint Nft</div>
        <div className={styles["integration__description"]}>Mint your unique blob art designed at ETHGlobal San francisco!</div>
        <div className={styles["integration__price"]}>Price: 0.01 ETH</div>

        <div className={styles["integration__image"]}>
          <img src="/logos/exchanges/mint.png" />
        </div>
      </div>
      <div className={styles["wallet__widget"]}>
        <Widget req={body} address={address} function="mint" total="0.01" chain="ETH" />
      </div>
    </div>
  );
};

export default MintNft;
