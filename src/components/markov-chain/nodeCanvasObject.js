
const nodeCanvasObject = (node, ctx, globalScale) => {
  const label = node.id;
  const fontSize = 4;
  ctx.font = `${fontSize}px Sans-Serif`;
  const textWidth = ctx.measureText(label).width;

  ctx.fillStyle = '#3f3f3f';

  ctx.beginPath();
  ctx.arc(node.x, node.y, 4.25, 0, 2 * Math.PI, false);
  ctx.fill();

  // ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
  ctx.fillStyle = 'rgb(255, 255, 255)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, node.x, node.y);
}

export default nodeCanvasObject;