import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const res = await fetch(
      "https://api.convertkit.com/v3/forms/8269273/subscribe",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: process.env.CONVERTKIT_API_KEY,
          email,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to subscribe" },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: "Chuzly <no-reply@chuzly.app>",
      to: email,
      subject: "Welcome to Chuzly 🎉",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://chuzly.app/logo3.png" alt="Chuzly Logo" style="width: 120px; height: auto;" />
          </div>
          <h2 style="color: #111; text-align: center;">Welcome to Chuzly 🎉</h2>
          <p style="font-size: 16px; color: #333;">
            Hey 👋🏼,
          </p>
          <p style="font-size: 16px; color: #333;">
            Thank you for joining our waitlist! We're thrilled to have you on board.
          </p>
          <p style="font-size: 16px; color: #333;">
            We’ll keep you updated as we get closer to launch. Stay tuned!
          </p>
          <p style="font-size: 16px; color: #333;">
            — The Chuzly team 😁
          </p>
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://chuzly.app" style="display: inline-block; padding: 10px 20px; background-color: #111827; color: white; text-decoration: none; border-radius: 5px;">
              Visit our website
            </a>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Server error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
