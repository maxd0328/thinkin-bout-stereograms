import Image from './image.js';
import { perlin, whiteStatic, rgbStatic } from './noise.js';
import { generateNodes, drawNodes, animateNodes } from './nodes.js';

function calculateDistortion(nodes, map, image) {
   for(let node of nodes) {
      let distortion = 0;
      if(map)
         distortion = map.sample(image.textureCoords(node.x, node.y)).r;

      node.x -= (distortion * 2 - 1) * 8;
   }
}

const left = Image.fromDocument(document.getElementById('left'));
const right = Image.fromDocument(document.getElementById('right'));
const nodes = generateNodes(-40, -40, left.getWidth() + 40, left.getHeight() + 40, 0.01);

let dudv;

function tick(time) {
   time /= 1000; // ms to s

   animateNodes(nodes, time);
   drawNodes(left, nodes);
   calculateDistortion(nodes, dudv, right);
   drawNodes(right, nodes);
   
   requestAnimationFrame(tick);
}

Image.fromFile('/dudv.png').then(result => {
   dudv = result;
   requestAnimationFrame(tick);
});

