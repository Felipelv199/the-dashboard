import express from 'express';

const app = express();

app.get('/', () => 'Hello World');

export default app;
