const emailRegex =
    new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/);

export const validateEmail = (email) => emailRegex.test(email);

export const validatePassword = (password) => password.length >= 6;