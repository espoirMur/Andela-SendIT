/* eslint-disable arrow-parens */
/* eslint-disable no-else-return */
const checkStatus = (response) => {
  if (Array.of(201, 200).includes(response.status)) {
    // is status is different form 200 or 201 the promise should be rejected
    return Promise.resolve(response);
  } else {
    return Promise.reject(response);
  }
};

const parseResponse = (response) => {
  // parse json response and return promises given status code
  return response.json();
};

const fetchUrl = (url, method, data = {}, token = '') => {
  /**
   * Helper function to handle fetch requests
   * */
  const baseUrl = 'http://localhost:3000';
  const requestData = {
    method,
    headers: {
      'Content-Type': 'Application/JSON',
    },
  };
  if (data && Array.of('PUT', 'POST').includes(method)) {
    requestData.body = data;
  }
  if (token) {
    requestData.headers.Authorization = `Bearer ${token}`;
  }
  return new Promise((resolve, reject) => {
    fetch(`${baseUrl}${url}`, requestData)
      .then(checkStatus)
      .then(parseResponse)
      .then((successData) => {
        resolve(successData);
      })
      .catch((error) => {
        if (error.json) {
          error.json().then((errorData) => {
            reject(errorData);
          });
        } else {
          reject(error);
        }
      });
  });
};

export default fetchUrl;
