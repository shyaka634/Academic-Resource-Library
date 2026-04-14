import express from 'express'
import session from 'express-session'
import sequelize,{ connectDb } from './config/db.js';
const app= express();
connectDb();
app.use(express.json())

app.use(session({
    secret:"my banana plantation",
    resave:false,
    saveUninitialized:false,
    cookie:{secure:false}
}));

import bookmarkRoute from './routes/bookmarkRoute.js';
app.use('/bookmarks', bookmarkRoute);

import bookmark from './models/bookmarkModel.js'
import resource from './models/resoucesModel.js'
import sessions from './models/sessionModel.js'
import user from './models/userModel.js'

sequelize.sync({force:true})
.then(()=>app.listen(2000,()=>{ console.log('Listen to port 2000 ')}))
.then(err => console.error("sync error", err));