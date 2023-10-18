const express = require("express");
const axios = require("axios");
const fs = require('fs'); // Added the fs module to read the local JSON file

const API_KEY = "sk-rSHL652af5e81adbd2459";
const ids = [1];
const giftids = [1, 2, 3, 4, 5, 6, 7];

const app = express();
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  try {
    const blogs = [
      { title: "Blog 1", snippet: "Lorem ipsum dolor sit amet consectetur" },
      { title: "Blog 2", snippet: "Lorem ipsum dolor sit amet consectetur" },
      { title: "Blog 3", snippet: "Lorem ipsum dolor sit amet consectetur" },
    ];

    const commons = [];
    const giftnames = [];

    for (let i = 0; i < ids.length; i++) {
      const idd = ids[i];
      await axios
        .get(
          `https://perenual.com/api/pest-disease-list?key=${API_KEY}&id=${idd}`
        )
        .then((response) => {
          const common_name = response.data.data[0].common_name;

          commons.push({ id: idd, com: common_name });
        })
        .catch((err) => {
          console.log(err);
        });
    }

    // Reading local JSON file
    const data = fs.readFileSync('plantGift.json');
    const plantGiftData = JSON.parse(data);
    for (let i = 0; i < giftids.length; i++) {
      const GIFT_ID = giftids[i];
      const gift = plantGiftData.gift.find(g => g.id === GIFT_ID);

      giftnames.push({ g_id: GIFT_ID, g_name: gift.name });
    }

    res.render("index", { title: "Homepage", blogs, commons, giftnames });

  } catch (error) {
    console.error(error);
    res.status(500).render("error", { title: "Error" });
  }
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
