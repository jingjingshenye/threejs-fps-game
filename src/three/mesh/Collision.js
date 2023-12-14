import { GLTFLoader } from "three/examples/jsm/loaders/gltfloader";
import modelUrl from "@assets/model/collision-world.glb?url";

const GRAVITY = 30;

const NUM_SPHERES = 100;
const SPHERE_RADIUS = 0.2;

const STEPS_PER_FRAME = 5;

const worldOctree = new Octree();

export default class Collision {
  constructor(scene) {
    this.scene = scene;
    this.terrain = null;
    const loader = new GLTFLoader();

    loader.load(modelUrl, (gltf) => {
      gltf.scene.position.set(0, 0, 0);
      // gltf.scene.traverse()
      worldOctree.fromGraphNode(gltf.scene);

      this.terrain = gltf.scene;

      this.scene.add(this.terrain);
    });
  }

  getPlane() {
    return this.terrain;
  }
}
