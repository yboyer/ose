// @flow

document.getCookie = key => {
  return document.cookie.split(';')
    .map(cookie => cookie.trim().split('='))
    .filter(cookie => cookie[0] === key)
    .map(cookie => decodeURIComponent(cookie[1]))[0];
};
