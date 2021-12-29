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

  // テストで表示する用の立方体
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(450, 600, 50),
    new THREE.MeshToonMaterial({ color: 0x00FF00 })
  );

  cube.position.set(200, -100, 0);

  // const cube2 = new THREE.Mesh(
  //   new THREE.BoxGeometry(5, 5, 5),
  //   new THREE.MeshBasicMaterial({ color: 0xFF0000 })
  // );

  // cube2.position.set(0, 0, 60);
  // cube2.scale.set(10, 10, 10);

  // 平行光源
  // const light = new THREE.DirectionalLight(0xffffff, 80);
  // light.position.set(0, 100, 0);
  // const light = THREE.AmbientLight(0xFFFFFF, 1.0);

  const light = new THREE.PointLight(0xFFFFFF, 1, 1000, 1.0);
  light.position.set(200, 320, 300);

  // NFTマーカーを読み込み
  arController.loadNFTMarker('./markers/nenga2', (markerId) => {
    // マーカーシーンを定義
    const marker = arController.createThreeNFTMarker(markerId);
    marker.add(cube);
    // marker.add(cube2);
    marker.add(light);

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
