const express  = require('express');
const app = express();
const port = process.env.PORT || 3051; 
const cookieParser = require('cookie-parser');
const cors = require('cors');
const Blaze = require('./crash');

     const {
          checkToken,
          countAllSygnal,
          createUsers,
          insertUsersToken,
          getUser,
          getAllRows,
          InsertRoullete,
          getLastNumber18,
          getLastNumber,
          usersFilters
        } = require('./database');

