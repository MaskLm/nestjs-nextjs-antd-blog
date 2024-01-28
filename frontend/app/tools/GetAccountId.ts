import { checkJWTIsNoExpired } from './jwtTools';

const getAccountId = async () => {
  const storedAccount = localStorage.getItem('account');
  const accountTemp = storedAccount ? JSON.parse(storedAccount) : null;
  const refreshToken = localStorage.getItem('refreshToken');
  if (refreshToken) {
    if (accountTemp && (await checkJWTIsNoExpired(refreshToken))) {
      return accountTemp.sub;
    }
  }
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('account');
  return false;
};

export default getAccountId;
