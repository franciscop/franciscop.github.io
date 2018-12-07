---
layout: post.hbs
title: The future of Server.js
description: I propose different ways to continue developing server.js and ask the community for advice on those.
date: 2018-12-08 01:00:00+09:00
---

First, let me give you a little context. It was 2016 and I was teaching some friends about getting started with Node.js. Then (and now, for that matter) the state of the art was Express, with the two main alternatives being Koa and Hapi.js.

However, I was very dissatisfied having to explain how you should include a bunch of middleware to do the most basic things. It's just cumbersome and error-prone:

```js
// Example with `express`:
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());
// ... many other middleware needed
app.get('/', (req, res) => res.send('Hello World!'));
app.post('/', (req, res) => res.send(`Posted: ${JSON.stringify(req.body)}`));
app.listen(3000);
```

I decided to put a bunch of middleware together, throw in a bit of ES6+ and call it `server`. I have yet to come close to any other solution that is as intuitive and flexible as this! The same code in `server` is:

```js
// Example with the current `server`:
const server = require('server');
const { get, post } = server.router;
server([
  get('/', () => 'Hello world'),
  post('/', ({ body }) => `Posted: ${JSON.stringify(body)}`)
]);
```

Now I am in a point where I *really* want to make `server@2` and I have some ideas after hundreds (thousands?) of hours of experimentation for 2 years and trying many different frameworks in both front-end and back-end. The next iteration is going to be glorious:

```js
// Example with my idea for server@2:
import server, { get, post } from 'server';
server([
  get('/', () => 'Hello world'),
  post('/', ({ body }) => `Posted: ${JSON.stringify(body)}`)
]);
```

These are the ideas I have so far to improve from `server@1` to `server@2`:

- **Import syntax** like you are used in `React` or any other modern front-end workflow. This is coming soon in native Node.js so you'll be able to work better.
- **Simplified response** so you can work with it on your own a lot easier inspired by `fetch()`.
- **Improved error handling**. In v1 it's similar to Express, but we can do a lot better.
- **Tutorials** including how to make server.js from scratch and many others.
- **lightweight** with no dependencies (or bundled ones). Installing it takes ~2 seconds and you are ready to go.
- **plugins** are something that I've been working on very hard but were never released.
- **minimal breaking changes** of course. Let's keep all the good parts and improve the bad ones!



## The problem

As the project evolved I got a fulltime job and I could not spend so much time on it anymore. Tutorials were not written, Github issues were unanswered and the documentation is only the basics.

The main problem is that **I do not have time**. I need to work fulltime (for food AND to keep my immigration VISA in Japan) so getting $100 or $300 per month would not change much. I'm in a point where it's either make it or break it, either I continue working fulltime or I work on server.js with the community.

Donations have not worked so far, I got `$5` for all the length of the project (~2 years). Pull requests were minimal, but I think they can improved greatly in `v2` after cleaning up the code and the tutorial on how to create server.js from scratch.



## The solution(s)

So from my point of view, I have 3 options to continue with server.js:

1. Do it **for myself**. Keep it closed source or the closest equivalent (read-only Github, etc). While all the community involvement has been highly positive, it requires a large amount of time that I do not have. I would very much **not like this** though, I love Open Source.

2. **Sell the project**. With increased monetary support and a paying community, I can focus my effort on what matters while reducing the support needed. I really like the way Alvaro Trigo [is doing it with Fullpage.js](https://alvarotrigo.com/fullPage/pricing/). This has many pros and cons though.

3. Find a **big sponsor**. With a big company paying my expenses I can live with that and focus exclusively on server.js for ~1 year. Facebook, Google, Stripe, Airbnb, etc. have shown great contributions to open source projects. I can live with $3000-4000/month (gross) and even spend a bit of that on external help (graphic design, copywriting). This would be a huge pay cut, but some things are more important than money.

I really think it is the ideal moment for a project like this, a Node.js server that is lightweight, future-proof, uses modern workflows and it's easy to get started with. While Javascript back-end is not as sexy as the front-end, I believe server.js can turn things around.

My preferred method would be 3 doubtlessly. But I do not even know how to reach to those big companies and get them to contribute, or what to offer in exchange. If you can help or have any advice, please contact me or tell me on Hacker News:
