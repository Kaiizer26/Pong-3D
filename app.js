import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

let renderer, humanCamera, cpuCamera, scene;
let puck, human, cpu;
const walls = [];
let puckSpeed = 0.5; 
let puckDirection = new THREE.Vector3(0.1, 0, puckSpeed);
let humanScore = 0;
let cpuScore = 0;

// Ajouter un élément HTML pour afficher le score
const scoreElement = document.createElement("div");
scoreElement.style.position = "absolute";
scoreElement.style.top = "10px";
scoreElement.style.left = "10px";
scoreElement.style.color = "black";
scoreElement.style.fontSize = "20px";
scoreElement.style.fontFamily = "Arial, sans-serif";
scoreElement.innerHTML = `Human: 0 | CPU: 0`;
document.body.appendChild(scoreElement);

let keyState = {}; 

function createScene() {
  scene = new THREE.Scene();
}

function createRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x99e0ff);
  renderer.shadowMap.enabled = true; 
  document.body.appendChild(renderer.domElement);
}

function createCameras() {
  const aspectRatio = window.innerWidth / 2 / window.innerHeight;

  // Caméra pour la raquette humaine
  humanCamera = new THREE.PerspectiveCamera(80, aspectRatio, 0.1, 1000);
  humanCamera.position.set(0, 15, 35); 
  humanCamera.lookAt(0, 0, 0); 

  // Caméra pour la raquette CPU
  cpuCamera = new THREE.PerspectiveCamera(80, aspectRatio, 0.1, 1000);
  cpuCamera.position.set(0, 30, -50); // Position plus reculée
  cpuCamera.lookAt(0, 0, 0); // Point de vue centré sur le terrain
}



function createLight() {
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(-20, 50, 0); 
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.left = -30;
  directionalLight.shadow.camera.right = 30;
  directionalLight.shadow.camera.top = 30;
  directionalLight.shadow.camera.bottom = -30;
  scene.add(directionalLight);

  const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
  scene.add(ambientLight);
}

function createSurface() {
  const surfaceGeometry = new THREE.BoxGeometry(50, 1, 60);
  const surfaceMaterial = new THREE.MeshPhongMaterial({ color: 0x64ff5c });
  const surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
  surface.position.set(0, -1, 0);
  surface.receiveShadow = true;
  scene.add(surface);
}

function createWalls() {
  const wallMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });

  const sideWallLeft = new THREE.Mesh(
    new THREE.BoxGeometry(1, 10, 60),
    wallMaterial
  );
  sideWallLeft.position.set(-25.5, 4, 0);
  sideWallLeft.castShadow = true;
  sideWallLeft.receiveShadow = true;
  scene.add(sideWallLeft);
  walls.push(sideWallLeft);

  const sideWallRight = new THREE.Mesh(
    new THREE.BoxGeometry(1, 10, 60),
    wallMaterial
  );
  sideWallRight.position.set(25.5, 4, 0);
  sideWallRight.castShadow = true;
  sideWallRight.receiveShadow = true;
  scene.add(sideWallRight);
  walls.push(sideWallRight);
}

function createPuck() {
  const gltfLoader = new GLTFLoader();

  gltfLoader.load("./assets/badminton/scene.gltf", (gltf) => {
    gltf.scene.traverse((c) => {
      if (c instanceof THREE.Mesh) {
        c.castShadow = true;
      }
    });

    gltf.scene.scale.set(60, 60, 60); 
    gltf.scene.position.set(0, 1, 0);
    gltf.scene.rotation.set(5, 1, 0);

    puck = gltf.scene;
    scene.add(puck);
  });
}

function createRackets() {
  const racketGeometry = new THREE.BoxGeometry(8, 1, 1);
  const humanMaterial = new THREE.MeshPhongMaterial({ color: "blue" });
  const cpuMaterial = new THREE.MeshPhongMaterial({ color: 0xc500fb });

  human = new THREE.Mesh(racketGeometry, humanMaterial);
  human.position.set(0, 1, 28);
  human.castShadow = true;
  scene.add(human);

  cpu = new THREE.Mesh(racketGeometry, cpuMaterial);
  cpu.position.set(0, 1, -28);
  cpu.castShadow = true;
  scene.add(cpu);
}

function resetPuck(winner) {
  puck.position.set(0, 1, 0);
  puckSpeed = 0.5; 
  puckDirection.set(0.1, 0, winner === "human" ? puckSpeed : -puckSpeed);
  if (winner === "human") {
    humanScore++;
  } else {
    cpuScore++;
  }
  scoreElement.innerHTML = `Human: ${humanScore} | CPU: ${cpuScore}`;
}

function handleCollisions() {
  if (puck.position.x <= -24 || puck.position.x >= 24) {
    puckDirection.x = -puckDirection.x;
  }

  if (
    puck.position.z >= human.position.z - 2 &&
    puck.position.z <= human.position.z + 2 &&
    puck.position.x >= human.position.x - 6 &&
    puck.position.x <= human.position.x + 6
  ) {
    puck.rotation.z= Math.PI;
    puckDirection.z = -Math.abs(puckDirection.z);
    puckSpeed += 0.3; 
    puckDirection.setLength(puckSpeed);
  }
  if (
    puck.position.z >= cpu.position.z - 2 &&
    puck.position.z <= cpu.position.z + 2 &&
    puck.position.x >= cpu.position.x - 6 &&
    puck.position.x <= cpu.position.x + 6
  ) {
    puck.rotation.z= Math.PI;
    puckDirection.z = Math.abs(puckDirection.z);
    puckSpeed += 0.3; 
    puckDirection.setLength(puckSpeed);
  }

  if (puck.position.z < -30) {
    resetPuck("human");
  } else if (puck.position.z > 30) {
    resetPuck("cpu");
  }
}

function animate() {
  requestAnimationFrame(animate);

  if (puck) {
    puck.position.add(puckDirection);
    handleCollisions();
  }

  if (keyState["q"]) {
    human.position.x = Math.max(human.position.x - 0.5, -20);
  }
  if (keyState["s"]) {
    human.position.x = Math.min(human.position.x + 0.5, 20);
  }
  if (keyState["m"]) {
    cpu.position.x = Math.max(cpu.position.x - 0.5, -20);
  }
  if (keyState["l"]) {
    cpu.position.x = Math.min(cpu.position.x + 0.5, 20);
  }

  // Mettre à jour les caméras pour qu'elles suivent les raquettes
  humanCamera.position.x = human.position.x; // Aligner avec la raquette humaine
  humanCamera.position.z = human.position.z + 20; // Distance optimale derrière la raquette
  humanCamera.position.y = 10;
  humanCamera.lookAt(human.position.x, 0, 0); // Fixer le regard vers le terrain

  cpuCamera.position.x = cpu.position.x; 
  cpuCamera.position.z = cpu.position.z - 20; 
  cpuCamera.position.y = 15; 
  cpuCamera.lookAt(cpu.position.x, 0, 0); 

  // Diviser l'écran et rendre les deux caméras
  renderer.setViewport(0, 0, window.innerWidth / 2, window.innerHeight);
  renderer.render(scene, humanCamera);

  renderer.setViewport(window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight);
  renderer.render(scene, cpuCamera);
}



// Gestion des événements clavier
document.addEventListener("keydown", (event) => {
  keyState[event.key.toLowerCase()] = true;
});

document.addEventListener("keyup", (event) => {
  keyState[event.key.toLowerCase()] = false;
});

function init() {
  createScene();
  createRenderer();
  createCameras();
  createLight();
  createSurface();
  createWalls();
  createPuck();
  createRackets();
  animate();
}

init();
