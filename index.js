const express = require("express");
const { connection } = require("./db");
const { userRouter } = require("./routes/userRoutes");
const { postsRouter } = require("./routes/postsRoutes");
var cors = require('cors')

const app = express();
app.use(express.json());
app.use(cors())
app.use("/users", userRouter);
app.use("/posts", postsRouter);

app.get("/", (req, res)=>{
    res.status(200).send({"msg": "Welcome to InstaMasai Backend"})
})

app.listen(8080, async()=>{
    try {
        await connection
        console.log("Connected to DB")
        console.log("Server is live at PORT 8080");
    } catch (error) {
        console.log(error)
    }
})