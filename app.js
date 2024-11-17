import 'dotenv/config'; // Replaces require('dotenv').config();
import express from 'express';
// import session from 'express-session';
import sequelize from './config/database.js';

// Importing route files
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
// import cors from 'cors';



const app = express();

// app.use(cors({
//   origin: ['http://localhost:3000', 'http://localhost:3030'],
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true
// }));

app.use(express.json());


(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

sequelize.sync({ force: false }); 


// Set up session
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false
// }));


// Routes
app.get('/', (req, res) => {
  res.json({ message: "Yam generator" });
});

app.get('/api/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      id: req.user.id,
      displayName: req.user.displayName,
      email: req.user.email
    });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Registering the routes
app.use(userRoutes);


// Use auth routes
app.use('/auth', authRoutes);

// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});