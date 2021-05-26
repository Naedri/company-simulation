import express from "express";
import router from "./router";

const app = express();
const PORT = "3000";

app.use("/", router);

app.use(function(req, res, next){
    res.json({
        error:{
            status: 404,
            message: "Route not found!"
        }
    });
});

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});