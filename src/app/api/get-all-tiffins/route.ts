import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import { TiffinOrder } from "@/lib/db"

export async function GET() {
  try {
    await dbConnect()
    const tiffins = await TiffinOrder.find({}).sort({ fromDate: -1 })
    return NextResponse.json({ tiffins })
  } catch (error) {
    console.error("Error fetching tiffins:", error)
    return NextResponse.json({ error: "Failed to fetch tiffins" }, { status: 500 })
  }
}