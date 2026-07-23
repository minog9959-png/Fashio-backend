import PDFDocument from "pdfkit";
import Order from "../models/Order.js";

export const generateInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find Order from database
    const order = await Order.findById(orderId)
      .populate("user")
      .populate("items.product");

    // if order not found
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // PDF document create
    const doc = new PDFDocument();

    // Browser ko batao ke PDF file aa rahi hai
    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${order._id}.pdf`
    );

    // PDF connect with response
    doc.pipe(res);

    // -------------------------
    // Invoice Header
    // -------------------------

    doc
      .fontSize(24)
      .text("FASHIO", { align: "center" });

    doc
      .moveDown()
      .fontSize(20)
      .text("INVOICE", { align: "center" });

    doc.moveDown();

    // -------------------------
    // Order Information
    // -------------------------

    doc
      .fontSize(12)
      .text(`Order ID: ${order._id}`);

    doc.text(
      `Date: ${new Date(order.createdAt).toLocaleDateString()}`
    );

    doc.moveDown();

    // -------------------------
    // Customer Information
    // -------------------------

    doc.fontSize(14).text("Customer Information");

    doc.moveDown(0.5);

    doc.fontSize(12);

    doc.text(`Name: ${order.user?.name || "Customer"}`);

    doc.text(`Email: ${order.user?.email || "N/A"}`);

    doc.moveDown();

    // -------------------------
    // Products
    // -------------------------

    doc.fontSize(14).text("Order Items");

    doc.moveDown(0.5);

    order.items.forEach((item) => {
      const productName = item.product?.title || "Product";

      const price = item.product?.price || 0;

      const quantity = item.quantity;

      const subtotal = price * quantity;

      doc.fontSize(12).text(
        `${productName} | Qty: ${quantity} | Price: $${price} | Subtotal: $${subtotal}`
      );

      doc.moveDown(0.5);
    });

    doc.moveDown();

    // -------------------------
    // Total
    // -------------------------

    doc
      .fontSize(16)
      .text(`Total: $${order.totalPrice}`);

    doc.moveDown();

    // -------------------------
    // Payment & Order Status
    // -------------------------

    doc
      .fontSize(12)
      .text(
        `Payment Status: ${order.paymentStatus || "Pending"}`
      );

    doc.text(
      `Order Status: ${order.status}`
    );

    doc.moveDown(2);

    doc
      .fontSize(12)
      .text(
        "Thank you for shopping with FASHIO!",
        { align: "center" }
      );

    // PDF complete
    doc.end();

  } catch (error) {
    console.log("Invoice Error:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};