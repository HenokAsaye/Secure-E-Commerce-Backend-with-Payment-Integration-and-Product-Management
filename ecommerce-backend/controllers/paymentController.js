import { stripe } from "../config/stripe.js";
import dotenv from "dotenv";
import Payment from "../models/payment.js";
import Order from "../models/order.js";
import { logger } from "../config/logger.js";
dotenv.config();

export const createPaymentSession = async (order, items) => {
  try {
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product?.Name || "Product",
          ...(item.description ? { description: item.description } : {}),
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/checkout`,
      metadata: {
        orderId: order._id.toString(),
        userId: order.user.toString(),
      },
      shipping_address_collection: {
        allowed_countries: ["US", "ET", "BR"],
      },
    });

    logger.info(`Payment session created for order ${order._id}`);
    return session.url;
  } catch (error) {
    logger.error("Error creating checkout session:", error);
    throw new Error("Failed to create Payment Session");
  }
};

export const savePayment = async (req, res) => {
  const {
    orderId,
    userId,
    amount,
    paymentMethod,
    transactionId,
    shippingAddress,
  } = req.body;

  try {
    const payment = new Payment({
      order: orderId,
      user: userId,
      paymentMethod,
      Amount: amount,
      transactionId,
      status: "completed",
      shippingAddress,
    });

    await payment.save();
    await Order.findByIdAndUpdate(orderId, { paymentStatus: "paid" });

    logger.info(`Payment saved for order ${orderId}`);
    res.status(200).json({
      success: true,
      message: "Payment recorded successfully",
      payment,
    });
  } catch (error) {
    logger.error("Error saving payment:", error);
    res.status(500).json({ success: false, message: "Failed to save payment" });
  }
};

export const handleWebhooks = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const payload = req.body;

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.metadata.orderId;

      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "paid",
        orderStatus: "processing",
      });

      const payment = new Payment({
        order: orderId,
        user: session.metadata.userId,
        status: "completed",
        transactionId: session.payment_intent,
        Amount: session.amount_total / 100,
        paymentMethod: "stripe",
      });

      await payment.save();
      logger.info(`Payment completed for order ${orderId}`);
    }

    return res.status(200).json({ success: true, received: true });
  } catch (error) {
    logger.error("Webhook error:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};
