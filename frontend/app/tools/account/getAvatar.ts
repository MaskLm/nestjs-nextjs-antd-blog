import axiosInstance from '../AxiosInterceptorsJwt';

async function getAvatarURL(account: any) {
  const response = await axiosInstance.get(
    process.env.NEXT_PUBLIC_API_URL + '/user/' + account.sub,
  );
  return response.data.avatarURL;
}

export default getAvatarURL;
