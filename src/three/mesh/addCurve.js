import * as THREE from "three";
export default class Curve {
  constructor(scene) {
    this.curve = null;
    this.path = null;
    // 创建曲线
    const points = [
      new THREE.Vector3(30, 11, -20),
      new THREE.Vector3(30, 50, 20),
      new THREE.Vector3(-30, 10, 20),
      new THREE.Vector3(-30, 25, -20),
    ];

    // 绘制曲线
    this.curve = new THREE.CatmullRomCurve3(points, true, "catmullrom", 0.5);
    this.path = new THREE.Path(this.curve.getPoints(200)); // 将曲线转换成路径

    // 曲线轨迹 测试使用
    const geometry = new THREE.BufferGeometry().setFromPoints(
      this.curve.getPoints(50),
    );
    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const curveObject = new THREE.Line(geometry, material);
    scene.add(curveObject);
  }

  getCurvePoint(time) {
    return this.curve.getPoint(time);
  }
}
