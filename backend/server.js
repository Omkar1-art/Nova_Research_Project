const express = require("express");

const cors = require("cors");

require("dotenv").config();

const chatRoutes =
require("./routes/chatRoutes");

const app = express();

/* MIDDLEWARE */

app.use(cors());

app.use(express.json());

/* ROUTES */

app.use(
  "/api/chat",
  chatRoutes
);

/* TEST ROUTE */

app.get("/", (req, res)=>{

  res.json({

    message:
    "Nova Backend Running 🚀"
  });
});

/* PORT */

const PORT =
process.env.PORT || 5000;

/* SERVER */

app.listen(PORT, ()=>{

  console.log(
    `Server running on port ${PORT}`
  );
});