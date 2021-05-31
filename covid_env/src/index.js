
import app from './app';
import 'dotenv/config';
import './db';



app.listen(process.env.PORT, () =>
  console.log('Litening on port', process.env.PORT)
);
