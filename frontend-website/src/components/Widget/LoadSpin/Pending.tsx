import React, { useContext } from "react";
import styles from "./Pending.module.scss";

interface PendingProps {}

const Pending: React.FC<PendingProps> = (props: PendingProps) => {
  return <div className={styles["main__container"]}>Loading...</div>;
};

export default Pending;
