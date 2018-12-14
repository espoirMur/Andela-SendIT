/* eslint-disable no-else-return */
/* eslint-disable no-use-before-define */
/* eslint-disable arrow-parens */
const _ = (id) => document.getElementById(id);
const baseUrl = 'http://localhost:3000';
const loginForm = _('login-form');
// const authError = _('#auth-error');
const loginButton = _('login-btn');

const checkStatus = (response) => {
  if (Array.of(201, 200).includes(response.status)) {
    // is status is different form 200 or 201 the promise shoulf be rejected
    return Promise.resolve(response);
  } else {
    return Promise.reject(response);
  }
};

const parseResponse = (response) => {
  // parse json response and return promises given status code
  return response.json();
};

const fetchUrl = (url, method, data = []) => {
  /**
   * Helper function to handle fetch requests
   * */
  const requestData = {
    method,
    headers: {
      'Content-Type': 'Application/JSON',
    },
  };
  if (data) {
    requestData.body = data;
  }
  return new Promise((resolve, reject) => {
    fetch(url, requestData)
      .then(checkStatus)
      .then(parseResponse)
      .then((successData) => {
        console.log('Request succeeded with JSON response', successData);
        resolve(successData);
      })
      .catch((error) => {
        error
          .json()
          .then((errorData) => {
            console.log('Request failed', errorData);
            reject(errorData);
          })
          .catch((errorData) => Promise.reject(errorData));
      });
  });
};
const login = async (event) => {
  event.preventDefault();
  cleanError();
  const formData = new FormData(loginForm);
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });
  const dataJson = JSON.stringify(data);
  const url = `${baseUrl}/auth/signin`;
  fetchUrl(url, 'POST', dataJson)
    .then((successData) => {
      console.log(successData);
    })
    .catch((errorData) => {
      console.log(errorData);
    });
};

loginButton.addEventListener('click', login);

const cleanError = () => {
  console.log('I should clean all the errors here');
};
