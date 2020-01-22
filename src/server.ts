import app from "./app"
import Environment from "./environment";
import * as dotenv from "dotenv";
dotenv.config();

app.listen(Environment.httpPort, () => console.log(`Listenning on port ${Environment.httpPort}`));