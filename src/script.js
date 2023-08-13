import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { gsap } from "gsap";

THREE.ColorManagement.enabled = false;

/**
 * Base
 */
const gui = new dat.GUI();
const variables = { numberOfDonuts: 100, distanceFromCenter: 10 };

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const normalTexture = textureLoader.load("/textures/matcaps/8.png");

const material = new THREE.MeshMatcapMaterial({
  matcap: normalTexture,
  wireframe: true,
});

// Font
const fontLoader = new FontLoader();
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new TextGeometry("Donuts.", {
    font,
    size: 0.5,
    height: 0.1,
    curveSegments: 8,
    bevelEnabled: true,
    bevelSize: 0.04,
    bevelOffset: 0,
    bevelSegments: 5,
    bevelThickness: 0.05,
  });

  const text = new THREE.Mesh(textGeometry, material);

  textGeometry.center();
  scene.add(text);
});

/**
 * Object
 */

const getRandom = () => {
  return variables.distanceFromCenter * (Math.random() - 0.5);
};

const donutGroup = new THREE.Group();
const renderDonuts = () => {
  donutGroup.children = [];
  const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);

  for (let i = 0; i < variables.numberOfDonuts; i++) {
    const donut = new THREE.Mesh(donutGeometry, material);
    donut.rotation.x = getRandom() * Math.PI;
    donut.rotation.y = getRandom() * Math.PI;

    const scale = Math.random();
    donut.scale.x = scale;
    donut.scale.y = scale;
    donut.scale.z = scale;
    donut.position.set(getRandom(), getRandom(), getRandom());
    donutGroup.add(donut);
  }
  scene.add(donutGroup);
};

renderDonuts();

gui
  .add(variables, "numberOfDonuts")
  .min(0)
  .max(2000)
  .onChange(() => {
    renderDonuts();
  });

gui
  .add(variables, "distanceFromCenter")
  .min(0)
  .max(100)
  .onChange(() => {
    renderDonuts();
  });

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = -1;
camera.position.y = 1;
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

gsap.to(donutGroup.rotation, { duration: 30, y: Math.PI / 2, repeat: -1 });

// /**
//  * Animate
//  */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
