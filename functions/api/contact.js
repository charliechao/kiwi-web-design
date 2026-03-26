import { Resend } from 'resend';

const OWNER_EMAIL = 'Hi@KiwiWebDesign.co.nz';
const FROM_NOTIF  = 'KWD Contact Form <noreply@kiwiwebdesign.co.nz>';
const FROM_REPLY  = 'Kiwi Web Design <noreply@kiwiwebdesign.co.nz>';
const EMAIL_RE    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequestPost({ request, env }) {
  // Parse form body
  let body;
  try { body = await request.formData(); }
  catch { return json({ ok: false, error: 'Invalid request body.' }, 400); }

  const name     = (body.get('name')     ?? '').trim();
  const email    = (body.get('email')    ?? '').trim();
  const mobile   = (body.get('mobile')   ?? '').trim();
  const business = (body.get('business') ?? '').trim();
  const service  = (body.get('service')  ?? '').trim();
  const message  = (body.get('message')  ?? '').trim();

  // Validate required fields
  const missing = [];
  if (!name)    missing.push('name');
  if (!email)   missing.push('email');
  if (!mobile)  missing.push('mobile');
  if (!message) missing.push('message');
  if (missing.length) return json({ ok: false, error: `Required fields missing: ${missing.join(', ')}.` }, 422);
  if (!EMAIL_RE.test(email)) return json({ ok: false, error: 'Please provide a valid email address.' }, 422);

  if (!env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY not configured');
    return json({ ok: false, error: 'Server configuration error. Please call us directly.' }, 500);
  }

  const resend = new Resend(env.RESEND_API_KEY);

  const notifHtml = `
    <h2 style="font-family:sans-serif;color:#2c2927">New Contact Form Submission</h2>
    <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">
      <tr><td style="padding:6px 12px 6px 0;font-weight:700">Name</td><td>${name}</td></tr>
      <tr><td style="padding:6px 12px 6px 0;font-weight:700">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
      <tr><td style="padding:6px 12px 6px 0;font-weight:700">Mobile</td><td><a href="tel:${mobile}">${mobile}</a></td></tr>
      <tr><td style="padding:6px 12px 6px 0;font-weight:700">Business</td><td>${business || '—'}</td></tr>
      <tr><td style="padding:6px 12px 6px 0;font-weight:700">Service</td><td>${service || 'Not specified'}</td></tr>
      <tr><td style="padding:6px 12px 6px 0;font-weight:700;vertical-align:top">Message</td><td style="white-space:pre-wrap">${message}</td></tr>
    </table>`;

  const replyHtml = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
      <h2 style="color:#2c2927">Thanks for reaching out, ${name}!</h2>
      <p style="color:#534a45;line-height:1.6">We've received your message and will get back to you within 1 business day.
      If you need us sooner, call or text <a href="tel:+64210396580" style="color:#2c2927;font-weight:700">021 039 6580</a>.</p>
      <p style="color:#534a45">— Charlie &amp; the Kiwi Web Design team</p>
      <hr style="border:none;border-top:1px solid #e8e7db;margin:2rem 0"/>
      <p style="font-size:12px;color:#888">Kiwi Web Design · Auckland<br>
      <a href="https://www.kiwiwebdesign.co.nz" style="color:#888">www.kiwiwebdesign.co.nz</a></p>
    </div>`;

  try {
    const [notif, reply] = await Promise.all([
      resend.emails.send({
        from: FROM_NOTIF, to: [OWNER_EMAIL], replyTo: email,
        subject: `New enquiry from ${name}${business ? ` — ${business}` : ''}`,
        html: notifHtml,
      }),
      resend.emails.send({
        from: FROM_REPLY, to: [email],
        subject: 'Thanks for contacting Kiwi Web Design',
        html: replyHtml,
      }),
    ]);

    if (notif.error || reply.error) {
      const msg = notif.error?.message ?? reply.error?.message;
      console.error('Resend error:', msg);
      return json({ ok: false, error: 'Failed to send email. Please try calling us directly.' }, 502);
    }

    return json({ ok: true });
  } catch (err) {
    console.error('Unexpected error:', err);
    return json({ ok: false, error: 'An unexpected error occurred. Please try again.' }, 500);
  }
}

export async function onRequest(context) {
  if (context.request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  return onRequestPost(context);
}
