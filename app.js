import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

let renderer1, humanCamera, cpuCamera, scene;
let puck, human, cpu;
const walls = [];
let puckSpeed = 0.5;
let puckDirection = new THREE.Vector3(0.1, 0, puckSpeed);
let humanScore = 0;
let cpuScore = 0;
let gameOver = false;

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

// Ajouter un message de fin de partie
const endMessageElement = document.createElement("div");
endMessageElement.style.position = "absolute";
endMessageElement.style.top = "50%";
endMessageElement.style.left = "50%";
endMessageElement.style.transform = "translate(-50%, -50%)";
endMessageElement.style.color = "black";
endMessageElement.style.fontSize = "30px";
endMessageElement.style.fontFamily = "Arial, sans-serif";
endMessageElement.style.visibility = "hidden"; // Caché au départ
endMessageElement.style.textAlign = "center"; // Centrer le texte
document.body.appendChild(endMessageElement);

// Ajouter un bouton pour recommencer la partie
const restartButton = document.createElement("button");
restartButton.innerHTML = "Restart Game";
restartButton.style.position = "absolute";
restartButton.style.top = "60%";
restartButton.style.left = "50%";
restartButton.style.transform = "translateX(-50%)";
restartButton.style.padding = "10px 20px";
restartButton.style.fontSize = "20px";
restartButton.style.visibility = "hidden"; // Caché au départ
restartButton.addEventListener("click", restartGame);
document.body.appendChild(restartButton);

let keyState = {};

function createScene() {
  scene = new THREE.Scene();
}

function createRenderer() {
  // Créez deux rendus séparés, chacun pour une caméra différente
  renderer1 = new THREE.WebGLRenderer({ antialias: true });
  renderer1.setSize(window.innerWidth, window.innerHeight);
  renderer1.setClearColor(0x99e0ff);
  renderer1.shadowMap.enabled = true;
  document.body.appendChild(renderer1.domElement);

}

function createCameras() {
  const aspectRatio = (window.innerWidth ) / window.innerHeight;

  // Caméra pour la raquette humaine

  // Caméra pour la raquette CPU
  cpuCamera = new THREE.PerspectiveCamera(80, aspectRatio, 0.1, 1000);
  cpuCamera.position.set(0, 30, -50); // Positionnez la caméra du CPU plus loin de l'axe Z
  cpuCamera.lookAt(0, 0, 0);
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
  const wallMaterial = new THREE.MeshPhongMaterial({ color: 0xe5e5e5 });

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

  // Vérification du score pour la fin de la partie
  if (humanScore === 3) {
    endGame("Human");
  } else if (cpuScore === 3) {
    endGame("CPU");
  }
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
    puck.rotation.z += Math.PI;
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
    puck.rotation.z += Math.PI;
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

function endGame(winner) {
  gameOver = true;
  endMessageElement.innerHTML = `${winner} wins!`;
  endMessageElement.style.visibility = "visible"; // Afficher le message de fin
  restartButton.style.visibility = "visible"; // Afficher le bouton pour recommencer
  endMessageElement.style.color = "yellow"; // Afficher le bouton pour recommencer
}

function restartGame() {
  humanScore = 0;
  cpuScore = 0;
  gameOver = false;
  scoreElement.innerHTML = `Human: 0 | CPU: 0`;
  endMessageElement.style.visibility = "hidden"; // Masquer le message de fin
  restartButton.style.visibility = "hidden"; // Masquer le bouton de redémarrage
  puck.position.set(0, 1, 0);
  puckDirection.set(0.1, 0, puckSpeed);
  animate();
}

function animate() {
  if (gameOver) return; // Si la partie est terminée, ne plus animer

  requestAnimationFrame(animate);

  if (puck) {
    puck.position.add(puckDirection);
    handleCollisions();
  }

  if (keyState["p"]) {
    human.position.x = Math.max(human.position.x - 0.75, -20);
  }
  if (keyState["o"]) {
    human.position.x = Math.min(human.position.x + 0.75, 20);
  }
  if (keyState["z"]) {
    cpu.position.x = Math.max(cpu.position.x - 0.75, -20);
  }
  if (keyState["a"]) {
    cpu.position.x = Math.min(cpu.position.x + 0.75, 20);
  }

  
  cpuCamera.position.x = cpu.position.x;
  cpuCamera.position.z = cpu.position.z - 20;
  cpuCamera.position.y = 15;
  cpuCamera.lookAt(cpu.position.x, 0, 0);

  // Rendu pour le joueur humain
  renderer1.render(scene, cpuCamera);

}

// Gestion des événements clavier
document.addEventListener("keydown", (event) => {
  keyState[event.key.toLowerCase()] = true;
});

document.addEventListener("keyup", (event) => {
  keyState[event.key.toLowerCase()] = false;
});

// Gérer le redimensionnement de la fenêtre
window.addEventListener("resize", () => {
  renderer1.setSize(window.innerWidth, window.innerHeight);

  const aspectRatio = (window.innerWidth) / window.innerHeight;
  cpuCamera.aspect = aspectRatio;

  cpuCamera.updateProjectionMatrix();
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
