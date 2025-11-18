import { createPaymentSession } from "./paymentController.js";
import Order from "../models/order.js";
import User from "../models/user.js";
import { authorizeRoles } from "../middlewares/authMiddleware.js";

export const createOrder = async (req, res) => {
  try {
    const { userId, items, totalAmount, paymentMethod, shippingAddress } =
      req.body;
    if (userId !== req.user._id.toString()) {
      return res
        .status(400)
        .json({
          sucess: false,
          message: "you are not Authorized for this service",
        });
    }
    const order = new Order({
      user: userId,
      items: items,
      totalAmount: totalAmount,
      paymentStatus: "pending",
      paymentMethod: paymentMethod,
    });
    await order.save();
    const sessionUrl = await createPaymentSession(order, items);
    order.shippingAddress = shippingAddress;
    return res.status(200).json({
      success: true,
      message:
        "Order Created SuccessFully.Complete the Payment for confirmation",
      sessionUrl,
      order,
    });
  } catch (error) {
    console.log("Failed to create order");
    return res.status(500).json({ success: false, message: "server-Error" });
  }
};
export const orderDetail = async (req, res) => {
  const { orderId } = req.params;
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user || !authorizeRoles(user.role)) {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden to view these details" });
    }
    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Successfully fetched the order details",
      order: {
        ...order._doc,
      },
    });
  } catch (error) {
    console.error("Error retrieving order details:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const userOrderhistory = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById({ user: userId });
    if (!user || userId.toString() !== req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "failed!" });
    }
    const userOrder = await Order.find({ user: userId });
    return res.status(200).json({
      message: "successfully fetched Data",
      success: true,
      order: userOrder,
    });
  } catch (error) {
    console.log("Error while fetched data");
    res.satus(500).json({ success: false, message: "Server-Error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { userId, status } = req.body;
  const { orderId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return res
        .status(400)
        .json({ success: false, message: "you are not allowed for this Task" });
    }
    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, messsgae: "order not found" });
    }
    order.orderStatus = status;
    await order.save();
    return res.status(200).json({
      success: true,
      message: "Status updated sucessFully",
      order: {
        ...order._doc,
        user: undefined,
      },
    });
  } catch (error) {
    console.log("Failed to update the status!");
    res.status(500).json({ success: false, message: "server-Error" });
  }
};

export const cancelOrder = async (req, res) => {
  const { userId } = req.body;
  const { orderId } = req.params;
  try {
    const user = await User.findById(userId);
    const order = await Order.findById(orderId);
    if (!user || userId.toString() !== req.user._id.toString()) {
      return res
        .status(400)
        .json({
          sucess: false,
          message: "User not found or you Are not Authorized",
        });
    } else if (
      userId.toString() !== req.user._id.toString() &&
      !authorizeRoles(user.role)
    ) {
      return res
        .status(403)
        .json({ sucess: false, message: "Forbiden to do this" });
    }
    order.OrderStatus = "failed";
    order.save();
    return res.status(200).json({
      success: true,
      message: "order is Cancelled",
      order: {
        ...order._doc,
        user: undefined,
      },
    });
  } catch (error) {
    console.log("Failed to Cancel the order!");
    res.status(500).json({ success: false, message: "server-Error" });
  }
};
