// Single source of truth for Getclick's offers. Prices in DA.

/** International format without "+" (e.g. "213555000000"). Empty = WhatsApp opens without recipient. */
export const WHATSAPP_NUMBER = "213549329645";
export const INSTAGRAM = "https://www.instagram.com/getclick.agency";
export const PHONE_DISPLAY = "+213 549 32 96 45";
export const EMAIL = "getclick.agency@gmail.com";

export type CategoryId = "websites" | "stores" | "software" | "ai";

export type Pack = {
  id: string;
  name: string;
  pitch: string;
  price: number;
  from?: boolean;
  recommended?: boolean;
  delay?: string;
  examples?: string[];
  inherits?: string;
  features: string[];
  cta: string;
};

export type Addon = { id: string; name: string; desc: string; price: number };

export type Category = {
  id: CategoryId;
  label: string;
  short: string;
  lead: string;
  packs: Pack[];
  addons: Addon[];
  roi?: { title: string; lead: string; example: string; others: string[] };
  compare: { rows: { label: string; values: (string | boolean)[] }[] };
};

const pwa = (desc: string): Addon => ({ id: "pwa", name: "Web App (PWA)", desc, price: 25000 });
const lang = (desc: string): Addon => ({ id: "lang", name: "Langue supplémentaire", desc, price: 5000 });

export const categories: Category[] = [
  {
    id: "websites",
    label: "Sites vitrine",
    short: "Sites",
    lead: "Être trouvé sur Google, inspirer confiance et recevoir des demandes.",
    packs: [
      {
        id: "starter",
        name: "Starter",
        pitch: "L'essentiel pour une visibilité professionnelle immédiate et un référencement local optimisé.",
        price: 45000,
        features: [
          "Jusqu'à 3 pages personnalisées",
          "Design adaptatif mobile & desktop",
          "3 sessions de révisions incluses",
          "Formulaire WhatsApp direct",
          "3 mois de support technique offerts",
        ],
        cta: "Lancer mon site",
      },
      {
        id: "premium",
        name: "Premium",
        pitch: "Design sur mesure avec animations hautes performances pour captiver vos visiteurs.",
        price: 89000,
        recommended: true,
        inherits: "Tout le Starter, plus :",
        features: [
          "Jusqu'à 8 pages personnalisées",
          "Domaine .com offert (1 an)",
          "Animations & design avancés",
          "Structure SEO optimisée",
          "Google Maps & statistiques intégrés",
          "6 mois de support technique offerts",
        ],
        cta: "Passer au Premium",
      },
    ],
    addons: [
      pwa("Site installable comme une application sur mobile et PC."),
      { id: "booking", name: "Système de réservation", desc: "Vos clients réservent un créneau directement sur le site.", price: 20000 },
      { id: "page", name: "Page supplémentaire", desc: "Une page de plus, dans le même système visuel.", price: 9500 },
      lang("Arabe, anglais ou français, traduit et intégré."),
    ],
    compare: {
      rows: [
        { label: "Pages", values: ["3", "8"] },
        { label: "Domaine .com (1 an)", values: [false, true] },
        { label: "Animations avancées", values: [false, true] },
        { label: "SEO avancé", values: [false, true] },
        { label: "Google Maps & stats", values: [false, true] },
        { label: "Support technique", values: ["3 mois", "6 mois"] },
      ],
    },
  },
  {
    id: "stores",
    label: "E-commerce",
    short: "E-commerce",
    lead: "De la page de vente pour un seul produit à la boutique qui tourne seule.",
    packs: [
      {
        id: "landing",
        name: "Landing Page",
        pitch: "Une page de vente unique, optimisée pour convertir rapidement un seul produit.",
        price: 17000,
        from: true,
        features: [
          "Mono-produit, page unique",
          "Structure de vente ultra-efficace",
          "Sans tableau de bord complexe",
          "Commandes via WhatsApp direct",
          "Optimisation mobile prioritaire",
          "Installation Pixel Ads (Facebook / TikTok)",
        ],
        cta: "Lancer ma landing",
      },
      {
        id: "essentiel",
        name: "E-commerce Essentiel",
        pitch: "Boutique complète avec gestion autonome de vos produits et commandes.",
        price: 75000,
        from: true,
        features: [
          "Tableau de bord admin",
          "Ajout, modification, suppression de produits",
          "Réception et gestion des commandes",
          "Pages produits",
          "Panier & paiement à la livraison (COD)",
          "Jusqu'à 15 produits",
          "Formation à l'utilisation incluse",
        ],
        cta: "Commencer à vendre",
      },
      {
        id: "boutique",
        name: "Boutique Premium",
        pitch: "Automatisez votre business et maximisez vos ventes. Pour les boutiques sérieuses.",
        price: 150000,
        from: true,
        recommended: true,
        inherits: "Tout l'Essentiel, plus :",
        features: [
          "Synchronisation API livraison (auto)",
          "Gestion avancée des stocks & alertes de rupture",
          "Variantes produits (tailles, couleurs…)",
          "Masquage automatique des indisponibles",
          "Confirmation automatique des commandes",
          "Système de coupons",
          "Notifications auto (commandes, livraison…)",
          "100 produits et plus",
          "Serveur dédié haute performance",
          "Maintenance continue & support prioritaire 7j/7",
        ],
        cta: "Automatiser mon business",
      },
    ],
    addons: [
      pwa("Votre boutique installable sur l'écran d'accueil."),
      { id: "upload", name: "Upload produits", desc: "Nous ajoutons vos produits pour vous (jusqu'à 50).", price: 5000 },
      lang("Boutique multilingue pour toucher plus de clients."),
    ],
    compare: {
      rows: [
        { label: "Produits", values: ["1", "Jusqu'à 15", "100 et plus"] },
        { label: "Tableau de bord admin", values: [false, true, true] },
        { label: "Commandes", values: ["WhatsApp", "Panier + COD", "Panier + COD"] },
        { label: "Formation incluse", values: [false, true, true] },
        { label: "API livraison automatique", values: [false, false, true] },
        { label: "Stocks, variantes & alertes", values: [false, false, true] },
        { label: "Coupons & notifications auto", values: [false, false, true] },
        { label: "Serveur dédié & maintenance", values: [false, false, true] },
        { label: "Support prioritaire 7j/7", values: [false, false, true] },
      ],
    },
  },
  {
    id: "software",
    label: "Logiciels SaaS",
    short: "SaaS",
    lead: "Un outil construit une fois, qui vous rapporte chaque mois.",
    packs: [
      {
        id: "mvp",
        name: "Lancement (MVP)",
        pitch: "Testez votre idée rapidement avec un premier produit fonctionnel.",
        price: 170000,
        delay: "2 à 3 semaines",
        examples: ["Gestion de stock grossiste", "App de livraison locale"],
        features: [
          "Application simple pour démarrer",
          "Création de comptes (auth)",
          "Tableau de bord de gestion",
          "1 à 2 fonctionnalités principales",
          "Design mobile & ordinateur",
          "2 mois de support technique",
        ],
        cta: "Lancer mon projet",
      },
      {
        id: "croissance",
        name: "Croissance",
        pitch: "Un vrai produit, prêt à être utilisé par vos clients.",
        price: 250000,
        recommended: true,
        delay: "3 à 5 semaines",
        examples: ["Gestion de cabinet médical", "Gestion de flotte auto"],
        inherits: "Tout le Lancement, plus :",
        features: [
          "Fonctionnalités avancées illimitées",
          "Gestion des accès (admin / équipe)",
          "Connexion avec outils externes",
          "Expérience utilisateur pro",
          "Vitesse & performance optimisées",
          "3 mois de support technique",
        ],
        cta: "Développer mon application",
      },
      {
        id: "surmesure",
        name: "Sur-mesure",
        pitch: "Pour les projets sérieux, aux besoins avancés et à vision long terme.",
        price: 450000,
        from: true,
        delay: "Selon le projet",
        examples: ["Gestion BTP / chantier", "Système pour écoles privées"],
        inherits: "Tout le Croissance, plus :",
        features: [
          "Solution entièrement adaptée",
          "Automatisation de vos tâches",
          "Multi-utilisateurs complexe",
          "Sécurité des données renforcée",
          "Support prioritaire",
        ],
        cta: "Demander une expertise",
      },
    ],
    addons: [
      pwa("Accès rapide via application mobile et desktop."),
      { id: "booking-adv", name: "Booking avancé", desc: "Calendrier & gestion complexe des disponibilités.", price: 35000 },
      { id: "pay", name: "Paiement réservation", desc: "Paiement direct au moment de la réservation.", price: 20000 },
      lang("Interface logicielle en plusieurs langues."),
    ],
    compare: {
      rows: [
        { label: "Délai", values: ["2 à 3 semaines", "3 à 5 semaines", "Selon le projet"] },
        { label: "Fonctionnalités principales", values: ["1 à 2", "Illimitées", "Sur mesure"] },
        { label: "Comptes utilisateurs", values: [true, true, true] },
        { label: "Rôles admin / équipe", values: [false, true, true] },
        { label: "Connexion outils externes", values: [false, true, true] },
        { label: "Automatisation des tâches", values: [false, false, true] },
        { label: "Sécurité renforcée", values: [false, false, true] },
        { label: "Support technique", values: ["2 mois", "3 mois", "Prioritaire"] },
      ],
    },
    roi: {
      title: "Un SaaS se rembourse tout seul.",
      lead: "Vos clients paient un abonnement mensuel. Vous construisez l'outil une fois.",
      example:
        "Un logiciel de gestion de cliniques à 300 000 DA. 100 cliniques abonnées à 20 000 DA/mois = 2 000 000 DA chaque mois.",
      others: [
        "Écoles privées — 50 × 15 000 DA = 750 000 DA/mois",
        "Salles de sport — 30 × 5 000 DA = 150 000 DA/mois",
        "Grossistes — 40 × 12 000 DA = 480 000 DA/mois",
      ],
    },
  },
  {
    id: "ai",
    label: "Assistants IA",
    short: "IA",
    lead: "Un assistant qui répond, qualifie et vend à votre place, 24h/24.",
    packs: [
      {
        id: "assistant",
        name: "Assistant Client Auto",
        pitch: "Répondez automatiquement à vos clients et ne perdez plus aucune demande.",
        price: 80000,
        from: true,
        examples: ["Labo d'analyses (résultats / RDV)", "Immobilier (vente / visites)"],
        features: [
          "Réponses auto aux questions fréquentes",
          "Infos simples : prix, horaires, services",
          "Disponible 24h/24 sur site & WhatsApp",
          "Redirection humaine si nécessaire",
          "Installation & configuration incluses",
        ],
        cta: "Activer mon assistant",
      },
      {
        id: "metier",
        name: "Assistant Métier",
        pitch: "Automatisez la gestion de votre activité en structurant vos informations internes.",
        price: 150000,
        from: true,
        recommended: true,
        examples: ["Expert juridique / comptable IA", "Support client SAV 24/7"],
        inherits: "Tout l'Assistant Client, plus :",
        features: [
          "Entraîné sur vos documents PDF / Docs",
          "Réponses fondées sur vos données",
          "Gestion des demandes complexes",
          "Assistance à la décision opérationnelle",
          "Organisation des flux d'informations",
          "Support prioritaire 7j/7",
        ],
        cta: "Déployer mon IA métier",
      },
    ],
    addons: [lang("Votre assistant répond en plusieurs langues.")],
    compare: {
      rows: [
        { label: "Réponses auto aux questions fréquentes", values: [true, true] },
        { label: "Disponible 24h/24, site & WhatsApp", values: [true, true] },
        { label: "Relais vers un humain", values: [true, true] },
        { label: "Entraîné sur vos documents", values: [false, true] },
        { label: "Demandes complexes", values: [false, true] },
        { label: "Aide à la décision", values: [false, true] },
        { label: "Support prioritaire 7j/7", values: [false, true] },
      ],
    },
    roi: {
      title: "Une IA ne dort jamais.",
      lead: "Elle traite des milliers de demandes instantanément, sans pause.",
      example:
        "Un assistant IA pour labo à 80 000 DA. S'il convertit 1 patient de plus par jour à 5 000 DA = +150 000 DA de CA par mois.",
      others: [],
    },
  },
];

export const faqs = [
  {
    q: "Les prix « à partir de » peuvent-ils changer ?",
    a: "Oui, selon le volume et les intégrations demandées. Vous recevez un devis fixe avant de commencer, sans surprise.",
  },
  {
    q: "Comment se passe le paiement ?",
    a: "Un acompte au lancement, le solde à la livraison. Les modalités exactes sont confirmées sur WhatsApp.",
  },
  {
    q: "Puis-je ajouter une option plus tard ?",
    a: "Oui. Toutes les options s'ajoutent à n'importe quel moment, même après la mise en ligne.",
  },
  {
    q: "Le support technique couvre quoi ?",
    a: "Corrections, mises à jour de contenu mineures et assistance si quelque chose ne fonctionne pas.",
  },
];

export const formatDA = (n: number) =>
  new Intl.NumberFormat("fr-FR").format(n).replace(/ | /g, " ");

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
