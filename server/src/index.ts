import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

import { checkMembership } from './lib/checkMembership';

app.post('/api/check', (req, res) => {
  const { language, string } = req.body || {};
  if (typeof language !== 'string' || typeof string !== 'string') {
    return res.status(400).json({ error: 'language and string are required' });
  }
  const result = checkMembership(language, string);
  res.json({ result });
});

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(port, () => console.log(`PLV API listening on http://localhost:${port}`));
