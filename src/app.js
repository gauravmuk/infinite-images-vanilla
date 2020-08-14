import { MAX_IMAGES_IN_A_ROW } from "./constants.js";
import { ImageManager } from "./ImageManager.js";

let imageManager;
let documentWidth;
let $pixel;
let $content;

async function bindScroll() {
  const intersectionObserver = new IntersectionObserver(async (entries) => {
    if (entries.some((entry) => entry.intersectionRatio > 0)) {
      await imageManager.loadImages(MAX_IMAGES_IN_A_ROW * 3);
      // Move the pixel after the images on every load to trigger intersection again
      $content.appendChild($pixel);
      await imageManager.loadImages(MAX_IMAGES_IN_A_ROW * 2);
    }
  });
  intersectionObserver.observe($pixel);
}

function initializeConstants() {
  documentWidth = document.documentElement.scrollWidth;
  $content = document.querySelector("#content");
  $pixel = document.querySelector("#pixel");
  imageManager = new ImageManager({
    ref: $content,
    documentWidth: documentWidth
  });
}

async function init() {
  // Initialize Constants which are to be reused
  initializeConstants();
  // Preload Images
  await imageManager.loadImages(MAX_IMAGES_IN_A_ROW * 3);
  bindScroll();
}

document.addEventListener("DOMContentLoaded", () => {
  init();
});
