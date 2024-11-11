import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { TiffinOrder } from "@/lib/db";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    console.log(body);
    
    const tiffinOrder = await TiffinOrder.create(body);
    return NextResponse.json(
      { message: "Tiffin registered successfully", tiffinOrder },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to register tiffin" + error },
      { status: 500 }
    );
  }
}
