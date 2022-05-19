---
layout: post.hbs
title: Promises and Streams in Javascript
description: An exploratory article on using Promises, Node.js Streams and Web Streams together in a single function.
date: 2022-05-19T08:00+09:00
---

Let's explore this topic in a practical way! I want a function that **read a file** and another that **writes a file**. But files can be small or big, text or binary, so we want to allow them to read the whole file at once with a promise, or pipe it to another file in chunks. The API should look like:

```js
// demo.js
import { read, write } from "./simplefs.js";

// Works with Promises
const data = await read("./readme.md");
await write("./readme2.md", data);

// Works with traditional Node.js Streams
read("./readme.md").pipe(write("./readme3.md"));

// Works with the new Web Streams
read("./readme.md").pipeTo(write("./readme4.md"));
```

I am also not sure what to expect here, while I'm very familiar with the inner workings of Promises, I'm only at the user-level familiar with [Node.js Streams](https://nodejs.org/api/stream.html), and totally unfamiliar with [WebStreams](https://nodejs.org/api/webstreams.html), the new Node.js abstraction. But let's try to make that work anyway!

## It all starts with a Promise

Let's start first with Promises, we want to make an API that allows us to simply do:

```js
// demo.js
import { read, write } from "./simplefs.js";

// Works with Promises
const data = await read("./readme.md");
await write("./readme2.md", data);
```

Promises is the one I'm most familiar with and the default one for small files. This should look like a thin wrapper since we have a very similar API in `fs/promises` already:

```js
import { readFile, writeFile } from "node:fs/promises";

// simplefs.js
export const read = (path) => {
  return readFile(path, "utf-8");
};

export const write = (path, data) => {
  // Returning a promise is the same as making the whole file async
  return writeFile(path, data);
};
```

🚂 Let's test it! We write a minimal `package.json` and run `node demo.js`, and we see that our demo.js correctly writes the file `readme2.md` with the same content as this file!

But we only want the `read()` to use promises when calling it with `await` or `.then()`, and the `write()` when it receives some data, so let's modify our functions to reflect that:

> Note: calling `await fn()` is practically the same as calling `fn().then()`, with some minor differences that are not relevant for this article.

```js
export const read = (path) => {
  return {
    // A promise is abstracted just like this! It's just a function that
    // receives a CB and passing the resolution value into it
    then: async (cb) => cb(await readFile(path, "utf-8")),
  };
};

export const write = (path, data) => {
  // Returning a promise is the same as making the whole file async
  if (typeof data !== 'undefined') {
    return writeFile(path, data);
  }
};
```

Now we have the promise behaviour occurring *only* when we are using promises. An empty file will return `""`, and so the file is created even with empty files. So promises to promises condition is fulfilled! 🎉

> Note: we are simplifying and this is not Promise-compliant, or "[Promises A+](https://promisesaplus.com/)" as it's called.

## Node.js streams

Now let's try to work with the streams, starting with the traditional Node.js pipes. We want to achieve the ability of doing this, without hampering the previous promises workflow:

```js
// demo.js
import { read, write } from "./simplefs.js";

// Works with traditional pipes
read("./readme.md").pipe(write("./readme3.md"));
```

For that, we'll import and use it only when ".pipe()" is called:

```js
// simplefs.js
import { readFile, writeFile } from "node:fs/promises";
import { createReadStream, createWriteStream } from "node:fs";

export const read = (path) => ({
  then: async (cb) => cb(await readFile(path, "utf-8")),

  // Our .pipe(writable) receives the writable stream, so create and pipe it
  pipe: (writable) => createReadStream(path).pipe(writable),
});

export const write = (path, data) => {
  if (typeof data !== "undefined") {
    return writeFile(path, data);
  }
  // Create the writable stream if there's no data, assuming it's going to
  // receive a pipe
  return createWriteStream(path);
};
```

🚂 Let's test it again with `node demo.js` and we see that once more, `readme3.md` is created with the correct data! Node.js streams seem to work properly 🎉

> Note: we are also simplifying A LOT here and this is not fully Node Stream-compliant.

## Web Streams

Finally we want the ability of doing the following:

```js
// demo.js
import { read, write } from "./simplefs.js";

// Works with the new Web Streams
read("./readme.md").pipeTo(write("./readme4.md"));
```

This is probably going to be the tricky one, specially in the `write()` since we don't have much room there for mistakes, but let's try anyway! The first thing we do is try to modify our `read()` to add the `pipeTo()` characteristic of Web Streams. We're going to transform the Node.js stream to Web stream and clean the file a bit:

```js
import { Readable, Writable } from "node:stream";

export const read = (path) => ({
  // A promise is abstracted just like this! It's just a function that
  // receives a CB and passing the resolution value into it
  then: async (cb) => cb(await readFile(path, "utf-8")),

  // Our .pipe(writable) receives the writable stream, so create and pipe it
  pipe: (writable) => createReadStream(path).pipe(writable),

  // When pipeTo, it's a webstream so convert it from Node to Web:
  pipeTo: (writable) => {
    return Readable.toWeb(createReadStream(path)).pipeTo(writable);
  }
});
```

However if we try to run this, it won't work since that `writable` is still a Node.js Stream and `pipeTo()` expects a Writable WebStream.

Since we have control over both `read()` and `write()`, let's do a couple of modifications to pick only the right write type depending on the piping method:

```js
export const write = (path, data) => {
  ...

  // Depending on whether we are pipe()-ing or pipeTo()-ing, we'll call one
  // method or the other. This is not ideal since it doesn't interact properly
  // with native streams, but it's better than nothing
  return {
    node: () => createWriteStream(path),
    web: () => Writable.toWeb(createWriteStream(path)),
  };
};
```

While we could do that and then on write differentiate with `writeable.node()`, then we have a big problem: this is not a write stream anymore, it's a custom API that just happens to have the same name AND uses pipes deep down, but you cannot work with the write() as you would normally work with a pipe in other cases. That's pretty bad, we want pipes to just be pipes, so let's try a different way:

```js
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
```

What we are doing here is similar to how we fake the promise, but better. We are defining the output as a Node.js stream, and then overloading all of the methods of WebStream. We are not sure whether this will work or not, so let's try.

🚂 Let's remove the duplicate files and run `node demo.js` and we can see that the files `readme2.md`, `readme3.md` and `readme4.md` are created successfully. This is... surprising, and I'm not sure how I feel about doing it this way since there's a chance of method collision, but it seems to work so far so kudos! 🎉



## Putting it all together

This is our final file 🎉:

```js
// simplefs.js
import { readFile, writeFile } from "node:fs/promises";
import { createReadStream, createWriteStream } from "node:fs";
import { Readable, Writable } from "node:stream";

export const read = (path) => ({
  // A promise is abstracted just like this! It's just a function that
  // receives a CB and passing the resolution value into it
  then: async (cb) => cb(await readFile(path, "utf-8")),

  // Our .pipe(writable) receives the writable stream, so create and pipe it
  pipe: (writable) => createReadStream(path).pipe(writable),

  // When pipeTo, it's a webstream so convert it from Node to Web:
  pipeTo: (writable) => {
    return Readable.toWeb(createReadStream(path)).pipeTo(writable);
  },
});

export const write = (path, data) => {
  // Returning a promise is the same as making the whole file async
  if (typeof data !== "undefined") {
    return writeFile(path, data);
  }

  // Create the Node.js stream and overload it with the methods of WebStreams
  const stream = createWriteStream(path);
  const webStream = Writable.toWeb(stream);
  return Object.assign(stream, webStream);
};
```

We purposefully only followed the happy simplified path here. However, there's a lot of details that we skipped, like:

- Promises also have `.catch()` and `.finally()`.
- Node.js Streams have A LOT of other methods, like`.close()`, `.push()`, `.read()`, etc.
- Web Streams ALSO have other methods.
- We are ignoring _all_ of the options that both the promises and streams can accept.

We would need to make all of those to work properly if we want to call this a Promise or a Node/Web Stream properly. One possible hack/fix, at least on the `read()` side, is to make it all a ReadableStream that has the promise methods attached, like:

```js
export const read = (path) => {
  const stream = createReadStream(path);
  stream.then = async cb => cb(await readFile(path, "utf-8"));
  stream.catch = // ...
  stream.finally = // ...
  const webStream = // ...
  return Object.assign(stream, webStream);
};
```

This allows us to make it be a stream by default and not need to worry about those methods and details, and only add the promise interface on top of it. However, I don't know enough of the internals of createReadStream to know if this would result in a double read, or even in potentially a memory leak, so I won't set that as "the solution".

Maybe a better solution is not to try to overload a single method, but instead to keep it into separated helpers like this:

```js
// demo.js
import { read, write } from "./simplefs.js";

const data = await read("./readme.md");
await write("./readme2.md", data);

read.nodeStream("./readme.md").pipe(write.nodeStream("./readme3.md"));

read.stream("./readme.md").pipeTo(write.stream("./readme4.md"));
```

I'm the author of the library `files` and I'll continue exploring this topic and adding this functionality to the library itself when I'm confident enough! So make sure to star and watch the library:

**[github.com/franciscop/files](https://github.com/franciscop/files/)**
