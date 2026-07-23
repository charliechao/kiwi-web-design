/// <reference types="astro/client" />

interface KwdLeadContext {
  lead_id: string;
  ga_client_id: string;
  ga_session_id: string;
  landing_page: string;
  initial_referrer: string;
  first_seen_at: string;
  form_page: string;
  form_name: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  gclid: string;
  gbraid: string;
  wbraid: string;
  msclkid: string;
  fbclid: string;
}

interface Window {
  dataLayer: unknown[];
  gtag?: (...args: unknown[]) => void;
  kwdLeadTracking?: {
    prepare(form: HTMLFormElement, formName: string): Promise<KwdLeadContext>;
    trackLead(context: KwdLeadContext, formId: string, formName: string): void;
  };
}
