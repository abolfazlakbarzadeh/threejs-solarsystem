import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// load images
import starsTexture from "../img/stars.jpg";
import sunTexture from "../img/sun.jpg";
import mercuryTexture from "../img/mercury.jpg";
import venusTexture from "../img/venus.jpg";
import earthTexture from "../img/earth.jpg";
import marsTexture from "../img/mars.jpg";
import jupiterTexture from "../img/jupiter.jpg";
import saturnTexture from "../img/saturn.jpg";
import saturnRingTexture from "../img/saturn ring.png";
import uranusTexture from "../img/uranus.jpg";
import uranusRingTexture from "../img/uranus ring.png";
import neptuneTexture from "../img/neptune.jpg";
import plutoTexture from "../img/pluto.jpg";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.01,
  1000
);
camera.position.set(-40, 65, 0);

const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.update();

// light
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// texture loader
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
]);

const textureLoader = new THREE.TextureLoader();

function createPlanete(size, texture, position, ring) {
  const geo = new THREE.SphereGeometry(size, 30, 30);
  const mat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture),
  });
  const mesh = new THREE.Mesh(geo, mat);
  const meshObj = new THREE.Object3D();
  meshObj.add(mesh);
  scene.add(meshObj);
  mesh.position.x = position;
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  meshObj.receiveShadow = true;
  meshObj.castShadow = true;

  if (ring) {
    const ringGeo = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius,
      32
    );
    const ringMat = new THREE.MeshBasicMaterial({
      map: textureLoader.load(ring.texture),
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    meshObj.add(ringMesh);
    ringMesh.position.x = position;
    ringMesh.rotation.x = -0.5 * Math.PI;
  }

  return [mesh, meshObj];
}

// sun
const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
  map: textureLoader.load(sunTexture),
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

// point light
const pointLight = new THREE.PointLight(0xffffff, 3, 300);
scene.add(pointLight);
pointLight.castShadow = true;

// // mercury
const [mercury, mercuryObj] = createPlanete(3.2, mercuryTexture, 28);
// venus
const [venus, venusObj] = createPlanete(5.8, venusTexture, 44);
// earth
const [earth, earthObj] = createPlanete(6, earthTexture, 62);
// mars
const [mars, marsObj] = createPlanete(4, marsTexture, 78);
// jupiter
const [jupiter, jupiterObj] = createPlanete(12, jupiterTexture, 100);
// neptune
const [neptune, neptuneObj] = createPlanete(7, neptuneTexture, 200);
// pluto
const [pluto, plutoObj] = createPlanete(2.8, plutoTexture, 219);
// saturn
const [saturn, saturnObj] = createPlanete(10, saturnTexture, 138, {
  texture: saturnRingTexture,
  innerRadius: 10,
  outerRadius: 20,
});
// uranus
const [uranus, uranusObj] = createPlanete(7, uranusTexture, 176, {
  texture: uranusRingTexture,
  innerRadius: 7,
  outerRadius: 12,
});

function animate() {
  // Self-rotation
  sun.rotateY(0.004);
  mercury.rotateY(0.004);
  saturn.rotateY(0.038);
  venus.rotateY(0.002);
  earth.rotateY(0.02);
  mars.rotateY(0.018);
  jupiter.rotateY(0.04);
  uranus.rotateY(0.03);
  neptune.rotateY(0.032);
  pluto.rotateY(0.008);

  // Around-sun-rotation
  saturnObj.rotateY(0.0009);
  venusObj.rotateY(0.015);
  earthObj.rotateY(0.01);
  marsObj.rotateY(0.008);
  jupiterObj.rotateY(0.002);
  uranusObj.rotateY(0.0004);
  neptuneObj.rotateY(0.0001);
  plutoObj.rotateY(0.00007);
  mercuryObj.rotateY(0.04);

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
