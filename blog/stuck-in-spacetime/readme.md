---
layout: post.hbs
title: Stuck in spacetime 🚀
description:
date: 2022-02-23T06:45+09:00
---

<script src="https://cdn.jsdelivr.net/npm/vector-graph"></script>

I just remembered an interesting question that plagued my mind when I was in high school, possibly even middle school, when my thoughts were even in another language.

The question is simply, "how can we walk or move?" Let me explain what I mean by that, at that point I was just discovering the basics of mathematics, possibly I learned that the atom was the smallest divisible unit -oh sweet summer child-.

To understand my question, let me fully express it as I remember I understood it back then. If you want to move any distance, first you move half of it and then the other half as you move through space. Sounds simple enough.

So for 1 meter, first you walk half a meter. Then as you move further you have to walk the next half of the distance left, 1/4th of a meter. And each segment would take an amount of time to be transversed, so it would look something like this:

<vector-graph width="400" height="400" x="0,1" y="0,1" grid="0.1" axis="m,t">
  <point x="0.5" y="0.5"></point>
  <vector from="0.5,0.5" to="0.8,0.5" label="v"></vector>
  <line color="#900" from="0,0" to="0.5,0"></line>
  <line color="#a00" from="0.5,0.1" to="0.75,0.1"></line>
  <line color="#b00" from="0.75,0.2" to="0.875,0.2"></line>
  <line color="#c00" from="0.875,0.3" to="0.937,0.3"></line>
  <line color="#d00" from="0.937,0.4" to="0.968,0.4"></line>
  <line color="#e00" from="0.968,0.5" to="0.984,0.5"></line>
  <line color="#f00" from="0.984,0.6" to="0.992,0.6"></line>
  <line color="#f00" from="0.992,0.7" to="0.996,0.7"></line>
  <line color="#f00" from="0.996,0.8" to="1,0.8"></line>
</vector-graph>

Since there are of course infinite number of steps, and each takes some time to be traversed, then the vertical axis (time) goes to infinity as you try to reach that 1 meter. So for my teen brain, how can you move an infinite number of steps in a finite time? It just made no sense for as much as I tried to make sense of it. If we smooth it out, it looks like this:

<vector-graph width="400" height="400" x="0,1" y="0,1" grid="0.1" units axis="m,t">
  <point x="0.5" y="0.5"></point>
  <vector from="0.5,0.5" to="0.8,0.5" label="v"></vector>
  <line color="#900" from="0,0" to="0.5,0.1"></line>
  <line color="#a00" from="0.5,0.1" to="0.75,0.2"></line>
  <line color="#b00" from="0.75,0.2" to="0.875,0.3"></line>
  <line color="#c00" from="0.875,0.3" to="0.937,0.4"></line>
  <line color="#d00" from="0.937,0.4" to="0.968,0.5"></line>
  <line color="#e00" from="0.968,0.5" to="0.984,0.6"></line>
  <line color="#f00" from="0.984,0.6" to="0.992,0.7"></line>
  <line color="#f00" from="0.992,0.7" to="0.996,0.8"></line>
  <line color="#f00" from="0.996,0.8" to="1,0.9"></line>
</vector-graph>

Of course with that graph, you could never reach 1 meter! You'd be stuck taking infinite steps trying to reach there, and if that's true for the arbitrary 1 meter it should be for any other distance! We are stuck in space-time!!

I went home terrified that day, but somehow I knew I was wrong because we can in fact walk and move through space. A good reminder that mathematics follows reality, and not the other way around.

Then that memory faded, locked away as a bad nightmare and somehow never resurfaced as I studied through calculus, derivatives, etc. in University.

Now in retrospective, the easy solution and what I didn't realize back then is that the time it'd take for each step would _also_ be half of the previous one. While I imagined the vertical temporal steps in the graph to be constant, in fact they'd be decreasing in size at the same rate the x axis was increasing in distance:

<vector-graph width="400" height="400" x="0,1" y="0,1" grid="0.1" axis="m,t">
  <line color="#90f" from="0,0" to="0.5,0"></line>
  <line color="#a0e" from="0.5,0.5" to="0.75,0.5"></line>
  <line color="#b0d" from="0.75,0.75" to="0.875,0.75"></line>
  <line color="#c0c" from="0.875,0.875" to="0.937,0.875"></line>
  <line color="#d0b" from="0.937,0.937" to="0.968,0.937"></line>
  <line color="#e0a" from="0.968,0.968" to="0.984,0.968"></line>
  <line color="#f09" from="0.984,0.984" to="0.992,0.984"></line>
  <line color="#f08" from="0.992,0.992" to="0.996,0.992"></line>
  <line color="#f07" from="0.996,0.996" to="1,0.996"></line>
</vector-graph>

If we smooth it out to see the actual speed, we in fact see that it's just a straight line to react 1 meter. Something that, now that I know of derivatives, it's quite logical since I was considering a constant velocity:

<vector-graph width="400" height="400" x="0,1" y="0,1" grid="0.1" axis="m,t">
  <line color="#70f" from="0,0" to="0.5,0.5"></line>
  <line color="#80e" from="0.5,0.5" to="0.75,0.75"></line>
  <line color="#90d" from="0.75,0.75" to="0.875,0.875"></line>
  <line color="#a0c" from="0.875,0.875" to="0.937,0.937"></line>
  <line color="#b0b" from="0.937,0.937" to="0.968,0.968"></line>
  <line color="#c0a" from="0.968,0.968" to="0.984,0.984"></line>
  <line color="#d09" from="0.984,0.984" to="0.992,0.992"></line>
  <line color="#e08" from="0.992,0.992" to="0.996,0.996"></line>
  <line color="#f07" from="0.996,0.996" to="1,1"></line>
</vector-graph>
