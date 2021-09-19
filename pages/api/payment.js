import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export default async (req, res) => {
  const { id, amount } = req.body;

  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "USD",
      description: "Coffee",
      payment_method: id,
      confirm: true,
    });
    console.log("payment", payment);
    return res.status(200).json({
      confirm: payment.status,
    });
  } catch (error) {
    console.log("error in server", error);
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
};
