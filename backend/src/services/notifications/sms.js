import twilio from 'twilio';

const client =
  process.env.TWILIO_SID && process.env.TWILIO_TOKEN
    ? twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)
    : null;

export const sendSMS = async ({ to, body }) => {
  if (!client) return { ok: false, message: 'Twilio not configured' };
  const msid = process.env.TWILIO_MESSAGING_SERVICE_SID;
  const from = process.env.TWILIO_FROM;

  const payload = { to, body };
  if (msid) payload.messagingServiceSid = msid;
  else if (from) payload.from = from;
  else return { ok: false, message: 'No Messaging Service or FROM number configured' };

  const res = await client.messages.create(payload);
  return { ok: true, sid: res.sid, status: res.status };
};
