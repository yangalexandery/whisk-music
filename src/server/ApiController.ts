import * as express from "express";

export const ApiController = express.Router();
const fs = require("fs");

ApiController.get("/", (req: express.Request, res: express.Response) => {
    res.render("index", {
        pageName: "test"//ReactPage.Landing
    });
});