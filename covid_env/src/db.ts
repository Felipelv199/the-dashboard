import mongoose from 'mongoose';

const uri = process.env.MONGOOSE_URI_DEV;

if (typeof uri !== 'undefined') {
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => console.log('Database connected'));
} else {
  console.log('"URI" not found inside .env file');
}
