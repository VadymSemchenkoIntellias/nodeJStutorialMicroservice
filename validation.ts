const emailRegex =
    new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/);

export const validateEmail = (email: string) => emailRegex.test(email);

export const validatePassword = (password: string) => password.length >= 6;