const dataGenerators = [
  "https://random.dog/woof.json",
  "https://randomfox.ca/floof/",
];

const maxImagesInARow = 5;
const imagesFetched = {};
let documentWidth;
let intersectionObserver;
let imageCount = 0;

function getRandomNumber() {
  return Math.floor(Math.random() * 2);
}

async function getAnimalImage() {
  const response = await fetch(`${dataGenerators[getRandomNumber()]}`);
  const imageData = await response.json();
  const imageUrl = imageData.url || imageData.image;
  if (!imagesFetched[imageUrl] && imageUrl.indexOf('.mp4') === -1) {
    imagesFetched[imageUrl] = true;
  } else {
    return await getAnimalImage();
  }
  return imageUrl;
}

function addImageToDOM() {
  return new Promise((resolve, reject) => {
    const image = new Image();
    return getAnimalImage().then((data) => {
      image.src = data;
      image.style.display = "inline-block";

      image.onload = () => {
        if (image.width > documentWidth) {
          image.width = documentWidth;
        } else if (image.width > documentWidth / 2) {
          image.width = image.width / 2;
        }

        imageCount++;
        image.setAttribute("data-index", imageCount);
        document.querySelector("#content").appendChild(image);
        resolve(imageCount);
      };
    });
  });
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
  intersectionObserver = new IntersectionObserver(async (entries) => {
    if (entries.some((entry) => entry.intersectionRatio > 0)) {
      await loadImages(10);
      document.querySelector('#content').appendChild(document.querySelector('#pixel'));
      await loadImages(5);
    }
  });
  intersectionObserver.observe(document.querySelector("#pixel"));
}

async function init() {
  documentWidth = document.documentElement.scrollWidth;
  await loadImages(10);
  bindScroll();
}

document.addEventListener("DOMContentLoaded", () => {
  init();
});
