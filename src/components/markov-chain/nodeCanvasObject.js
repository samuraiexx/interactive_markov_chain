
let nodesPosition = {};

const renderNodeCanvas = (node, ctx, globalScale) => {
  const label = node.id;
  const fontSize = 4;
  const nodeColor = '#3f3f3f';
  const textColor = '#ffffff';

  nodesPosition[node.id] = [node.x, node.y];

  ctx.font = `${fontSize}px Roboto`;

  ctx.fillStyle = nodeColor;
  ctx.beginPath();
  ctx.arc(node.x, node.y, 4.25, 0, 2 * Math.PI, false);
  ctx.fill();

  if (node.isCurrentNode) {
    ctx.arc(node.x, node.y, 4.25, 0, 2 * Math.PI, false);
    ctx.lineWidth = 0.6;
    ctx.strokeStyle = textColor;
    ctx.stroke();
  }

  // ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, node.x, node.y);
}

module.exports = {
  nodesPosition,
  renderNodeCanvas
}