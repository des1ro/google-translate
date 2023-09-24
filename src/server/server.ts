import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import routes from "../global.routing";
dotenv.config();
const app: Express = express();
const port = process.env.PORT;
app.use(express.json()); // To handle req.body

app.use("/api", routes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Translator111");
});
