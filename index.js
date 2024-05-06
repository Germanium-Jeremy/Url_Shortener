const express = require('express');
const mysql = require('mysql');
const shortId = require('shortid');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 100;

dotenv.config();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'urlShortner'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

app.get('/', (req, res) => {
  connection.query('SELECT * FROM urls ORDER BY ID DESC', (error, results) => {
    if (error) {
      console.error('Error retrieving short URLs:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.render('index', { shortUrls: results });
  });
});

app.post('/shortUrls', (req, res) => {
  const fullUrl = req.body.fullUrl;
  const shortUrl = 'Jer.' + shortId.generate() + '.App';
  connection.query('INSERT INTO urls (fullUrl, shortUrl) VALUES (?, ?)', [fullUrl, shortUrl], (error) => {
    if (error) {
      console.error('Error creating short URL:', error);
      res.status(500).send('Failed to create short URL');
      return;
    }
    res.redirect('/');
  });
});

app.listen(port, () => console.log('Server running on port: ' + port));