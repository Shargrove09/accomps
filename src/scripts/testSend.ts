import "dotenv/config";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: "Accompi Bot <accompi@mg.wedahargroves.com>",
  to: "scott7c1@gmail.com",
  subject: "Outbound Test",
  html: "<p>If you're reading this, outbound works ✔️</p>",
});
