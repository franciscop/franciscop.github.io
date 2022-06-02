---
layout: post.hbs
title: Algebra and Javascript - Drawing an Arrow
description: In this article we learn with graphics, mathematics and code how to draw an arrow with line segments
date: 2022-06-02 17:00:00+09:00
---

In JS when you draw things manually often you need some mathematics to help you. In this article we're going to see an introduction to how to solve one such problem, drawing an arrow with lines. It could be applied to drawing in a canvas, SVG, Mapbox API, etc.

You are going to learn through visualizations, mathematics and code! So this is an exciting article for me to write, hope you enjoy it as well!

Let's say you have two arbitrary points and a line between them, \\(A [A_x, A_y]\\) and \\(B [B_x, B_y]\\):

<vector-graph id="plain" x="0,5" y="0,5" width="300" height="300">
  <line from="1,1" to="4,4" color="blue"></line>
  <point x="1" y="1" axis="Ax,Ay" label="A"></point>
  <point x="4" y="4" axis="Bx,By" label="B"></point>
</vector-graph>

Now we want to draw the simplest arrow possible with more line segments, like this:

<vector-graph id="plain" x="0,5" y="0,5" width="300" height="300">
  <line from="1,1" to="4,4" color="blue"></line>
  <line from="4,4" to="2.5,3.6" color="red" label="5px"></line>
  <line from="2.5,3.6" to="3.6,2.5" color="red"></line>
  <line from="3.6,2.5" to="4,4" color="red"></line>
  <point x="1" y="1" label="A"></point>
  <point x="4" y="4" label="B"></point>
  <point x="2.5" y="3.6" label="C"></point>
  <point x="3.6" y="2.5" label="D"></point>
  <angle label="30°" x="4" y="4" radius="1.2" from="195" to="225"></angle>
</vector-graph>

Since A and B could be anywhere, it's not a problem you can solve numerically once and leave it, but instead we need to solve it with a function in code. For that, we are going to solve it in multiple steps, each with a visualization, the associated mathematics and JS code.

## Solving the triangle

Zooming into the head of the arrow, we can solve things here using [the trigonometric functions](https://en.wikipedia.org/wiki/Trigonometric_functions#Right-angled_triangle_definitions). Let's resolve the triangle BCN by calculating the sizes of the sides:

<vector-graph id="plain" x="0,5" y="1,5" width="300" height="240" axis="false">
  <polygon points="2,2;4,4;1,3" sides=",5px," angles="90°,30°,"></polygon>
  <point x="2" y="2" label="N" color="red"></point>
  <point x="1" y="3" label="C" color="red"></point>
  <point x="4" y="4" label="B" color="red"></point>
</vector-graph>

$$sin(30) = {\\overline{CN} \\over 5} \\rightarrow \\overline{CN} = 5 \\cdot sin(30) = 2.5px$$

$$cos(30) = {\\overline{BN} \\over 5} \\rightarrow \\overline{BN} = 5 \\cdot cos(30) = 4.33px$$

We can just define these as variables in the code, since we know they won't change:

```js
function findC(A, B) {
  const t_long = 4.33;
  const t_short = 2.5;
}
```

## Finding the point C

Now we have the size, but still need the direction where to apply it, the vector \\(\\vec{V}\_{BC}\\). To obtain it, we are going to find the vector \\(\\vec{V}\_{BN}\\) first and then the vector \\(\\vec{V}\_{NC}\\). Adding them together, we obtain the vector \\(\\vec{V}\_{BC}\\). Finally, adding B to that vector we can obtain C:

<vector-graph id="plain" x="0,5" y="1,5" width="300" height="240" axis="false">
  <vector from="4,4" to="2,2" color="red" label="BN"></vector>
  <vector from="4,4" to="1,3" color="red" label="BC"></vector>
  <vector from="2,2" to="1,3" color="red" label="NC"></vector>
  <line from="1,1" to="2,2" dashed></line>
  <point x="2" y="2" label="N"></point>
  <point x="1" y="3" label="C"></point>
  <point x="4" y="4" label="B"></point>
</vector-graph>

$$C = B + \\vec{V}\_{BC} = B + \\vec{V}\_{BN} + \\vec{V}\_{NC}$$

> We could have solved this with problem with plain angles as well, but I find vectors useful specially in more complex situations or 3D problems, so it's good to have practice with them

<br />

### Finding \\(\\vec{V}\_{BN}\\)

Since the longer side goes in the direction of \\(\\vec{V}\_{BA}\\) (note: not \\(\\vec{V}\_{AB}\\)), we can multiply the longer side by the unit vector \\(\\hat{V}\_{BA}\\) to obtain the vector \\(\\vec{V}\_{BN}\\):

<vector-graph id="plain" x="0,5" y="1,5" width="300" height="240" axis="false">
  <polygon points="2,2;4,4;1,3"></polygon>
  <vector from="4,4" to="2,2" color="red" label="V"></vector>
  <line from="1,1" to="2,2" dashed></line>
  <point x="2" y="2" label="N" color="red"></point>
  <point x="1" y="3" label="C" color="red"></point>
  <point x="4" y="4" label="B" color="red"></point>
</vector-graph>

$$\\vec{V}\_{AB} = B - A$$

$$\\vec{V}\_{BN} = 4.33 \\cdot \\hat{V}\_{BA} = - 4.33 \\cdot \\hat{V}\_{AB} = -4.44 \\space {\\vec{V}\_{AB} \\over {|V_{AB}|}}$$

```js
function findC(A, B) {
  const t_long = 4.33;
  const t_short = 2.5;
  const v_ab = [B[0] - A[0], B[1] - A[1]];
  const mod = Math.sqrt(Math.pow(v_ab[0], 2) + Math.pow(v_ab[1], 2));
  const unit = [v_ab[0] / mod, v_ab[1] / mod];
  const v_bn = [- 4.33 * unit[0], - 4.33 * unit[1]];
}
```

### Finding \\(\\vec{V}\_{NC}\\)

Now in a similar fashion we need to obtain the vector \\(\\vec{V}\_{NC}\\). For this, after a quick Google search we know we can obtain a perpendicular vector we can flip the values and negate one of them\*. If we rotate the unit vector, the resulting vector will also be unitary, which is very useful:

<vector-graph id="plain" x="0,5" y="1,5" width="300" height="240" axis="false">
  <polygon points="2,2;4,4;1,3"></polygon>
  <vector from="2,2" to="1,3" color="red" label="V"></vector>
  <line from="1,1" to="2,2" dashed></line>
  <point x="2" y="2" label="N" color="red"></point>
  <point x="1" y="3" label="C" color="red"></point>
  <point x="4" y="4" label="B" color="red"></point>
</vector-graph>

$$\\hat{V}\_{BN} = a\\vec{i} + b\\vec{j} \\rightarrow \\bot\\hat{V}\_{BN} = -b\\vec{i} + a\\vec{j}$$

$$\\vec{V}\_{NC} = 2.5 \\cdot \\hat{V}\_{NC} = 2.5 \\cdot \\bot \\hat{V}\_{BN}$$

```js
function findC(A, B) {
  const t_long = 4.33;
  const t_short = 2.5;
  const v_ab = [B[0] - A[0], B[1] - A[1]];
  const mod = Math.sqrt(Math.pow(v_ab[0], 2) + Math.pow(v_ab[1], 2));
  const unit = [v_ab[0] / mod, v_ab[1] / mod];
  const v_bn = [- 4.33 * unit[0], - 4.33 * unit[1]];
  // Order is reversed and one negated on purpose to obtain the perpendicular
  const v_nc = [-2.5 * unit[1], 2.5 * unit[0]];
}
```

> \* For the perpendicular vector it doesn't matter which one we negate, since the arrow is symmetrical and in a later section we'll reverse this whole vector, obtaining the other side. If it matters to you, make sure to negate the right one!

<br />

### Putting \\(\\vec{V}\_{BC}\\) together

Finally we add both vectors to obtain \\(\\vec{V}\_{BC}\\), from which we can obtain the point C reliably in code:

<vector-graph id="plain" x="0,5" y="1,5" width="300" height="240" axis="false">
  <polygon points="2,2;4,4;1,3"></polygon>
  <vector from="4,4" to="1,3" color="red" label="V"></vector>
  <line from="1,1" to="2,2" dashed></line>
  <point x="2" y="2" label="N" color="red"></point>
  <point x="1" y="3" label="C" color="red"></point>
  <point x="4" y="4" label="B" color="red"></point>
</vector-graph>

$$\\vec{V}\_{BC} = \\vec{V}\_{BN} + \\vec{V}\_{NC}$$

$$C = B + \\vec{V}\_{BC}$$

```js
function findC(A, B) {
  const t_long = 4.33;
  const t_short = 2.5;
  const v_ab = [B[0] - A[0], B[1] - A[1]];
  const mod = Math.sqrt(Math.pow(v_ab[0], 2) + Math.pow(v_ab[1], 2));
  const unit = [v_ab[0] / mod, v_ab[1] / mod];
  const v_bn = [- 4.33 * unit[0], - 4.33 * unit[1]];
  // Order is reversed and one negated on purpose to obtain the perpendicular
  const v_nc = [-2.5 * unit[1], 2.5 * unit[0]];
  const v_bc = [v_bn[0] + v_nc[0], v_bn[1] + v_nc[1]];
  return [B[0] + v_bc[0], B[1] + v_bc[1]];
}
```

## Finding the point D

Great! The hard part is done, now following the same steps with a small change we can obtain the point D. We flip the vector \\(\\vec{V}\_{NC}\\) to obtain \\(\\vec{V}\_{ND}\\):

```js
function findD(A, B) {
  const t_long = 4.33;
  const t_short = 2.5;
  const v_ab = [B[0] - A[0], B[1] - A[1]];
  const mod = Math.sqrt(Math.pow(v_ab[0], 2) + Math.pow(v_ab[1], 2));
  const unit = [v_ab[0] / mod, v_ab[1] / mod];
  const v_bn = [- 4.33 * unit[0], - 4.33 * unit[1]];
  // Order is reversed and THE OTHER negated on purpose to obtain the opposite
  const v_nd = [2.5 * unit[1], -2.5 * unit[0]];
  const v_bd = [v_bn[0] + v_nd[0], v_bn[1] + v_nd[1]];
  return [B[0] + v_bd[0], B[1] + v_bd[1]];
}
```

## Testing with a SVG arrow

It seems we have all the pieces! Let's try our code by drawing an arrow in SVG:

```js
function findC(A,B) {...}
function findD(A,B) {...}

const A = [1,1];
const B = [80,80];
const C = findC(A, B);
const D = findD(A, B);

const svg = document.querySelector('#svg-sample');
const drawLine = (A, B) => `
  <line
    x1="${A[0]}px" y1="${A[1]}px"
    x2="${B[0]}px" y2="${B[1]}px"
    stroke="black" stroke-linecap="round"
  />`;
svg.innerHTML += drawLine(A, B);
svg.innerHTML += drawLine(B, C);
svg.innerHTML += drawLine(C, D);
svg.innerHTML += drawLine(D, B);
```

<svg id="svg-sample" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="300px" height="300px" style="transform:scaleY(-1)">
</svg>

<script>
function findC(A, B) {
  const t_long = 4.33;
  const t_short = 2.5;
  const v_ab = [B[0] - A[0], B[1] - A[1]];
  const mod = Math.sqrt(Math.pow(v_ab[0], 2) + Math.pow(v_ab[1], 2));
  const unit = [v_ab[0] / mod, v_ab[1] / mod];
  const v_bn = [- 4.33 * unit[0], - 4.33 * unit[1]];
  // The order is reversed on purpose to obtain the perpendicular vector
  const v_nc = [-2.5 * unit[1], 2.5 * unit[0]];
  const v_bc = [v_bn[0] + v_nc[0], v_bn[1] + v_nc[1]];
  return [B[0] + v_bc[0], B[1] + v_bc[1]];
}

function findD(A, B) {
  const v_ab = [B[0] - A[0], B[1] - A[1]];
  const t_long = 4.33;
  const t_short = 2.5;
  const mod = Math.sqrt(Math.pow(v_ab[0], 2) + Math.pow(v_ab[1], 2));
  const unit = [v_ab[0] / mod, v_ab[1] / mod];
  const v_bn = [- 4.33 * unit[0], - 4.33 * unit[1]];
  // The order is reversed on purpose to obtain the perpendicular vector
  const v_nd = [2.5 * unit[1], -2.5 * unit[0]];
  const v_bd = [v_bn[0] + v_nd[0], v_bn[1] + v_nd[1]];
  return [B[0] + v_bd[0], B[1] + v_bd[1]];
}

const A = [1,1];
const B = [80,80];
const C = findC(A, B);
const D = findD(A, B);

const svg = document.querySelector('#svg-sample');
const drawLine = (A, B) => `
  <line
    x1="${A[0]}px" y1="${A[1]}px"
    x2="${B[0]}px" y2="${B[1]}px"
    stroke="black" stroke-linecap="round"
  />`;
svg.innerHTML += drawLine(A, B);
svg.innerHTML += drawLine(B, C);
svg.innerHTML += drawLine(C, D);
svg.innerHTML += drawLine(D, B);
</script>

It works! The SVG has the right shape as we wanted. We should normally use a path to ensure those corners are rounded properly at all sizes, but for a quick test we can see the coordinates are in the right place.

## Putting it all together

Let's create a single function, which means we can also simplify things by merging findC and findD:

```js
// Receives two points and returns an array with the 5 points needed to draw
// the full arrow:
function generateArrow(A, B) {
  const t_long = 4.33;
  const t_short = 2.5;
  const v_ab = [B[0] - A[0], B[1] - A[1]];
  const mod = Math.sqrt(Math.pow(v_ab[0], 2) + Math.pow(v_ab[1], 2));
  const unit = [v_ab[0] / mod, v_ab[1] / mod];
  const v_bn = [- 4.33 * unit[0], - 4.33 * unit[1]];
  // The order is reversed on purpose to obtain the perpendicular vector
  const v_nc = [-2.5 * unit[1], 2.5 * unit[0]];
  const v_bc = [v_bn[0] + v_nc[0], v_bn[1] + v_nc[1]];
  const C = [B[0] + v_bc[0], B[1] + v_bc[1]];

  // Obtain D based on the previous variables
  const v_nd = [2.5 * unit[1], -2.5 * unit[0]];
  const v_bd = [v_bn[0] + v_nd[0], v_bn[1] + v_nd[1]];
  const D = [B[0] + v_bd[0], B[1] + v_bd[1]];

  return [A, B, C, D, B];
}
```

**Exercise for the reader**: modify this generateArrow function to accept a `size` (the size of the side of the arrow in pixels) and `angle` (half of the angle of the tip, in degrees) like this, to allow drawing thinner or fatter arrows:

```js
generateArrow(A, B, { size: 10, angle: 20 });
```

 > Tip: the mathematics of this bit is already in this article.


<script type="module" src="https://cdn.jsdelivr.net/npm/vector-graph"></script>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.15.6/dist/katex.min.css" integrity="sha384-ZPe7yZ91iWxYumsBEOn7ieg8q/o+qh/hQpSaPow8T6BwALcXSCS6C6fSRPIAnTQs" crossorigin="anonymous">

<script defer src="https://cdn.jsdelivr.net/npm/katex@0.15.6/dist/katex.min.js" integrity="sha384-ljao5I1l+8KYFXG7LNEA7DyaFvuvSCmedUf6Y6JI7LJqiu8q5dEivP2nDdFH31V4" crossorigin="anonymous"></script>

<script defer src="https://cdn.jsdelivr.net/npm/katex@0.15.6/dist/contrib/auto-render.min.js" integrity="sha384-+XBljXPPiv+OzfbB3cVmLHf4hdUFHlWNZN5spNQ7rmHTXpd7WvJum6fIACpNNfIR" crossorigin="anonymous"
    onload="renderMathInElement(document.body);"></script>

<style>
vector-graph {
margin: 0 auto;
display: block;
width: 300px;
min-height: 200px;
}
</style>
