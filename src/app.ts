import express from 'express';
import webhookRoute from './routes/webhookCallback';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
/**
 * The port number on which the server will listen.
 * If the PORT environment variable is set, it will use that value.
 * Otherwise, it will default to 3000.
 */
const PORT = process.env.PORT || 3000;

const app = express();
app.use(webhookRoute);

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
