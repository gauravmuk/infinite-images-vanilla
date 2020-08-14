import { MAX_IMAGES_IN_A_ROW, DATA_GENERATORS } from "./constants.js";
import { FunctionUtils } from "./utils.js";

export class ImageManager {
  constructor(params) {
    this.imagesFetched = {};
    this.ref = params.ref;
    this.documentWidth = params.documentWidth;
  }

  async getAnimalImage() {
    const response = await fetch(
      `${DATA_GENERATORS[FunctionUtils.getRandomNumber()]}`
    );
    const imageData = await response.json();
    const imageUrl = imageData.url || imageData.image;
    // Cache image url to check for re-occurence and blacklist .mp4 type response from API
    if (!this.imagesFetched[imageUrl] && imageUrl.indexOf(".mp4") === -1) {
      this.imagesFetched[imageUrl] = true;
    } else {
      // Retry if image is found in cache
      return await this.getAnimalImage();
    }
    return imageUrl;
  }

  async onImageLoad() {
    const img = event.target;
    img.width = this.documentWidth / MAX_IMAGES_IN_A_ROW;

    await this.ref.appendChild(img);
  }

  appendToDOM() {}

  async addImageToDOM() {
    const image = new Image();
    image.src = await this.getAnimalImage();
    image.style.display = "inline-block";

    image.onload = this.onImageLoad.bind(this);
  }

  loadImages(countOfImages) {
    console.info("Loading Batch of Images");
    const promises = [];
    for (var i = 0; i < countOfImages; i++) {
      promises.push(this.addImageToDOM());
    }
    return Promise.all(promises);
  }
}
