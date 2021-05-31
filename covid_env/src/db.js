import mongoose from 'mongoose';


mongoose.connect(process.env.MONGOOSE_URI_DEV, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Database connected'));
