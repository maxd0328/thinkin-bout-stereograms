import Image from './image.js';
import { perlin, whiteStatic, rgbStatic } from './noise.js';
import { generateNodes, drawNodes } from './nodes.js';

function drawStereogram(noise, distort, dest) {
   for(let x = 0; x < dest.getWidth(); ++x) {
      for(let y = 0; y < dest.getHeight(); ++y) {
         let distortion = 0;
         if(distort)
            distortion = distort.sample(dest.textureCoords(x, y)).r;

         distortion *= 8; // intensity
         dest.setPixel(x, y, noise(x + Math.floor(distortion), y));
      }
   }
}

const left = Image.fromDocument(document.getElementById('left'));
const right = Image.fromDocument(document.getElementById('right'));

const nodesL = generateNodes(0, 0, left.getWidth(), left.getHeight(), 0.015);
const nodesR = [];
for(let node of nodesL) {
   if(node.x >= 50 && node.x <= 150 && node.y >= 50 && node.y <= 150)
      nodesR.push({ x: node.x - 5, y: node.y });
   else
      nodesR.push({ x: node.x, y: node.y });
}

drawNodes(left, nodesL);
drawNodes(right, nodesR);

