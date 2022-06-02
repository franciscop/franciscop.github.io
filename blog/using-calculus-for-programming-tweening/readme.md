---
layout: post.hbs
title: Using calculus for programming; tweening
description: Blabla
date: 2022-06-31 17:00:00+09:00
---

<script type="module" src="https://cdn.jsdelivr.net/npm/vector-graph"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.15.6/dist/katex.min.css" integrity="sha384-ZPe7yZ91iWxYumsBEOn7ieg8q/o+qh/hQpSaPow8T6BwALcXSCS6C6fSRPIAnTQs" crossorigin="anonymous">

<script defer src="https://cdn.jsdelivr.net/npm/katex@0.15.6/dist/katex.min.js" integrity="sha384-ljao5I1l+8KYFXG7LNEA7DyaFvuvSCmedUf6Y6JI7LJqiu8q5dEivP2nDdFH31V4" crossorigin="anonymous"></script>

<script defer src="https://cdn.jsdelivr.net/npm/katex@0.15.6/dist/contrib/auto-render.min.js" integrity="sha384-+XBljXPPiv+OzfbB3cVmLHf4hdUFHlWNZN5spNQ7rmHTXpd7WvJum6fIACpNNfIR" crossorigin="anonymous"
    onload="renderMathInElement(document.body);"></script>

<style>
vector-graph {
margin: 0 auto;
display: block;
width: 200px;
height: 200px;
}
</style>

I needed a function that would interpolate from A to B over time in a smooth manner. So if the value was initially (or before t=0) 0, then it changed to X at time T, it should behave something like this:

<vector-graph id="plain" x="-0.2,1.2" y="-0.2,1.2" grid="0.2" axis="t,value">
<plot fn="x<0?0:x>1?1:(2 - (Math.pow(x,3) - 1.5 * Math.pow(x,2) + 1) * 2)" from="0" to="0"></plot>
<line from="-2,0" to="0,0" color="red"></line>
<line from="1,1" to="3,1" color="blue"></line>
<point x="0" y="0" axis="0,0"></point>
<point x="1" y="1" axis="T,X"></point>
</vector-graph>

We know from basic trigonometry that if we resolve the _easier_ problem where T=1 and X=1, then we can interpolate the points in the graph and translate them, so let's resolve the easier graph instead:

<vector-graph id="plain" x="-0.2,1.2" y="-0.2,1.2" grid="0.2" axis="t,value">
<plot fn="x<0?1:x>1?0:((Math.pow(x,3) - 1.5 * Math.pow(x,2) + 1) * 2 - 1)" from="0" to="0"></plot>
<line from="-2,1" to="0,1" color="red"></line>
<line from="1,0" to="3,0" color="blue"></line>
<point x="1" y="0" axis></point>
<point x="0" y="1" axis></point>
</vector-graph>

To find out the equation needed, I knew it had to be at least a 3rd grade equation, since it has two possible points that can become a peak or a valley. So we start with a general equation of:

$$f(t) = A t^3 + B t^2 + C t + D$$

However we not only want that, but we also want to solve it for any initial slope, that is if the graph was already transitioning it should _smoothly_ interpolate to another graph. That's what most interpolating libraries in Javascript get wrong BTW, so that's why I wanted to make this.

We have a few variables there to resolve, so what do we know? We know:

- The initial value is 0,1
- The final value is 1,0
- The initial slope value is S
- The final slope is 0

The final value slope is calculated with the derivative for t=1, so that seems promising:

$$f'(t) = 3A t^2 + 2 B t + C$$

$$f'(t = 0) = 0 + 0 + C = S \rightarrow C = S ⚡$$

$$f'(t = 1) = 3A t^2 + 2 B t + C = 0 \rightarrow$$

$$3A + 2B + S = 0$$

Let's combine that with the initial value:

$$f(t=0) = 0 + 0 + 0 + D = 1 \rightarrow D = 1 ⚡$$

$$f(t=1) = A + B + S + 1 = 0 \rightarrow$$

So we end up with two equations:

$$A + B + S + 1 = 0$$

$$3A + 2B + S = 0$$

Let's resolve for $A = - 1 - S - B$:

$$3(- 1 - S - B) + 2B + S + 1 = 0$$

$$- 3 - 3S - 3B + 2B + S + 1 = 0$$

$$- 2 - 2S - B = 0$$

$$B = - 2 - 2S$$
