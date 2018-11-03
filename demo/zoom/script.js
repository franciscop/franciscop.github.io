const random = (max = 1, min = 0) => Math.random() * (max - min) + min;

const hexa = num => Math.min(parseInt(num), 15).toString(16);

const log = Math.log;

const config = {
  speed: 1.02,
  margin: 20,
};

const points = [];

const primitives = ctx => ({
  arc: (x, y, size, options) => {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    for (let key in options) {
      ctx[key] = options[key];
    }
    if (options.fillStyle) ctx.fill();
    if (options.strokeStyle || options.lineWidth) ctx.stroke();
  }
});

faster(({ index, ctx, width, height }) => {
  const { arc } = primitives(ctx);

  points.push({ x: random(width), y: random(height), start: new Date() });
  points.push({ x: random(width), y: random(height), start: new Date() });

  points.slice().reverse().forEach((p, i) => {
    p.diff = (new Date() - p.start) / 1000;
    p.size = p.diff * 50;

    // Remove out-of-canvas points
    if (p.x + p.size < 0) return points.splice(points.indexOf(p), 1);
    if (p.x - p.size > width) return points.splice(points.indexOf(p), 1);
    if (p.y + p.size < 0) return points.splice(points.indexOf(p), 1);
    if (p.y - p.size > height) return points.splice(points.indexOf(p), 1);

    const strokeStyle = '#' + hexa(3 * p.diff + 50) + hexa(3 * p.diff + 50) + hexa(3 * p.diff + 50);
    p.x = (p.x - width / 2) * config.speed + width / 2;
    p.y = (p.y - height / 2) * config.speed + height / 2;
    if (p.x > width / 2 - config.margin && p.x <= width / 2) p.x -= config.margin;
    if (p.x < width / 2 + config.margin && p.x >= width / 2) p.x += config.margin;
    if (p.y > height / 2 - config.margin && p.y <= height / 2) p.y -= config.margin;
    if (p.y < height / 2 + config.margin && p.y >= height / 2) p.y += config.margin;
    arc(p.x, p.y, p.size, { strokeStyle, lineWidth: p.diff * 2, fillStyle: "rgba(0, 0, 0, 0.75)" });
  });
});
