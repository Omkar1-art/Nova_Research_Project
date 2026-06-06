const express = require("express");

const axios = require("axios");

const router = express.Router();

router.post("/", async (req, res) => {

  const { message } = req.body;

  try {

    const response =
    await axios.post(

      "https://openrouter.ai/api/v1/chat/completions",

      {
        model:
            "openai/gpt-3.5-turbo",

        messages:[
          {
            role:"user",
            content:message
          }
        ]
      },

      {
        headers:{
          Authorization:
          `Bearer ${process.env.OPENROUTER_API_KEY}`,

          "Content-Type":
          "application/json"
        }
      }
    );

    const reply =
    response.data?.choices?.[0]?.message?.content
    ||
    "Nova could not reply 😭";

    res.json({
      reply
    });

  }

  catch(error){

    console.log(error.response?.data);

    res.status(500).json({
      error:"AI failed 😭"
    });
  }

});

module.exports = router;