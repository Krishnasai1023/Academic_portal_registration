const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');  // MySQL connection
const router = express.Router();

router.post('/signup', async (req, res) => {
  const { username, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const sql = `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`;
  db.query(sql, [username, hashedPassword, role], (err, result) => {
    if (err) return res.status(500).send('Error signing up');
    res.send({ success: true });
  });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const sql = `SELECT * FROM users WHERE username = ?`;
  db.query(sql, [username], async (err, results) => {
    if (err) return res.status(500).send('Error during login');
    if (results.length === 0) return res.status(400).send('Invalid credentials');
    
    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid credentials');

    const token = jwt.sign({ id: user.id, role: user.role }, 'jwtSecret');
    res.send({ success: true, token });
  });
});

module.exports = router;
