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
        resolve(successData);
      })
      .catch((error) => {
        error
          .json()
          .then((errorData) => {
            reject(errorData);
          })
          .catch((errorData) => reject(errorData));
      });
  });
};

export default fetchUrl;
