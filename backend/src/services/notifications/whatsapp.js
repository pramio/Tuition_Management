import twilio from 'twilio';

const client =
  process.env.TWILIO_SID && process.env.TWILIO_TOKEN
    ? twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)
    : null;

export const sendWhatsApp = async ({ to, body }) => {
  if (!client) return { ok: false, message: 'Twilio not configured' };
  const from = `whatsapp:${process.env.TWILIO_WA_FROM}`;
  const toNum = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
  const res = await client.messages.create({ from, to: toNum, body });
  return { ok: true, sid: res.sid, status: res.status };
};
