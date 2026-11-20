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

/* ——— Glossary: every technical term with its short definition ——— */

export const GLOSSARY = {
  landing: { term: "Landing page", def: "une seule page pensée pour vendre ou convaincre" },
  onepage: { term: "One-page", def: "tout votre site sur une seule page" },
  responsive: { term: "Responsive", def: "s'adapte au téléphone, à la tablette et à l'ordinateur" },
  pwa: { term: "PWA – Web App", def: "votre site s'installe comme une application" },
  seo: { term: "SEO", def: "apparaître sur Google" },
  domain: { term: "Nom de domaine", def: "votre adresse internet : monentreprise.com" },
  hosting: { term: "Hébergement", def: "l'espace où votre site est en ligne" },
  ssl: { term: "SSL – HTTPS", def: "le cadenas de sécurité de votre site" },
  email: { term: "Email professionnel", def: "contact@monentreprise.com" },
  dashboard: { term: "Dashboard", def: "votre tableau de bord pour tout gérer" },
  cms: { term: "CMS", def: "vous modifiez vous-même textes et photos" },
  portfolio: { term: "Portfolio", def: "la vitrine de vos réalisations" },
  analytics: { term: "Google Analytics", def: "statistiques de vos visiteurs" },
  business: { term: "Google Business", def: "votre fiche sur Google Maps" },
  cod: { term: "COD", def: "paiement à la livraison" },
  api_delivery: { term: "API livraison", def: "commandes envoyées automatiquement au livreur" },
  pixel: { term: "Pixel Facebook / TikTok", def: "mesure les résultats de vos publicités" },
  saas: { term: "SaaS", def: "logiciel vendu par abonnement" },
  tenant: { term: "Multi-tenant", def: "chaque entreprise cliente a son espace privé" },
  chatbot: { term: "Chatbot", def: "assistant qui répond automatiquement" },
  rtl: { term: "RTL", def: "version arabe de droite à gauche" },
  backup: { term: "Backup", def: "copie de sécurité de vos données" },
  api: { term: "API", def: "connexion avec d'autres logiciels" },
} as const;

export type TermKey = keyof typeof GLOSSARY;

/** "SEO (apparaître sur Google)". Pass a label to replace the term, e.g. t("seo", "SEO avancé"). */
export const t = (key: TermKey, label?: string) => `${label ?? GLOSSARY[key].term} (${GLOSSARY[key].def})`;

/* ——— Renewal after the first year (shown in the FAQ) ——— */

/** TO CONFIRM with the agency. */
export const RENEWAL = { domain: 3000, hosting: 8000 };

/* ——— Types ——— */

export type CategoryId = "vitrine" | "catalogue" | "ecommerce" | "gestion" | "saas" | "ia";

export type Extra = {
  id: string;
  /** Name with the bracketed definition when it is a technical term. */
  label: string;
  price: number;
  /**
   * "page": price × number of pages.
   * "20products": price × each started block of 20 products.
   * "month" / "year": a recurring amount, never added to the one-time total.
   */
  per?: "page" | "20products" | "month" | "year";
  /** Price that depends on the chosen pack (packId → price). Falls back to `price`. */
  packPrices?: Record<string, number>;
};

export type Pack = {
  id: string;
  name: string;
  /** Price. One-time unless `period` is set. Ignored when `quote` is true. */
  price: number;
  /** "year": the price is a yearly subscription (Logiciel de gestion). */
  period?: "year";
  /** Monthly fee shown next to the price (Assistant IA). */
  monthly?: number;
  /** "Sur devis": the card's button goes straight to WhatsApp, no panel. */
  quote?: boolean;
  /** Pages or products included. null = unlimited. */
  included?: number | null;
  /** How many modules can be ticked. null = all. Logiciel de gestion only. */
  modules?: number | null;
  /** Pour qui. */
  forWho: string;
  /** What the pack is and what it brings, in one line (shown under the name). */
  value: string;
  /** The 5 key items shown on the card. */
  highlights: string[];
  /** Pages & sections. */
  sections?: string[];
  /** Fonctionnalités. */
  features: string[];
  /** Inclus avec: domain, hosting, emails, training, revisions, free repairs. */
  inclus: string[];
  /** Délai. */
  delay?: string;
  /** "Exemples d'utilisation": typical businesses that use this pack (not client references). */
  examples?: string[];
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
  /** "oneTime": once or in parts. "yearly": pay the year. "setupMonthly": setup, then a monthly fee. */
  billing: "oneTime" | "yearly" | "setupMonthly";
  /** Big text on the category card. */
  title: string;
  /** Small label. */
  label: string;
  /** One plain line about how the price works. */
  model: string;
  /** Plain explanation shown above the packs. */
  explain: string;
  counter?: Counter;
  /** Module checkboxes shown in the panel (Logiciel de gestion). */
  modules?: { id: string; label: string }[];
  /** Building blocks clients can see with "Voir les sections disponibles". */
  sectionLibrary?: { name: string; desc: string }[];
  packs: Pack[];
  extras: Extra[];
  helper?: Helper;
  /** Word shown before the delivery time on cards. Default "Délai". */
  delayLabel?: string;
  /** Small link under the cards: opens a hidden pack, or goes to WhatsApp with a message. */
  sideLink?: { text: string; packId?: string; whatsapp?: string };
};

/* ——— Categories ——— */

export const CATEGORIES: Category[] = [
  {
    id: "vitrine",
    billing: "oneTime",
    title: "Je veux montrer mon activité ou mon travail",
    label: "Site vitrine & Portfolio",
    model: "Le prix dépend du nombre de pages et de sections.",
    explain: "Un site pour présenter votre activité ou vos réalisations, et donner envie de vous contacter.",
    counter: { kind: "pages", label: "Nombre de pages", step: 1, min: 1, unitPrice: 6000 },
    sectionLibrary: [
      { name: "Bannière d'accueil (hero)", desc: "Titre, photo ou vidéo, bouton de contact" },
      { name: "Services", desc: "Chaque service avec une icône, une description et un prix si vous voulez" },
      { name: t("portfolio", "Réalisations – Portfolio"), desc: "Vos projets avec photos, description et résultat" },
      { name: "À propos", desc: "Votre histoire, vos valeurs, vos chiffres clés (« 10 ans d'expérience »)" },
      { name: "Équipe", desc: "La photo et le rôle de chaque membre" },
      { name: "Avis clients", desc: "Les témoignages de vos clients, avec nom et photo" },
      { name: "Galerie photos / vidéos", desc: "Vos meilleures images, en grand" },
      { name: "Partenaires / logos clients", desc: "Les marques qui vous font confiance" },
      { name: "Tarifs", desc: "Vos prix, clairs et lisibles" },
      { name: "FAQ", desc: "Les réponses aux questions que l'on vous pose souvent" },
      { name: "Contact", desc: "Formulaire, WhatsApp, Google Maps, horaires, réseaux sociaux" },
    ],
    packs: [
      {
        id: "one-page",
        name: "One-page",
        price: 29000,
        included: 1,
        forWho: "Freelance, artisan ou petit commerce qui veut être présent sur internet rapidement",
        value: "Une seule page claire pour présenter votre travail et recevoir des messages WhatsApp.",
        highlights: ["1 page avec jusqu'à 6 sections", "Vos 6 meilleurs projets en photos", "Bouton WhatsApp toujours visible", "Google Maps et liens vers vos réseaux", "Marche sur téléphone et ordinateur", "Site en ligne et sécurisé pendant 1 an"],
        sections: [
          "1 page avec jusqu'à 6 sections au choix",
          `Un ${t("portfolio")} de 6 projets maximum`,
        ],
        features: [
          t("responsive"),
          "Bouton WhatsApp toujours visible",
          "Google Maps",
          "Liens vers vos réseaux sociaux",
          `${t("seo", "SEO de base")} : titre, description, chargement rapide`,
          t("ssl"),
        ],
        inclus: [`${t("hosting")} pendant 1 an`, "2 tours de modifications", "On répare gratuitement pendant 3 mois"],
        delay: "5 jours",
        examples: ["Photographe", "Artisan", "Coach ou formateur"],
      },
      {
        id: "vitrine",
        name: "Vitrine",
        price: 55000,
        included: 4,
        forWho: "Commerce, cabinet, agence ou créatif qui veut inspirer confiance",
        value: "Un site complet de 4 pages, à votre nom, pour inspirer confiance et attirer des demandes.",
        highlights: ["4 pages, jusqu'à 14 sections", "Jusqu'à 20 projets, chacun avec sa galerie", "Formulaire reçu par email et WhatsApp", "Avis de vos clients", "Adresse .com offerte 1 an", "1 email pro (contact@votresite.com)"],
        sections: [
          "4 pages (par exemple Accueil, À propos, Services ou Réalisations, Contact)",
          "Jusqu'à 14 sections au total",
          "Portfolio de 20 projets maximum",
          "Chaque projet a sa galerie photos et sa description",
        ],
        features: [
          "Tout ce qu'offre One-page",
          "Formulaire de contact reçu par email et WhatsApp",
          "Section Avis clients",
          `${t("seo", "SEO de base")} sur chaque page, et Google Search Console configuré`,
          t("analytics"),
        ],
        inclus: [
          `${t("domain", "Nom de domaine .com")} pendant 1 an`,
          `${t("hosting")} pendant 1 an`,
          `1 ${t("email")}`,
          "3 tours de modifications",
          "On répare gratuitement pendant 3 mois",
        ],
        delay: "10 jours",
        examples: ["Cabinet médical", "Agence d'architecture", "Restaurant"],
      },
      {
        id: "vitrine-pro",
        name: "Vitrine Pro",
        price: 85000,
        included: 8,
        forWho: "Entreprise ou créatif qui veut se démarquer et gérer son site seul",
        value: "Un site haut de gamme que vous modifiez vous-même, en français et en arabe.",
        highlights: ["8 pages, sections illimitées", "Vous changez textes et photos vous-même", "Français + arabe", "Projets illimités avec filtres", "Animations et design haut de gamme", "Blog / actualités", "3 emails pro"],
        sections: [
          "8 pages, sections illimitées",
          "Portfolio illimité, avec filtres par catégorie",
          "Une page détaillée par projet (le problème, le travail, le résultat)",
          "Une page Blog / Actualités",
        ],
        features: [
          "Tout ce qu'offre Vitrine",
          `${GLOSSARY.cms.term} – ${GLOSSARY.dashboard.term} (vous modifiez vous-même textes, photos, projets et articles)`,
          "Animations et design haut de gamme",
          `Français + arabe avec ${t("rtl")}`,
          `${t("seo", "SEO avancé")} : sitemap, résultats enrichis, vitesse optimisée`,
          "Formulaire de demande de rendez-vous",
        ],
        inclus: [
          `${t("domain", "Nom de domaine .com")} et hébergement pendant 1 an`,
          `3 ${t("email", "Emails professionnels")}`,
          "Formation vidéo sur votre tableau de bord",
          "4 tours de modifications",
          "On répare gratuitement pendant 6 mois",
        ],
        delay: "15 jours",
        includesExtras: ["arabe"],
        examples: ["Bureau d'études", "Clinique privée", "Agence de communication"],
      },
    ],
    extras: [
      { id: "arabe", label: "Version arabe – RTL (de droite à gauche)", price: 3500, per: "page" },
      { id: "logo", label: "Logo simple", price: 12000 },
      { id: "maps", label: t("business"), price: 8000 },
      { id: "app", label: t("pwa"), price: 15000 },
    ],
    helper: {
      questions: [
        {
          q: "Que voulez-vous montrer ?",
          options: [
            { label: "Juste qui je suis et comment me contacter", pack: 0 },
            { label: "Mes services et mes réalisations en détail", pack: 1 },
            { label: "Une image haut de gamme, que je gère seul", pack: 2 },
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
        forWho: "Entreprise avec une petite gamme de produits",
        value: "Un catalogue en ligne de vos produits, avec demande de devis directe sur WhatsApp.",
        highlights: ["Jusqu'à 30 produits par catégories", "Une fiche détaillée par produit", "Bouton « Demander un devis » sur WhatsApp", "Vous ajoutez vos produits vous-même", "Français + 1 autre langue", "2 emails pro"],
        sections: [
          "Accueil (bannière, catégories, produits phares, présentation)",
          "Nos produits",
          "Une fiche détaillée par produit",
          "À propos",
          "Contact (formulaire, carte, téléphones, emails)",
        ],
        features: [
          "Catégories de produits",
          "Fiches produits avec photos, caractéristiques techniques et utilisations",
          "Bouton « Demander un devis » sur WhatsApp pour chaque produit",
          `${t("dashboard")} pour ajouter et modifier vos produits`,
          t("responsive"),
          t("seo", "SEO de base"),
          t("ssl"),
        ],
        inclus: [
          `${t("domain")} et hébergement pendant 1 an`,
          `2 ${t("email", "Emails professionnels")}`,
          "Français + 1 autre langue",
          "3 tours de modifications",
          "On répare gratuitement pendant 3 mois",
        ],
        delay: "15 jours",
        examples: ["Matériaux de construction", "Équipements agricoles", "Fournisseur de pièces"],
      },
      {
        id: "catalogue-pro",
        name: "Catalogue Pro",
        price: 139000,
        included: 150,
        forWho: "Entreprise avec plusieurs gammes et des clients professionnels",
        value: "Un catalogue complet avec recherche, fiches techniques et devis pour plusieurs produits.",
        highlights: ["Jusqu'à 150 produits", "Recherche et filtres", "Fiches techniques PDF à télécharger", "Une seule demande pour plusieurs produits", "3 langues : français, arabe, anglais", "Statistiques de vos visiteurs"],
        sections: [
          "Tout ce qu'offre Catalogue",
          "Meilleures ventes",
          "Secteurs / applications",
          "Entreprise (histoire, usine, certifications)",
        ],
        features: [
          "Tout ce qu'offre Catalogue",
          "Recherche et filtres de produits",
          "Fiches techniques PDF à télécharger",
          "Liste de devis : le client choisit plusieurs produits et envoie une seule demande",
          `3 langues : français, arabe avec ${t("rtl")}, anglais`,
          t("analytics"),
        ],
        inclus: [
          `${t("domain")} et hébergement pendant 1 an`,
          `5 ${t("email", "Emails professionnels")}`,
          "Formation vidéo",
          "4 tours de modifications",
          "On répare gratuitement pendant 6 mois",
        ],
        delay: "20 jours",
        examples: ["Distributeur de lubrifiants", "Matériel médical", "Électricité industrielle"],
      },
      {
        id: "catalogue-industrie",
        name: "Catalogue Industrie",
        price: 219000,
        included: null,
        forWho: "Usine, importateur ou grand distributeur",
        value: "Un site de grande entreprise, avec espace revendeurs et carte de vos points de vente.",
        highlights: ["Produits illimités", "Carte de vos points de vente", "Espace revendeurs avec leurs prix", "Page recrutement avec candidatures", "Actualités et presse", "Maintenance chaque mois pendant 1 an"],
        sections: [
          "Tout ce qu'offre Catalogue Pro",
          "Points de vente",
          "Espace revendeurs",
          "Carrières",
          "Actualités / Presse",
        ],
        features: [
          "Tout ce qu'offre Catalogue Pro",
          "Carte interactive des points de vente et distributeurs",
          "Espace revendeurs privé, avec mot de passe et prix professionnels",
          "Page Carrières avec candidatures en ligne",
          "Actualités et presse, gérées depuis votre tableau de bord",
        ],
        inclus: [
          `${t("domain")} et hébergement pendant 1 an`,
          `10 ${t("email", "Emails professionnels")}`,
          "Maintenance chaque mois pendant 1 an",
          "Aide en priorité",
          "On répare gratuitement pendant 6 mois",
        ],
        delay: "30 jours",
        examples: ["Usine agroalimentaire", "Importateur", "Groupe industriel"],
      },
    ],
    extras: [
      { id: "ajout-produits", label: "On ajoute tous vos produits pour vous", price: 5000 },
      { id: "langue", label: "Une langue de plus", price: 15000 },
      { id: "marque", label: "Logo et charte graphique (vos couleurs et votre style)", price: 12000 },
      { id: "app", label: t("pwa"), price: 15000 },
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
    explain: `Une boutique en ligne où vos clients commandent et paient à la livraison (${GLOSSARY.cod.term}).`,
    counter: { kind: "products", label: "Nombre de produits", step: 10, min: 10, unlimitedDefault: 300 },
    packs: [
      {
        id: "boutique",
        name: "Boutique",
        price: 69000,
        included: 30,
        forWho: "Je vends sur Instagram et je veux une vraie boutique",
        value: "Une boutique en ligne complète où vos clients commandent seuls et paient à la livraison.",
        highlights: ["Jusqu'à 30 produits", "Tailles et couleurs avec photos", "Paiement à la livraison", "Livraison dans les 58 wilayas", "Suivi des commandes de A à Z", "Alerte WhatsApp à chaque commande"],
        sections: [
          "Accueil (bannière, catégories, nouveautés, meilleures ventes)",
          "Boutique",
          "Fiche produit",
          "Panier",
          "Commande",
          "Contact",
          "Politique de livraison et de retour",
        ],
        features: [
          `${t("dashboard")} : produits, catégories et commandes`,
          "Tailles et couleurs, avec une photo pour chacune",
          `Panier et ${t("cod")}`,
          "Prix de livraison pour les 58 wilayas (à domicile ou au bureau)",
          "Suivi des commandes : nouvelle, confirmée, expédiée, livrée, retournée",
          "Alerte WhatsApp à chaque nouvelle commande",
          t("responsive"),
          t("seo", "SEO de base"),
          t("ssl"),
        ],
        inclus: [
          `${t("domain")} et hébergement pendant 1 an`,
          "Formation vidéo",
          "3 tours de modifications",
          "On répare gratuitement pendant 3 mois",
        ],
        delay: "15 jours",
        examples: ["Vêtements", "Cosmétiques", "Accessoires"],
      },
      {
        id: "boutique-pro",
        name: "Boutique Pro",
        price: 129000,
        included: 150,
        forWho: "Je reçois des commandes chaque jour",
        value: "Une boutique qui travaille pour vous : livraison automatique, stock suivi, faux colis bloqués.",
        highlights: ["Jusqu'à 150 produits", "Commandes envoyées seules au livreur", "Blocage des faux numéros", "Récupère les commandes abandonnées", "Stock suivi, produits épuisés cachés", "Mesure de vos pubs Facebook et TikTok", "Codes promo et statistiques"],
        sections: ["Tout ce qu'offre Boutique", "Promotions", "Suivi de commande"],
        features: [
          "Tout ce qu'offre Boutique",
          t("api_delivery"),
          "Suivi du stock, alertes de rupture, produits épuisés cachés automatiquement",
          "Récupération des commandes abandonnées (le numéro est gardé)",
          "Liste de numéros bloqués contre les fausses commandes",
          "Codes promo",
          t("pixel"),
          "Statistiques : ventes, meilleurs produits, taux de retour par wilaya",
        ],
        inclus: [
          `${t("domain")} et hébergement pendant 1 an`,
          "Formation vidéo",
          "4 tours de modifications",
          "On répare gratuitement pendant 6 mois",
        ],
        delay: "25 jours",
        examples: ["Marque de chaussures", "Électroménager", "Boutique multi-produits"],
      },
      {
        id: "boutique-marque",
        name: "Boutique Marque",
        price: 199000,
        included: null,
        forWho: "J'ai une vraie marque et une équipe",
        value: "La boutique d'une vraie marque : paiement par carte, comptes clients et équipe.",
        highlights: ["Produits illimités", "Paiement par carte (CIB / Edahabia)", "Comptes clients et fidélité", "Plusieurs admins avec des rôles", "S'installe comme une application", "Maintenance chaque mois pendant 1 an"],
        sections: ["Tout ce qu'offre Boutique Pro", "Espace client", "Programme fidélité"],
        features: [
          "Tout ce qu'offre Boutique Pro",
          "Paiement par carte (CIB / Edahabia)",
          "Comptes clients avec l'historique des commandes",
          "Plusieurs admins avec des rôles (confirmation, stock, gestion)",
          t("pwa", "PWA – Web App").replace("votre site", "votre boutique"),
          "Serveur rapide rien que pour vous",
        ],
        inclus: [
          `${t("domain")} et hébergement pendant 1 an`,
          "Maintenance chaque mois pendant 1 an",
          "Aide en priorité 7 jours sur 7",
          "On répare gratuitement pendant 6 mois",
        ],
        delay: "35 jours",
        includesExtras: ["app"],
        examples: ["Marque de mode", "Grande parfumerie", "Chaîne de magasins"],
      },
      {
        id: "landing-page",
        name: "Landing page",
        price: 25000,
        included: 1,
        hidden: true,
        forWho: "Je vends un seul produit",
        value: "Une seule page pensée pour vendre un produit, parfaite avec vos publicités.",
        highlights: ["1 page pour 1 produit", "Formulaire de commande", "Paiement à la livraison", "Mesure de vos pubs Facebook et TikTok"],
        features: [
          t("landing"),
          `Formulaire de commande avec ${t("cod")}`,
          t("pixel"),
          t("responsive"),
        ],
        inclus: ["Mise en ligne de votre page", "On répare gratuitement pendant 3 mois"],
        delay: "5 jours",
        examples: ["Produit gagnant", "Nouveau produit à tester"],
      },
    ],
    extras: [
      { id: "ajout-produits", label: "On ajoute tous vos produits pour vous", price: 5000 },
      { id: "arabe", label: "Version arabe – RTL (de droite à gauche)", price: 15000 },
      { id: "landing", label: `${t("landing", "Landing page")} pour un produit star`, price: 25000 },
      { id: "app", label: t("pwa").replace("votre site", "votre boutique"), price: 20000 },
    ],
    sideLink: {
      text: `Vous vendez un seul produit ? ${GLOSSARY.landing.term} (une seule page pensée pour vendre) : 25 000 DA`,
      packId: "landing-page",
    },
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
            { label: "Beaucoup, avec une équipe", pack: 2 },
          ],
        },
      ],
    },
  },
  {
    id: "gestion",
    billing: "yearly",
    delayLabel: "Mise en service",
    title: "Je veux un logiciel pour gérer mon business",
    label: "Logiciel de gestion",
    model: "Un abonnement par an, tout compris.",
    explain:
      "Un logiciel pour gérer votre business. Vous payez par an : installation, hébergement, mises à jour, backups et réparations compris.",
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
        value: "Un logiciel simple pour gérer seul votre activité, depuis votre téléphone.",
        highlights: ["1 module au choix", "1 utilisateur", "Marche sur téléphone et ordinateur", "Données sauvegardées chaque jour", "Formation vidéo"],
        features: [
          "1 module au choix",
          "1 utilisateur",
          `${t("responsive")}`,
          `${t("backup", "Backup automatique chaque jour")}`,
        ],
        inclus: ["Installation", "Hébergement", "Mises à jour", "Formation vidéo", "Réparations pendant toute l'année"],
        delay: "7 jours",
        examples: ["Pharmacie", "Salon de coiffure", "Petit commerce"],
      },
      {
        id: "gestion-pro",
        name: "Gestion Pro",
        price: 79000,
        period: "year",
        modules: 3,
        forWho: "J'ai une petite équipe",
        value: "Un logiciel pour votre équipe : chacun son accès, factures et statistiques en un clic.",
        highlights: ["Jusqu'à 3 modules", "5 utilisateurs avec leurs droits", "Factures et devis en PDF", "Statistiques et export Excel", "Alertes WhatsApp (stock bas, rendez-vous)"],
        features: [
          "Tout ce qu'offre Gestion Simple",
          "Jusqu'à 3 modules",
          "5 utilisateurs avec des droits différents",
          "Factures et documents PDF",
          "Statistiques",
          "Export vers Excel",
          "Alertes WhatsApp (stock bas, nouveau rendez-vous…)",
        ],
        inclus: ["Installation", "Hébergement", "Mises à jour", "Formation", "Réparations pendant toute l'année"],
        delay: "14 jours",
        examples: ["Cabinet dentaire", "Quincaillerie", "Auto-école"],
      },
      {
        id: "gestion-entreprise",
        name: "Gestion Entreprise",
        price: 139000,
        period: "year",
        modules: null,
        forWho: "J'ai plusieurs magasins ou agences",
        value: "Un seul logiciel pour tous vos magasins ou agences, adapté à votre métier.",
        highlights: ["Tous les modules", "Utilisateurs illimités", "Plusieurs magasins ou agences", "Adapté à votre façon de travailler", "Aide en priorité 7j/7"],
        features: [
          "Tout ce qu'offre Gestion Pro",
          "Tous les modules",
          "Utilisateurs illimités",
          "Plusieurs magasins ou agences",
          "Des ajustements pour coller à votre métier",
          "Serveur rapide rien que pour vous",
        ],
        inclus: ["Installation", "Hébergement", "Mises à jour", "Formation sur place ou en visio", "Aide en priorité 7 jours sur 7"],
        delay: "21 jours",
        examples: ["Chaîne de magasins", "Grossiste", "Réseau d'agences"],
      },
    ],
    extras: [
      { id: "import", label: "Import de vos données existantes (clients, produits…)", price: 10000 },
      { id: "formation", label: "Formation sur place ou en visio", price: 8000 },
      { id: "module", label: "Un module de plus", price: 20000, per: "year" },
      { id: "app", label: t("pwa").replace("votre site", "votre logiciel"), price: 15000 },
    ],
    sideLink: {
      text: "Acheter le logiciel définitivement ? Sur devis sur WhatsApp",
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
    label: t("saas"),
    model: "Un prix unique pour construire votre plateforme.",
    explain:
      "Vous avez une idée de plateforme que d'autres entreprises vont payer chaque mois ? On la construit pour vous, prête à vendre.",
    packs: [
      {
        id: "version-test",
        name: "Version test",
        price: 119000,
        forWho: "Je veux tester mon idée avec de vrais clients",
        value: "Une première version de votre plateforme pour la tester avec de vrais clients.",
        highlights: ["Inscription et connexion", "Les 1 ou 2 fonctions clés de votre idée", "Tableau de bord admin", "Une page qui présente votre plateforme", "Marche sur téléphone et ordinateur"],
        features: [
          "Inscription et connexion",
          "Les 1 ou 2 fonctions principales de votre idée",
          `${t("dashboard", "Dashboard")} admin`,
          `${t("landing", "Landing page").replace("vendre ou convaincre", "convaincre")} qui présente la plateforme`,
          t("responsive"),
          t("ssl"),
        ],
        inclus: [`${t("hosting")} pendant 1 an`, "3 tours de modifications", "On répare gratuitement pendant 3 mois"],
        delay: "4 semaines",
        examples: ["Prise de rendez-vous en ligne", "Gestion de stock pour grossistes"],
      },
      {
        id: "prete-a-vendre",
        name: "Prête à vendre",
        price: 219000,
        forWho: "Je veux vendre des abonnements",
        value: "Une plateforme complète qui encaisse les abonnements de vos clients toute seule.",
        highlights: ["Abonnements au mois ou à l'année", "Paiement en ligne (CIB / Edahabia)", "Un espace privé pour chaque entreprise cliente", "Emails automatiques (bienvenue, facture)", "Suivi des clients et des revenus"],
        features: [
          "Tout ce qu'offre Version test",
          "Abonnements au mois ou à l'année",
          "Paiement en ligne (CIB / Edahabia)",
          t("tenant"),
          "Emails automatiques (bienvenue, facture, rappel de renouvellement)",
          "Tableau de bord des clients, revenus et abonnements",
        ],
        inclus: [`${t("hosting")} pendant 1 an`, "Formation vidéo", "4 tours de modifications", "On répare gratuitement pendant 6 mois"],
        delay: "8 semaines",
        examples: ["Logiciel pour cabinets médicaux", "Gestion de flotte auto"],
      },
      {
        id: "grande-plateforme",
        name: "Grande plateforme",
        price: 349000,
        forWho: "Je vise beaucoup de clients",
        value: "Une plateforme solide, avec application mobile, prête pour des centaines de clients.",
        highlights: ["Équipes et rôles chez chaque client", "Application mobile", "Connexion avec d'autres logiciels", "Serveur rapide rien que pour vous", "Maintenance chaque mois pendant 1 an"],
        features: [
          "Tout ce qu'offre Prête à vendre",
          "Équipes et rôles dans chaque entreprise cliente",
          "Application mobile",
          t("api"),
          "Serveur rapide rien que pour vous",
        ],
        inclus: [`${t("hosting")} pendant 1 an`, "Maintenance chaque mois pendant 1 an", "Aide en priorité 7 jours sur 7"],
        delay: "12 semaines",
        includesExtras: ["app"],
        examples: ["Gestion BTP / chantiers", "Plateforme pour écoles privées"],
      },
    ],
    extras: [
      { id: "app", label: "Application mobile", price: 90000 },
      { id: "langue", label: "Une langue de plus", price: 15000 },
      { id: "landing", label: `${t("landing", "Landing page")} pour attirer vos premiers clients`, price: 25000 },
      { id: "maintenance", label: "Maintenance mensuelle", price: 10000, per: "month" },
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
    billing: "oneTime",
    title: "Je veux répondre à mes clients automatiquement",
    label: `Assistant IA – ${GLOSSARY.chatbot.term}`,
    model: "Un prix unique pour l'installer. Le suivi mensuel est en option.",
    explain:
      "Un assistant qui répond à vos clients 24h/24. Vous payez l'installation une fois, et vous pouvez ajouter un suivi chaque mois si vous le souhaitez.",
    packs: [
      {
        id: "assistant-site",
        name: "Assistant site",
        price: 35000,
        forWho: "Je veux répondre aux questions des visiteurs de mon site",
        value: "Un assistant sur votre site qui répond aux visiteurs 24h/24, même la nuit.",
        highlights: [
          "Réponses automatiques aux questions fréquentes",
          "Infos simples : prix, horaires, services, adresse",
          "Réponse immédiate, 24h/24 et 7j/7",
          "Envoie les clients intéressés sur WhatsApp",
          "Installation et configuration incluses",
        ],
        features: [
          `${t("chatbot")} sur votre site`,
          "Entraîné sur vos informations : services, prix, horaires, FAQ",
          "Répond seulement avec vos informations, sans inventer",
          "Comprend le français et l'arabe",
          "Récupère le nom et le téléphone des visiteurs intéressés",
          "Envoie les clients intéressés sur WhatsApp",
        ],
        inclus: ["Installation et configuration", "1 ajustement des réponses chaque mois avec le suivi mensuel"],
        delay: "5 jours",
        examples: ["Clinique (horaires, rendez-vous)", "Agence immobilière (biens, visites)", "École ou centre de formation"],
      },
      {
        id: "assistant-messages",
        name: "Assistant WhatsApp / Instagram",
        price: 70000,
        forWho: "Je reçois trop de messages pour répondre à tout",
        value: "Un assistant qui répond sur WhatsApp et Instagram et prend les commandes.",
        highlights: [
          "Répond sur WhatsApp et Instagram, 24h/24",
          "Prend les commandes et les rendez-vous",
          "Comprend le français, l'arabe et la darija",
          "Vous passe la conversation quand il le faut",
          "Résumé des conversations chaque mois",
        ],
        features: [
          "Tout ce qu'offre Assistant site",
          "Répond automatiquement aux messages WhatsApp et Instagram",
          "Entraîné sur vos documents : catalogue, menu, tarifs (PDF, Word)",
          "Prend les commandes et les rendez-vous",
          "Comprend le français, l'arabe et la darija",
          "Gère plusieurs conversations en même temps",
          "Passe la conversation à un humain quand il le faut",
          "Résumé des conversations chaque mois",
        ],
        inclus: ["Installation et configuration", "2 ajustements des réponses chaque mois avec le suivi mensuel"],
        delay: "10 jours",
        examples: ["Boutique Instagram (commandes, tailles)", "Restaurant (réservations, menu)", "Salon de beauté (rendez-vous)"],
      },
      {
        id: "ia-projet",
        name: "IA sur mesure",
        price: 0,
        quote: true,
        forWho: "Je veux une IA connectée à mes données ou à mon logiciel",
        value: "Une IA sur mesure, branchée sur vos documents, vos données ou votre logiciel.",
        highlights: [
          "Entraînée sur vos documents (PDF, Word, Excel)",
          "Connectée à votre logiciel ou à vos données",
          "Gère les demandes complexes",
          "Aide à la décision : résumés et rapports",
          "Accès réservé à votre équipe",
        ],
        features: [
          "Entraînée sur vos documents internes (PDF, Word, Excel)",
          "Répond seulement avec vos données vérifiées",
          `Connectée à votre logiciel ou à vos données (${GLOSSARY.api.term} : ${GLOSSARY.api.def})`,
          "Gère les demandes complexes, étape par étape",
          "Aide à la décision : résumés, rapports, recherches dans vos fichiers",
          "Organise et retrouve vos informations en quelques secondes",
        ],
        inclus: ["Étude de votre besoin", "Prix fixé après un échange sur WhatsApp", "Aide en priorité 7 jours sur 7"],
        examples: ["Cabinet juridique ou comptable", "Service après-vente 24h/24", "Assistant interne pour vos employés"],
      },
    ],
    extras: [
      { id: "boutique", label: "Connecté à votre boutique (stock, commandes)", price: 20000 },
      { id: "rdv", label: "Prise de rendez-vous automatique", price: 15000 },
      {
        id: "maintenance",
        label: "Suivi mensuel (on surveille et on ajuste les réponses)",
        price: 3000,
        per: "month",
        packPrices: { "assistant-site": 3000, "assistant-messages": 6000 },
      },
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
  { id: "time", text: "Livré dans les délais annoncés", detail: "Chaque pack a son délai, écrit noir sur blanc avant de commencer." },
  { id: "owner", text: "Le site et le domaine sont à votre nom", detail: "Votre site, votre adresse internet et vos données vous appartiennent." },
];

export const FAQS = [
  { q: "Combien de temps pour livrer ?", a: "Le délai est écrit dans chaque pack : de 5 jours à 12 semaines selon le projet." },
  { q: "Comment je paie ?", a: "En une fois, en 2 fois ou en 3 fois : la dernière partie se paie à la livraison." },
  { q: "Que se passe-t-il après la livraison ?", a: "On répare gratuitement pendant la durée prévue dans votre pack (3 ou 6 mois)." },
  { q: "Je peux changer des choses après la mise en ligne ?", a: "Oui. Les tours de modifications sont inclus, les ajouts suivent les prix affichés ici." },
  { q: "À qui appartient le site ou les données ?", a: "À vous. Le site, le nom de domaine et vos données sont à votre nom." },
  {
    q: "Combien coûte le renouvellement après la première année ?",
    a: `Nom de domaine : ${new Intl.NumberFormat("fr-FR").format(RENEWAL.domain).replace(/\u202f|\u00a0/g, " ")} DA par an. Hébergement : ${new Intl.NumberFormat("fr-FR").format(RENEWAL.hosting).replace(/\u202f|\u00a0/g, " ")} DA par an.`,
  },
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
  if (e.packPrices?.[p.id] !== undefined) return e.packPrices[p.id];
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
