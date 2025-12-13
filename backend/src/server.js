import express from 'express';

const app = express();

app.get('/api/health',(req,res)=>{
    res.send('OK').json({message:'the first api is connected sucessfully'})
});

app.listen(3000, ()=> console.log("the first api is connected sucessfully"))