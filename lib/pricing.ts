/**
 * GETCLICK pricing — single source of truth.
 * Categories, packs, prices, limits, included items, extras, modules, the price-range margin,
 * payment options, badges, FAQ and every client-facing word live here.
 * components/pricing.tsx only reads this file and the pure functions at the bottom.
 * All amounts are in Algerian dinars (DA).
 */

/* ——— Contact ——— */

/** International format without "+". */
export const WHATSAPP_NUMBER = "213549329645";
export const INSTAGRAM = "https://www.instagram.com/getclick.agency";
export const PHONE_DISPLAY = "+213 549 32 96 45";
export const EMAIL = "getclick.agency@gmail.com";

/* ——— Types ——— */

export type CategoryId = "vitrine" | "catalogue" | "ecommerce" | "gestion" | "saas" | "ia";

export type Extra = {
  id: string;
  /** Written as a benefit. */
  label: string;
  price: number;
  /**
   * "page": price × number of pages.
   * "20products": price × each started block of 20 products.
   * "month" / "year": a recurring amount, never added to the one-time total.
   */
  per?: "page" | "20products" | "month" | "year";
};

export type Pack = {
  id: string;
  name: string;
  /** Price. One-time unless `period` is set. Ignored when `quote` is true. */
  price: number;
  /** "year": the price is a yearly subscription (Logiciel de gestion). */
  period?: "year";
  /** How many modules can be ticked. null = all. Logiciel de gestion only. */
  modules?: number | null;
  /** Monthly fee shown next to the price (Assistant IA). */
  monthly?: number;
  /** "Sur devis": the card's button goes straight to WhatsApp, no panel. */
  quote?: boolean;
  /** Pages or products included. null = unlimited. */
  included?: number | null;
  /** The "Pour qui" line. */
  forWho: string;
  /** Line shown before `items` when the pack builds on another one. */
  inherits?: string;
  /** The first 5 are shown on the card; the rest open with "Voir tout". */
  items: string[];
  /** Extras already part of this pack (shown as "Inclus", not charged). */
  includesExtras?: string[];
  /** Not shown as a card; reached from a link under the cards. */
  hidden?: boolean;
};

export type Helper = {
  questions: { q: string; options: { label: string; pack: number }[] }[];
};

export type Counter = {
  kind: "pages" | "products";
  /** "Nombre de pages". */
  label: string;
  step: number;
  min: number;
  /** pages: price per page above or below `included`. products: no price, only limits. */
  unitPrice?: number;
  /** Starting value for packs with an unlimited `included`. */
  unlimitedDefault?: number;
};

export type Category = {
  id: CategoryId;
  /** Big text on the category card. */
  title: string;
  /** Small technical label. */
  label: string;
  /** One plain line about how the price works. */
  model: string;
  /** Plain explanation shown above the packs. */
  explain: string;
  /**
   * How the client pays:
   * "oneTime": once or in 2 times. "yearly": pay the year. "setupMonthly": setup, then a monthly fee.
   */
  billing: "oneTime" | "yearly" | "setupMonthly";
  counter?: Counter;
  /** Module checkboxes shown in the panel (Logiciel de gestion). */
  modules?: { id: string; label: string }[];
  packs: Pack[];
  extras: Extra[];
  helper?: Helper;
  /** Small link under the cards: opens a hidden pack, or goes to WhatsApp with a message. */
  sideLink?: { text: string; packId?: string; whatsapp?: string };
};

/* ——— Categories ——— */

export const CATEGORIES: Category[] = [
  {
    id: "vitrine",
    billing: "oneTime",
    title: "Je veux montrer mon activité",
    label: "Site vitrine",
    model: "Le prix dépend du nombre de pages.",
    explain: "Un site pour présenter votre activité. Le prix dépend du nombre de pages.",
    counter: { kind: "pages", label: "Nombre de pages", step: 1, min: 1, unitPrice: 6000 },
    packs: [
      {
        id: "une-page",
        name: "Une page",
        price: 29000,
        included: 1,
        forWho: "Juste être présent sur internet",
        items: [
          "1 longue page",
          "Marche sur téléphone et ordinateur",
          "Bouton WhatsApp",
          "Google Maps sur votre site",
          "On répare gratuitement pendant 3 mois",
        ],
      },
      {
        id: "vitrine",
        name: "Vitrine",
        price: 55000,
        included: 4,
        forWho: "La plupart des commerces",
        inherits: "Tout ce qu'offre Une page, et aussi :",
        items: [
          "4 pages",
          "Un formulaire de contact",
          "Votre adresse internet (ex : monentreprise.com) offerte 1 an",
          "Apparaître sur Google",
          "On répare gratuitement pendant 3 mois",
        ],
      },
      {
        id: "vitrine-pro",
        name: "Vitrine Pro",
        price: 85000,
        included: 8,
        forWho: "Les entreprises qui veulent impressionner",
        inherits: "Tout ce qu'offre Vitrine, et aussi :",
        items: [
          "8 pages",
          "Des animations soignées",
          "Vous modifiez vous-même vos textes et photos",
          "Votre site en français et en arabe",
          "On répare gratuitement pendant 6 mois",
        ],
        includesExtras: ["arabe"],
      },
    ],
    extras: [
      { id: "arabe", label: "Votre site aussi en arabe", price: 3500, per: "page" },
      { id: "logo", label: "Un logo simple", price: 12000 },
      { id: "maps", label: "Être trouvé sur Google Maps", price: 8000 },
      { id: "app", label: "Votre site comme une application sur le téléphone", price: 15000 },
    ],
    helper: {
      questions: [
        {
          q: "Que voulez-vous montrer ?",
          options: [
            { label: "Juste mes coordonnées et ce que je fais", pack: 0 },
            { label: "Mes services, mes photos, comment me trouver", pack: 1 },
            { label: "Une image haut de gamme de mon entreprise", pack: 2 },
          ],
        },
        {
          q: "Vos clients parlent quelle langue ?",
          options: [
            { label: "Surtout le français", pack: 0 },
            { label: "Le français et l'arabe", pack: 2 },
          ],
        },
      ],
    },
  },
  {
    id: "catalogue",
    billing: "oneTime",
    title: "Je veux présenter mes produits aux professionnels",
    label: "Site catalogue",
    model: "Le prix dépend du nombre de produits.",
    explain:
      "Un site pour présenter vos produits aux clients et aux professionnels, sans vente en ligne. Les clients vous demandent un devis.",
    counter: { kind: "products", label: "Nombre de produits", step: 10, min: 10, unlimitedDefault: 300 },
    packs: [
      {
        id: "catalogue",
        name: "Catalogue",
        price: 79000,
        included: 30,
        forWho: "Une petite gamme de produits",
        items: [
          "Jusqu'à 30 produits",
          "Pages Accueil, Produits, À propos et Contact",
          "Vos produits rangés par catégories",
          "Une fiche pour chaque produit, avec ses caractéristiques",
          "Bouton « Demander un devis » sur WhatsApp",
          "Un tableau pour ajouter et modifier vos produits",
          "En français + 1 autre langue",
        ],
      },
      {
        id: "catalogue-pro",
        name: "Catalogue Pro",
        price: 139000,
        included: 150,
        forWho: "Une entreprise avec plusieurs gammes",
        inherits: "Tout ce qu'offre Catalogue, et aussi :",
        items: [
          "Jusqu'à 150 produits",
          "Recherche et filtres de produits",
          "Fiches techniques à télécharger (PDF)",
          "Le client choisit plusieurs produits et envoie une seule demande",
          "Une section « Meilleures ventes »",
          "3 langues : français, arabe, anglais",
        ],
      },
      {
        id: "catalogue-industrie",
        name: "Catalogue Industrie",
        price: 219000,
        included: null,
        forWho: "Usine ou grand distributeur",
        inherits: "Tout ce qu'offre Catalogue Pro, et aussi :",
        items: [
          "Produits illimités",
          "Carte de vos points de vente et distributeurs",
          "Un espace revendeurs, avec mot de passe et prix professionnels",
          "Une page « Recrutement » avec formulaire de candidature",
          "Une page actualités et presse",
          "Suivi chaque mois et aide en priorité",
        ],
      },
    ],
    extras: [
      { id: "ajout-produits", label: "On ajoute tous vos produits pour vous", price: 5000 },
      { id: "langue", label: "Une langue de plus", price: 15000 },
      { id: "marque", label: "Logo et couleurs de votre marque", price: 12000 },
      { id: "app", label: "Votre site comme une application sur le téléphone", price: 15000 },
    ],
    helper: {
      questions: [
        {
          q: "Combien de produits avez-vous ?",
          options: [
            { label: "Moins de 30", pack: 0 },
            { label: "Entre 30 et 150", pack: 1 },
            { label: "Plus de 150", pack: 2 },
          ],
        },
        {
          q: "Vous travaillez avec des revendeurs ?",
          options: [
            { label: "Non", pack: 0 },
            { label: "Quelques-uns", pack: 1 },
            { label: "Oui, un réseau entier", pack: 2 },
          ],
        },
      ],
    },
  },
  {
    id: "ecommerce",
    billing: "oneTime",
    title: "Je veux vendre en ligne",
    label: "E-commerce",
    model: "Le prix dépend de la taille de votre boutique.",
    explain: "Une boutique où vos clients commandent et paient à la livraison.",
    counter: { kind: "products", label: "Nombre de produits", step: 10, min: 10, unlimitedDefault: 300 },
    packs: [
      {
        id: "boutique",
        name: "Boutique",
        price: 69000,
        included: 30,
        forWho: "Je commence à vendre",
        items: [
          "Jusqu'à 30 produits",
          "Tailles et couleurs pour chaque produit",
          "Panier avec paiement à la livraison",
          "Prix de livraison pour les 58 wilayas",
          "Une alerte WhatsApp à chaque nouvelle commande",
          "Un tableau pour ajouter, modifier et retirer vos produits",
          "Suivi des commandes : nouvelle, confirmée, expédiée, livrée, retournée",
          "Une formation vidéo pour utiliser votre tableau",
        ],
      },
      {
        id: "boutique-pro",
        name: "Boutique Pro",
        price: 129000,
        included: 150,
        forWho: "Je reçois des commandes chaque jour",
        inherits: "Tout ce qu'offre Boutique, et aussi :",
        items: [
          "Jusqu'à 150 produits",
          "Commandes envoyées automatiquement à votre société de livraison",
          "Protection contre les fausses commandes (numéros bloqués)",
          "Vous gardez le numéro même si la commande n'est pas terminée",
          "Suivi du stock, alertes et produits épuisés cachés tout seuls",
          "Codes promo",
          "Suivi de vos publicités Facebook et TikTok",
          "Statistiques de ventes et de retours",
        ],
      },
      {
        id: "boutique-marque",
        name: "Boutique Marque",
        price: 199000,
        included: null,
        forWho: "J'ai une vraie marque",
        inherits: "Tout ce qu'offre Boutique Pro, et aussi :",
        items: [
          "Produits illimités",
          "Paiement par carte (CIB / Edahabia)",
          "Comptes clients avec l'historique des commandes",
          "Plusieurs personnes pour gérer, chacune avec ses droits",
          "Votre boutique comme une application sur le téléphone",
          "Une boutique rapide, sur un serveur rien que pour vous",
          "Suivi chaque mois et aide en priorité 7 jours sur 7",
        ],
        includesExtras: ["app"],
      },
      {
        id: "page-de-vente",
        name: "Page de vente",
        price: 25000,
        included: 1,
        hidden: true,
        forWho: "Je vends un seul produit",
        items: [
          "Une page pour un seul produit",
          "Commande avec paiement à la livraison",
          "Marche sur téléphone et ordinateur",
          "Une alerte WhatsApp à chaque nouvelle commande",
        ],
      },
    ],
    extras: [
      { id: "ajout-produits", label: "On ajoute tous vos produits pour vous", price: 5000 },
      { id: "arabe", label: "Votre boutique aussi en arabe", price: 15000 },
      { id: "page-star", label: "Une page de vente pour un produit star", price: 25000 },
      { id: "app", label: "Votre boutique comme une application sur le téléphone", price: 20000 },
    ],
    sideLink: { text: "Vous vendez un seul produit ? Page de vente : 25 000 DA", packId: "page-de-vente" },
    helper: {
      questions: [
        {
          q: "Combien de produits ?",
          options: [
            { label: "Moins de 30", pack: 0 },
            { label: "Entre 30 et 150", pack: 1 },
            { label: "Plus de 150", pack: 2 },
          ],
        },
        {
          q: "Combien de commandes par jour ?",
          options: [
            { label: "Je commence", pack: 0 },
            { label: "Plusieurs chaque jour", pack: 1 },
            { label: "Beaucoup, et je veux grandir", pack: 2 },
          ],
        },
      ],
    },
  },
  {
    id: "gestion",
    billing: "yearly",
    title: "Je veux un logiciel pour gérer mon business",
    label: "Logiciel de gestion",
    model: "Un abonnement par an, tout compris.",
    explain:
      "Un logiciel pour gérer votre business (stock, rendez-vous, clients, ventes…). Vous payez par an : installation, mise en ligne, mises à jour et réparations comprises.",
    modules: [
      { id: "stock", label: "Stock" },
      { id: "rdv", label: "Rendez-vous" },
      { id: "clients", label: "Fichier clients" },
      { id: "caisse", label: "Caisse et ventes" },
      { id: "factures", label: "Factures et devis PDF" },
      { id: "employes", label: "Employés et pointage" },
    ],
    packs: [
      {
        id: "gestion-simple",
        name: "Gestion Simple",
        price: 39000,
        period: "year",
        modules: 1,
        forWho: "Je gère seul mon activité",
        items: [
          "1 module au choix",
          "1 utilisateur",
          "Marche sur téléphone et ordinateur",
          "Vos données sauvegardées chaque jour, automatiquement",
          "Une formation vidéo",
        ],
      },
      {
        id: "gestion-pro",
        name: "Gestion Pro",
        price: 79000,
        period: "year",
        modules: 3,
        forWho: "J'ai une petite équipe",
        inherits: "Tout ce qu'offre Gestion Simple, et aussi :",
        items: [
          "Jusqu'à 3 modules",
          "5 utilisateurs, chacun avec son accès",
          "Factures et documents PDF",
          "Statistiques",
          "Export vers Excel",
          "Alertes WhatsApp (stock bas, nouveau rendez-vous…)",
        ],
      },
      {
        id: "gestion-entreprise",
        name: "Gestion Entreprise",
        price: 139000,
        period: "year",
        modules: null,
        forWho: "J'ai plusieurs magasins ou agences",
        inherits: "Tout ce qu'offre Gestion Pro, et aussi :",
        items: [
          "Tous les modules",
          "Utilisateurs illimités",
          "Plusieurs magasins ou agences dans un seul compte",
          "Des ajustements pour coller à votre métier",
          "Un logiciel rapide, sur un serveur rien que pour vous",
          "Aide en priorité 7 jours sur 7",
        ],
      },
    ],
    extras: [
      { id: "import", label: "On importe vos données (clients, produits…)", price: 10000 },
      { id: "formation", label: "Formation en présentiel ou en visio", price: 8000 },
      { id: "module", label: "Un module de plus", price: 20000, per: "year" },
      { id: "app", label: "Votre logiciel comme une application sur le téléphone", price: 15000 },
    ],
    sideLink: {
      text: "Vous voulez acheter le logiciel définitivement ? Sur devis sur WhatsApp",
      whatsapp: "Bonjour Getclick, je voudrais acheter un logiciel de gestion définitivement. Pouvez-vous me faire un devis ?",
    },
    helper: {
      questions: [
        {
          q: "Combien de personnes vont l'utiliser ?",
          options: [
            { label: "Moi seul", pack: 0 },
            { label: "2 à 5 personnes", pack: 1 },
            { label: "Plus de 5", pack: 2 },
          ],
        },
        {
          q: "Combien de magasins ou d'agences ?",
          options: [
            { label: "Un seul", pack: 0 },
            { label: "Plusieurs", pack: 2 },
          ],
        },
      ],
    },
  },
  {
    id: "saas",
    billing: "oneTime",
    title: "Je veux créer ma plateforme et la vendre en abonnement",
    label: "Plateforme SaaS",
    model: "Un prix unique pour construire votre plateforme.",
    explain:
      "Vous avez une idée de plateforme que d'autres entreprises vont payer chaque mois ? On la construit pour vous, prête à vendre.",
    packs: [
      {
        id: "version-test",
        name: "Version test",
        price: 119000,
        forWho: "Je veux tester mon idée avec de vrais clients",
        items: [
          "Inscription et connexion",
          "Les 1 ou 2 fonctions principales de votre idée",
          "Un tableau de bord pour tout gérer",
          "Une page qui présente votre plateforme",
          "Marche sur téléphone et ordinateur",
        ],
      },
      {
        id: "prete-a-vendre",
        name: "Prête à vendre",
        price: 219000,
        forWho: "Je veux vendre des abonnements",
        inherits: "Tout ce qu'offre Version test, et aussi :",
        items: [
          "Abonnements au mois ou à l'année",
          "Paiement en ligne (CIB / Edahabia)",
          "Chaque entreprise cliente a son espace privé",
          "E-mails automatiques (bienvenue, facture, rappel)",
          "Statistiques : clients, revenus, abonnements",
          "On répare gratuitement pendant 3 mois",
        ],
      },
      {
        id: "grande-plateforme",
        name: "Grande plateforme",
        price: 349000,
        forWho: "Je vise beaucoup de clients",
        inherits: "Tout ce qu'offre Prête à vendre, et aussi :",
        items: [
          "Des équipes et des rôles dans chaque entreprise cliente",
          "Application sur le téléphone",
          "Connexion avec d'autres outils",
          "Une plateforme rapide, sur un serveur rien que pour vous",
          "Suivi chaque mois et aide en priorité 7 jours sur 7",
        ],
        includesExtras: ["app"],
      },
    ],
    extras: [
      { id: "app", label: "Application sur le téléphone", price: 90000 },
      { id: "langue", label: "Une langue de plus", price: 15000 },
      { id: "page-vente", label: "Une page de vente pour attirer vos premiers clients", price: 25000 },
      { id: "maintenance", label: "Suivi et réparations chaque mois", price: 10000, per: "month" },
    ],
    helper: {
      questions: [
        {
          q: "Où en est votre idée ?",
          options: [
            { label: "Je veux d'abord la tester", pack: 0 },
            { label: "Je suis prêt à vendre", pack: 1 },
            { label: "J'ai déjà des clients qui attendent", pack: 2 },
          ],
        },
        {
          q: "Combien d'entreprises clientes visez-vous ?",
          options: [
            { label: "Quelques-unes pour commencer", pack: 0 },
            { label: "Des dizaines", pack: 1 },
            { label: "Des centaines", pack: 2 },
          ],
        },
      ],
    },
  },
  {
    id: "ia",
    billing: "setupMonthly",
    title: "Je veux répondre à mes clients automatiquement",
    label: "Assistant IA",
    model: "Une installation, puis un petit montant chaque mois.",
    explain:
      "Un assistant qui répond à vos clients 24h/24. Il y a une installation, puis un petit montant chaque mois car l'IA fonctionne en continu.",
    packs: [
      {
        id: "assistant-site",
        name: "Assistant site",
        price: 35000,
        monthly: 3000,
        forWho: "Répondre aux questions sur mon site",
        items: [
          "Répond aux visiteurs de votre site, 24h/24",
          "Utilise vos informations : services, prix, horaires",
          "Parle français et arabe",
        ],
      },
      {
        id: "assistant-messages",
        name: "Assistant WhatsApp / Instagram",
        price: 70000,
        monthly: 6000,
        forWho: "Je reçois trop de messages",
        items: [
          "Répond à vos messages WhatsApp et Instagram",
          "Prend les commandes et les rendez-vous",
          "Vous passe la conversation quand il le faut",
          "Parle français et arabe",
        ],
      },
      {
        id: "ia-projet",
        name: "IA sur mesure",
        price: 0,
        quote: true,
        forWho: "IA connectée à mes données ou à mon logiciel",
        items: ["Une IA branchée sur vos données ou votre logiciel", "On en parle ensemble sur WhatsApp"],
      },
    ],
    extras: [
      { id: "boutique", label: "Connecté à votre boutique (stock, commandes)", price: 20000 },
      { id: "rdv", label: "Prise de rendez-vous automatique", price: 15000 },
    ],
    helper: {
      questions: [
        {
          q: "Où vos clients vous écrivent-ils ?",
          options: [
            { label: "Sur mon site", pack: 0 },
            { label: "Sur WhatsApp ou Instagram", pack: 1 },
            { label: "Dans mon logiciel ou mes fichiers", pack: 2 },
          ],
        },
        {
          q: "Combien de messages par jour ?",
          options: [
            { label: "Quelques-uns", pack: 0 },
            { label: "Trop pour répondre à tout", pack: 1 },
          ],
        },
      ],
    },
  },
];

/* ——— Payment ——— */

export const PAYMENT = {
  once: { enabled: true, label: "En une fois" },
  /** Half now, half at delivery. */
  twice: { enabled: true, label: "En 2 fois", nowRate: 0.5 },
  /** A third now, a third halfway through the project, a third at delivery. */
  thrice: { enabled: true, label: "En 3 fois" },
  /** Disabled until the agency approves it. One-time categories only. */
  monthly: { enabled: false, label: "Chaque mois", months: 6, depositRate: 0.3, surcharge: 0.15 },
  yearly: { label: "Payer l'année" },
  setup: { label: "Installation" },
};

/* ——— Badges, trust, FAQ ——— */

/** The middle pack of each category gets this badge. */
export const HIGHLIGHT_BADGE = "Le choix de la plupart";

/** Real delivered projects. Add { name, url, image } to a category to show them; empty groups stay hidden. */
export const DELIVERED: Partial<Record<CategoryId, { name: string; url: string; image: string }[]>> = {};

export const PROMISES = [
  { id: "price", text: "Prix fixe, sans surprise", detail: "Le prix que vous voyez ici est celui que vous payez. Rien ne s'ajoute après." },
  { id: "time", text: "Livré dans les délais annoncés", detail: "La date de livraison est fixée avec vous avant de commencer." },
  { id: "owner", text: "Le site est à votre nom", detail: "Votre site, votre adresse internet et vos données vous appartiennent." },
];

export const FAQS = [
  { q: "Combien de temps pour livrer ?", a: "Le délai est annoncé avant de commencer, selon le pack." },
  { q: "Comment je paie ?", a: "En une fois, en 2 fois ou en 3 fois : la dernière partie se paie à la livraison." },
  { q: "Que se passe-t-il après la livraison ?", a: "On répare gratuitement pendant la durée prévue dans votre pack." },
  { q: "Je peux changer des choses après la mise en ligne ?", a: "Oui. Petites retouches comprises, ajouts au prix affiché ici." },
  { q: "À qui appartient le site ou les données ?", a: "À vous. Le site, votre adresse internet et vos données sont à votre nom." },
];

/* ——— Calculations (pure, no UI) ——— */

const round100 = (n: number) => Math.round(n / 100) * 100;

export type Selection = {
  categoryId: CategoryId;
  packId: string;
  /** Pages or products. */
  qty: number;
  extras: string[];
  /** Ticked modules (Logiciel de gestion). */
  modules: string[];
  payment: "once" | "twice" | "thrice" | "monthly" | "yearly" | "setup";
};

export const getCategory = (id: CategoryId) => CATEGORIES.find((c) => c.id === id)!;
export const getPack = (c: Category, id: string) => c.packs.find((p) => p.id === id)!;
export const visiblePacks = (c: Category) => c.packs.filter((p) => !p.hidden);
/** Index of the highlighted pack (the middle one when there are 3). */
export const highlightIndex = (c: Category) => (visiblePacks(c).length === 3 ? 1 : -1);

export function defaultQty(c: Category, p: Pack): number {
  if (!c.counter) return 0;
  return p.included ?? c.counter.unlimitedDefault ?? c.counter.min;
}

export function defaultPayment(c: Category): Selection["payment"] {
  return c.billing === "yearly" ? "yearly" : c.billing === "setupMonthly" ? "setup" : "once";
}

/** "soit 3 250 DA par mois": yearly price spread over 12 months, rounded to 50 DA. */
export const monthlyEquivalent = (yearly: number) => Math.round(yearly / 12 / 50) * 50;

/** How many modules the selection may tick (pack limit + the "Un module de plus" extra). null = all. */
export function moduleLimit(p: Pack, extras: string[]): number | null {
  if (p.modules === undefined || p.modules === null) return null;
  return p.modules + (extras.includes("module") ? 1 : 0);
}

/** Next visible pack when the quantity or the ticked modules go past the current pack's limit. */
export function suggestedPack(c: Category, p: Pack, s: Pick<Selection, "qty" | "modules" | "extras">): Pack | null {
  if (c.counter?.kind === "products" && p.included != null && s.qty > p.included) {
    return visiblePacks(c).find((x) => x.included == null || x.included >= s.qty) ?? null;
  }
  const limit = moduleLimit(p, s.extras);
  if (c.modules && limit !== null && s.modules.length > limit) {
    return visiblePacks(c).find((x) => x.modules === null || (x.modules ?? 0) >= s.modules.length) ?? null;
  }
  return null;
}

export function extraAmount(c: Category, p: Pack, e: Extra, qty: number): number {
  if (p.includesExtras?.includes(e.id)) return 0;
  if (e.per === "page") return e.price * Math.max(qty, 1);
  if (e.per === "20products") return e.price * Math.max(1, Math.ceil(qty / 20));
  return e.price;
}

export type Quote = {
  /** Paid once. */
  oneTime: number;
  /** Paid each year. Never added to oneTime. */
  yearly: number;
  /** Paid each month. Never added to oneTime. */
  monthly: number;
};

export function computeQuote(s: Selection): Quote {
  const c = getCategory(s.categoryId);
  const p = getPack(c, s.packId);
  const q: Quote = { oneTime: 0, yearly: 0, monthly: p.monthly ?? 0 };
  if (p.period === "year") q.yearly += p.price;
  else q.oneTime += p.price;

  if (c.counter?.kind === "pages" && c.counter.unitPrice && p.included != null) {
    q.oneTime += (s.qty - p.included) * c.counter.unitPrice;
  }

  for (const e of c.extras.filter((e) => s.extras.includes(e.id))) {
    const a = extraAmount(c, p, e, s.qty);
    if (e.per === "month") q.monthly += a;
    else if (e.per === "year") q.yearly += a;
    else q.oneTime += a;
  }
  return q;
}

/** The payment buttons, with real amounts. */
export function paymentOptions(c: Category, q: Quote) {
  const opts: { id: Selection["payment"]; title: string; detail?: string }[] = [];
  const recurring = [
    q.yearly ? `${formatDA(q.yearly)} DA par an` : null,
    q.monthly ? `${formatDA(q.monthly)} DA par mois` : null,
  ].filter(Boolean);

  if (c.billing === "yearly") {
    opts.push({
      id: "yearly",
      title: `${PAYMENT.yearly.label} : ${formatDA(q.yearly)} DA`,
      detail: q.oneTime ? `+ ${formatDA(q.oneTime)} DA une seule fois pour les options` : undefined,
    });
    return opts;
  }
  if (c.billing === "setupMonthly") {
    opts.push({ id: "setup", title: `${PAYMENT.setup.label} : ${formatDA(q.oneTime)} DA, puis ${formatDA(q.monthly)} DA par mois` });
    return opts;
  }
  const later = recurring.length ? `Ensuite : ${recurring.join(" et ")}` : undefined;
  if (PAYMENT.once.enabled) opts.push({ id: "once", title: `${PAYMENT.once.label} : ${formatDA(q.oneTime)} DA`, detail: later });
  if (PAYMENT.twice.enabled) {
    const now = round100(q.oneTime * PAYMENT.twice.nowRate);
    opts.push({
      id: "twice",
      title: `${PAYMENT.twice.label} : ${formatDA(now)} DA maintenant`,
      detail: `${formatDA(q.oneTime - now)} DA à la livraison`,
    });
  }
  if (PAYMENT.thrice.enabled) {
    const part = round100(q.oneTime / 3);
    opts.push({
      id: "thrice",
      title: `${PAYMENT.thrice.label} : ${formatDA(part)} DA maintenant`,
      detail: `${formatDA(part)} DA au milieu du projet, ${formatDA(q.oneTime - 2 * part)} DA à la livraison`,
    });
  }
  if (PAYMENT.monthly.enabled) {
    const m = PAYMENT.monthly;
    const total = round100(q.oneTime * (1 + m.surcharge));
    const deposit = round100(total * m.depositRate);
    opts.push({
      id: "monthly",
      title: `${m.label} : ${formatDA(round100((total - deposit) / m.months))} DA par mois`,
      detail: `${formatDA(deposit)} DA au départ, puis ${m.months} mois`,
    });
  }
  return opts;
}

/** Every amount the client will pay, each on its own line: "69 000 DA", "79 000 DA par an", "6 000 DA par mois". */
export function totalLines(q: Quote): string[] {
  return [
    q.oneTime ? `${formatDA(q.oneTime)} DA${q.yearly || q.monthly ? " une seule fois" : ""}` : null,
    q.yearly ? `${formatDA(q.yearly)} DA par an` : null,
    q.monthly ? `${formatDA(q.monthly)} DA par mois` : null,
  ].filter((x): x is string => Boolean(x));
}

export function buildMessage(s: Selection): string {
  const c = getCategory(s.categoryId);
  const p = getPack(c, s.packId);
  const q = computeQuote(s);
  const pay = paymentOptions(c, q).find((o) => o.id === s.payment);
  const modules = (c.modules ?? []).filter((m) => s.modules.includes(m.id)).map((m) => m.label);
  const extras = c.extras.filter((e) => s.extras.includes(e.id)).map((e) => e.label);
  return [
    "Bonjour Getclick,",
    `Je souhaite : ${c.label}.`,
    `• Pack : ${p.name}`,
    c.counter && !p.hidden ? `• ${c.counter.label} : ${s.qty}` : null,
    c.modules ? `• Modules : ${modules.length ? modules.join(", ") : "à choisir ensemble"}` : null,
    extras.length ? `• En plus : ${extras.join(", ")}` : null,
    pay ? `• Paiement : ${pay.title}${pay.detail ? ` (${pay.detail})` : ""}` : null,
    `Total : ${totalLines(q).join(" + ")}`,
  ]
    .filter(Boolean)
    .join("\n");
}

/** Pack index recommended by the "Je ne sais pas quoi choisir" answers: the highest answer wins. */
export function recommendPack(answers: number[]): number {
  return answers.length ? Math.max(...answers) : 0;
}

/** French formatting: "55 000". */
export const formatDA = (n: number) => new Intl.NumberFormat("fr-FR").format(n).replace(/\u202f|\u00a0/g, " ");

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
