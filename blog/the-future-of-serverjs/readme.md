---
layout: post.hbs
title: The future of Server.js
description: I propose different ways to continue developing server.js and ask the community for advice on those.
date: 2018-12-08 03:00:00+09:00
---

First, let me give you a little context. It was 2016 and I was teaching some friends about getting started with Node.js. Then (and now, for that matter) the state of the art was Express, with the two main alternatives being Koa and Hapi.js.

However, I was very dissatisfied having to explain how you should include a bunch of middleware to do the most basic things. It's cumbersome, error-prone and insecure by default:

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

I decided to put a bunch of middleware together, throw in a bit of ES6+ and call it `server`. I have yet to come close to any other solution that is as intuitive and flexible as this! The same in `server`:

```js
// Example with the current `server`:
const server = require('server');
const { get, post } = server.router;
server([
  get('/', () => 'Hello world'),
  post('/', ({ body }) => `Posted: ${JSON.stringify(body)}`)
]);
```

Now I am in a point where I *really* want to make `server@2` and I have many ideas after hundreds (thousands?) of hours of experimentation and trying several frameworks in front-end and back-end:

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
- **Simplified response** because server templates are becoming more rare in favor of APIs.
- **Improved error handling**. In v1 it's similar to Express, but we can do much better.
- **Lightweight** with no dependencies (or bundled). Install it in ~2s and you are ready to go.
- **Plugins** are something that I've been working on very hard but were never released.
- **Tutorials** including how to make server.js from scratch and many others.
- **Minimal breaking changes**. Let's keep all the good parts and improve the bad ones!



## The problem

As the project evolved I got a fulltime job and I could not spend so much time on it anymore. Tutorials were not written, Github issues went unanswered and the documentation is still quite basic.

The main problem is that **I do not have time**. I need to work fulltime (for food AND to keep my immigration VISA in Japan). I'm in a make it or break it situation, either I continue working fulltime or I work on server.js with the community.

Donations have not worked so far, I got **$5 in total** for the 2 years since the project started. That is the equivalent of **$0.21/month**, which is totally not sustainable.



## The solution(s)

So from my point of view and current situation, I have 3 options to continue with server.js:

1. Do it **for myself**. Keep it closed source or the closest equivalent (read-only Github, etc). While all the community involvement has been highly positive, it requires a large amount of time that I do not have. I would very much **not like this** though, I love Open Source and the community.

2. **Sell the project**. With increased monetary support and a paying community, I can focus my effort on what matters while reducing the support needed. I really like the way Alvaro Trigo [is doing it with Fullpage.js](https://alvarotrigo.com/fullPage/pricing/). This has many pros and cons to be considered.

3. Find **big sponsors**. With a big company paying me I can focus exclusively on server.js for ~1 year. Facebook, Google, Stripe, Airbnb, etc. have shown great contributions to open source. I can live with $3000-4000/month (gross) and even spare some for design and copywriting.

There are some other alternatives like joining an agency and basing their back-end work on server.js, contracting and doing this on the side, etc. but I think those are very rare.

I really think it is the ideal moment for a lightweight Node.js server that uses modern workflows and it's easy to get started with. While Javascript back-end is not as sexy as the front-end, I believe server.js can turn things around.

My preferred method would be 3 doubtlessly. But I do not even know how to reach to those big companies and get them to contribute, or what to offer in exchange. If you can help or have any advice, please contact me or tell me on Hacker News:
