import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const userAgent = req.headers.get('user-agent');
  const ipv4 = req.ip;
  const userData = { ...(await req.json()), userAgent, ipv4 };
  try {
    const axiosResponse = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + '/auth/oauth2/login',
      userData,
    );
    const { refreshToken, accessToken, account } = axiosResponse.data;
    return NextResponse.json({
      refreshToken,
      accessToken,
      account,
    });
  } catch (error) {
    return NextResponse.json(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      { error: error.response.data },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      { status: error.response.status },
    );
  }
}
