const dynamicImport = (path) => {
  return new Promise((resolve) => {
    const element = document.createElement('script');
    element.src = path;
    document.body.appendChild(element);

    setTimeout(() => {
      resolve();
    }, 500);
  });
};

let section = 'home';
let greeting = '';
let username = '';
let modelUrl = '';

const update = async () => {
  if (section === 'home') {
    await dynamicImport("./utils/Page.js");
    await dynamicImport("./utils/auth.js");
    await dynamicImport("./home.js");

  } else if (section === 'logined') {
    await dynamicImport("./logined.js");

  } else if (section === 'world') {
    await dynamicImport("./lib/three.min.js");
    await dynamicImport("./lib/ARnftThreejs.js");
    await dynamicImport("./lib/ARnft.js");
    await dynamicImport("./world.js");
  }
};

update();
