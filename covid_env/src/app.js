import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import fileupload from 'express-fileupload';
import dataRoutes from './routes/api/data.routes';
import clientRoutes from './routes/client.routes';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(fileupload());
app.use(
  '/bootstrap',
  express.static(__dirname + '\\..\\node_modules/bootstrap\\dist\\css')
);

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.use('/api/data', dataRoutes);
app.use('/', clientRoutes);

export default app;
