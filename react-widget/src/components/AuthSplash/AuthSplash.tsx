import React, { useContext } from "react";
import styles from "./AuthSplash.module.scss";
import Header from "../Header/Header";

interface AuthSplashProps {}

const AuthSplash: React.FC<AuthSplashProps> = (props: AuthSplashProps) => {
  return (
    <div className={styles["main__container"]}>
      <Header title="Smart Account" />
      <div className={styles["inner__container"]}>
        <div className={styles["txn__title"]}>Transaction Title</div>
        <div className={styles["detail__container"]}>
          <div className={styles["detail__title"]}>Smart Contract Address:</div>
          <div className={styles["detail__input"]}>input</div>
        </div>
        <div className={styles["detail__container"]}>
          <div className={styles["detail__title"]}>Function Call:</div>
          <div className={styles["detail__input"]}>input</div>
        </div>
        <div className={styles["detail__container"]}>
          <div className={styles["detail__title"]}>Subtotal:</div>
          <div className={styles["detail__input"]}>input</div>
        </div>
        <div className={styles["detail__container"]}>
          <div className={styles["detail__title"]}>Estimated Cost:</div>
          <div className={styles["detail__input"]}>input</div>
        </div>
      </div>
      <div className={styles["button__container"]}>
        <button className={styles["login__button"]}>Login to Account</button>
      </div>
    </div>
  );
};

export default AuthSplash;
