export const readinessChecks = [
  {
    id: 'eligibility',
    question: 'Have you checked your exact offer against current advertising policies?',
    detail: 'Review the advertised product and destination, not only your industry label. Health, financial and legal services are currently restricted outside the US.',
    fix: 'Check the relevant policy section for your offer before creating ads. If the offer is prohibited, choose another channel rather than disguising it.',
    href: 'https://openai.com/policies/ad-policies/',
    linkLabel: 'OpenAI advertising policies',
  },
  {
    id: 'account',
    question: 'Have you confirmed account access and usable location controls?',
    detail: 'Your legal entity must qualify, and the locations available for your campaign type must match where you can fulfil the offer.',
    fix: 'Confirm account eligibility and inspect the available locations. Do not assume Auckland-only targeting exists for your campaign; new product-feed campaigns currently use country-level targeting.',
    href: 'https://help.openai.com/en/articles/20001210-create-campaigns-for-chatgpt-ads',
    linkLabel: 'OpenAI campaign setup guidance',
  },
  {
    id: 'offer',
    question: 'Do you have one clear offer and a specific buyer situation?',
    detail: 'The message should describe a real capability and a buying decision, with usable creative and truthful context hints.',
    fix: 'Choose one buyer situation and one offer. Prepare truthful creative and a context hint that explains why the offer suits that situation.',
    href: '/affordable-web-design-auckland/chatgpt-ads-context-hints-nz-examples/',
    linkLabel: 'Worked context-hint examples',
  },
  {
    id: 'destination',
    question: 'Does the destination answer the buying question and work on mobile?',
    detail: 'Check suitability, service area or delivery, availability, restrictions and the next action. Test the real enquiry or checkout path.',
    fix: 'Align the page with the ad promise and test its mobile enquiry or checkout path. Resolve missing suitability and fulfilment details before adding traffic.',
    href: '/landing-pages-funnels-on-wordpress/',
    linkLabel: 'Landing-page preparation',
  },
  {
    id: 'measurement',
    question: 'Have you validated the conversion event and lead or order record?',
    detail: 'Confirm the intended successful action, platform event receipt and your business record. A button click is not a sale.',
    fix: 'Run an authorised, labelled test. Check successful and failed submissions, event receipt, campaign conversion settings and the received enquiry or order separately.',
    href: '/affordable-web-design-auckland/chatgpt-ads-conversion-tracking-nz/',
    linkLabel: 'KWD conversion-tracking walkthrough',
  },
  {
    id: 'decision',
    question: 'Have you assigned follow-up and agreed the test boundaries?',
    detail: 'Name who qualifies leads and records sales. Agree a spend limit, a review point and reasons to stop or continue before launch.',
    fix: 'Assign the lead owner and define a qualified outcome. Agree the test boundary and review criteria without assuming a new channel will outperform existing activity.',
    href: '/affordable-web-design-auckland/chatgpt-ads-vs-google-search-ads-nz/',
    linkLabel: 'Channel comparison and test decisions',
  },
] as const;

export type ReadinessAnswer = 'unknown' | 'yes' | 'no';
export type ReadinessAnswers = Partial<Record<(typeof readinessChecks)[number]['id'], ReadinessAnswer>>;

export function assessReadiness(answers: ReadinessAnswers) {
  const gaps = readinessChecks.filter((check) => answers[check.id] !== 'yes');
  const confirmed = readinessChecks.length - gaps.length;
  const pending = gaps.filter((check) => answers[check.id] !== 'no').length;
  let title = 'Complete the preparation checks';
  if (confirmed === readinessChecks.length) title = 'Ready to discuss a controlled test';
  else if (answers.eligibility === 'no') title = 'Review offer eligibility first';
  else if (answers.account === 'no') title = 'Resolve account and geography requirements';
  else if (confirmed > 0 || gaps.some((check) => answers[check.id] === 'no')) title = 'Preparation is still needed';
  return { title, confirmed, pending, gaps, ready: gaps.length === 0 };
}

export function readinessSummary(answers: ReadinessAnswers) {
  const result = assessReadiness(answers);
  return [
    'KWD ChatGPT Ads readiness check',
    result.title,
    `${result.confirmed} of ${readinessChecks.length} checks confirmed`,
    ...readinessChecks.map((check) => `${check.question} ${answers[check.id] === 'yes' ? 'Yes' : answers[check.id] === 'no' ? 'No' : 'Not checked'}`),
    'This is a self-assessment, not OpenAI approval or a performance forecast.',
    'https://www.kiwiwebdesign.co.nz/chatgpt-ads-readiness-check/',
  ].join('\n');
}
