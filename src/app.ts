import express from 'express';
import webhookRoute from './routes/webhookCallback';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
const PORT = process.env.PORT || 3000;

const app = express();
app.use(webhookRoute);

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
