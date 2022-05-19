// demo.js
import { read, write } from "./simplefs.js";

// Works with Promises
const data = await read("./readme.md");
await write("./readme2.md", data);

// Works with traditional Node.js Streams
read("./readme.md").pipe(write("./readme3.md"));

// Works with the new Web Streams
read("./readme.md").pipeTo(write("./readme4.md"));
