import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});
const handler = async (req, res) => {
  const { amount, payment_intent_id } = req.body;
  if (payment_intent_id) {
    try {
      const current_intent = await stripe.paymentIntents.retrieve(payment_intent_id);

      if (current_intent) {
        const updated_intent = await stripe.paymentIntents.update(payment_intent_id, {
          amount: amount,
        });
        res.status(200).json(updated_intent);
        return;
      }
    } catch (e) {
      if (e.code !== "resource_missing") {
        const errorMessage = e instanceof Error ? e.message : "Internal server error";
        res.status(500).json({ statusCode: 500, message: errorMessage });
        return;
      }
    }
  }
  try {
    // Create PaymentIntent
    const params = {
      amount: amount,
      currency: "usd",
      description: "Payment description",
      payment_method_types: ["card"],
    };
    const payment_intent = await stripe.paymentIntents.create(params);
    res.status(200).json(payment_intent);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({ statusCode: 500, message: errorMessage });
  }
};
export default handler;
