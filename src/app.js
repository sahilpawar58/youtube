import  express  from "express";
import cors from cors;

const app = express();

app.use(cors());
app.use(express.urlencoded({
    limit:"16Kb",
    extended:true
}))
app.use(express.json({limit:"16Kb"}))
app.use(express.static('public'))

export default app;