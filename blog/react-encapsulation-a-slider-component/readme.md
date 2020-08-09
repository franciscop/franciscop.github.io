---
layout: post.hbs
title: A React Slider component
description: It is easier than ever to make high quality React components. In this article I explain how to make a nice slider.
date: 2020-08-09T14:30:00Z
---

One of the things I like most from React is how you can define tight components that don't bleed their logic all over the place. This is an article to show how I'd build a slider that has an exponential range in React. I will be using `styled-components` for styles.

First, how would you normally create a plain slider in React? There's an HTML input type called `range` that fits the bill perfectly, so let's name that as the React component:

<iframe src="https://codesandbox.io/embed/react-slider-post-1-t8y8d?fontsize=14&hidenavigation=1&theme=dark&module=%2Fsrc%2FRange.js"
  class="codesandbox"
  style="height:300px;"
  title="React Slider post 1"
></iframe>

Great, it works nicely. We want to maintain the normal `<input />` value to follow standard web forms, which will give greater flexibility to those using this module. They will be able to use it as a controlled or uncontrolled input.

While our component very basics work, the user doesn't know what they are doing when they move the slider, so we'll show the value besides it. We will also add some style to the whole slider:

<iframe src="https://codesandbox.io/embed/pensive-fermi-drxi0?fontsize=14&hidenavigation=1&theme=dark&module=%2Fsrc%2FRange.js"
  class="codesandbox"
  title="pensive-fermi-drxi0"
></iframe>

Now we want to fulfill this blogpost requirements and make it exponential. There are few ways I can think of doing this in the code, so normally I would try a couple of them if I am not confident.

First I tried using some math functions in JS, but that turned out to yield some ugly numbers and not nice round ones. It'd jump from "87" to "103" and not let me choose a nice round "100".

Since this is for a tool for estimates, and not for real-world numbers, I decided to instead make a list of numbers that are allowed and use that in the slider:

<iframe src="https://codesandbox.io/embed/react-slider-post-3-nwzj2?fontsize=14&hidenavigation=1&theme=dark&module=%2Fsrc%2FRange.js"
  class="codesandbox"
  title="React Slider post 3"
></iframe>

This certainly has a different feeling from the free-flowing cursor from before. You can smooth it out by adding many more numbers, which we will do with a small helper function.

We can also add a bit of internationalization so the numbers are easier to read:

<iframe src="https://codesandbox.io/embed/react-slider-post-4-nnpuf?fontsize=14&hidenavigation=1&theme=dark&module=%2Fsrc%2FRange.js"
  class="codesandbox"
  title="React Slider post 4"
></iframe>

Finally we are going to deal with proper HTML and React things. I personally prefer uncontrolled components, but React input elements should normally be able to do either. Try both the controlled and uncontrolled componentts by opening `App.js` and modifying the code in this codesandbox:

<iframe src="https://codesandbox.io/embed/react-slider-post-5-7v9qy?fontsize=14&hidenavigation=1&theme=dark&module=%2Fsrc%2FSlider.js"
  class="codesandbox"
  title="React Slider post 5"
  ></iframe>
