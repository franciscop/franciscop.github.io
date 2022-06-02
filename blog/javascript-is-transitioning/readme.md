---
title: Javascript is going through its largest transition ever
---

> The Javascript ecosystem is going through its largest transition ever. Based on past transitions, everything should be smooth in 1-2 years, and right now we are at the "peak" of the pain for the transition.

I remember when I started programming, PHP had great documentation, and for Javascript you had to google what you wanted to do and try to find it -normally- in custom websites or personal websites subfolders/subdomains. Then the recommended way to include it was importing it with a script pointing to their domain, something like:

```html
<script src="https://mydomain.com/bundle.min.js"></script>
```

This favoured larger projects; if you were going to buy a domain, set up a whole website and manually manage it, then it better be worth of that work. It was not uncommon that those domains expired, the [URLs changed](https://www.w3.org/Provider/Style/URI), or even there was some worries about hijacks, but IIRC there was no major news about any malware (I don't think there would be _even_ if it had happened though).

Then came along Github and npm and ruined everything.

Wait no, <span title="That was SourceForge">that's not right</span>, they literally helped Open Source Javascript explode, having now millions of libraries at the tip of a simple command, `npm install X`.

So **what is actually wrong** with Javascript? Why so many people *hate it*?

## Do devs hate Javascript?

I cannot answer why devs hate JS without first examining the question itself! It seems to me that a lot of comments I hear from JS are negative, but if you know anything about social behavior this is to be expected. It's the same reason why platforms like Tripadvisor struggle, the human tendency to just be happy when things work well and complain and write bad reviews when things don't work make everything look disproportionately grim when you only look at reviews.

Platforms expend a HUGE amount of marketing and human effort to fight this, like how Airbnb implores you email after email to write a review, since they know the average experience is better than what the "natural" reviews would imply.

You never see Github Issues or Discussion like "I tried this JS module and it worked great, thanks!" (and that's good, please don't write those!), as an open source writer myself I learned to find my signal in a different place. Now I look at what the numbers say about my work.

Let's look at Javascript numbers!

![StackOverflow Survey](/blog/javascript-is-transitioning/so-survey.png)

> "JavaScript completes its ninth year in a row as the most commonly used programming language" - StackOverflow survey

It seems the vast majority of devs use Javascript, so that's likely a really good sign!

But it's not like there's no issues at all, Javascript has evolved greatly over the years, sometimes painfully, so here's a recap of how the whole ecosystem has changed:

## Ecosystem major changes

There have been multiple transitions in Javascript in the past, however they were all fully backwards-compatible, while *this one* (where `this` refers to commonjs → ESM) is the most painful one in the ecosystem, and the only one that is not 100% backwards compatible.

A timeline of JS ecosystem transitions, since Node.js was created:

- 2009: Node.js was created, adopting commonjs. On the front-end we had a bunch of ways to include files, none standard by a long shot.
- 2015: ES6 was a big welcome change. It brought us `const` and `let`, arrow functions, and a lot of nice things that make Javascript more flexible and usable. This was a minor transition since it was fully optional and backwards compatible, so only the best practices had to change. However, unlike the previous JS transitions where you could just wait for browsers to get upgraded, Internet Explorer was being a huge drag here, with no end in sight, so the concept of transpilers was born as well.
- 2017-2020: Callbacks to Promises. You might remember [callbackhell.com](http://callbackhell.com/) that talks about Promises as the "more advanced" solution and mentions the proposed "async/await" operations. This transition was non-trivial, since for a while you had to choose between callbacks or promises, and if a library you were using still wasn't updated then you had to write some wrappers. Also you had to polyfill Promises for older browsers. In 2022, 100% of the code you are writing is expected to be using async/await, and let me tell you it's _amazing_ compared to the old days. I'm so happy we made this transition!
- 2018+: Typescript. I personally don't like it *because* it adds another layer of compound complexity to this whole thing, and I have never seen experienced JS devs add bugs that I thought could be avoided with typescript, but I _have_ seen junior ones do it so if you want to use it sure up to you. I just needed to mention that it does add another layer of complexity here, and it encroaches the need to use bundlers/transpilers even more.
- 2020-2022: CommonJS to ESM. This takes a whole section to be explained! Read on.

> Note: I'm purposefully ignoring many things like runtimes, frameworks, bundlers, testing, etc. because they have more to do with preferences than the actual language/language specification.

## Commonjs vs ESM

> Historically, it all started with a simple `<script src="...">`, then when you had multiple scripts requirejs came up. This led to commonjs (legitimized by Node.js), then AMD/UMD, and finally ESM. ESM _is_ the standard, so everything else should be deprecated and eventually only ESM should be used.

Okay this is the big one, the one that messes everything and throws confusing errors on your terminal. How did _this_ mess even happen (by `this` I mean... you know what I mean).

When the front-end used to include files using `<script src="..."></script>`, the backend in this new Node.js runtime had no way to do the same, so they took one library that helped with it and incorporated the way it works, commonjs:

```js
const fs = require('fs');
```

This library, specifically in Node.js, knew that 'fs' here was a native module, while installed modules were in `node_modules`. This worked okay, but it broke one of the biggest promises of Node.js: it's the same language as the front-end, so you can reuse modules in both front-end and back-end.

The designers - and users - of JS didn't like that, and in the past they've been very succesfully followed a recipe: let devs create workarounds and ways to deal with the inefficiencies of the language, and _then_ when it's kind of agreed upon modify the language to add the same functionality in the core. From `.querySelectAll()` to the Promises we saw earlier, this has worked pretty well!

This gave rise to EcmaScript Modules, or ESM. The JS committee created a specification of how to include a file inside another, based on commonjs and other languages, which is the right thing to do. However, the problem is that the goals and details didn't fully match what commonjs was doing:

- `import/export` was supposed to be statically analyzable, this has consequences.
- `require()` is highly dynamic, A.K.A. not statically analyzable.
- `import` need to be on the top, at the top-level (consequence) and not under any dynamic code
- `import` cannot use variables on its module names (consequence)
- `export` has to be at the top-level (consequence), meaning they cannot be dynamic or conditional

In 2020 Node.js finally decided to support ESM. It took a long time exactly because of these issues, and meanwhile Node.js creator decided to stop waiting and created his own Deno with Imports and more web standards while ESM was discussing ESM.

<details>
  <summary>Webpack double the trouble!</summary>
  <p>React and Webpack DID adopt the new ESM early on, since it was better than require() for React world and that was transpiled anyway, however what they did is translate <code>import</code> to <code>require</code> straight away, which is <strong>not</strong> compatible with the ESM specification! Talk about fragmentation...</p>
</details>

They were incompatible so the *only* way they could make ESM work with commonjs is to just separate them; the Michael Jackson `.mjs` extension was born, and there was such a kickback from the community that the `"type": "module"` option was added to `package.json` as well, since apparently it couldn't be decided at runtime if a file was commonjs or ESM.

So now you have this matrix of compatibility:

- ESM app uses ESM library: easy, only use import/export. Oh, and remember `"type": "module"`.
- Commonjs app uses commonjs library: straightforward, only use require()/module.exports.
- ESM app uses commonjs library: works, might need some import shenanigans though like `import pkg from 'pkg'; const lib = pkg.default;` or `import { default as pkg } from 'pkg'`.
- commonjs app uses ESM library: invalid.

## The future of Javascript

The community aspect of this is ugly! If you are a library author looking at the above table, you would never publish your modules as ESM, since commonjs _kinda_ works on both worlds but not the other way around.

But from the user perspective, you should always use ESM, since ESM libraries just work, and commonjs normally just works. For the last couple of years we've seen devs using ESM more and more in applications.

> If you are a library author you can help this transitioning by moving early to ESM and prompt your users to use ESM as well. I added a warning on top of my projects for now saying they only work with ESM.

So right now we are in a hard place; once enough users have upgraded their Node.js installations and started using ESM, then libraries can migrate and things will quickly pick up the pace. IIRC the officially supported Node.js versions _all_ support ESM already, so I expect that this year (maybe next at most) most new libraries should be published as ESM.

Once most users - and libraries - are being written as ESM, then we can go to npm and beg them to change the default `"type": "commonjs"` to `"type": "module"`, so that you have one worry less.

Looking at past JS transitions, like promises, I expect that within this/next year the bulk of Node.js libraries have migrated to ESM, and in a couple of years we are all laughing at that "require()" thing, the same way we laugh now at Callback Hell.
