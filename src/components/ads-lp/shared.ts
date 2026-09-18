import beautyTouchPreview from '../../assets/general/beauty-salon-website-design-seo-auckland.jpg';

/** Heading text with one highlighted phrase: `pre` + <accent> + `post`. */
export interface AccentText {
  pre: string;
  accent: string;
  post?: string;
}

export interface AdsLpContent {
  meta: { title: string; description: string; canonicalURL: string };
  forms: {
    /** Top form `name`; also the GA4 `form_name` that tells variants apart. */
    topName: string;
    bottomName: string;
    /** Web3Forms email subjects. Keep the "Google Ads LP lead" prefix, the inbox filter keys on it. */
    topSubject: string;
    bottomSubject: string;
    goalPlaceholder: string;
  };
  hero: {
    eyebrow: string;
    title: AccentText;
    lead: string;
    trust: { icon: string; text: string }[];
    formTitle: AccentText;
  };
  reviews: { title: AccentText; first?: string[] };
  problem: { eyebrow: string; title: AccentText; cards: { icon: string; title: string; text: string }[] };
  portfolio: { title: AccentText; first?: string[] };
  impact: { eyebrow: string; title: AccentText; points: { title: string; desc: string }[] };
  included: { title: AccentText; items: { icon: string; title: string; desc: string }[] };
  fit: { title: AccentText; good: string[]; notFit: string[] };
  testimonialTitle: AccentText;
  ctaBandText: string;
  faq: { title: AccentText; items: { q: string; a: string }[] };
  coverage: { eyebrow: string; title: AccentText; intro: string; items: string[] };
  final: { eyebrow: string; title: AccentText; body: string; formTitle: AccentText; formSub: string };
}

/** Moves the items named in `first` to the front (in that order), keeping the rest in place. */
export function orderBy<T>(items: T[], first: string[], key: (item: T) => string): T[] {
  const picked = first
    .map((name) => items.find((item) => key(item) === name))
    .filter((item): item is T => item !== undefined);
  return [...picked, ...items.filter((item) => !picked.includes(item))];
}

// Verbatim 5-star Google reviews (kiwiwebdesign.co.nz Business Profile).
export const reviews: { name: string; company?: string; avatar?: string; text: string }[] = [
  { name: "Eduardo Arnez", company: "Aesthetic Painting & Deco", text: "Charlie from Kiwi Web Design did an outstanding job designing our website. He was incredibly helpful throughout the entire process, offering great ideas and maintaining excellent communication. We're extremely happy with both the look and functionality of the final result. Highly recommend!" },
  { name: "Francesco Moretti", text: "Kiwi Web Design doesn't just build website, they actually focus on getting you found online. Their approach to SEO and AI search made a big difference for us. We're now showing up in more places and getting more enquires." },
  { name: "Charles Haddix", avatar: "/images/reviews/charles-haddix.png", text: "We recently got our website rebuilt by Kiwi Web Design in Auckland, and honestly, it was such a good experience. Charlie made everything really easy to understand and kept us in the loop the whole way through. The new site looks great on both phone and desktop, and we've already noticed more people finding us on Google and getting in touch. Couldn't recommend Kiwi Web Design enough if you're after an affordable, professional web designer in Auckland." },
  { name: "Deborah Shaw", company: "Deborah Shaw Editing", avatar: "/images/reviews/deborah-shaw.png", text: "Charlie is fantastic to work with! I got stuck fiddling around with WordPress blocks, but Charlie came to the rescue. He understood what I was wanting with my website and made my ideas come together. Thank you!" },
  { name: "Zane Barrett", company: "Barrett Access Scaffolding", text: "We recently worked with Kiwiweb to design and launch our new website, and we couldn't be happier with the results. The team was professional, responsive, and really took the time to understand our business. They helped us create a modern, easy-to-navigate site and incorporated some amazing features, including a scaffold cost calculator – the first of its kind in NZ! This has already set us apart in our industry and made quoting so much easier for our clients. Communication was clear and efficient throughout, and any tweaks we needed were handled quickly. I highly recommend Kiwiweb to anyone looking for a web design team that delivers both creativity and functionality." },
  { name: "Steven Liu", company: "Kiwiland Constructions", avatar: "/images/reviews/steven-liu.png", text: "Outstanding Experience with Kiwi Web Design and Charlie! I couldn't be happier with the website that Kiwi Web Design created for me. From start to finish, Charlie was professional, responsive, and incredibly easy to work with. He took the time to understand exactly what I wanted, offered helpful suggestions, and delivered a final product that exceeded my expectations. The design is clean, modern, and user-friendly — exactly what I was hoping for. Charlie made the whole process smooth and stress-free, and he was always quick to answer any questions I had. His attention to detail and commitment to quality really stood out. If you're looking for a reliable, talented web designer who truly cares about your vision, I highly recommend Kiwi Web Design and Charlie. Five stars all the way!" },
  { name: "Jack at Show Me Shorts", avatar: "/images/reviews/jack-show-me-shorts.png", text: "Kiwi Web Design were fantastic to work with. From the very beginning they really took the time to understand what I needed and offered smart, practical solutions. The team were professional, friendly and quick to respond whenever I had questions. If you're looking for a reliable, creative, and genuinely helpful web design team in New Zealand, I'd definitely recommend Kiwi Web Design." },
  { name: "Tony S", company: "Streetfood Network", avatar: "/images/reviews/tony-s.png", text: "Charlie from Kiwi Web Design has been great to work with. He communicates clearly, responds promptly, and makes the process easy to understand. The pricing has been reasonable, and I've appreciated his practical approach to building and improving our Streetfood Network website. I would recommend Kiwi Web Design to any small business looking for reliable website support. Business has since taken off and the Website is amazing!" },
  { name: "Iby V.", company: "Yoga Teacher", text: "Charlie from Kiwi Web Design helped me design a flyer for my studio, and I'm really happy with the result. He was easy to communicate with, understood what I needed, and created something professional, clean, and aligned with the feeling of my business. The process was smooth and thoughtful, and I appreciated the care he put into making the flyer look polished and effective. I'd happily recommend Charlie and Kiwi Web Design to any small business owner who needs help with design, websites, or digital marketing." },
  { name: "Elisabeth Krull", text: "Kiwi Web Design is helping me with an international website. I can highly recommend working with Charlie — both professionally and personally!" },
  { name: "Gina Dellabarca", company: "Showme Short Film Festival", avatar: "/images/reviews/gina-dellabarca.png", text: "They provided a comprehensive and helpful website audit for us. Clear information. Great communication." },
  { name: "Dave G", text: "Charlie was very responsive to my concerns and demonstrated a strong understanding of the issues I raised. Excellent service and support — thank you." },
];

// Full-colour Google "G" logo (official 4-colour mark), reused in the header + each review card.
export const googleG = '<path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/><path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/><path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"/><path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>';
export const avatarColors = ['#d93b8f', '#5b8def', '#8b5cf6', '#0ea5a4', '#e0672c', '#3f7d4f', '#c0392b', '#2f6f9f'];

export const steps = [
  { num: "1", title: "15-Minute Strategy Call", desc: "We talk through your business, your customers, and whether a new site will actually move the needle. Honest advice, no pressure." },
  { num: "2", title: "Plan & Fixed Quote", desc: "You get a clear proposal: pages, copy, design direction, timeline, and one fixed price. No surprise invoices." },
  { num: "3", title: "Design & Build", desc: "I write, design, and build. You review at each stage. Most sites are live in 2-3 weeks." },
  { num: "4", title: "Launch & Grow", desc: "Analytics and enquiry tracking are live from day one. Add SEO or Google Ads when you're ready." },
];

// Screenshots only, deliberately no outbound links — this page has one job.
// Full set — matches the homepage portfolio (index.astro) plus a couple of LP-only extras.
// `result` is a qualitative outcome statement (no hard metrics claimed).
export const portfolio = [
  { src: '/portfolio/barrett-access-scaffolding.webp', alt: 'Barrett Access Scaffolding website by Kiwi Web Design', caption: 'Barrett Access Scaffolding', result: 'More phone calls and quote requests' },
  { src: '/portfolio/prime-industrial.webp', alt: 'Prime Industrial website by Kiwi Web Design', caption: 'Prime Industrial', result: 'Stronger trust from first-time visitors' },
  { src: '/portfolio/the-framers-guild.webp', alt: 'The Framers Guild website by Kiwi Web Design', caption: 'The Framers Guild', result: 'Better engagement across every page' },
  { src: '/portfolio/kiwiland-construction.webp', alt: 'Kiwiland Construction website by Kiwi Web Design', caption: 'Kiwiland Construction', result: 'More email enquiries from Google' },
  { src: '/portfolio/melanoma-specialists.webp', alt: 'Melanoma Specialists website by Kiwi Web Design', caption: 'Melanoma Specialists', result: 'Clearer booking journey for patients' },
  { src: '/portfolio/aesthetic-painting.webp', alt: 'Aesthetic Painting website by Kiwi Web Design', caption: 'Aesthetic Painting', result: 'Higher conversion from visitor to enquiry' },
  { src: beautyTouchPreview.src, alt: 'Beauty Touch Auckland website by Kiwi Web Design', caption: 'Beauty Touch Auckland', result: 'More online bookings and enquiries' },
  { src: '/portfolio/gom.webp', alt: 'Goldwing website by Kiwi Web Design', caption: 'Goldwing', result: 'A more professional first impression' },
  { src: '/portfolio/kebudel.webp', alt: 'Kebudel website by Kiwi Web Design', caption: 'Kebudel', result: 'Better engagement from new visitors' },
  { src: '/portfolio/asc-homes.webp', alt: 'ASC Homes website by Kiwi Web Design', caption: 'ASC Homes', result: 'Stronger trust with prospective clients' },
  { src: '/portfolio/mt-albert-business.jpg', alt: 'Mt Albert Business Association website by Kiwi Web Design', caption: 'Mt Albert Business Assoc.', result: 'Easier for members to find and contact' },
  { src: '/blog/600-21B675F7-8EB5-45A5-99242870729DC26D.png', alt: 'TopRated.nz platform by Kiwi Web Design', caption: 'TopRated.nz', result: 'Higher engagement across the platform' },
];
