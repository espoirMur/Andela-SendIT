/* eslint-disable arrow-parens */
const getById = (id) => document.getElementById(id);

const formTOJson = (form) => {
  const formData = new FormData(form);
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });
  return JSON.stringify(data);
};

export { getById, formTOJson };
