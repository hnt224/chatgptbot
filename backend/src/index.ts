import { connectToDatabase } from './db/connection.js';
import app from './app.js';

const PORT = process.env.PORT || 5000;

//connection
connectToDatabase()
.then(() => {
  app.listen(PORT, () => console.log("Server running on port 5000"));
})
.catch((err) => console.log(err));
