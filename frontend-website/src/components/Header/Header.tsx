import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "./Header.module.scss";
import ButtonOutline from "../ButtonOutline/ButtonOutline";
import DarkMode from "@material-design-icons/svg/outlined/dark_mode.svg";
import { useUser } from "@auth0/nextjs-auth0/client";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { useAAInterface } from "@/api/aaInterface";
import { ethers } from "ethers";

export default function Header() {
  console.log(ethers.utils.parseEther("0.01")._hex);
  const { sendTxn } = useAAInterface();
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  console.log("user", user);
  return (
    <div className={styles["out__container"]}>
      <div className={styles["left__container"]}>
        <div className={styles["logo__container"]}>
          <img src="./logos/novusys-logo.png" />
        </div>
        <div className={styles["pages__container"]}>
          <div>About</div>
          <div>Docs</div>
        </div>
      </div>
      
        
    </div>
  );
}
