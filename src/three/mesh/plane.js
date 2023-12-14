import { GLTFLoader } from "three/examples/jsm/loaders/gltfloader";
import modelUrl from "@assets/model/plane.glb?url";

export default class Plane {
  constructor(scene) {
    this.scene = scene;
    this.plane = null;
    const loader = new GLTFLoader();

    loader.load(modelUrl, (gltf) => {
      gltf.scene.position.set(0, 0, 0);
      gltf.scene.rotation.set(0, 0, 0);
      // gltf.scene.traverse()

      this.plane = gltf.scene;

      this.scene.add(this.plane);
    });
  }

  getPlane() {
    return this.plane;
  }
}
