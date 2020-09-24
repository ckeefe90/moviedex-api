const express = require('express');
const morgan = require('morgan');
const helmet = require("helmet");
const cors = require("cors");
const MOVIES = require('./movies-data-small.json');

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());

console.log(process.env.API_TOKEN);

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get("Authorization");
    if (!authToken || authToken.split(" ")[1] !== apiToken) {
        return res.status(401).json({ error: "Unauthorized request" });
    }
    next();
});

function handleGetMovie(req, res) {
    const { genre, country, avg_vote } = req.query;
    if (genre && typeof genre !== "string")
        res.status(400).send("genre must be a string.");
    if (country && typeof country !== "string")
        res.status(400).send("country must be a string.");
    if (avg_vote && isNaN(Number(avg_vote)))
        res.status(400).send("avg_vote must be a number.");


    res.json(
        MOVIES.filter(movie =>
            (!genre || movie.genre.toLowerCase().includes(genre.toLowerCase()))
            && (!country || movie.country.toLowerCase().includes(country.toLowerCase()))
            && (!avg_vote || movie.avg_vote >= Number(avg_vote))
        )
    )
}

app.get('/movie', handleGetMovie)

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});
