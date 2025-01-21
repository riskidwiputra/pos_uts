const express         = require('express');
const dotenv          = require('dotenv');
const expressLayouts  = require('express-ejs-layouts');
const flash           = require('connect-flash');
const session         = require('express-session');
const cookieParser    = require('cookie-parser');
const methodOverride  = require('method-override')
const cors            = require('cors');
const axios = require('axios');

// local
const allRoutes       = require('./routes');
const {sequelize}     = require('./app/models')
const { handleError } = require('./app/utils/errorHandler');



dotenv.config();

async function startServer() {
const app = express()
const port            = process.env.PORT;

// set view engine
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('secret'));
app.use(session({
    cookie: {
        maxAge: 1000
    },
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

app.use(flash())

app.use(express.static(__dirname + '/views'));

app.use(methodOverride('_method'))
app.use(allRoutes);

app.use((err, req, res, next) => {
  handleError(err, res);
});
// error status 

// connection database
app.listen(port, async () => {
      try {
        await sequelize.authenticate();
        console.log('database Connected')
      } catch (error) {
        console.log(error)
      }
      console.log(`Example app listening at ${process.env.BASE_URL}`)
  })
}
startServer();