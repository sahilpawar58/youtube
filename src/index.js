import connectDb from './db/index.js'
import dotenv from 'dotenv';
import app from './app.js'

dotenv.config({
    path: './env'
})


connectDb()
.then(()=>{
    app.on("error", (error)=>{
        console.log('error is '+error)
    })
    app.listen(process.env.PORT || 8000,() => {
        console.log("Server Started On "+process.env.PORT);
    })
})
.catch(()=>{
    console.log("Server Failed to Start");
})
// connectDb();