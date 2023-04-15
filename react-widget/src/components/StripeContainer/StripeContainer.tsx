import React, { useContext, useEffect, useState } from "react";
import styles from "./StripeContainer.module.scss";
import { PageCtx } from "../Widget/Widget";
import Header from "../Header/Header";
import StripeForm from "../StripeForm/StripeForm";
import { PaymentElement, LinkAuthenticationElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// @ts-ignore
const stripePromise = loadStripe(`${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`);

interface StripeContainerProps {
  title: string;
  amount: any;
  user: any;
}

const StripeContainer: React.FC<StripeContainerProps> = (props: StripeContainerProps) => {
  const { page, setPage } = useContext(PageCtx);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntent, setPaymentIntent] = useState("");

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("api/stripe_intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: parseInt(props.amount) * 100,
        payment_intent_id: "",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("DATA ", data);
        setClientSecret(data.client_secret), setPaymentIntent(data.id);
      });
  }, []);

  const options = {
    clientSecret,
  };

  const renderPage = () => {
    return (
      <div className={styles["main__container"]}>
        <Header title={"Credit Card"} iconURL={"/assets/card.png"} />
        <div className={styles["inner__container"]}>
          <div className={styles["txn__title"]}>{props.title}</div>

          {clientSecret && (
            <Elements stripe={stripePromise} options={options}>
              <StripeForm paymentIntent={paymentIntent} user={props.user} amount={props.amount} />
            </Elements>
          )}
        </div>
      </div>
    );
  };

  return renderPage();
};

export default StripeContainer;
