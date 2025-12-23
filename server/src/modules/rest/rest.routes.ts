

import {FastifyInstance} from "fastify";
import { executeRest } from "./rest.controller";

export async function restRoute(app:FastifyInstance){
     app.post('/execute/rest', executeRest);
}