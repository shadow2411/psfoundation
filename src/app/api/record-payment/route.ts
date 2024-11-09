import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import { TiffinOrder } from "@/lib/db"

export async function POST(req: Request) {
  try {
    await dbConnect()
    const { id } = await req.json()
    
    const updatedTiffin = await TiffinOrder.findByIdAndUpdate(
      id,
      { paymentStatus: 'received' },
      { new: true }
    )

    if (!updatedTiffin) {
      return NextResponse.json({ error: "Tiffin not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, tiffin: updatedTiffin })
  } catch (error) {
    console.error("Error updating payment status:", error)
    return NextResponse.json({ error: "Failed to update payment status" }, { status: 500 })
  }
}