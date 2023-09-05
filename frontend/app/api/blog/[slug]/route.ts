import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + '/blog/' + params.slug,
      {
        next: { revalidate: 3600 },
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
      },
    );
    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    } else {
      return response;
    }
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
