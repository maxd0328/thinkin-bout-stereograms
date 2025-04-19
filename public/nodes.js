
const minNodeDistance = 0;
const maxNodeDistance = 18;
const maxLineWidth = 0.8;
const maxInnerRadius = 4;
const maxOuterRadius = 20;
const maxAngFreq = 0.2;

const distance = (node0, node1) => Math.sqrt((node1.x - node0.x)**2 + (node1.y - node0.y)**2);
const rgbString = col => `rgb(${Math.floor(col.r * 255)}, ${Math.floor(col.g * 255)}, ${Math.floor(col.b * 255)})`;

export function drawNodes(image, nodes) {
   image.context.rect(0, 0, image.getWidth(), image.getHeight());
   image.context.fillStyle = '#222';
   image.context.fill();

   for(const node of nodes) {
      image.context.fillStyle = rgbString(node.color);
      image.context.beginPath();
      image.context.arc(node.x, node.y, node.innerRadius, 0, 2 * Math.PI, false);
      image.context.fill();
   }

   for(const node0 of nodes) {
      for(const node1 of nodes) {
         let dist = distance(node0, node1);

         if(dist <= maxNodeDistance && dist >= minNodeDistance) {
            let gradient = image.context.createLinearGradient(node0.x, node0.y, node1.x, node1.y);
            gradient.addColorStop(0, rgbString(node0.color));
            gradient.addColorStop(1, rgbString(node1.color));
            image.context.strokeStyle = gradient;

            image.context.lineWidth = (1 - (dist - minNodeDistance) / (maxNodeDistance - minNodeDistance)) * maxLineWidth;

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
         center: {
            x: Math.random() * (maxX - minX) + minX,
            y: Math.random() * (maxY - minY) + minY
         },
         innerRadius: Math.random() * maxInnerRadius,
         outerRadius: Math.random() * maxOuterRadius,
         angFreq: (Math.random() * 2 - 1) * maxAngFreq,
         color: {
            r: Math.random() * 0.2,
            g: Math.random(),
            b: Math.random() * 0.6
         }
      });
   }

   return nodes;
}

export function animateNodes(nodes, time) {
   for(let node of nodes) {
      node.x = node.center.x + node.outerRadius * Math.cos(time * 2 * Math.PI * node.angFreq);
      node.y = node.center.y + node.outerRadius * Math.sin(time * 2 * Math.PI * node.angFreq);
   }
}

