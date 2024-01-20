import  express  from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use(express.json({limit:"16Kb"}))
app.use(express.static('public'))

import userRouter from './routes/user.routes.js';

app.use('/api/v1/users',userRouter)

export default app;