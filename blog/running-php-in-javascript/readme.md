---
layout: post.hbs
title: Running PHP in Javascript 🤯
description: After tweaking things around, I could get a basic PHP version running in pure Javascript
date: 2018-11-16 22:00:00+09:00
---



*But why?* you are wondering. You must be given some context: this is an experiment [inside another experiment I'm doing](https://github.com/franciscop/create-static-web) to learn about Static Site Generators. PHP is the first language I knew well and I wanted to test whether it's a horrible or just a bad idea to use it for templates.

> If you come from Google trying to find how to run PHP inside Javascript, you are very likely lost. Beware, this article is only for experts! <a title="the '/s' stands for 'sarcasm'" href="https://www.urbandictionary.com/define.php?term=%2Fs">/s</a>

Since a large motivator for my site generator is to rely purely on Node.js and *not* to have to install Ruby, I also don't want to install PHP! But can you run PHP inside Javascript? I only need the most basic PHP features: variables, echo, loops.

The language of this article might be deceiving, but there is really **[a working demo](#demo)**.



## Initial objective

The idea came when I was making FrontMatter work properly for the current file. It is also related to my general dissatisfaction with the Node.js template engines, but that a topic for another day:

```html
---
title: Running PHP in Javascript
---
<head>
  <title>{{title}}</title>
  <meta property="og:title" content="{{title}}" />
</head>
```

It reminded me quite a bit to what can be achieved with raw PHP:

```html
<? $title = "Running PHP in Javascript"; ?>
<head>
  <title><?= $title ?></title>
  <meta content="<?= $title ?>" property="og:title" />
</head>
```



## Googling around

Google just led me to [780 StackOverflow questions](https://stackoverflow.com/search?q=run+php+inside+javascript) with `-1` average score. After reading some, I believe the average score should be more like `-5`. I also learned that devs are trying to do:

```js
alert("<?= "Hello world" ?>");
```

As an astute reader might notice, that is supposed to run first through the PHP server, *then* sent to the browser and finally run the resulting `alert("Hello world")` on the client. But this level of sophistication is too high, I just want to run raw PHP on the browser! I want something like this:

```js
// No server needed, "just" Javascript parsing PHP
alert(php(`<?= "Hello world" ?>`));
```

But not even [Reddit's "PHP" search](https://www.reddit.com/r/atwoodslaw/search?q=php) in [ `r/atwoodslaw`](https://www.reddit.com/r/atwoodslaw/) could find what I seek.



## Promising finds

After getting lucky with a *"PHP parser Javascript"* search, I end up finding the package [`php-parser` in Github/npm](https://github.com/glayzzle/php-parser). The problem is that the output is an [*Abstract Syntax Tree*](https://en.wikipedia.org/wiki/Abstract_syntax_tree). I just wanted to run the code, not whatever an abstract tree seems to be:

![An abstract tree somehow](abstract-tree.q50.jpg)

Since you are reading this it means that in the [*Related Projects*](https://github.com/glayzzle/php-parser#related-projects) category I found my next clue. I head to the website with the <span title="I know, it's a tanuki ;)">funny looking cat</span>: [`babel-preset-php`](https://gitlab.com/kornelski/babel-preset-php). It transpiles PHP into Javascript 🎉

Since babel is in total chaos with the whole `babel-loader` vs `@babel/loader` and no one knows which one is which (ironic, innit?), I give up and take a break. I do practice [my Kanjis](https://core.cards/), speak with my family in Spanish and think about the English title for this article.



## Building up the library

Fresh again, I ravage the library `babel-preset-php` to build a different project. I am now using:

- `php-parser` to transform the PHP into the Abstract Tree thing.
- `babel-preset-php` ravaged files to do something that I have no idea what it is but it's the only way to keep it working.
- `@babel/generator` to finally generate the Javascript from the previous step.
- A bit of Javascript. I use the fancier `new Function()` to pretend it's better than `eval()`.

I wasn't going to show you, but since my code is so tiny thanks to those great libraries I can just paste it here for your satisfaction:

```js
import parser from 'php-parser';
import translator from './translator';
import generator from '@babel/generator';

const run = (code, opts) => {
  // Make a closure so that `out` doesn't collide with the PHP variables:
  let out = '';
  // Define `echo` since it's used in the transpiled JS code for some reason
  opts.echo = opts.echo || (str => out += str);
  // Pretend this is safe. Pro tip: IT IS NOT SAFE
  new Function(...Object.keys(opts), code)(...Object.values(opts));
  return out;
}

export default function (src, opts = {}) {
  const ast = new parser().parseCode(src);
  const file = translator.translateProgram(ast);
  const code = generator(file).code;
  return run(code, opts);
};
```

Later on I will export some individual parts for better testing, but that is really all there is to it.



## Demo

The long-awaited demo! Turn your internet off, hide your kids and say your prayers. I already loaded [the `php()` function](./php.min.js) for you, but are you *ready* to run it?

<script src="php.min.js"></script>
<form id="horrible">
<textarea>alert(php(&#x60;&#x3C;?= &#x22;for fun! &#x22;.$right ?&#x3E;&#x60;, { right: &#x27;&#x1F622;&#x27; }));</textarea>
<button data-tooltip="Are you sure? Like, 100%? There is no coming back">EVAL()</button>
<script>
  const $ = sel => document.querySelector(sel);
  $('#horrible').addEventListener('submit', e => {
    e.preventDefault();
    eval($('#horrible textarea').value);
  });
</script>

Tips to make the demo better for [lack of documentation](https://documentation.agency/):

- I am running `eval()` against your code. The php() function is basically running `eval()` internally. Do I get a "Go to Jail card" for basically doing `eval(eval(...))`?
- Use [backticks](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) as the first argument of `php()` to allow for any quote type and multi line.
- Provide a second argument as a plain object like `{ hello: 'world' }` to define the variable `$hello` with the value `"world"` inside PHP.



## Closures

Yup, this sucks. Use it just as an example of things that should never happen. If you *really, really* need to use this, and want more features, feel free to throw me loads of money and I might consider talking you out of it or contact the relevant health authorities.

Now that we have reached this point and seeing how many languages have AST generators, I ponder: can *any* language be transpiled to Javascript? [Should we do it?](https://www.youtube.com/watch?v=kY-pUxKQMUE) Webassembly is gonna eat JS so we might just give it a try!

If you hate PHP, or Javascript, and you *really* want to let me and others know<a title="You want to feel like you belong, but spreading hate on PHP won't change the fact that no one really likes you...">\*</a> feel free to comment on Hacker News:
