loginedElement = new Page('main');

loginedElement.register([
  {
    tag: 'h1',
    content: `${username}！<br>あけおめです！`
  },
  {
    tag: 'p',
    contents: [
      {
        tag: 'span',
        content: greeting
      }
    ]
  },
  {
    tag: 'div',
    className: 'horizon'
  },
  {
    tag: 'div',
    contents: [
      {
        tag: 'button',
        content: 'ARコンテンツを見る',
        onClick: () => {
          section = 'world';
          update();
          loginedElement.unmount();
        }
      }
    ]
  },
  {
    tag: 'p',
    content: 'カメラに年賀状を映すと、何か出てくるかも…？'
  },
  {
    tag: 'p',
    content: 'カメラ映像はサーバーに送信されないので、ご安心ください。'
  },
  {
    tag: 'p',
    contents: [
      {
        tag: 'span',
        content: '今年はQRコードではなく、画像全体でARマーカー認識を行います。'
      },
      {
        tag: 'span',
        className: 'font-bold',
        content: 'できるだけマーカーに近づいてください。'
      }
    ]
  },
  {
    tag: 'p',
    className: 'font-bold',
    content: 'どうしても直らないマーカーの不具合で正しく描画できません。ごめんなさい。'
  }
]);

loginedElement.mount();
