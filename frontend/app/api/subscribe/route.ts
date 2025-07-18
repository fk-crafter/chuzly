import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const subscription = await req.json();

    console.log("📨 [Next.js] subscription reçu :", subscription);
    console.log(
      "➡️ Envoi vers :",
      process.env.NEXT_PUBLIC_API_URL + "/push/subscribe"
    );

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/push/subscribe`,
      {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Réponse du backend :", res.status);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Erreur côté API Route /subscribe :", error);
    return NextResponse.json({ error: "Erreur côté serveur" }, { status: 500 });
  }
}
