import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { TiffinOrder } from "@/lib/db";


export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const meal: string = searchParams.get("meal") || "";

    if (meal === "") {
      return NextResponse.json(
        { error: "Missing meal parameter" },
        { status: 400 }
      );
    }

    const date= new Date();

    const query = {
      $and: [
        { fromDate: { $lte: date } },  
        { tillDate: { $gte: date } },  
        { [`${meal}Count`]: { $gt: 0 } }
      ]
    };

    const tiffins = await TiffinOrder.find(query).sort({ village: -1 });

    return NextResponse.json({ tiffins });
  } catch (error) {
    console.error("Error in GET:", error);
    return NextResponse.json(
      { error: "Failed to fetch tiffins" },
      { status: 500 }
    );
  }
}