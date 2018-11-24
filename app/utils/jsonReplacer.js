const jsonReplacer = (key, value) => {
  /**
   * This is used to
   *  explicitly override the undefined behavior and set values to null ,
   *  when the application is returning json response
   *
   * */
  if (typeof value === 'undefined') {
    return null;
  }
  return value;
};

export default jsonReplacer;
