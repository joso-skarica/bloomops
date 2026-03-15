import { NextResponse } from "next/server";
import { createShipment } from "@/lib/actions/shipments";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const shipment = await createShipment(payload);

    return NextResponse.json({ success: true, data: shipment }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create shipment.";

    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
