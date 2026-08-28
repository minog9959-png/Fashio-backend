import Contact from "../models/Contact.js";

export const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Check required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if this email has already submitted the form
    const existingContact = await Contact.findOne({ email });

    if (existingContact) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted the contact form.",
      });
    }

    // Create contact message
    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Your message has been sent successfully",
      contact,
    });
  } catch (error) {
    console.error("Contact Error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
