---
layout: post.hbs
title: Aggressive idea execution 🚀
description: Exploring the limitations of Javascript's Promises and what I did to overcome them
date: 2019-02-16T20:00+09:00
---




Back in 2014 after winning a NASA hackathon everyone was amazed at how fast I was making things, but I wasn't happy so I spent the last 5 years consciously improving on this.

The most important things I learned about **executing ideas at high speed** with an estimated of 5-10x speed boost each are: [*the right abstraction*](#the-right-abstraction), a [*fast iterative process*](#fast-iterative-process) and a [*winner team*](#winner-team).

For this post to be useful you have to be **brutally honest with yourself** to the point it hurts. You need to have a very clear understanding of where your weaknesses are and leave your ego apart to focus on what matters. *If you don't know yourself you will succumb in every battle.*

You might develop [impostor syndrome](https://en.wikipedia.org/wiki/Impostor_syndrome) by doing just that. Luckily, being brutally honest with yourself also helps here! I *feel* like I'm a normal-to-mediocre programmer, but I know I'm biased so I can look at my progress from a more objective point of view.




## The right abstraction

First you have to really know **what you want** to achieve. There are too many perverse incentives and self-deception tricks working against you! Sit down and really consider this.

Then **work only for your goal** and review this as often as needed. You might have several goals and that is fine, but: be very conscious about your goals and remove any unconscious goal. Ask yourself how to best reach your goal and ask knowledgeable friends about this.

**Choose the right tool and path for the job**, which will depend greatly on your personal situation. If you are an engineer with a business partner you'll work towards your goal better as a CTO, even if that doesn't give you all the fame (hopefully assuming fame is not your real goal).

I'm very happy to see services that allow you to hook a simple Google Spreadsheet to a website/app and not worry about databases or code at all. These are bringing creative tools to the business people and makers and that is amazing.

This also has personal implications for learning about technology (Node.js? React?), different fields (design? marketing?) and about life itself (friends? hobbies?).

Let me give you some counter examples of how **not** to do things:

> *We are writing custom software because we want to launch a successful online store*.

Too often business people think they need it and devs want to make it, so new ecommerce software is written. I'd suggest to instead trying these, in order of importance:

1. Sell your products in **online stores** like Amazon, eBay, etc. This allows to start selling a product in few hours and see how the market reacts.
2. Use one of the **ecommerce solutions** like Shoppify, Magento, etc. This allows for custom branding and better marketing techniques in few days.
3. Customize **wordpress** with woocommerce or similar. This allows for lower fees and very custom functionality if your business really needs this and you can launch in few weeks.
4. Integrate with **3rd party** solutions like Stripe or Paypal. You would do this when adding payments into existing software, but I would *not* recommend it for an ecommerce.

> *We need to support 10 million concurrent users because everyone will love our idea.*

Let me tell you a very controversial opinion: **it's great to have scalability issues!** While you might not believe that, I'll rephrase it as a question for you: what is a better risk to have?

- Too many people are throwing their money at you and you have to work hard to accept it faster.
- You are running out of money and your website doesn't work at all after spending hundreds of thousands of dollars.

Of course no one likes those late nights, but in the grand schema of things and with those two being at each end of the scale, I'd choose the first one any day and you'd be a fool not to do the same.

> *We are discussing what pattern is better because we want to win a hackathon*.

After half a day of debates, I can already tell you that your team is not going to win. Throw dirty code at it as fast as possible, change your ideas as you go and adapt. Absolutely no one will care about code quality when evaluating your competition project.




## Fast iterative process

Great, after much consideration you have decided you can use a pre-made solution! Close this post, go there and get it done! **Really!**.

But if you decide to actually write software, you want to **"fail fast, fail cheap"**. You want to be able to make great progress at every stage as fast as possible. My general process is this, with times for personal ideas spent in each stage (multiply by 2-3x for work/3rd party ideas):

1. An **idea** comes. It is there and I'm thinking about it during my day to day down time.
2. Many **paper mockups (1-10 hours)** with alternative designs help to materialize it. Once it's on paper I can attack it for weakness and change it fast.
3. A **quick prototype (1-10 days)** is perfect to see if *the core idea* is useful and how people work with it. I make this quick and dirty with the idea of throwing the whole thing away.
4. A **Minimum Viable Product (10-100 days)** that has the core functionality with the *needed* support systems like login, storage, interface, etc. It will reuse the core idea from the prototype, but not the rest. It helps to discover new business cases and features.
5. **Production (100+ days)** with a proper deploy pipeline, testing and documentation. It has been improved from the MVP but it's flexible enough to accept new features.

The time will decrease with a team but not linearly because of combination effectiveness, so the points 1-3 are normally better done by a single person. Point 4 is debatable and point 5 should definitely be made by a team.

Once again the main issue here is people and their egos trying to go straight to point 5. "Why would my ideas be wrong? I'm an expert! It's the world/market/etc that is wrong!" Normally it gets funnier (or, sadder) the more "expert" someone believes they are.

As a practical example of how these steps might work for my personal project **Core Cards**:

1. Anki interface felt so 1999, how would Spaced Repetition look like if it was made today?
2. Made paper prototypes with a swipping interface which look like something I'd love using everyday.
3. Made a prototype to test the spaced repetition algorithm since I'm not 100% convinced. Used a [Node.js server]() with [Google Spreadsheets](https://github.com/franciscop/drive-db) for the data. Added Mongodb so that I can test it between server restarts.
4. I rewrote it in React and localStorage so that I can use it anywhere. Changed it to Preact and IndexedDB from what I learned here.

Never "*released for production*", but I've used it ~5.000 times and my Japanese has improved greatly because of it! *Mischief managed*. Some day my objectives might change and I might take it to production and try to sell it.




## A winner team






## Final notes

I'm totally wrong, please feel free to correct me and I'll read and consider every single one of your opinions. Special things I'd love to learn:

- What big topics am I missing here? There *are* many more topics not covered here since I'm trying to focus on the ones that have changed my productivity by *an order of magnitude*.
- I think each of these 3 points depends on the previous one respectively. A great team is nothing with a deeply flawed process, and a great process is nothing if it's not needed.
- People talk about taking months to get started in a new company, which seems crazy to me. I expect to be fully integrated within 1~2 weeks and so far it has been hold true.
