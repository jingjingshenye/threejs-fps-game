import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/gltfloader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { Octree } from "three/examples/jsm/math/Octree";
import { Capsule } from "three/examples/jsm/math/Capsule";
import { OctreeHelper } from "three/examples/jsm/helpers/OctreeHelper";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import modelUrl from "@assets/model/collision-world.glb?url";
import modelSelf from "@assets/model/self.glb?url";

const GRAVITY = 30;

const NUM_SPHERES = 100;
const SPHERE_RADIUS = 0.2;

const STEPS_PER_FRAME = 5;

const worldOctree = new Octree();

export default class Terrain {
  constructor(scene) {
    this.scene = scene;
    this.terrain = null;
    const loader = new GLTFLoader();

    loader.load(modelUrl, (gltf) => {
      gltf.scene.position.set(0, -10, 0);
      // gltf.scene.traverse()
      worldOctree.fromGraphNode(gltf.scene);

      const helper = new OctreeHelper(worldOctree);
      helper.visible = false;
      scene.add(helper);

      this.terrain = gltf.scene;

      this.scene.add(this.terrain);
    });
  }

  getPlane() {
    return this.terrain;
  }
}

export class Player {
  constructor(scene, camera, renderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.player = null;
    this.playerCollider = new Capsule(
      new THREE.Vector3(0, 0.35, 0),
      new THREE.Vector3(0, 1, 0),
      0.35
    );

    this.playerVelocity = new THREE.Vector3();
    this.playerDirection = new THREE.Vector3();

    this.playerOnFloor = false;
    let mouseTime = 0;

    this.keyStates = {};

    document.addEventListener("keydown", (event) => {
      this.keyStates[event.code] = true;
    });

    document.addEventListener("keyup", (event) => {
      this.keyStates[event.code] = false;
    });

    // const controls = new PointerLockControls(camera, document.body);

    // this.renderer.domElement.addEventListener("mousedown", () => {
    //   controls.lock();
    // });
    // controls.addEventListener("lock", function () {
    //   // menu.style.display = "none";
    // });

    // controls.addEventListener("unlock", function () {
    //   // menu.style.display = "block";
    // });

    this.renderer.domElement.addEventListener("mousedown", () => {
      document.body.requestPointerLock();

      // mouseTime = performance.now();
    });

    document.addEventListener("mouseup", () => {
      if (document.pointerLockElement !== null) {
        // throwBall();
      }
    });

    document.body.addEventListener("mousemove", (event) => {
      if (document.pointerLockElement === document.body) {
        // const _euler = new THREE.Euler(0, 0, 0, "YXZ");
        // this.pointerSpeed = 1.0;
        // this.minPolarAngle = 0; // radians
        // this.maxPolarAngle = Math.PI; // radians
        // const _PI_2 = Math.PI / 2;
        // const movementX =
        //   event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        // const movementY =
        //   event.movementY || event.mozMovementY || event.webkitMovementY || 0;
        // _euler.setFromQuaternion(camera.quaternion);
        // _euler.y -= movementX * 0.002 * this.pointerSpeed;
        // _euler.x -= movementY * 0.002 * this.pointerSpeed;
        // _euler.x = Math.max(
        //   _PI_2 - this.maxPolarAngle,
        //   Math.min(_PI_2 - this.minPolarAngle, _euler.x)
        // );
        // camera.quaternion.setFromEuler(_euler);

        camera.rotation.order = "YXZ";

        camera.rotation.y -= event.movementX / 500;
        camera.rotation.x -= event.movementY / 500;
      }
    });
  }
  playerCollisions() {
    const result = worldOctree.capsuleIntersect(this.playerCollider);

    this.playerOnFloor = false;

    if (result) {
      this.playerOnFloor = result.normal.y > 0;

      if (!this.playerOnFloor) {
        this.playerVelocity.addScaledVector(
          result.normal,
          -result.normal.dot(this.playerVelocity)
        );
      }

      this.playerCollider.translate(result.normal.multiplyScalar(result.depth));
    }
  }
  updatePlayer(deltaTime) {
    let damping = Math.exp(-4 * deltaTime) - 1;

    if (!this.playerOnFloor) {
      this.playerVelocity.y -= GRAVITY * deltaTime;

      // small air resistance
      damping *= 0.1;
    }

    this.playerVelocity.addScaledVector(this.playerVelocity, damping);

    const deltaPosition = this.playerVelocity.clone().multiplyScalar(deltaTime);
    this.playerCollider.translate(deltaPosition);

    this.playerCollisions();

    this.camera.position.copy(this.playerCollider.end);
  }

  getForwardVector() {
    this.camera.getWorldDirection(this.playerDirection);
    this.playerDirection.y = 0;
    this.playerDirection.normalize();

    return this.playerDirection;
  }

  getSideVector() {
    this.camera.getWorldDirection(this.playerDirection);
    this.playerDirection.y = 0;
    this.playerDirection.normalize();
    this.playerDirection.cross(this.camera.up);

    return this.playerDirection;
  }

  controls(deltaTime) {
    // gives a bit of air control
    const speedDelta = deltaTime * (this.playerOnFloor ? 25 : 8);

    if (this.keyStates["KeyW"]) {
      this.playerVelocity.add(
        this.getForwardVector().multiplyScalar(speedDelta)
      );
    }

    if (this.keyStates["KeyS"]) {
      this.playerVelocity.add(
        this.getForwardVector().multiplyScalar(-speedDelta)
      );
    }

    if (this.keyStates["KeyA"]) {
      this.playerVelocity.add(this.getSideVector().multiplyScalar(-speedDelta));
    }

    if (this.keyStates["KeyD"]) {
      this.playerVelocity.add(this.getSideVector().multiplyScalar(speedDelta));
    }

    if (this.playerOnFloor) {
      if (this.keyStates["Space"]) {
        this.playerVelocity.y = 15;
      }
    }
  }
  teleportPlayerIfOob() {
    if (this.camera.position.y <= -25) {
      this.playerCollider.start.set(0, 0.35, 0);
      this.playerCollider.end.set(0, 1, 0);
      this.playerCollider.radius = 0.35;
      this.camera.position.copy(this.playerCollider.end);
      this.camera.rotation.set(0, 0, 0);
    }
  }
}
