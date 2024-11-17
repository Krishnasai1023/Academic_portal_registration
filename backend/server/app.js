const express = require('express');
const mysql = require('mysql');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const app = express();

app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'academic_portal',
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/academic_portal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
