import  express  from "express";
import cors from "cors";
<<<<<<< HEAD
import cookieParser from "cookie-parser";
=======
>>>>>>> 7dcb05844c2ae8314d3ca6ab2cf489e7300eb954

const app = express();

app.use(cors());
<<<<<<< HEAD
app.use(cookieParser())
=======
>>>>>>> 7dcb05844c2ae8314d3ca6ab2cf489e7300eb954
app.use(express.urlencoded({ extended: true }))
app.use(express.json({limit:"16Kb"}))
app.use(express.static('public'))

import userRouter from './routes/user.routes.js';
<<<<<<< HEAD
import videoRouter from "./routes/video.routes.js"


app.use('/api/v1/users',userRouter)
app.use("/api/v1/videos", videoRouter)
=======

app.use('/api/v1/users',userRouter)

>>>>>>> 7dcb05844c2ae8314d3ca6ab2cf489e7300eb954
export default app;