// simplefs.js
import { readFile, writeFile } from "node:fs/promises";
import { createReadStream, createWriteStream } from "node:fs";
import { Readable, Writable } from "node:stream";

export const read = (path) => {
  // A promise is abstracted just like this! It's just a function that
  // receives a CB and passing the resolution value into it
  const promFn = async (cb) => cb(await readFile(path, "utf-8"));

  // Our .pipe(writable) receives the writable stream, so create and pipe it
  const pipe = (writable) => createReadStream(path).pipe(writable);

  // When pipeTo, it's a webstream so convert it from Node to Web:
  const pipeTo = (writable) => {
    return Readable.toWeb(createReadStream(path)).pipeTo(writable);
  };

  return { then: promFn, pipe, pipeTo };
};

export const write = (path, data) => {
  // Returning a promise is the same as making the whole file async
  if (typeof data !== "undefined") {
    return writeFile(path, data);
  }

  // Create the Node.js stream and overload it with the methods of WebStreams
  const stream = createWriteStream(path);
  const webStream = Writable.toWeb(createWriteStream(path));
  return Object.assign(stream, webStream);
};
