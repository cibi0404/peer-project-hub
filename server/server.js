const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const projectRoutes = require('./routes/projectRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Peer Project Hub API is running...');
});

app.use('/api/projects', projectRoutes);
app.use('/api/comments', commentRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
