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

async function sendEmail(apiKey, payload) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  console.log(`[Resend] status=${res.status} body=${JSON.stringify(data)}`);
  if (!res.ok) throw new Error(data.message ?? JSON.stringify(data));
  return data;
}

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  // Parse body, accept both form-encoded and JSON
  let name, email, mobile, business, service, message;
  try {
    const ct = request.headers.get('content-type') ?? '';
    if (ct.includes('application/json')) {
      const b = await request.json();
      ({ name, email, mobile, business, service, message } = b);
    } else {
      const b = await request.formData();
      name     = b.get('name')     ?? '';
      email    = b.get('email')    ?? '';
      mobile   = b.get('mobile')   ?? '';
      business = b.get('business') ?? '';
      service  = b.get('service')  ?? '';
      message  = b.get('message')  ?? '';
    }
  } catch {
    return json({ ok: false, error: 'Invalid request body.' }, 400);
  }

  name     = (name     ?? '').trim();
  email    = (email    ?? '').trim();
  mobile   = (mobile   ?? '').trim();
  business = (business ?? '').trim();
  service  = (service  ?? '').trim();
  message  = (message  ?? '').trim();

  // Validate
  const missing = [];
  if (!name)    missing.push('name');
  if (!email)   missing.push('email');
  if (!message) missing.push('message');
  if (missing.length) {
    return json({ ok: false, error: `Required fields missing: ${missing.join(', ')}.` }, 422);
  }
  if (!EMAIL_RE.test(email)) {
    return json({ ok: false, error: 'Please provide a valid email address.' }, 422);
  }

  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY not configured');
    return json({ ok: false, error: 'Server configuration error. Please call us directly.' }, 500);
  }

  const notifHtml = `
    <h2 style="font-family:sans-serif;color:#2c2927">New Contact Form Submission</h2>
    <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">
      <tr><td style="padding:6px 12px 6px 0;font-weight:700">Name</td><td>${name}</td></tr>
      <tr><td style="padding:6px 12px 6px 0;font-weight:700">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
      <tr><td style="padding:6px 12px 6px 0;font-weight:700">Mobile</td><td><a href="tel:${mobile}">${mobile}</a></td></tr>
      <tr><td style="padding:6px 12px 6px 0;font-weight:700">Business</td><td>${business || '-'}</td></tr>
      <tr><td style="padding:6px 12px 6px 0;font-weight:700">Service</td><td>${service || 'Not specified'}</td></tr>
      <tr><td style="padding:6px 12px 6px 0;font-weight:700;vertical-align:top">Message</td><td style="white-space:pre-wrap">${message}</td></tr>
    </table>`;

  const replyHtml = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
      <h2 style="color:#2c2927">Thanks for reaching out, ${name}!</h2>
      <p style="color:#534a45;line-height:1.6">We've received your message and will get back to you within 1 business day.
      If you need us sooner, call or text <a href="tel:+64210396580" style="color:#2c2927;font-weight:700">021 039 6580</a>.</p>
      <p style="color:#534a45">- Charlie &amp; the Kiwi Web Design team</p>
      <hr style="border:none;border-top:1px solid #e8e7db;margin:2rem 0"/>
      <p style="font-size:12px;color:#888">Kiwi Web Design · Auckland<br>
      <a href="https://www.kiwiwebdesign.co.nz" style="color:#888">www.kiwiwebdesign.co.nz</a></p>
    </div>`;

  try {
    await Promise.all([
      sendEmail(apiKey, {
        from: FROM_NOTIF,
        to: [OWNER_EMAIL],
        reply_to: email,
        subject: `New enquiry from ${name}${business ? `, ${business}` : ''}`,
        html: notifHtml,
      }),
      sendEmail(apiKey, {
        from: FROM_REPLY,
        to: [email],
        subject: 'Thanks for contacting Kiwi Web Design',
        html: replyHtml,
      }),
    ]);

    return json({ ok: true });
  } catch (err) {
    console.error('Resend error:', err.message);
    return json({ ok: false, error: 'Failed to send email. Please try calling us directly.' }, 502);
  }
}
