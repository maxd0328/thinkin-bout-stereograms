
const minNodeDistance = 11;
const maxNodeDistance = 15;
const radius = 3;
const lineWidth = 0.4;

const distance = (node0, node1) => Math.sqrt((node1.x - node0.x)**2 + (node1.y - node0.y)**2);

export function drawNodes(image, nodes) {
   for(const node of nodes) {
      image.context.beginPath();
      image.context.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
      image.context.fill();
   }

   image.context.lineWidth = lineWidth;
   for(const node0 of nodes) {
      for(const node1 of nodes) {
         if(distance(node0, node1) <= maxNodeDistance && distance(node0, node1) >= minNodeDistance) {
            image.context.beginPath();
            image.context.moveTo(node0.x, node0.y);
            image.context.lineTo(node1.x, node1.y);
            image.context.stroke();
         }
      }
   }

   image.reload();
}

export function generateNodes(minX, minY, maxX, maxY, density) {
   let nodes = [];
   let area = (maxY - minY) * (maxX - minX);

   let numNodes = density * area;
   for(let i = 0; i < numNodes; ++i) {
      nodes.push({
         x: Math.random() * (maxX - minX) + minX,
         y: Math.random() * (maxY - minY) + minY
      });
   }

   return nodes;
}

