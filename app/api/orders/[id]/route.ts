import { NextResponse } from "next/server";
import { updateOrder } from "@/lib/actions/orders";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payload = await request.json();
    const order = await updateOrder(id, payload);

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update order.";

    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
