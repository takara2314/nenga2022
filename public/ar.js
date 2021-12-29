///////////////////////////////////
//  ARレンダリング
///////////////////////////////////
const render = (arScene, arController, arCamera) => {
  document.body.className = arController.orientation;

  const renderer = new THREE.WebGLRenderer({ antialias: true });

  if (arController.orientation === 'portrait') {
    // 表示域が縦長なら
    const w = (window.innerWidth / arController.videoHeight) * arController.videoWidth;
    const h = window.innerWidth;
    renderer.setSize(w, h);
    renderer.domElement.style.paddingBottom = `${w - h}px`;

  } else if (/Android|mobile|iPad|iPhone/i.test(navigator.userAgent)) {
    // モバイル端末の横長なら
    const w = window.innerWidth;
    const h = (window.innerWidth / arController.videoWidth) * arController.videoHeight;
    renderer.setSize(w, h);

  } else {
    // PCなら
    renderer.setSize(arController.videoWidth, arController.videoHeight);
    document.body.className += ' desktop';
  }

  // 最初の要素の前にキャンバスを配置
  document.body.insertBefore(renderer.domElement, document.body.firstChild);

  let rotationV = 0;
  let rotationTarget = 0;

  // キャンバスにクリックしたら
  renderer.domElement.addEventListener('click', (ev) => {
    ev.preventDefault();
    rotationTarget += 1;
  }, false);

  // 基盤3Dモデル
  let basic;
  const gltfLoader = new THREE.GLTFLoader();
  gltfLoader.load('./models/test.glb', (gltf) => {
    basic = gltf.scene;
    basic.scale.set(10, 10, 10);
    basic.rotation.set(Math.PI / 2, 0, 0);
    basic.position.set(200, 320, 0);
  });

  const lights = Array(4);
  const lightPositions = [
    [0, -100, 300],
    [0, 500, 300],
    [300, -100, 300],
    [300, 500, 300]
  ];

  for (let i = 0; i < lights.length; i++) {
    lights[i] = new THREE.PointLight(0xFFFFFF, 1.2, 1000, 1.0);
    lights[i].position.set(lightPositions[i][0], lightPositions[i][1], lightPositions[i][2]);
  }

  // NFTマーカーを読み込み
  arController.loadNFTMarker('./markers/nenga', (markerId) => {
    // マーカーシーンを定義
    const marker = arController.createThreeNFTMarker(markerId);
    marker.add(basic);

    for (let light of lights) {
      marker.add(light);
    }

    // マーカーシーンをARシーンに追加
    arScene.scene.add(marker);
  });

  // 常時実行
  const tick = () => {
    arScene.process();

    arScene.renderOn(renderer);
    requestAnimationFrame(tick);
  };

  tick();
};


///////////////////////////////////
//  初期化
///////////////////////////////////
window.addEventListener('artoolkit-loaded', () => {
  window.ARThreeOnLoad = () => {

    ARController.getUserMediaThreeScene({
      maxARVideoSize: 320,
      cameraParam: './parameters/camera.dat',
      onSuccess: render
    });

    delete window.ArThreeOnLoad;
  };

  if (window.ARController && ARController.getUserMediaThreeScene) {
    ARThreeOnLoad();
  }
});
