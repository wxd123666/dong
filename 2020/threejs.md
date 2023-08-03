## tools

webgl 官网 https://www.khronos.org/webgl/
### threejs 
官网 https://threejs.org/
github：https://github.com/mrdoob/three.js/tree/master/build

作者
 http://zhangwenli.com/blog

http://github.com/Ovilia。

https://github.com/qiao

游戏库 http://www.voxeljs.com/

Komodo IDE  //https://www.activestate.com/products/komodo-ide/
在https://github.com/mrdoob/three.js/tree/master/build可以看到three.js和three.min.js两个文件


# threejs 三要素
渲染器 randerer
场景   sence
照相机  camera

### 正交投影照相机
视景体（Frustum）
var camera = THREE.orthographicCamera(left,right,top,bottom,near,far)
camera.position(x,y,z);

### 透视投影照相机

THREE.PerspectiveCamera(角度，width/height,near,far)






