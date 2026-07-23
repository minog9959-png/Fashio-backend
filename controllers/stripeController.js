import Stripe from "stripe";
import Order from "../models/Order.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const { orderId } = req.body;

    // Find order
    const order = await Order.findById(orderId).populate("items.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Create Stripe line items
    const lineItems = order.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.title,
        },
        unit_amount: Math.round(item.product.price * 100),
      },
      quantity: item.quantity,
    }));

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: lineItems,

      mode: "payment",

      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${process.env.CLIENT_URL}/payment-failed`,

      metadata: {
        orderId: order._id.toString(),
      },
    });

    // Save Stripe session ID in order
    order.stripeSessionId = session.id;

    await order.save();

    res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.log("Stripe Error:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// verify payment
export const verifyPayment = async (req, res) => {
  try {
    const { sessionId } = req.body;

    // Stripe se Checkout Session nikalo
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Order ID metadata se milegi
    const orderId = session.metadata.orderId;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Payment check
    if (session.payment_status === "paid") {
      order.paymentStatus = "Paid";
      order.status = "Processing";

      await order.save();

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        order,
      });
    }

    // Payment paid nahi hui
    order.paymentStatus = "Failed";

    await order.save();

    return res.status(400).json({
      success: false,
      message: "Payment not completed",
    });

  } catch (error) {
    console.log("Payment Verification Error:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};