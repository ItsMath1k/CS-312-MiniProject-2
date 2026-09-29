const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

const PORT = 3000;

app.get("/", (req,res)=> {
    res.render("index", { pokemon: null, error: null, searchName: "", shiny: false, genus: null });
});

app.post("/search", async (req, res)=> {
    const shiny = req.body.shiny === "on"
    
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${req.body.name.trim().toLowerCase()}`);
        const speciesResponse = await axios.get(response.data.species.url);
        const genus = speciesResponse.data.genera.find(g => g.language.name === "en").genus;

        res.render("index", { pokemon: response.data, error: null, searchName: req.body.name, shiny: shiny, genus: genus });    
    } catch (error) {
        res.render("index", { pokemon: null, error: "Pokemon not found. Please try again.", searchName: req.body.name, shiny: shiny, genus: genus });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});