---
layout: post.hbs
title: The mathematics behind music 🎶
description: Learning about the Fourier transformation and what it means for music
date: 2014-01-18T00:00+09:00
---

<style>
vector-graph {
  margin: 0 auto;
  display: block;
  width: auto;
}
</style>

This blog post is a rewrite of an old experiment I made exactly 8 years ago. I love SVGs and how they are mathematical representations in text of geometrical figures, and it's easy to understand because it's all visual:

<vector-graph grid="false" axis="false">
  <circle x="3" y="3" radius="2"></circle>
  <line from="3,8" to="8,6"></line>
  <polygon color="red" points="0,0;10,0;10,10;0,10"></polygon>
</vector-graph>

The trick **is** that it's all visual. Sound on the other hand is usually harder for people to understand, since there's multiple concepts that are a bit more advanced like the Fourier tranformation, inverse squared attenuation, etc.

So, let's make sound visual! If you open any song in a music editor, it'll look something like this:

![Soundwave](/blog/the-mathematics-behind-music/soundwave.png)

But if you zoom in, first you'll see an individual wave:

![Single wave](/blog/the-mathematics-behind-music/wave.png)

And if you keep zooming in, you'll see what looks like a periodic wave:


<vector-graph x="-5,5" y="-2,2">
  <plot fn="Math.tan(x)" color="red" width="1"></plot>
  <plot fn="Math.sin(x)" color="green"></plot>
  <plot fn="Math.cos(x)" color="blue"></plot>
</vector-graph>

This looks really like a periodic wave. We know that any periodic wave, no matter the shape, can be decomposed with a Fourier transformation into a sum of sines:

<vector-graph x="0,0.1" y="-1,1" width="400">
  <plot fn="0.4 * Math.sin(440 * x + 1) + 0.2 * Math.sin(880 * x + 2) + 0.2 * Math.sin(1320 * x + 4) + 0.2 * Math.sin(2200 * x + 4)" color="red" width="1"></plot>
</vector-graph>


**TODO**

The goal of this experiment is to understand the building blocks of music. This stems from the lack of a .sva for scalar vector audio and the question "How can we create mathematically perfect music?"




I love promises. It isn't a secret and I've said it [many](https://medium.com/server-for-node-js/async-await-are-awesome-c0834cc09ab), [many](https://medium.com/server-for-node-js/servers-middleware-promises-41d82a184452) times. They come in all asynchronous shapes and colors. But I think they could be better, so let's see some places where they fall short:



### Parallel resolution

To run several promises at once you'll use `Promise.all()` quite too often:

```js
// Load several websites at once
const webs = await Promise.all(urls.map(url => got(url)));

// Load several files at once with `mz/fs`
const files = await Promise.all(files.map(file => readFile(file, 'utf-8')));
```

If we have an array of promises we should be able to just wait at the whole thing instead of having to wrap it once more. This syntax would be much better, wouldn't it?

```js
// Does NOT work :(
const webs = await urls.map(url => got(url));
const files = await files.map(file => readFile(file, 'utf-8'));
```



### Chaining operations

The next issue is when you want to perform any operation on the promise value. You have to await for the whole thing to finish with `.then()` to perform the next operation:

```js
// Get each line from a remote URL
const lines = await fetch(...).then(res => res.text()).then(res => res.split('\n'));
```

What if we could call the method straight out of the Promise? The promise would know it has to wait until it's finished and then execute the method itself:

```js
// Does NOT work :(
const lines = await fetch(...).text().split('\n');
```



### Combination

When we combine those two, we get to ridiculous extremes. For a set of operations:

```js
// Perform two async operations on a list of items
let value = await Promise.all(data.map(op1));
value = value.filter(op2);
value = await Promise.all(value.map(op3));
```

It would be better if let the promise chain figure out those and worked as expected:

```js
// Does NOT work
const value = await data.map(op1).filter(op2).map(op3);
```



## Magic Promises

Well now you *can* with a bit of `magic()`! I just wrote [the library `magic-promises`](https://github.com/franciscop/magic-promises) to allow this:

```bash
npm install magic-promises
```

```js
const value = await magic(data).map(op1).filter(op2).map(op3);
```

It *extends* the promise definition so you can use them transparently. But it also adds the perfect syntax sugar for whenever it matters:

```js
// With a bit of `magic()`
const newMap = await magic(arr1).map(op1);
const newLines = await magic(fetch(...)).text().split('\n');

// Traditional style
const oldMap = await Promise.all(arr1.map(op1));
const oldLines = await fetch(...).then(res => res.text()).then(txt => txt.split('\n'));
```

It will effectively build the internal queue of methods and arguments, and resolve them as each of the steps get resolved. Then you can treat Promises even more transparently.



## File System

A perfect example of magic promises being useful is the filesystem, so I *also* published [`fs-array`](https://www.npmjs.com/package/fs-array):

```bash
npm install fs-array
```

```js
const { read, walk } = require('fs-array');

// Read all of the readme anywhere inside the current directory or children
const files = await walk('demo')
  .filter(name => /\/readme\.md$/.test(name))
  .map(read);

// IF fs-array did not use magic-promises internally:
const all = await walk('demo');
const readmes = all.filter(name => /\/readme\.md$/.test(name));
const files = Promise.all(readmes.map(read));
```


## Wrap up

My initial experience by creating and using `magic-promises` has been great. There is still some things to do, like `.filter()` accepting promises that resolve to booleans, but that's for the next chapter.




<script src="/blog/the-mathematics-behind-music/vector-graph.js"></script>
