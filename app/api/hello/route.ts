import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server'
 
type ResponseData = {
    message: string
  }
   
  export function GET(
   
    res: NextApiResponse<ResponseData>
  ) {
   
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 200 });
  }

  export function POST(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
  ) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }