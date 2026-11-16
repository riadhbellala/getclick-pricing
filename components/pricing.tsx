"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  categories,
  faqs,
  formatDA,
  INSTAGRAM,
  EMAIL,
  PHONE_DISPLAY,
  whatsappLink,
  type Category,
  type CategoryId,
  type Pack,
} from "@/lib/pricing";

type Quote = { packId: string | null; addons: string[] };
const emptyQuote: Quote = { packId: null, addons: [] };

export default function Pricing() {
  const [active, setActive] = useState<CategoryId>("websites");
  const [quote, setQuote] = useState<Quote>(emptyQuote);
  useReveal();

  const category = categories.find((c) => c.id === active)!;
  const pack = category.packs.find((p) => p.id === quote.packId) ?? null;
  const chosenAddons = category.addons.filter((a) => quote.addons.includes(a.id));
  const total = (pack?.price ?? 0) + chosenAddons.reduce((s, a) => s + a.price, 0);
  const isFrom = pack?.from ?? false;

  const message = useMemo(
    () =>
      [
        "Bonjour Getclick,",
        `Je souhaite un devis — ${category.label}.`,
        pack ? `• ${pack.name} : ${pack.from ? "à partir de " : ""}${formatDA(pack.price)} DA` : "• Pack : à définir ensemble",
        ...chosenAddons.map((a) => `• ${a.name} : +${formatDA(a.price)} DA`),
        `Total estimé : ${isFrom ? "à partir de " : ""}${formatDA(total)} DA`,
      ].join("\n"),
    [category.label, pack, chosenAddons, total, isFrom],
  );

  function openCategory(id: CategoryId) {
    if (id === active) return;
    setActive(id);
    setQuote(emptyQuote);
  }

  const choosePack = (id: string) => setQuote((q) => ({ ...q, packId: q.packId === id ? null : id }));
  const toggleAddon = (id: string) =>
    setQuote((q) => ({
      ...q,
      addons: q.addons.includes(id) ? q.addons.filter((a) => a !== id) : [...q.addons, id],
    }));

  return (
    <>
      <Backdrop />
      <Header />
      <main>
        <Hero />

        <section id="devis" aria-labelledby="devis-title" className="relative isolate">
          <div className="relative mx-auto max-w-[1240px] px-5 pt-4 sm:px-8">
          <h2 id="devis-title" className="sr-only">
            Packs et options
          </h2>
          <CategorySwitch active={active} onChange={(id) => openCategory(id)} />

          <div key={active} className="swap">
            <p className="mt-6 max-w-[60ch] text-[clamp(18px,1.6vw,22px)] leading-[1.4] text-ink">{category.lead}</p>

            <div className={`mt-6 grid items-stretch gap-4 ${category.packs.length === 3 ? "lg:grid-cols-3" : "md:grid-cols-2"}`}>
              {category.packs.map((p, i) => (
                <PackCard key={p.id} pack={p} index={i} selected={quote.packId === p.id} onSelect={() => choosePack(p.id)} />
              ))}
            </div>

            <Addons category={category} selected={quote.addons} onToggle={toggleAddon} />
            <Compare category={category} selected={quote.packId} onSelect={choosePack} />
          </div>
          </div>
        </section>

        <Faq />
      </main>
      <Footer />

      <QuoteBar
        visible={quote.packId !== null || quote.addons.length > 0}
        category={category.label}
        packName={pack?.name ?? null}
        addonCount={chosenAddons.length}
        total={total}
        isFrom={isFrom}
        href={whatsappLink(message)}
        onReset={() => setQuote(emptyQuote)}
      />
    </>
  );
}

/* ——— Reveal on scroll ——— */

function useReveal() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -8% 0px" },
    );
    const observe = () => document.querySelectorAll(".reveal:not(.in)").forEach((el) => io.observe(el));
    observe();
    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
}

/* ——— Brand ——— */

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline leading-none ${className}`} role="img" aria-label="Getclick">
      <span aria-hidden className="font-light italic tracking-[-0.02em]" style={{ fontStretch: "100%" }}>
        GET
      </span>
      <span aria-hidden className="wide tracking-[-0.02em]">
        CLICK
      </span>
      <span aria-hidden className="ml-[0.08em] self-start text-[0.4em] font-medium">
        ®
      </span>
    </span>
  );
}

function Header() {
  return (
    <header className="relative z-40">
      <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between gap-6 px-5 sm:px-8">
        <a href="#" className="press text-[22px]" aria-label="Getclick, haut de page">
          <Wordmark />
        </a>
        <a
          href={whatsappLink("Bonjour Getclick, j'ai un projet.")}
          target="_blank"
          rel="noopener noreferrer"
          className="press inline-flex min-h-11 items-center rounded-full bg-ink px-5 text-[15px] font-medium text-bone hover:bg-copper"
        >
          Nous écrire
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section aria-labelledby="hero-title" className="mx-auto max-w-[1240px] px-5 pt-12 text-center sm:px-8 sm:pt-16">
      <h1 id="hero-title" className="text-[clamp(38px,6vw,84px)] leading-[0.98] font-semibold tracking-[-0.04em]">
        <span className="block">
          {["Votre", "projet", "mérite"].map((w, i) => (
            <span key={w} className="word" style={{ animationDelay: `${i * 80}ms` }}>
              {w}
              {i < 2 ? "\u00a0" : ""}
            </span>
          ))}
        </span>
        <span className="clip-up mt-2 block" style={{ animationDelay: "300ms" }}>
          <Wordmark className="text-copper" />
        </span>
      </h1>
      <p
        className="hero-in mx-auto mt-5 max-w-[40ch] text-[clamp(18px,1.6vw,22px)] leading-[1.5]"
        style={{ animationDelay: "480ms" }}
      >
        Des sites et des logiciels qui vous ramènent des clients, à prix fixe. Choisissez votre pack, on s&apos;occupe du
        reste.
      </p>
    </section>
  );
}

/* ——— Category switch ——— */

function CategorySwitch({ active, onChange }: { active: CategoryId; onChange: (id: CategoryId) => void }) {
  const index = categories.findIndex((c) => c.id === active);
  return (
    <div
      role="tablist"
      aria-label="Domaine"
      className="sticky top-0 z-30 -mx-5 mt-8 bg-bone px-5 py-3 sm:mx-0 sm:px-0"
    >
      <div className="relative grid grid-cols-4 rounded-full bg-surface p-1 ring-1 ring-ink/10">
        <span
          aria-hidden
          className="absolute inset-y-1 left-1 rounded-full bg-ink transition-transform duration-300"
          style={{
            width: "calc((100% - 8px) / 4)",
            transform: `translateX(${index * 100}%)`,
            transitionTimingFunction: "var(--ease-in-out)",
          }}
        />
        {categories.map((c) => {
          const on = c.id === active;
          return (
            <button
              key={c.id}
              role="tab"
              type="button"
              aria-selected={on}
              onClick={() => onChange(c.id)}
              className={`press relative z-10 min-h-12 rounded-full px-1 text-[14px] whitespace-nowrap sm:text-[15px] font-medium transition-colors duration-200 ${
                on ? "text-bone" : "text-ink/75 hover:text-ink"
              }`}
            >
              <span className="sm:hidden">{c.short}</span>
              <span className="hidden sm:inline">{c.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ——— Packs ——— */

function PackCard({
  pack,
  index,
  selected,
  onSelect,
}: {
  pack: Pack;
  index: number;
  selected: boolean;
  onSelect: () => void;
}) {
  const light = pack.recommended;
  return (
    <article
      aria-label={`Pack ${pack.name}`}
      className={`card-in lift flex flex-col rounded-2xl p-6 sm:p-8 ${
        light ? "bg-ink text-bone lg:-translate-y-3" : "bg-surface ring-1 ring-ink/10"
      } ${selected ? "ring-2 ring-copper" : ""}`}
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <header>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-[24px] leading-tight font-semibold tracking-[-0.02em]">{pack.name}</h3>
          {light && <span className="rounded-full bg-copper px-3 py-1 text-[13px] font-medium text-bone">Le plus choisi</span>}
        </div>
        <p className="mt-3 text-[15px] leading-[1.55]">{pack.pitch}</p>
        <p className={`wide num mt-7 text-[clamp(40px,4vw,56px)] ${light ? "text-copper" : ""}`}>
          {pack.from && <span className="mr-2 text-[0.4em] font-semibold tracking-normal">dès</span>}
          <CountUp value={pack.price} />
          <span className="ml-2 text-[0.4em] font-semibold tracking-normal">DA</span>
        </p>
        <p className="mt-2 text-[15px]">{pack.from ? "Prix de départ, devis fixe avant de commencer" : "Prix fixe, tout compris"}</p>
        {(pack.delay || pack.examples) && (
          <dl className="mt-5 grid gap-1.5 text-[14px] leading-[1.5]">
            {pack.delay && (
              <div>
                <dt className="inline font-semibold">Délai : </dt>
                <dd className="inline">{pack.delay}</dd>
              </div>
            )}
            {pack.examples && (
              <div>
                <dt className="inline font-semibold">Exemples : </dt>
                <dd className="inline">{pack.examples.join(", ")}</dd>
              </div>
            )}
          </dl>
        )}
      </header>

      <div className={`my-7 h-2 rounded-full ${light ? "bg-bone/[0.06]" : "bg-surface-2"}`} aria-hidden />

      <p className="text-[15px] font-semibold">{pack.inherits ?? "Ce qui est inclus"}</p>
      <ul className="mt-4 grid gap-3">
        {pack.features.map((f) => (
          <li key={f} className="flex gap-3 text-[15px] leading-[1.45]">
            <Check className="mt-[3px] shrink-0 text-copper" />
            {f}
          </li>
        ))}
      </ul>

      <div aria-hidden className="min-h-8 flex-1" />
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className={`press inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full px-6 text-[16px] font-medium ${
          selected ? "bg-copper text-bone" : light ? "bg-bone text-ink hover:bg-copper hover:text-bone" : "bg-ink text-bone hover:bg-copper"
        }`}
      >
        {selected ? (
          <>
            <Check /> Ajouté au devis
          </>
        ) : (
          <>
            {pack.cta} <span aria-hidden>→</span>
          </>
        )}
      </button>
    </article>
  );
}

/** Fixed page backdrop after the reference component: tone glow, lines that draw in, rising sparks. */
function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 [background:radial-gradient(70%_55%_at_50%_0%,rgba(169,70,27,0.10),transparent_70%)]" />
      <div className="bg-grid" />
      <div className="backdrop-lines">
        <span className="vline" style={{ left: "max(20px, calc(50% - 620px))" }} />
        <span className="vline" style={{ right: "max(20px, calc(50% - 620px))", animationDelay: "120ms" }} />
        <span className="hline" style={{ top: "64px", animationDelay: "200ms" }} />
      </div>
      <Sparks />
    </div>
  );
}

/** Rising copper and ink sparks, after the reference component. Static for reduced motion. */
function Sparks() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    type P = { x: number; y: number; v: number; o: number; c: string };
    let parts: P[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    const make = (y?: number): P => ({
      x: Math.random() * w,
      y: y ?? Math.random() * h,
      v: Math.random() * 0.3 + 0.06,
      o: Math.random() * 0.4 + 0.15,
      c: Math.random() < 0.35 ? "196,86,31" : "23,18,15",
    });
    const size = () => {
      const r = { width: window.innerWidth, height: window.innerHeight };
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      parts = Array.from({ length: Math.floor((w * h) / 14000) }, () => make());
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        if (!still) p.y -= p.v;
        if (p.y < -4) Object.assign(p, make(h + Math.random() * 40));
        ctx.fillStyle = `rgba(${p.c},${p.o})`;
        ctx.fillRect(p.x, p.y, 1, 2.6);
      }
      if (!still) raf = requestAnimationFrame(draw);
    };
    const ro = new ResizeObserver(() => {
      size();
      if (still) draw();
    });
    ro.observe(document.documentElement);
    size();
    draw();
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);
  return <canvas ref={ref} aria-hidden className="absolute inset-0 h-full w-full" />;
}

/** Counts up to the price when a card mounts (category switch). Instant for reduced motion. */
function CountUp({ value }: { value: number }) {
  const [n, setN] = useState(value);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const start = performance.now();
    const step = (t: number) => {
      const k = Math.min((t - start) / 700, 1);
      const eased = 1 - Math.pow(1 - k, 3);
      setN(Math.round((value * eased) / 500) * 500);
      if (k < 1) raf = requestAnimationFrame(step);
      else setN(value);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{formatDA(n)}</>;
}

function Check({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden className={className}>
      <path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ——— Add-ons ——— */

function Addons({
  category,
  selected,
  onToggle,
}: {
  category: Category;
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <fieldset className="mt-16 grid gap-8 lg:grid-cols-12">
      <legend className="sr-only">Options à la carte</legend>
      <div className="lg:col-span-4">
        <h3 className="wide reveal text-[clamp(32px,3.6vw,48px)]">Options</h3>
        <p className="reveal mt-5 max-w-[34ch] text-[16px] leading-[1.6]" style={{ "--d": "80ms" } as React.CSSProperties}>
          Cochez ce qu&apos;il vous faut, elles s&apos;ajoutent au total. Vous pouvez aussi les ajouter après la mise en ligne.
        </p>
      </div>
      <ul className="grid gap-2 lg:col-span-8">
        {category.addons.map((a, i) => {
          const on = selected.includes(a.id);
          return (
            <li key={a.id} className="reveal" style={{ "--d": `${i * 70}ms` } as React.CSSProperties}>
              <label
                className={`press flex min-h-20 cursor-pointer items-center gap-5 rounded-xl px-5 py-4 sm:px-6 ${
                  on ? "bg-ink text-bone" : "bg-ink/[0.05] hover:bg-ink/[0.08]"
                }`}
              >
                <input type="checkbox" checked={on} onChange={() => onToggle(a.id)} className="peer sr-only" />
                <span
                  aria-hidden
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-md transition-colors duration-150 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-copper ${
                    on ? "bg-copper text-bone" : "bg-ink/15"
                  }`}
                >
                  {on && <Check />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <span className="text-[17px] font-semibold">{a.name}</span>
                    <span className={`num text-[16px] font-semibold whitespace-nowrap sm:hidden ${on ? "text-copper" : ""}`}>
                      +{formatDA(a.price)} DA
                    </span>
                  </span>
                  <span className="mt-1 block text-[15px] leading-[1.5] opacity-80">{a.desc}</span>
                </span>
                <span className={`num hidden text-[17px] font-semibold whitespace-nowrap sm:inline ${on ? "text-copper" : ""}`}>
                  +{formatDA(a.price)} DA
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}

/* ——— Comparison ——— */

function Compare({
  category,
  selected,
  onSelect,
}: {
  category: Category;
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const packs = category.packs;
  const cols = packs.length === 3 ? "grid-cols-3" : "grid-cols-2";

  return (
    <div id="comparer" className="mt-16 scroll-mt-40">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h3 className="wide reveal text-[clamp(32px,3.6vw,48px)]">Comparer les packs</h3>
        <p className="reveal flex items-center gap-5 text-[14px]">
          <span className="inline-flex items-center gap-2">
            <Yes /> Inclus
          </span>
          <span className="inline-flex items-center gap-2">
            <No /> Non inclus
          </span>
        </p>
      </div>

      {/* Desktop / tablet: one table, recommended column highlighted, choose from the header */}
      <div className="reveal mt-8 hidden overflow-hidden rounded-2xl bg-surface ring-1 ring-ink/10 md:block">
        <table className="w-full table-fixed border-collapse text-left text-[15px]">
          <caption className="sr-only">Comparatif des packs {category.label}</caption>
          <colgroup>
            <col className="w-[34%]" />
            {packs.map((p) => (
              <col key={p.id} className={p.recommended ? "bg-surface-2" : ""} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th scope="col" className="px-6 pt-7 pb-6 align-bottom text-[15px] font-normal text-ink/70">
                {packs.length} packs, {category.compare.rows.length} critères
              </th>
              {packs.map((p) => {
                const on = selected === p.id;
                return (
                  <th key={p.id} scope="col" className="px-6 pt-7 pb-6 align-bottom">
                    {p.recommended && (
                      <span className="mb-3 inline-block rounded-full bg-copper px-3 py-1 text-[12px] font-medium text-bone">
                        Le plus choisi
                      </span>
                    )}
                    <span className="block text-[18px] font-semibold">{p.name}</span>
                    <span className={`num mt-1 block text-[15px] font-medium ${p.recommended ? "text-copper" : "text-ink/75"}`}>
                      {p.from ? "dès " : ""}
                      {formatDA(p.price)} DA
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelect(p.id)}
                      aria-pressed={on}
                      className={`press mt-4 inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-[14px] font-medium ${
                        on ? "bg-copper text-bone" : "bg-ink text-bone hover:bg-copper"
                      }`}
                    >
                      {on ? (
                        <>
                          <Check /> Choisi
                        </>
                      ) : (
                        "Choisir"
                      )}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {category.compare.rows.map((r) => (
              <tr key={r.label} className="border-t border-ink/[0.08] transition-colors duration-150 hover:bg-surface-2">
                <th scope="row" className="px-6 py-4 font-medium">
                  {r.label}
                </th>
                {r.values.map((v, j) => (
                  <td key={j} className="px-6 py-4">
                    <Cell v={v} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phone: no sideways scrolling. Pack names stay pinned, each criterion is a row of answers. */}
      <div className="reveal mt-6 md:hidden">
        <div className={`sticky top-[68px] z-20 grid ${cols} gap-2 rounded-xl bg-ink p-2 text-bone`}>
          {packs.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelect(p.id)}
              aria-pressed={selected === p.id}
              className={`press rounded-lg px-2 py-2 text-left ${selected === p.id ? "bg-copper" : "bg-bone/[0.08]"}`}
            >
              <span className="block truncate text-[14px] font-semibold">{p.name}</span>
              <span className="num block text-[12px] opacity-80">
                {p.from ? "dès " : ""}
                {formatDA(p.price)} DA
              </span>
            </button>
          ))}
        </div>
        <ul className="mt-2 grid gap-2">
          {category.compare.rows.map((r) => (
            <li key={r.label} className="rounded-xl bg-surface p-4 ring-1 ring-ink/10">
              <p className="text-[15px] font-semibold">{r.label}</p>
              <div className={`mt-3 grid ${cols} gap-2`}>
                {r.values.map((v, j) => (
                  <div key={j} className="text-[14px]">
                    <span className="sr-only">{packs[j].name} : </span>
                    <Cell v={v} />
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Cell({ v }: { v: string | boolean }) {
  if (v === true)
    return (
      <span className="inline-flex items-center gap-2">
        <Yes />
        <span className="sr-only">Inclus</span>
      </span>
    );
  if (v === false)
    return (
      <span className="inline-flex items-center gap-2">
        <No />
        <span className="sr-only">Non inclus</span>
      </span>
    );
  return <span className="num font-semibold">{v}</span>;
}

function Yes() {
  return (
    <span aria-hidden className="grid h-6 w-6 place-items-center rounded-full bg-copper text-bone">
      <Check />
    </span>
  );
}

function No() {
  return (
    <span aria-hidden className="grid h-6 w-6 place-items-center rounded-full bg-ink/[0.08] text-ink/45">
      <svg width="10" height="10" viewBox="0 0 10 10">
        <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </span>
  );
}

/* ——— FAQ / footer ——— */

function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="mx-auto grid max-w-[1240px] gap-10 px-5 pt-20 sm:px-8 lg:grid-cols-12">
      <h2 id="faq-title" className="wide reveal text-[clamp(40px,4vw,56px)] lg:col-span-4">
        Questions
      </h2>
      <div className="grid gap-2 lg:col-span-8">
        {faqs.map((f, i) => (
          <details
            key={f.q}
            className="reveal group rounded-xl bg-ink/[0.05] px-6 open:bg-ink/[0.08]"
            style={{ "--d": `${i * 60}ms` } as React.CSSProperties}
          >
            <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-[17px] font-medium [&::-webkit-details-marker]:hidden">
              {f.q}
              <span
                aria-hidden
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink/10 text-[20px] leading-none transition-transform duration-200 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="max-w-[60ch] pb-6 text-[16px] leading-[1.6]">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mt-20 bg-ink pb-4 text-bone">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[clamp(22px,2.4vw,30px)] leading-tight font-semibold tracking-[-0.02em]">
              Prêt à lancer votre projet ?
            </p>
            <p className="mt-2 text-[15px] text-bone/70">Réponse sous 24h. Devis fixe avant de commencer.</p>
          </div>
          <a
            href={whatsappLink("Bonjour Getclick, je suis prêt à lancer mon projet.")}
            target="_blank"
            rel="noopener noreferrer"
            className="press group inline-flex min-h-14 shrink-0 items-center justify-center gap-3 rounded-full bg-copper px-7 text-[16px] font-medium text-bone hover:bg-bone hover:text-ink"
          >
            <WhatsAppIcon />
            Démarrer sur WhatsApp
            <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>
        <div className="flex flex-col gap-4 border-t border-bone/10 py-6 text-[14px] md:flex-row md:items-center md:justify-between">
          <Wordmark className="text-[20px]" />
          <nav aria-label="Contact" className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a href={`tel:${PHONE_DISPLAY.replace(/\s/g, "")}`} className="num hover:text-copper">
              {PHONE_DISPLAY}
            </a>
            <a href={`mailto:${EMAIL}`} className="hover:text-copper">
              {EMAIL}
            </a>
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="hover:text-copper">
              Instagram
            </a>
          </nav>
          <span className="text-bone/60">© 2026 Getclick · Alger</span>
        </div>
      </div>
    </footer>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.4.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
    </svg>
  );
}

/* ——— Live quote bar ——— */

function QuoteBar({
  visible,
  category,
  packName,
  addonCount,
  total,
  isFrom,
  href,
  onReset,
}: {
  visible: boolean;
  category: string;
  packName: string | null;
  addonCount: number;
  total: number;
  isFrom: boolean;
  href: string;
  onReset: () => void;
}) {
  return (
    <div
      role="region"
      aria-label="Votre devis"
      className={`fixed inset-x-0 bottom-0 z-50 px-3 pb-3 transition-[transform,opacity] duration-300 sm:px-6 sm:pb-6 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-[120%] opacity-0"
      }`}
      style={{ transitionTimingFunction: "var(--ease-out)" }}
      inert={!visible}
    >
      <div className="mx-auto flex max-w-[1180px] items-center gap-2 rounded-2xl bg-ink p-3 sm:gap-6 sm:p-4 text-bone shadow-[0_12px_40px_rgba(23,18,15,0.18)] sm:px-6"> {/* taste-skill-ignore: floating sticky bar */}
        <div className="min-w-0 flex-1" aria-live="polite">
          <p className="truncate text-[13px] sm:text-[14px]">
            {category} · {packName ?? "aucun pack"}
            {addonCount > 0 && ` + ${addonCount} option${addonCount > 1 ? "s" : ""}`}
          </p>
          <p key={total} className="tick wide num mt-1 text-[22px] sm:text-[30px]">
            {isFrom && <span className="mr-2 text-[0.55em] font-medium tracking-normal">dès</span>}
            {formatDA(total)} <span className="text-[0.55em] tracking-normal">DA</span>
          </p>
        </div>
        <button type="button" onClick={onReset} className="press hidden min-h-11 rounded-full px-4 text-[15px] hover:bg-bone/10 sm:inline-flex sm:items-center">
          Vider
        </button>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="press inline-flex min-h-12 shrink-0 items-center rounded-full bg-copper px-5 text-[15px] font-medium text-bone hover:bg-bone hover:text-ink sm:px-6"
        >
          Envoyer<span className="hidden sm:inline">&nbsp;sur WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
