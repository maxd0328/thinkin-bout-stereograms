
class Image {

   static fromDocument(canvas) {
      return new Image(canvas);
   }

   static fromFile(filepath) {
      return new Promise((resolve, reject) => {
         const elem = new window.Image();
         elem.onload = () => {
            const image = Image.newImage(elem.width, elem.height);
            image.context.drawImage(elem, 0, 0);
            image.reload();
            resolve(image);
         };
         elem.onerror = () => reject(new Error('Failed to load image'));
         elem.src = filepath;
      });
   }

   static newImage(width, height) {
      let canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      return new Image(canvas);
   }

   constructor(canvas) {
      this.canvas = canvas;
      this.context = this.canvas.getContext('2d');
      this.buffer = this.context.createImageData(this.canvas.width, this.canvas.height);
   }

   getWidth() {
      return this.canvas.width;
   }

   getHeight() {
      return this.canvas.height;
   }

   reload() {
      this.buffer = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
   }

   render() {
      this.context.putImageData(this.buffer, 0, 0);
   }

   getPixel(x, y) {
      [x, y] = this.clamp(x, y);
      const index = (y * this.canvas.width + x) * 4;
      return {
         r: this.buffer.data[index] / 255,
         g: this.buffer.data[index + 1] / 255,
         b: this.buffer.data[index + 2] / 255
      };
   }

   setPixel(x, y, col) {
      [x, y] = this.clamp(x, y);
      const index = (y * this.canvas.width + x) * 4;
      this.buffer.data[index] = Math.floor(col.r * 255);
      this.buffer.data[index + 1] = Math.floor(col.g * 255);
      this.buffer.data[index + 2] = Math.floor(col.b * 255);
      this.buffer.data[index + 3] = 255;
   }

   textureCoords(x, y) {
      return {
         x: x / this.canvas.width,
         y: 1 - (y / this.canvas.height)
      };
   }

   pixelCoords(textureCoords) {
      return [
         Math.floor(textureCoords.x * this.canvas.width),
         Math.floor((1 - textureCoords.y) * this.canvas.height)
      ];
   }

   sample(textureCoords) {
      return this.getPixel(...this.pixelCoords(textureCoords));
   }

   clamp(x, y) {
      return [
         x < 0 ? 0 : x >= this.canvas.width ? this.canvas.width - 1 : Math.floor(x),
         y < 0 ? 0 : y >= this.canvas.height ? this.canvas.height - 1 : Math.floor(y)
      ];
   }

}

export default Image;

