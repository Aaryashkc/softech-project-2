import dotenv from 'dotenv'
dotenv.config();
import express from 'express';
import cors from 'cors';


dotenv.config()

const port= process.env.PORT;
const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
}
))
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})