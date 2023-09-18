const checkAdmin = () => {
  const storedAccount = localStorage.getItem('account');
  const accountTemp = storedAccount ? JSON.parse(storedAccount) : null;
  if (accountTemp) {
    return !!accountTemp.role.includes('admin');
  }
};

export default checkAdmin;
