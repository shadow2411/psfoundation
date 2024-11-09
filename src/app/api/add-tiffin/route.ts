import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { TiffinOrder } from "@/lib/db";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    body.fromDate.setHours(0, 0, 0, 0);
    body.tillDate.setHours(23, 59, 59, 999);
    const tiffinOrder = await TiffinOrder.create(body);
    return NextResponse.json(
      { message: "Tiffin registered successfully", tiffinOrder },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to register tiffin" + error },
      { status: 500 }
    );
  }
}
