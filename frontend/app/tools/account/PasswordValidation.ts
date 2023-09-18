const PasswordValidation = (rule: any, value: any) => {
  if (!value) return Promise.reject(new Error('Password is required'));

  if (value.length > 32)
    return Promise.reject(
      new Error('Password must be at most 32 characters long'),
    );

  if (value.length < 8)
    return Promise.reject(
      new Error('Password must be at least 8 characters long'),
    );

  const hasLowerCase = /[a-z]/.test(value);
  const hasUpperCase = /[A-Z]/.test(value);
  const hasNumber = /[0-9]/.test(value);

  if (!hasLowerCase || !hasUpperCase || !hasNumber) {
    return Promise.reject(
      new Error(
        'Password must contain at least 1 lowercase letter, 1 uppercase letter, and 1 number',
      ),
    );
  }

  return Promise.resolve();
};

export default PasswordValidation;
