import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const subscription = await req.json();

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/push/subscribe`, {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur côté API Route /subscribe :", error);
    return NextResponse.json({ error: "Erreur côté serveur" }, { status: 500 });
  }
}
