const express = require('express');
const connectDB = require('./config/dbConfig')
require('dotenv').config();
const shortUrlModel = require('./models/shortUrl')
const shortid = require('shortid');

const app = express();
app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    const allUrls = await shortUrlModel.find();
    // res.render('index', {allUrls})
    res.send("Welcome")
})

app.post('/short-urls', async (req, res) => {
    const shortUrl = shortid.generate();
    const newUrl = {
        fullUrl: req.body.fullUrl,
        shortUrl: shortUrl
    }
    await shortUrlModel.create(newUrl)
    res.redirect('/');
})

app.get('/:shorturl', async (req, res) => {
    const url = await shortUrlModel.findOne({ shortUrl: req.params.shorturl });
    if (!url) return res.status(404).send(`The short url ${req.params.shorturl} does not exist`);

    url.clicks++;
    url.save();

    res.redirect(url.fullUrl)
})


//connect database and listen to port
const connectAndListen = async () => {
    try {
        await connectDB();
        app.listen(3070, function() {
          console.log(`Listening on port 3070`);
        });
    } catch (error) {
        console.log(error.message);        
    }
}
  
  
connectAndListen();