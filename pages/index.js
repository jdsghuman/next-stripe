import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";

const CheckoutForm = ({ setStatus }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (elements === null) return;
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (!error) {
      const { id } = paymentMethod;
      try {
        const response = await axios.post("/api/payment", { id, amount: 1099 });
        console.log("response in component", response);
        setStatus("success");
      } catch (error) {
        setStatus("Something went wrong. Please try again");
      }
    }
  };

  return (
    <form
      style={{ maxWidth: "400px", margin: "0 auto" }}
      onSubmit={handleSubmit}
    >
      <div
        style={{ display: "flex", justifyContent: "center", margin: "20px" }}
      >
        <h2></h2>
        <img
          style={{ width: "300px", height: "auto", margin: "0 auto" }}
          src="https://images.unsplash.com/photo-1541167760496-1628856ab772?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2900&q=80"
        />
      </div>
      <CardElement />
      <button type="submit" disabled={!stripe || !elements}>
        Pay
      </button>
    </form>
  );
};

const stripeProme = loadStripe(
  "pk_test_51IyTvuFZDO5hciT2zejiYSkheK3Nb3oYzjE9KWZYkJbtRWI2ls3YLqoLJAK4xMqi60VUV9lFJZZ352CvCVRSEPao00WMNjNFkk"
);

const Home = () => {
  const [status, setStatus] = useState("");
  console.log("status", status);

  debugger;
  if (status === "success") {
    return <div>Thank you for your purchase!</div>;
  }

  if (status.includes("Something went wrong")) {
    return <div>Something went wrong</div>;
  }

  return (
    <Elements stripe={stripeProme}>
      <CheckoutForm setStatus={setStatus} />
    </Elements>
  );
};

export default Home;
