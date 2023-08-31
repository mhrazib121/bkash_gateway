import { useBkash } from "react-bkash";
import "./App.css";

function App() {
  const { error, loading, triggerBkash } = useBkash({
    onSuccess: (data) => {
      console.log(data); // this contains data from api response from onExecutePayment
    },
    onClose: () => {
      console.log("Bkash iFrame closed");
    },
    bkashScriptURL:
      "https://scripts.sandbox.bka.sh/versions/1.2.0-beta/checkout/bKash-checkout-sandbox.js", // https://scripts.sandbox.bka.sh/versions/1.2.0-beta/checkout/bKash-checkout-sandbox.js
    amount: 1,
    onCreatePayment: async (paymentRequest) => {
      // call your API with the payment request here
      return await fetch("http://localhost:5001/orders", {
        method: "POST",
        body: JSON.stringify(paymentRequest),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("on creatate payment", data);
          return { ...data };
        });
    },
    onExecutePayment: async (paymentID) => {
      // call your executePayment API here
      return await fetch(`http://localhost:5001/execute/${paymentID}`, {
        method: "POST",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("on execute", data);
          return { ...data };
        });

      // it doesn't matter what you return here, any errors thrown here will be available on error return value of the useBkash hook
    },
  });
  if (loading) {
    return <h1>loading</h1>;
  }

  if (error) {
    return <h1>{error.message}</h1>;
  }
  return (
    <div>
      <button onClick={triggerBkash}>Pay with bKash</button>
    </div>
  );
}

export default App;
