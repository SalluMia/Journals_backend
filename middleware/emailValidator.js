exports.validateEmailArray = function (emailArray) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  for (const email of emailArray) {
    if (!emailRegex.test(email)) {
      return false;
    }
  }

  return true;
};
