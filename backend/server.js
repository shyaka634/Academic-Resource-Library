import express from 'express'
import session from 'express-session'
import cors from 'cors'
import sequelize,{ connectDb } from './config/db.js';
import sessionRoute from './routes/sessionRoute.js';
import authRoutes from './routes/authRoute.js'
import bookmarkRoute from './routes/bookmarkRoute.js';
import resourceRoute from './routes/resourceRoute.js';
import subjectRoute from './routes/subjectRoute.js';

const app = express();
connectDb();
app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(session({
    secret: "my banana plantation",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, sameSite: "lax" }
}));

import bookmark from './models/bookmarkModel.js'
import resource from './models/resoucesModel.js'
import sessions from './models/sessionModel.js'
import user from './models/userModel.js'
import subject from './models/subjectsModel.js'

// Associations
user.hasMany(resource, { foreignKey: 'uploaded_by' });
resource.belongsTo(user, { foreignKey: 'uploaded_by' });

resource.belongsTo(subject, { foreignKey: 'subject_id' });
subject.hasMany(resource, { foreignKey: 'subject_id' });

bookmark.belongsTo(user, { foreignKey: 'user_id' });
bookmark.belongsTo(resource, { foreignKey: 'resource_id' });
user.hasMany(bookmark, { foreignKey: 'user_id' });
resource.hasMany(bookmark, { foreignKey: 'resource_id' });

sessions.belongsTo(user, { foreignKey: 'user_id' });
user.hasMany(sessions, { foreignKey: 'user_id' });

app.use('/api/sessions', sessionRoute);
app.use('/api/auth', authRoutes)
app.use('/api/bookmarks', bookmarkRoute);
app.use('/api/resources', resourceRoute);
app.use('/api/subjects', subjectRoute);

sequelize.sync({alter:true})
.then(()=>{ app.listen(2000,()=>{ console.log('Listen to port 2000 ')})})
.catch(err => console.error("sync error", err));
