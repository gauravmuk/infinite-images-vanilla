import { MAX_IMAGES_IN_A_ROW } from "./constants.js";
import { ImageManager } from "./ImageManager.js";
export class App {
  constructor() {
    document.addEventListener("DOMContentLoaded", this.init.bind(this));
  }

  async init() {
    const documentWidth = document.documentElement.scrollWidth;
    this.$content = document.querySelector("#content");
    this.$pixel = document.querySelector("#pixel");
    this.imageManager = new ImageManager({
      ref: this.$content,
      documentWidth: documentWidth,
    });
    // Preload Images
    await this.imageManager.loadImages(MAX_IMAGES_IN_A_ROW * 3);
    this.loadImagesOnScroll();
  }

  async loadImagesOnScroll() {
    const intersectionObserver = new IntersectionObserver(async (entries) => {
      if (entries.some((entry) => entry.intersectionRatio > 0)) {
        await this.imageManager.loadImages(MAX_IMAGES_IN_A_ROW * 3);
        // Move the pixel after the images on every load to trigger intersection again
        this.$content.appendChild(this.$pixel);
        await this.imageManager.loadImages(MAX_IMAGES_IN_A_ROW * 2);
      }
    });
    intersectionObserver.observe(this.$pixel);
  }
}

new App();
