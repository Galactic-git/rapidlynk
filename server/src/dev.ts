import app from "./index.js"
import {serve} from "@hono/node-server"

const port = 3000

console.log(` server is running in the port ${port}`);

serve({
    fetch : app.fetch,
    port 
})