// ///////////////////////////////////
// //  ARレンダリング
// ///////////////////////////////////
// const render = (arScene, arController, arCamera) => {
//   const clock = new THREE.Clock();
//   document.body.className = arController.orientation;

//   const renderer = new THREE.WebGLRenderer({ antialias: true });

//   if (arController.orientation === 'portrait') {
//     // 表示域が縦長なら
//     const w = (window.innerWidth / arController.videoHeight) * arController.videoWidth;
//     const h = window.innerWidth;
//     renderer.setSize(w, h);
//     renderer.domElement.style.paddingBottom = `${w - h}px`;

//   } else if (/Android|mobile|iPad|iPhone/i.test(navigator.userAgent)) {
//     // モバイル端末の横長なら
//     const w = window.innerWidth;
//     const h = (window.innerWidth / arController.videoWidth) * arController.videoHeight;
//     renderer.setSize(w, h);

//   } else {
//     // PCなら
//     renderer.setSize(arController.videoWidth, arController.videoHeight);
//     document.body.className += ' desktop';
//   }

//   // 最初の要素の前にキャンバスを配置
//   document.body.insertBefore(renderer.domElement, document.body.firstChild);

//   let rotationV = 0;
//   let rotationTarget = 0;

//   // キャンバスにクリックしたら
//   renderer.domElement.addEventListener('click', (ev) => {
//     ev.preventDefault();
//     rotationTarget += 1;
//   }, false);

//   // 基盤3Dモデル
//   let basic;
//   const gltfLoader = new THREE.GLTFLoader();
//   gltfLoader.load('./models/base.glb', (gltf) => {
//     basic = gltf.scene;
//     basic.scale.set(10, 10, 10);
//     basic.rotation.set(Math.PI / 2, 0, 0);
//     basic.position.set(200, 320, 0);
//   });

//   // テストで表示する用の立方体
//   const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(5, 5, 5),
//     // new THREE.MeshLambertMaterial({ color: 0x6699FF })
//     new THREE.MeshNormalMaterial()
//   );

//   cube.position.set(0, 10, 0);
//   cube.scale.set(80, 80, 80);

//   const lights = Array(4);
//   const lightPositions = [
//     [0, -100, 300],
//     [0, 500, 300],
//     [300, -100, 300],
//     [300, 500, 300]
//   ];

//   const cheatLight = new THREE.AmbientLight(0xFFFFFF, 1.0);

//   for (let i = 0; i < lights.length; i++) {
//     lights[i] = new THREE.PointLight(0xFFFFFF, 1.2, 1000, 1.0);
//     lights[i].position.set(lightPositions[i][0], lightPositions[i][1], lightPositions[i][2]);
//   }

//   // NFTマーカーを読み込み
//   arController.loadNFTMarker('./markers/pinball', (markerId) => {
//     // マーカーシーンを定義
//     const marker = arController.createThreeNFTMarker(markerId);
//     // marker.add(basic);
//     marker.add(cube);

//     marker.add(cheatLight);

//     // for (let light of lights) {
//     //   marker.add(light);
//     // }

//     // マーカーシーンをARシーンに追加
//     arScene.scene.add(marker);
//   });

//   // 常時実行
//   const tick = () => {
//     // if (parseInt(clock.getElapsedTime() * 10) % 10 == 0) {
//     //   arScene.process();
//     // }
//     arScene.process();

//     arScene.renderOn(renderer);
//     requestAnimationFrame(tick);
//   };

//   tick();
// };


// ///////////////////////////////////
// //  初期化
// ///////////////////////////////////
// window.addEventListener('artoolkit-loaded', () => {
//   window.ARThreeOnLoad = () => {

//     ARController.getUserMediaThreeScene({
//       maxARVideoSize: 320,
//       cameraParam: './parameters/camera.dat',
//       onSuccess: render
//     });

//     delete window.ArThreeOnLoad;
//   };

//   if (window.ARController && ARController.getUserMediaThreeScene) {
//     ARThreeOnLoad();
//   }
// });


function isMobile() {
  return /Android|mobile|iPad|iPhone/i.test(navigator.userAgent);
}

var interpolationFactor = 24;

var trackedMatrix = {
  // for interpolation
  delta: [
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0
  ],
  interpolated: [
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0
  ]
};

// var markers = {
//   "pinball": {
//     width: 1637,
//     height: 2048,
//     dpi: 250,
//     url: "./markers/pinball",
//   },
// };

var markers = {
  "nenga": {
    url: "./markers/nenga"
  },
};

var setMatrix = function (matrix, value) {
  var array = [];
  for (var key in value) {
    array[key] = value[key];
  }
  if (typeof matrix.elements.set === "function") {
    matrix.elements.set(array);
  } else {
    matrix.elements = [].slice.call(array);
  }
};

//var worker;
function start(marker, video, input_width, input_height, canvas_draw, render_update, track_update) {
  worker = new Worker('./lib/artoolkit.wasm_worker.js');
  worker.onmessage = function (ev) {
    start2(marker, video, input_width, input_height, canvas_draw, render_update, track_update);
  };
}

function start2(marker, video, input_width, input_height, canvas_draw, render_update, track_update) {
  var vw, vh;
  var sw, sh;
  var pscale, sscale;
  var w, h;
  var pw, ph;
  var ox, oy;
  var camera_para = '../parameters/camera.dat';

  var canvas_process = document.createElement('canvas');
  var context_process = canvas_process.getContext('2d');

  var renderer = new THREE.WebGLRenderer({ canvas: canvas_draw, alpha: true, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);

  var scene = new THREE.Scene();

  // // const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10);
  // const cameraParam = {
  //   fovy: 60,
  //   aspect: window.innerWidth / window.innerHeight,
  //   near: 100,
  //   far: 20000,
  //   x: 0.0,
  //   y: 0.0,
  //   z: 0.0,
  // };

  const camera = new THREE.Camera(
    // cameraParam.fovy,
    // cameraParam.aspect,
    // cameraParam.near,
    // cameraParam.far
  );
  camera.matrixAutoUpdate = false;

  scene.add(camera);

  var sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 8, 8),
    new THREE.MeshNormalMaterial()
  );

  var root = new THREE.Object3D();
  scene.add(root);

  sphere.material.flatShading;
  sphere.position.z = 0;
  sphere.position.x = 100;
  sphere.position.y = 100;
  sphere.scale.set(200, 200, 200);

  root.matrixAutoUpdate = false;
  // root.add(sphere);

  // 基盤3Dモデル
  let basic = {};
  const gltfLoader = new THREE.GLTFLoader();
  gltfLoader.load('./models/hoge.glb', (gltf) => {
    basic = gltf.scene;
    basic.scale.set(10, 10, 10);
    basic.rotation.set(Math.PI / 2, 0, 0);
    basic.position.set(200, 320, 0);
    // basic.scale.set(2, 2, 2);
    // basic.rotation.set(Math.PI / 2, 0, 0);
    // basic.position.set(50, 10, 0);
    root.add(basic);
  });

  const lightPositions = [
    [0, -100, 300],
    [0, 500, 300],
    [300, -100, 300],
    [300, 500, 300]
  ];

  for (let position of lightPositions) {
    const light = new THREE.PointLight(0xFFFFFF, 1.2, 1000, 1.0);
    light.position.set(position[0], position[1], position[2]);
    root.add(light);
  }

  var sphere = new THREE.Mesh(
    new THREE.BoxGeometry(100, 200, 50),
    new THREE.MeshLambertMaterial({ color: 0x6699FF })
  );

  root.add(sphere);



  // let light = new THREE.DirectionalLight(0xffffff);
  // light.position.set(0, 0, 2);
  // root.add(light);

  var load = function () {
    vw = input_width;
    vh = input_height;

    pscale = 320 / Math.max(vw, vh / 3 * 4);
    sscale = isMobile() ? window.outerWidth / input_width : 1;

    sw = vw * sscale;
    sh = vh * sscale;

    w = vw * pscale;
    h = vh * pscale;
    pw = Math.max(w, h / 3 * 4);
    ph = Math.max(h, w / 4 * 3);
    ox = (pw - w) / 2;
    oy = (ph - h) / 2;
    canvas_process.style.clientWidth = pw + "px";
    canvas_process.style.clientHeight = ph + "px";
    canvas_process.width = pw;
    canvas_process.height = ph;

    renderer.setSize(sw, sh);

    worker.postMessage({ type: "load", pw: pw, ph: ph, camera_para: camera_para, marker: '../' + marker.url });

    worker.onmessage = function (ev) {
      var msg = ev.data;
      switch (msg.type) {
        case "loaded": {
          var proj = JSON.parse(msg.proj);
          var ratioW = pw / w;
          var ratioH = ph / h;
          proj[0] *= ratioW;
          proj[4] *= ratioW;
          proj[8] *= ratioW;
          proj[12] *= ratioW;
          proj[1] *= ratioH;
          proj[5] *= ratioH;
          proj[9] *= ratioH;
          proj[13] *= ratioH;
          setMatrix(camera.projectionMatrix, proj);
          break;
        }

        case "endLoading": {
          if (msg.end == true) {
            // removing loader page if present
            var loader = document.getElementById('loading');
            if (loader) {
              loader.querySelector('.loading-text').innerText = 'Start the tracking!';
              setTimeout(function () {
                loader.parentElement.removeChild(loader);
              }, 2000);
            }
          }
          break;
        }

        case "found": {
          found(msg);
          break;
        }

        case "not found": {
          found(null);
          break;
        }
      }

      track_update();
      process();
    };
  };

  var world;

  var found = function (msg) {
    if (!msg) {
      world = null;
    } else {
      world = JSON.parse(msg.matrixGL_RH);
    }
  };

  var lasttime = Date.now();
  var time = 0;

  var draw = function () {
    render_update();
    var now = Date.now();
    var dt = now - lasttime;
    time += dt;
    lasttime = now;

    if (!world) {
      sphere.visible = false;
      basic.visible = false;
    } else {
      sphere.visible = true;
      basic.visible = true;
      // interpolate matrix
      for (var i = 0; i < 16; i++) {
        trackedMatrix.delta[i] = world[i] - trackedMatrix.interpolated[i];
        trackedMatrix.interpolated[i] =
          trackedMatrix.interpolated[i] +
          trackedMatrix.delta[i] / interpolationFactor;
      }

      // set matrix of 'root' by detected 'world' matrix
      setMatrix(root.matrix, trackedMatrix.interpolated);
    }
    renderer.render(scene, camera);
  };

  function process() {
    context_process.fillStyle = "black";
    context_process.fillRect(0, 0, pw, ph);
    context_process.drawImage(video, 0, 0, vw, vh, ox, oy, w, h);

    var imageData = context_process.getImageData(0, 0, pw, ph);
    worker.postMessage({ type: "process", imagedata: imageData }, [
      imageData.data.buffer
    ]);
  }
  var tick = function () {
    draw();
    requestAnimationFrame(tick);
  };

  load();
  tick();
  process();
}
