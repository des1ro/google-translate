import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import routes from "../global.routing";
dotenv.config();
const app: Express = express();
const port = process.env.PORT;
app.use(express.json());
app.use("/", routes);

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Translator");
});

const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

export { app, server };
