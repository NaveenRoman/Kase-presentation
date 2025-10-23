const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const twilio = require('twilio');

const app = express();
app.use(bodyParser.json());

// Twilio setup
const accountSid = 'TWILIO_ACCOUNT_SID';
const authToken = 'TWILIO_AUTH_TOKEN';
const client = twilio(accountSid, authToken);
const twilioFrom = 'TWILIO_PHONE_NUMBER'; // e.g., +1234567890

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'yourgmail@gmail.com',
    pass: 'yourgmailpassword', // consider using app password
  }
});

// Endpoint to receive booking
app.post('/book-session', async (req, res) => {
  const { name, email, phone, date } = req.body;

  try {
    // Send SMS
    await client.messages.create({
      body: `New session booked by ${name} on ${date}. Contact: ${phone}, Email: ${email}`,
      from: twilioFrom,
      to: '+916305747441'
    });

    // Send Email
    await transporter.sendMail({
      from: 'yourgmail@gmail.com',
      to: 'naveenrom232@gmail.com',
      subject: 'New Info Session Booked',
      html: `<p><b>Name:</b> ${name}</p>
             <p><b>Email:</b> ${email}</p>
             <p><b>Phone:</b> ${phone}</p>
             <p><b>Date:</b> ${date}</p>`
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
