import express from "express";

const app = express();

app.get('/', (req, res)=>{
    res.send("Working")
})

app.listen(3000, () => {
    console.log("Server running in port 3000");
})