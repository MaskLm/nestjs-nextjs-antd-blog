import { checkIfTokenExpired } from './jwtTools';

const getAccountId = () => {
  const storedAccount = localStorage.getItem('account');
  const accountTemp = storedAccount ? JSON.parse(storedAccount) : null;
  const refreshToken = localStorage.getItem('refreshToken');
  if (refreshToken) {
    if (accountTemp && checkIfTokenExpired(refreshToken)) {
      return accountTemp.sub;
    }
  }
  return -1;
};

export default getAccountId;
