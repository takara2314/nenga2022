homeElement = new Page('main');

homeElement.register([
  {
    tag: 'h1',
    content: '本人確認'
  },
  {
    tag: 'p',
    contents: [
      {
        tag: 'span',
        content: '以下の情報を入力してください。これは認証のみ使用されます。'
      }
    ]
  },
  {
    tag: 'div',
    className: 'horizon'
  },
  {
    tag: 'h2',
    content: '年賀状に記載されているパスワード'
  },
  {
    tag: 'p',
    contents: [
      {
        tag: 'span',
        className: 'explain',
        content: '文面中央下側にある、半角英数と記号を含めた、8文字程度のパスワードです。'
      }
    ]
  },
  {
    tag: 'div',
    contents: [
      {
        tag: 'input',
        type: 'password',
        id: 'password'
      }
    ]
  },
  {
    tag: 'div',
    contents: [
      {
        tag: 'button',
        content: '認証する',
        onClick: () => {
          const password = homeElement.ref.password.value;

          if (password !== "") {
            auth(password, 'ontouchend' in document ? true : false)
              .then((result) => result.json())
              .then((json) => {
                if (json['status'] === 'OK') {
                  section = 'logined';
                  username = json['name'];
                  greeting = json['greeting'];
                  modelUrl = json['model_url'];
                  update();
                  homeElement.unmount();
                } else if (json['status'] === 'Unauthorized') {
                  homeElement.ref.error.innerHTML = 'パスワードが違います。';
                } else {
                  homeElement.ref.error.innerHTML = 'サーバーエラーが発生しました。たからーんに報告してください。';
                }
              })
              .catch((err) => {
                homeElement.ref.error.innerHTML = 'サーバーエラーが発生しました。たからーんに報告してください。';
              });
          } else {
            homeElement.ref.error.innerHTML = 'パスワードを入力してください。';
          }
        }
      }
    ]
  },
  {
    tag: 'div',
    contents: [
      {
        tag: 'p',
        id: 'error'
      }
    ]
  },
  {
    tag: 'p',
    className: 'explain',
    content: '本人確認ができない場合は、直接たからーんまでお問い合わせください。'
  }
]);

homeElement.mount();
