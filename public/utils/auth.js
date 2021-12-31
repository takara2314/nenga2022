const auth = (password, touchable) => {
  return fetch(
    'https://takaran-nenga2022-api.appspot.com/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'password': password,
      'touchable': touchable
    })
  });
};
