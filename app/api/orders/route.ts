import { NextResponse } from "next/server";
import { createOrder } from "@/lib/actions/orders";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const order = await createOrder(payload);

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create order.";

    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
