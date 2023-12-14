
function integerize(func, x, y) {
   if(typeof x != 'number')
      x = 0;
   if(typeof y != 'number')
      y = 0;
   return func(Math.floor(x), Math.floor(y));
}

export function whiteStatic() {
   let cache = {
      seed: function() {
         this.memory = {};
      },
      get: function(x, y) {
         if(!this.memory[[x, y]])
            this.memory[[x, y]] = Math.random();
         let v = this.memory[[x, y]];
         return { r: v, g: v, b: v };
      }
   };

   cache.seed();
   return integerize.bind(null, cache.get.bind(cache));
}

export function rgbStatic() {
   let cache = {
      seed: function() {
         this.memory = {};
      },
      get: function(x, y) {
         if(!this.memory[[x, y]])
            this.memory[[x, y]] = { r: Math.random(), g: Math.random(), b: Math.random() };
         let v = this.memory[[x, y]];
         return { r: v.r, g: v.g, b: v.b };
      }
   };

   cache.seed();
   return integerize.bind(null, cache.get.bind(cache));
}

export function perlin() {
   let cache = {
      randVector: function() {
         let theta = Math.random() * 2 * Math.PI;
         return { x: Math.cos(theta), y: Math.sin(theta) };
      },
      dotProductGrid: function(x, y, vx, vy) {
         let gVec;
         let dVec = { x: x - vx, y: y - vy };
         if(this.gradients[[vx, vy]])
            gVec = this.gradients[[vx, vy]];
         else {
            gVec = this.randVector();
            this.gradients[[vx, vy]] = gVec;
         }
         return gVec.x * dVec.x + gVec.y * dVec.y;
      },
      smootherstep: function(x) {
         return 6*x**5 - 15*x**4 + 10*x**3;
      },
      interp: function(x, a, b) {
         return a + this.smootherstep(x) * (b - a);
      },
      seed: function() {
         this.gradients = {};
         this.memory = {};
      },
      get: function(x, y) {
         x /= 5;
         y /= 5;
         if(this.memory.hasOwnProperty([x, y])) {
            let v = this.memory[[x, y]];
            return { r: v, g: v, b: v };
         }
         let xf = Math.floor(x)
         let yf = Math.floor(y);
         // Interpolation
         let tl = this.dotProductGrid(x, y, xf, yf);
         let tr = this.dotProductGrid(x, y, xf + 1, yf);
         let bl = this.dotProductGrid(x, y, xf, yf + 1);
         let br = this.dotProductGrid(x, y, xf + 1, yf + 1);
         let xt = this.interp(x - xf, tl, tr);
         let xb = this.interp(x - xf, bl, br);
         let v = this.interp(y - yf, xt, xb);
         this.memory[[x, y]] = v;
         return { r: v, g: v, b: v };
      },
   };

   cache.seed();
   return integerize.bind(null, cache.get.bind(cache));
}

