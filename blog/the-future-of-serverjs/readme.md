---
layout: post.hbs
title: The future of Server.js
description: I propose different ways to continue developing server.js and ask the community for advice on those.
date: 2018-12-08 01:00:00+09:00
---

First, let me give you a little context. It was 2016 and I was teaching some friends about getting started with Node.js. Then (and now, for that matter) the state of the art was Express, with the two main alternatives being Koa and Hapi.js.

However, I was very dissatisfied having to explain how you should include a bunch of middleware to do the most basic things:

```js
// Example with `express`:
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());
// ... many other middleware needed to match server
app.get('/', (req, res) => res.send('Hello World!'));
app.post('/', (req, res) => res.send(`Posted: ${JSON.stringify(req.body)}`));
app.listen(3000);
```

So I decided to put those together, throw in a bit of ES6+ and call it `server`. So far, I haven't come close to any other solution that is as intuitive and flexible to this! The same code in `server` is:

```js
// Example with the current `server`:
const server = require('server');
const { get, post } = server.router;
server([
  get('/', () => 'Hello world'),
  post('/', ({ data }) => `Posted: ${JSON.stringify(data)}`) // or 'body'
]);
```

However, as the project evolved I got a fulltime job and I could not spend so much time on it anymore. Tutorials were not written, and the documentation is only the basics.

So now I am in a point where I **really** want to make `server@2` and I have some ideas after hundreds of hours of experimentation and trying many different frameworks in both front-end and back-end. The next iteration is going to be glorious and using even more modern methods:

```js
// Example with my idea for server@2:
import server, { get, post } from 'server';
server([
  get('/', () => 'Hello world'),
  post('/', ({ body }) => `Posted: ${JSON.stringify(body)}`)
]);
```

These are the ideas I have so far to improve from `server@1` to `server@2`:

- **import syntax** like you are likely used to in `React` or any other modern front-end workflow. This is coming soon in native Node.js.
- **simplified response** so you can work with it on your own a lot easier. Again, similar to how easy `fetch()` is on the front-end.
- **error handling** should be improved greatly. Right now it's similar to Express, but it's still a mess and I have discovered ever since way better ways of handling it.
- **tutorials** including how to make server.js from scratch! While the syntax gets improved, the code gets reduced as well.
- **lightweight** with no dependencies (or bundled ones). Installing it takes ~10 seconds and you are ready to go.
- **plugins** are something that I've been working on very hard but were never released. They need a strong push to get finished.


## The problem

The main problem is that I do not have time. I still need to work fulltime (for food AND to keep my immigration VISA in Japan) so getting $100 or $300 per month would not change much. So I'm in a point where it's either make it or break it, either I continue working fulltime or I work on server.js with the community.

Donations have not worked so far, I got `$5` for all the length of the project (~2 years).



## The solution(s)

So from my point of view, I have 3 options to continue with server.js:

1. Do it **for myself**. Keep it closed source or the closest public source equivalent to it (read-only Github, etc). While I've gotten **great** help and issues in Github and everything has been highly positive, handling the community side requires an amount of time that I simply do not have now. I would very much **not like this**, I've put always as much code as OSS as possible.
2. **Sell the project**. With increased monetary support and a paying community, I can focus my effort on what matters while reducing the support needed. I really like the way Alvaro Trigo [is doing it with Fullpage.js](https://alvarotrigo.com/fullPage/pricing/).
3. Find a **big sponsor**. With a big company footing the bill I can live with that and can focus exclusively on server.js for ~1 year. Facebook, Google, Stripe, Airbnb, etc. have shown great contributions to open source projects, but it seems that mainly for things they use themselves. From back-of-the-envelope numbers, I could live with $3000-4000/month (gross) and even spend a bit of that on external help (graphic design, copywriting).

I really believe that it is the ideal moment for a project like this, a Node.js server that is lightweight, future-proof, uses modern workflows and it's easy to get started with. While Javascript back-end is not as sexy as the front-end, I believe server.js can turn things around.

My preferred method would be 3 doubtlessly. This way it would take ~1 month for the alpha, ~1 month for the beta, and then the rest of the time would be working with different people and refining it for the production version ~6 months in.

But I do not even know how to reach to those big companies and ask for help. If you can help or have any advice, please contact me or tell me how on Hacker News:
