const dataGenerators = [
  "https://random.dog/woof.json",
  "https://randomfox.ca/floof/",
];

const maxImagesInARow = 4;
const imagesFetched = {};
let documentWidth;
let $pixel;
let $content;
let imageCount = 0;

function getRandomNumber() {
  return Math.floor(Math.random() * 2);
}

async function getAnimalImage() {
  const response = await fetch(`${dataGenerators[getRandomNumber()]}`);
  const imageData = await response.json();
  const imageUrl = imageData.url || imageData.image;
  // Cache image url to check for re-occurence and blacklist .mp4 type response from API
  if (!imagesFetched[imageUrl] && imageUrl.indexOf(".mp4") === -1) {
    imagesFetched[imageUrl] = true;
  } else {
    // Retry if image is found in cache
    return await getAnimalImage();
  }
  return imageUrl;
}

async function onImageLoad(event) {
  const image = event.target;
  image.width = documentWidth / maxImagesInARow;

  imageCount++;
  image.setAttribute("data-index", imageCount);
  await $content.appendChild(image);
}

async function addImageToDOM() {
  const image = new Image();
  image.src = await getAnimalImage();
  image.style.display = "inline-block";

  image.onload = onImageLoad;
}

function loadImages(countOfImages) {
  console.info("Loading Batch of Images");
  const promises = [];
  for (var i = 0; i < countOfImages; i++) {
    promises.push(addImageToDOM());
  }
  return Promise.all(promises);
}

async function bindScroll() {
  const intersectionObserver = new IntersectionObserver(async (entries) => {
    if (entries.some((entry) => entry.intersectionRatio > 0)) {
      await loadImages(maxImagesInARow * 3);
      // Move the pixel after the images on every load to trigger intersection again
      $content.appendChild($pixel);
      await loadImages(maxImagesInARow * 2);
    }
  });
  intersectionObserver.observe($pixel);
}

function initializeConstants() {
  documentWidth = document.documentElement.scrollWidth;
  $content = document.querySelector("#content");
  $pixel = document.querySelector("#pixel");
}

async function init() {
  // Initialize Constants which are to be reused
  initializeConstants();
  // Preload Images
  await loadImages(maxImagesInARow * 3);
  bindScroll();
}

document.addEventListener("DOMContentLoaded", () => {
  init();
});
