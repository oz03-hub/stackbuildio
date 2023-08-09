import express from 'express';
import logger from 'morgan';
import * as ai from './ai-module.js';

const app = express();
const port = 3000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('<h1>Hello, check out usage: /help</h1>');
});

app.get('/build/:appName/:description', async (req, res) => {
    res.send(await ai.stackAdvice(req.params.appName, req.params.description));
});

app.get('*', (req, res) => {
    res.status(404).json({ request: req.path, message: 'Unknown request'});
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
