const path = require('path')
const express = require('express');
const connectDB = require('./config/dbConfig')
require('dotenv').config();
const shortUrlModel = require('./models/shortUrl')
const shortid = require('shortid');

const app = express();
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    res.render('index', {urlFound: null})
})

app.post('/short-urls', async (req, res) => {
    const shortUrl = shortid.generate();
    const newUrl = {
        fullUrl: req.body.fullUrl,
        shortUrl: shortUrl
    }
    await shortUrlModel.create(newUrl);
    // res.redirect('/');
    res.render('short', {newUrl})
})

app.post('/short-details', async (req, res) => {
    const urlFound = await shortUrlModel.findOne({shortUrl: req.body.checkShort})
    if (!urlFound) return res.render('details', {urlFound: null, message: `The url ${req.body.checkShort} can't be found!`})
    
    res.render('details', {urlFound: urlFound, message: null})
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