import express, {
  type Request,
  type Response,
  type NextFunction,
  Router,
} from 'express';
import crypto from 'crypto';
import type { WhatsAppWebhookPayload } from '../utils/types';
import dotenv from 'dotenv';
import { processPayload } from '../actions/processPayload';

dotenv.config({ path: '.env.local' });

const router = Router();

const checkEnvVariables = (req: Request, res: Response, next: NextFunction) => {
  const verificationToken = process.env.VERIFICATION_TOKEN;
  const appSecret = process.env.APP_SECRET;

  if (!verificationToken || !appSecret) {
    return res.status(500).send('Server configuration error');
  }

  req.app.locals.verificationToken = verificationToken;
  req.app.locals.appSecret = appSecret;
  next();
};

const validateWebhookPayload = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const signature = req.get('X-Hub-Signature-256');
  const { appSecret } = req.app.locals;
  const body = req.body;

  if (!signature) {
    console.log('Signature not provided');
    return res.status(401).send('Signature not provided');
  }

  const expectedSignature =
    'sha256=' +
    crypto.createHmac('sha256', appSecret).update(body).digest('hex');

  if (signature !== expectedSignature) {
    console.log('Invalid signature');
    return res.status(401).send('Invalid signature');
  }

  try {
    req.body = JSON.parse(body); // Replace raw text with parsed JSON
    next();
  } catch (error) {
    return res.status(400).send('Invalid JSON');
  }
};

router.use(
  '/api/webhook',
  checkEnvVariables,
  express.text({ type: 'application/json' })
);

router.get('/api/webhook', (req: Request, res: Response) => {
  const { verificationToken } = req.app.locals;
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (typeof challenge === 'string') {
    const challengeInt = parseInt(challenge);

    if (mode && token) {
      if (mode === 'subscribe' && token === verificationToken) {
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challengeInt);
      } else {
        res.sendStatus(403);
      }
    }
  } else {
    res.sendStatus(400);
  }
});

router.post(
  '/api/webhook',
  validateWebhookPayload,
  (req: Request, res: Response) => {
    const body: WhatsAppWebhookPayload = req.body;

    processPayload(body);
    return res.sendStatus(200);
  }
);

export default router;
