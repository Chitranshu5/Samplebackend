import express from 'express';
import { configDotenv } from 'dotenv';
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

configDotenv();
// Sample route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
