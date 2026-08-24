// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Form",
//       required: true,
//     },

//     items: [
//       {
//         product: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Product",
//           required: true,
//         },

//         quantity: {
//           type: Number,
//           required: true,
//           default: 1,
//         },
//       },
//     ],

//     totalPrice: {
//       type: Number,
//       required: true,
//     },

//     paymentStatus: {
//       type: String,
//       enum: ["Pending", "Paid", "Failed"],
//       default: "Pending",
//     },

//     status: {
//       type: String,
//       enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
//       default: "Pending",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const Order = mongoose.model("Order", orderSchema);

// export default Order;

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      required: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        // Product snapshot
        title: {
          type: String,
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },

        image: {
          type: String,
        },

        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],

    totalPrice: {
      type: Number,
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    stripeSessionId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;