const GA_MEASUREMENT_ID = 'G-T7CZRER80F';
const ATTRIBUTION_STORAGE_KEY = 'kwd_attribution_v1';
const GA_LOOKUP_TIMEOUT_MS = 1200;

type Attribution = Pick<
  KwdLeadContext,
  | 'landing_page'
  | 'initial_referrer'
  | 'first_seen_at'
  | 'utm_source'
  | 'utm_medium'
  | 'utm_campaign'
  | 'utm_term'
  | 'utm_content'
  | 'gclid'
  | 'gbraid'
  | 'wbraid'
  | 'msclkid'
  | 'fbclid'
>;

const ATTRIBUTION_FIELDS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'gbraid',
  'wbraid',
  'msclkid',
  'fbclid',
] as const;

function clean(value: unknown, maxLength = 500) {
  return String(value || '').trim().slice(0, maxLength);
}

function readStoredAttribution(): Attribution | null {
  try {
    const raw = sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Attribution>;
    if (!parsed.landing_page || !parsed.first_seen_at) return null;

    return {
      landing_page: clean(parsed.landing_page),
      initial_referrer: clean(parsed.initial_referrer),
      first_seen_at: clean(parsed.first_seen_at, 40),
      utm_source: clean(parsed.utm_source, 200),
      utm_medium: clean(parsed.utm_medium, 200),
      utm_campaign: clean(parsed.utm_campaign, 200),
      utm_term: clean(parsed.utm_term, 200),
      utm_content: clean(parsed.utm_content, 200),
      gclid: clean(parsed.gclid, 300),
      gbraid: clean(parsed.gbraid, 300),
      wbraid: clean(parsed.wbraid, 300),
      msclkid: clean(parsed.msclkid, 300),
      fbclid: clean(parsed.fbclid, 300),
    };
  } catch {
    return null;
  }
}

function createAttribution(): Attribution {
  const params = new URLSearchParams(window.location.search);
  const attribution = {
    landing_page: clean(window.location.pathname),
    initial_referrer: clean(document.referrer || '(direct)'),
    first_seen_at: new Date().toISOString(),
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_term: '',
    utm_content: '',
    gclid: '',
    gbraid: '',
    wbraid: '',
    msclkid: '',
    fbclid: '',
  } satisfies Attribution;

  ATTRIBUTION_FIELDS.forEach((field) => {
    attribution[field] = clean(params.get(field), field.startsWith('utm_') ? 200 : 300);
  });

  try {
    sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    // Attribution still works for the current page when storage is unavailable.
  }

  return attribution;
}

const attribution = readStoredAttribution() || createAttribution();

function createLeadId() {
  if (typeof crypto.randomUUID === 'function') {
    return `kwd_${crypto.randomUUID()}`;
  }

  const randomPart = Math.random().toString(36).slice(2, 12);
  return `kwd_${Date.now().toString(36)}_${randomPart}`;
}

function getGaValue(field: 'client_id' | 'session_id') {
  return new Promise<string>((resolve) => {
    const gtag = window.gtag;
    if (typeof gtag !== 'function') {
      resolve('');
      return;
    }

    let settled = false;
    const finish = (value: unknown) => {
      if (settled) return;
      settled = true;
      resolve(clean(value, 200));
    };

    window.setTimeout(() => finish(''), GA_LOOKUP_TIMEOUT_MS);
    gtag('get', GA_MEASUREMENT_ID, field, finish);
  });
}

function upsertHiddenField(form: HTMLFormElement, name: string, value: string) {
  let input = form.querySelector<HTMLInputElement>(`input[type="hidden"][name="${name}"]`);
  if (!input) {
    input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    form.appendChild(input);
  }
  input.value = value;
}

async function prepare(form: HTMLFormElement, formName: string): Promise<KwdLeadContext> {
  const [gaClientId, gaSessionId] = await Promise.all([
    getGaValue('client_id'),
    getGaValue('session_id'),
  ]);

  const context: KwdLeadContext = {
    lead_id: createLeadId(),
    ga_client_id: gaClientId,
    ga_session_id: gaSessionId,
    landing_page: attribution.landing_page,
    initial_referrer: attribution.initial_referrer,
    first_seen_at: attribution.first_seen_at,
    form_page: window.location.pathname,
    form_name: formName,
    utm_source: attribution.utm_source,
    utm_medium: attribution.utm_medium,
    utm_campaign: attribution.utm_campaign,
    utm_term: attribution.utm_term,
    utm_content: attribution.utm_content,
    gclid: attribution.gclid,
    gbraid: attribution.gbraid,
    wbraid: attribution.wbraid,
    msclkid: attribution.msclkid,
    fbclid: attribution.fbclid,
  };

  Object.entries(context).forEach(([name, value]) => {
    if (value) upsertHiddenField(form, name, value);
  });

  return context;
}

function trackLead(context: KwdLeadContext, formId: string, formName: string) {
  const gtag = window.gtag;
  if (typeof gtag !== 'function') return;

  const eventParameters = {
    lead_id: context.lead_id,
    form_id: formId,
    form_name: formName,
    lead_landing_page: context.landing_page,
  };

  gtag('event', 'form_submit', eventParameters);
  gtag('event', 'generate_lead', eventParameters);
}

window.kwdLeadTracking = { prepare, trackLead };
