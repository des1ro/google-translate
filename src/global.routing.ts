import { Router } from "express";
import routesTranslation from "./translator/translator.routing";
const routes = Router();

routes.use("/", routesTranslation);

export default routes;
