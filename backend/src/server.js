import express from 'express';
import path from 'path';
import { clerkMiddleware } from '@clerk/express'

import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';


const app = express() ;
const __dirname = path.resolve();

app.use(clerkMiddleware())

app.get('/api/health',(req,res)=>{
    res.status(200).json({message:'the first api is connected sucessfully'})
})

if (ENV.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../admin/dist')));
    app.get('*', (req, res) =>
      res.sendFile(path.join(__dirname, '../admin/dist/index.html'))
    );
} else {
    app.get('/', (req, res) => {
      res.send('API is running....');
    });
}

app.listen(ENV.PORT, () => 
   {
    console.log(`Server is running on port ${ENV.PORT}`)
    connectDB()
   }    
)