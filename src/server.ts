import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import * as nodemailer from "nodemailer";

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

// const PORT_NUMBER = process.env.PORT ?? 4000;
import { Pool } from "pg";
const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? "4000",
});

// POST contact form
app.post("/submit-form", (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      throw new Error("All fields are required");
    }
    // Create the mailOptions object
    const mailOptions = {
      from: "youremail@gmail.com",
      to: "recipient@gmail.com",
      subject: "New message from " + name,
      text: message + "\n\n" + "Email: " + email,
    };
    // Send the email
    transporter.sendMail(
      mailOptions,
      function (error: Error | null, info: nodemailer.SentMessageInfo) {
        if (error) {
          console.log(error);
          throw new Error("Error sending email");
        } else {
          console.log("Email sent: " + info.response);
        }
      }
    );
    // Store the data in the database
    pool.query(
      "INSERT INTO contact_form (name, email, message) VALUES ($1, $2, $3)",
      [name, email, message],
      (error: Error | null) => {
        if (error) {
          console.log(error);
          throw new Error("Error storing data in database");
        }
      }
    );
    // Send a success response to the client
    res.status(200).json({ message: "Form submitted successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: (error as Error).message });
  }
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// transporter.sendMail(mailOptions, function (error, info) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log("Email sent: " + info.response);
//   }
// });

app.listen(pool, () => {
  console.log(`Server is listening on port ${pool}!`);
});
