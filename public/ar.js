ARnft.ARnft.init(640, 480, ['./markers/nenga'], ['nenga'], 'config.json', false)
  .then((nft) => {
    document.addEventListener('containerEvent', function (ev) {
      let canvas = document.getElementById('canvas');
      let fov = 0.8 * 180 / Math.PI;
      let ratio = window.clientWidth / window.clientHeight;
      let config = {
        'renderer': {
          'alpha': true,
          'antialias': true,
          'context': null,
          'precision': 'mediump',
          'premultipliedAlpha': true,
          'stencil': true,
          'depth': true,
          'logarithmicDepthBuffer': true
        },
        'camera': {
          'fov': fov,
          'ratio': ratio,
          'near': 0.01,
          'far': 1000
        }
      };

      let sceneThreejs = new ARnftThreejs.SceneRendererTJS(
        config,
        canvas,
        nft.uuid,
        true
      );
      sceneThreejs.initRenderer();

      const renderer = sceneThreejs.getRenderer();
      const scene = sceneThreejs.getScene();
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.physicallyCorrectLights = true;

      let nftAddTJS = new ARnftThreejs.NFTaddTJS(nft.uuid);
      nftAddTJS.oef = true;
      nftAddTJS.addModel('./models/test.glb', 'nenga', 12, false);
      const tick = () => {
        sceneThreejs.draw();
        window.requestAnimationFrame(tick);
      };
      tick();
    });
  })
  .catch((error) => {
    console.log(error);
  });
