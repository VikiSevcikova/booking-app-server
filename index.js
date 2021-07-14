const express = require("express");
const app = express();
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(cors());

const YOUR_DOMAIN = "https://vikisevcikova.github.io/booking-app-m/#/";
console.log(process.env.STRIPE_SECRET_KEY)
app.post("/payment", cors(), async (req, res) => {
    let {booking, customer} = req.body;
    try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items:[{
              price_data: {
                currency: "CAD",
                product_data: {
                  name: booking.hotelName,
                  description: `${booking.checkIn} - ${booking.checkOut}, adults: ${booking.adults}, children: ${booking.children}`
                },
                unit_amount: booking.total * 100,
              },
              quantity: 1
            }],
            customer_email: customer,
          mode: "payment",
          success_url: `${YOUR_DOMAIN}?success=true`,
          cancel_url: `${YOUR_DOMAIN}?canceled=true`,
        });
        res.json({ id: session.id });
      } catch (error) {
        console.error("Error",error);
        res.sendStatus(500).send();
      }
    }
)

app.listen(process.env.PORT || 4000, () => console.log("Server is listening on port 4000."));