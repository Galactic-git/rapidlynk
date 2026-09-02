import {handle} from "hono/aws-lambda";
import app from "./app.js";

export const handler = handle(app);