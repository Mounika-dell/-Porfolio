require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const Contact = require("./models/contact");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../frontend")));

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.post("/contact", async (req, res) => {
    try {
        const newMessage = new Contact(req.body);
        await newMessage.save();
        await transporter.sendMail({
            from: "mounikarachamla@gmail.com",
            to: "mounikarachamla@gmail.com",
            subject: `Portfolio Contact: ${req.body.subject}`,
            text: `
        New portfolio message received:

        Name: ${req.body.name}
        Email: ${req.body.email}
        Subject: ${req.body.subject}
        Message: ${req.body.message}
            `
});

        res.json({ message: "Message Sent Successfully ✅" });
    } catch (error) {
    console.log("SAVE ERROR:", error);
    res.status(500).json({ message: "Error saving message ❌" });
}
});
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});