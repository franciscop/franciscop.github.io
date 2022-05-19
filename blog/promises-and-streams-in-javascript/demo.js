import { read, write } from "./simplefs.js";

// Works with Promises
const data = await read("./readme.md");
await write("./readme2.md", data);

read("./readme.md").pipe(write("./readme3.md"));

read("./readme.md").pipeTo(write("./readme4.md"));
