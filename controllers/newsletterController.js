import Newsletter from "../models/Newsletter.js";

export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    // Check email
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    // Check valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    // Check if email already exists
    const existingSubscriber = await Newsletter.findOne({
      email: email.toLowerCase(),
    });

    if (existingSubscriber) {
      return res.status(400).json({
        message: "This email is already subscribed",
      });
    }

    // Create subscriber
    const subscriber = await Newsletter.create({
      email: email.toLowerCase(),
    });

    res.status(201).json({
      message: "Successfully subscribed to newsletter",
      subscriber,
    });
  } catch (error) {
    console.error("Newsletter Subscription Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get subscriber on admin side

export const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: "Subscribers fetched successfully",
      subscribers,
    });
  } catch (error) {
    console.error("Get Subscribers Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};