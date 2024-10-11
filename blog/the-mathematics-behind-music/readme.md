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

> This blog post is a rewrite of an old experiment I made 10+ years ago.

I love SVGs and how they are mathematical representations in text of geometrical figures, and it's easy to understand because it's all visual.

The trick **is** that it's all visual. Sound on the other hand is usually harder for people to understand, since there's multiple concepts that are a bit more advanced like the Fourier tranformation, inverse squared attenuation, etc.

So, let's make sound visual! If you open any song in a music editor, it'll look something like this:

![Soundwave](/blog/the-mathematics-behind-music/soundwave.png)

But if you zoom in, first you'll see an individual wave:

![Single wave](/blog/the-mathematics-behind-music/wave.png)

And if you keep zooming in, you'll see what looks like a periodic wave:

<vector-graph x="0,0.1" y="-1,1" width="400">
  <plot fn="0.4 * Math.sin(440 * x + 1) + 0.2 * Math.sin(880 * x + 2) + 0.2 * Math.sin(1320 * x + 4) + 0.2 * Math.sin(2200 * x + 4)" color="red" width="1"></plot>
</vector-graph>

We know that any periodic wave, no matter the shape, can be decomposed with a Fourier transformation into a sum of sines. So the opposite is also true, to build a periodic wave, you can combine a series of sines.

**TODO**

The goal of this experiment is to understand the building blocks of music. This stems from the lack of a .sva for scalar vector audio and the question "How can we create mathematically perfect music?"

<script src="/blog/the-mathematics-behind-music/vector-graph.js"></script>
