import { NextResponse } from "next/server";
import { updateOrderStatus } from "@/lib/actions/orders";
import type { OrderStatus } from "@/lib/validations/order";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payload = await request.json();
    const order = await updateOrderStatus(id, payload.status as OrderStatus);

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update order status.";

    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
