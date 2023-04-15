import React, { useContext, useState, useEffect } from "react";
import styles from "./StripeForm.module.scss";
import { PageCtx } from "../Widget/Widget";

import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

interface StripeFormProps {
  paymentIntent: any;
  user: any;
  amount: any;
}

const StripeForm: React.FC<StripeFormProps> = (props: StripeFormProps) => {
  const { page, setPage } = useContext(PageCtx);
  const [email, setEmail] = useState("");
  const [locAmount, setLocAmount] = useState("300");
  const [message, setMessage] = useState(`Pay Now  $${props.amount}`);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (!stripe) {
      return;
    }

    //Grab the client secret from url params
    const clientSecret = new URLSearchParams(window.location.search).get("payment_intent_client_secret");

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      console.log("Intent ", paymentIntent);
      // @ts-ignore
      console.log("STATUS ", paymentIntent.status);
      // @ts-ignore
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment Success!");
          setStatus("success");
          break;
        case "processing":
          setMessage("Payment Processing...");
          setStatus("processing");
          break;
        case "requires_payment_method":
          setMessage("Payment Failed");
          setStatus("error");
          break;
        default:
          setMessage("Something went wrong.");
          setStatus("unknown error");
          break;
      }
    });
  }, [stripe]);

  // For changing amount purposes
  const handleAmount = async (amount: any) => {
    setLocAmount(amount);
    fetch("api/stripe_intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: amount * 100,
        payment_intent_id: props.paymentIntent.paymentIntent,
      }),
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!stripe || !elements) {
      console.log("Stripe not loaded");
      // Stripe.js has not yet loaded.
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/",
        receipt_email: props.user.email,
        payment_method_data: {
          billing_details: {
            name: "Billing user",
          },
        },
      },
      redirect: "if_required",
    });

    console.log("ERROR OUTPUT ", error);

    if (error) {
      console.log(error);
      setMessage(error.message || "Error with card validation");
      return;
    }

    setIsProcessing(false);

    setPage("txn_pending_stripe");
  };

  const renderPage = () => {
    return status == "success" ? (
      <div>Payment Suceeded</div>
    ) : (
      <form id="payment-form" className={styles["form__wrapper"]} onSubmit={handleSubmit}>
        <PaymentElement id="payment-element" />
        {stripe && elements && (
          <button className={styles["action__button"]} disabled={isProcessing || !stripe || !elements} id="submit">
            {isProcessing ? "Processing Payment..." : `Pay Now $${props.amount}`}
          </button>
        )}
      </form>
    );
  };

  return renderPage();
};

export default StripeForm;
