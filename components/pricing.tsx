"use client";

import { useEffect, useRef, useState } from "react";
import {
  CATEGORIES,
  DELIVERED,
  EMAIL,
  FAQS,
  HIGHLIGHT_BADGE,
  INSTAGRAM,
  PHONE_DISPLAY,
  PROMISES,
  buildMessage,
  computeQuote,
  defaultPayment,
  defaultQty,
  extraAmount,
  formatDA,
  getCategory,
  getPack,
  highlightIndex,
  moduleLimit,
  monthlyEquivalent,
  paymentOptions,
  recommendPack,
  suggestedPack,
  visiblePacks,
  whatsappLink,
  type Category,
  type CategoryId,
  type Pack,
  type Selection,
} from "@/lib/pricing";

const VISIBLE_ITEMS = 5;

export default function Pricing() {
  const [categoryId, setCategoryId] = useState<CategoryId | null>(null);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [recommended, setRecommended] = useState<number | null>(null);
  const offerRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  useReveal();

  const category = categoryId ? getCategory(categoryId) : null;

  function chooseCategory(id: CategoryId) {
    setCategoryId(id);
    setRecommended(null);
    requestAnimationFrame(() => offerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function choosePack(c: Category, p: Pack, trigger?: HTMLElement | null) {
    triggerRef.current = trigger ?? null;
    setSelection({ categoryId: c.id, packId: p.id, qty: defaultQty(c, p), extras: [], modules: [], payment: defaultPayment(c) });
    setPanelOpen(true);
  }

  function closePanel() {
    setPanelOpen(false);
    triggerRef.current?.focus();
  }

  function changePack() {
    setPanelOpen(false);
    requestAnimationFrame(() => document.getElementById("packs")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  return (
    <div className="relative isolate min-h-dvh">
      <Backdrop />
      <Header />
      <main>
        <Hero />
        <CategoryPicker active={categoryId} onSelect={chooseCategory} />

        {category && <StickyCategory category={category} />}

        <section ref={offerRef} id="packs" aria-live="polite" className="mx-auto max-w-[1320px] scroll-mt-20 px-5 sm:px-8">
          {category ? (
            <div key={category.id} className="swap pt-14">
              <Offer
                category={category}
                recommended={recommended}
                onRecommend={setRecommended}
                onChoose={(p, el) => choosePack(category, p, el)}
              />
            </div>
          ) : null}
        </section>

        <Trust />
      </main>
      <Footer />

      {selection && (
        <Panel
          open={panelOpen}
          selection={selection}
          setSelection={setSelection}
          onClose={closePanel}
          onChangePack={changePack}
        />
      )}
      <FloatingWhatsApp hidden={panelOpen} />
    </div>
  );
}

/* ——— Hero & categories ——— */

function Hero() {
  return (
    <section aria-labelledby="hero-title" className="mx-auto max-w-[1320px] px-5 pt-12 text-center sm:px-8 sm:pt-16">
      <h1 id="hero-title" className="text-[clamp(38px,6vw,84px)] leading-[0.98] font-semibold tracking-[-0.04em]">
        <span className="block">
          {["Votre", "projet", "mérite"].map((w, i) => (
            <span key={w} className="word" style={{ animationDelay: `${i * 80}ms` }}>
              {w}
              {i < 2 ? " " : ""}
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
        Choisissez ce dont vous avez besoin. Prix final, sans surprise.
      </p>
    </section>
  );
}

function CategoryPicker({ active, onSelect }: { active: CategoryId | null; onSelect: (id: CategoryId) => void }) {
  return (
    <section id="categories" aria-label="Que voulez-vous faire ?" className="mx-auto max-w-[1320px] scroll-mt-4 px-5 pt-10 sm:px-8">
      <ul className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-3">
        {CATEGORIES.map((c, i) => {
          const on = active === c.id;
          return (
            <li key={c.id} className="card-in" style={{ animationDelay: `${i * 60}ms` }}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => onSelect(c.id)}
                className={`press lift flex h-full min-h-40 w-full flex-col items-start justify-between gap-5 rounded-2xl p-4 text-left sm:p-6 lg:min-h-48 ${
                  on ? "bg-ink text-bone" : "bg-surface ring-1 ring-ink/10 hover:ring-ink/30"
                }`}
              >
                <CategoryIcon id={c.id} className={`shrink-0 ${on ? "text-copper" : "text-ink"}`} />
                <span className="min-w-0">
                  <span className="block text-[16px] leading-[1.25] font-semibold tracking-[-0.01em] sm:text-[20px]">{c.title}</span>
                  <span className={`mt-2 block text-[13px] sm:text-[14px] ${on ? "text-bone/70" : "text-ink/65"}`}>{c.label}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** On phones, the chosen category stays visible while scrolling the packs. */
function StickyCategory({ category }: { category: Category }) {
  return (
    <div className="sticky top-0 z-30 mt-4 px-3 md:hidden">
      <div className="flex items-center gap-3 rounded-xl bg-ink px-4 py-2.5 text-bone">
        <CategoryIcon id={category.id} className="h-6 w-6 shrink-0 text-copper" />
        <span className="min-w-0 flex-1 truncate text-[15px] font-medium">{category.label}</span>
        <a href="#categories" className="press inline-flex min-h-10 items-center rounded-full px-3 text-[14px] underline underline-offset-4">
          Changer
        </a>
      </div>
    </div>
  );
}

/* ——— Packs ——— */

function Offer({
  category,
  recommended,
  onRecommend,
  onChoose,
}: {
  category: Category;
  recommended: number | null;
  onRecommend: (i: number | null) => void;
  onChoose: (p: Pack, el: HTMLElement) => void;
}) {
  const packs = visiblePacks(category);
  const hi = highlightIndex(category);
  const [helperOpen, setHelperOpen] = useState(false);
  const side = category.sideLink?.packId ? getPack(category, category.sideLink.packId) : null;

  return (
    <div>
      <header className="grid gap-3 lg:grid-cols-12 lg:items-end">
        <h2 className="wide text-[clamp(32px,4.4vw,56px)] lg:col-span-6">{category.label}</h2>
        <p className="max-w-[56ch] text-[17px] leading-[1.55] lg:col-span-6">{category.explain}</p>
      </header>

      <div
        className={`mt-8 grid items-stretch gap-4 ${
          packs.length === 3 ? "lg:grid-cols-3" : packs.length === 2 ? "md:grid-cols-2" : "mx-auto max-w-[640px]"
        }`}
      >
        {packs.map((p, i) => (
          <PackCard
            key={p.id}
            pack={p}
            index={i}
            highlighted={i === hi}
            recommended={recommended === i}
            onChoose={onChoose}
          />
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-2 text-[15px] sm:flex-row sm:flex-wrap sm:gap-x-8">
        {category.helper && (
          <button
            type="button"
            aria-expanded={helperOpen}
            onClick={() => setHelperOpen((o) => !o)}
            className="press inline-flex min-h-11 items-center font-medium underline decoration-ink/30 underline-offset-4 hover:decoration-copper"
          >
            Je ne sais pas quoi choisir
          </button>
        )}
        {category.sideLink?.whatsapp && (
          <a
            href={whatsappLink(category.sideLink.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="press inline-flex min-h-11 items-center gap-2 text-ink/80 underline decoration-ink/30 underline-offset-4 hover:text-ink"
          >
            {category.sideLink.text} <span aria-hidden>→</span>
          </a>
        )}
        {side && category.sideLink && (
          <button
            type="button"
            onClick={(e) => onChoose(side, e.currentTarget)}
            className="press inline-flex min-h-11 items-center gap-2 text-ink/80 underline decoration-ink/30 underline-offset-4 hover:text-ink"
          >
            {category.sideLink.text} <span aria-hidden>→</span>
          </button>
        )}
      </div>

      {helperOpen && category.helper && (
        <Helper
          category={category}
          onResult={(i) => {
            onRecommend(i);
            setHelperOpen(false);
            requestAnimationFrame(() =>
              document.getElementById(`pack-${packs[i].id}`)?.scrollIntoView({ behavior: "smooth", block: "center" }),
            );
          }}
        />
      )}
    </div>
  );
}

function PackCard({
  pack,
  index,
  highlighted,
  recommended,
  onChoose,
}: {
  pack: Pack;
  index: number;
  highlighted: boolean;
  recommended: boolean;
  onChoose: (p: Pack, el: HTMLElement) => void;
}) {
  const [all, setAll] = useState(false);
  const dark = highlighted;
  const items = all ? pack.items : pack.items.slice(0, VISIBLE_ITEMS);
  const more = pack.items.length - VISIBLE_ITEMS;
  const listId = `items-${pack.id}`;

  return (
    <article
      id={`pack-${pack.id}`}
      aria-label={pack.name}
      className={`card-in lift @container flex scroll-mt-24 flex-col rounded-2xl p-6 sm:p-8 ${
        dark ? "bg-ink text-bone lg:-translate-y-3" : "bg-surface ring-1 ring-ink/10"
      } ${recommended ? "ring-4 ring-copper" : ""}`}
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div className="flex min-h-7 flex-wrap items-center justify-between gap-3">
        <h3 className="text-[22px] leading-tight font-semibold tracking-[-0.02em]">{pack.name}</h3>
        {recommended ? (
          <span className="rounded-full bg-copper px-3 py-1 text-[13px] font-medium text-bone">Fait pour vous</span>
        ) : (
          dark && <span className="rounded-full bg-copper px-3 py-1 text-[13px] font-medium text-bone">{HIGHLIGHT_BADGE}</span>
        )}
      </div>

      <p className={`wide num mt-6 text-[min(56px,11.5cqi)] whitespace-nowrap ${dark ? "text-copper" : ""}`}>
        {pack.quote ? (
          "Sur devis"
        ) : (
          <>
            <CountUp value={pack.price} />
            <span className="ml-2 text-[0.4em] font-semibold tracking-normal">DA{pack.period === "year" ? " / an" : ""}</span>
          </>
        )}
      </p>
      {pack.period === "year" ? (
        <p className="num mt-1 text-[15px]">soit {formatDA(monthlyEquivalent(pack.price))} DA par mois</p>
      ) : pack.monthly ? (
        <p className="num mt-1 text-[16px] font-semibold">+ {formatDA(pack.monthly)} DA / mois</p>
      ) : null}

      <p className={`mt-4 text-[16px] leading-[1.45] ${dark ? "text-bone" : ""}`}>
        <span className={dark ? "text-bone/65" : "text-ink/60"}>Pour qui : </span>
        <span className="font-medium">« {pack.forWho} »</span>
      </p>

      <div className={`my-6 h-2 rounded-full ${dark ? "bg-bone/[0.06]" : "bg-surface-2"}`} aria-hidden />

      {pack.inherits && <p className="text-[15px] font-semibold">{pack.inherits}</p>}
      <ul id={listId} className={`grid gap-3 ${pack.inherits ? "mt-3" : ""}`}>
        {items.map((f) => (
          <li key={f} className="flex gap-3 text-[15px] leading-[1.45]">
            <Check className="mt-[3px] shrink-0 text-copper" />
            {f}
          </li>
        ))}
      </ul>
      {more > 0 && (
        <button
          type="button"
          aria-expanded={all}
          aria-controls={listId}
          onClick={() => setAll((a) => !a)}
          className="press mt-4 inline-flex min-h-10 items-center self-start text-[15px] font-medium underline decoration-current/30 underline-offset-4"
        >
          {all ? "Voir moins" : `Voir tout (${pack.items.length})`}
        </button>
      )}

      <div aria-hidden className="min-h-8 flex-1" />
      {pack.quote ? (
        <a
          href={whatsappLink(`Bonjour Getclick, je m'intéresse à : ${pack.name}. ${pack.forWho}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="press inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-ink px-6 text-[16px] font-medium text-bone hover:bg-copper"
        >
          <WhatsAppIcon /> En parler sur WhatsApp
        </a>
      ) : (
        <button
          type="button"
          onClick={(e) => onChoose(pack, e.currentTarget)}
          className={`press inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full px-6 text-[16px] font-medium ${
            dark ? "bg-copper text-bone hover:bg-bone hover:text-ink" : "bg-ink text-bone hover:bg-copper"
          }`}
        >
          Choisir ce pack <span aria-hidden>→</span>
        </button>
      )}
    </article>
  );
}

function Helper({ category, onResult }: { category: Category; onResult: (i: number) => void }) {
  const qs = category.helper!.questions;
  const [answers, setAnswers] = useState<number[]>([]);
  const step = answers.length;
  const q = qs[step];

  return (
    <div className="swap mt-4 rounded-2xl bg-surface p-6 ring-1 ring-ink/10 sm:p-8">
      <p className="text-[14px] text-ink/65">
        Question {Math.min(step + 1, qs.length)} sur {qs.length}
      </p>
      {q && (
        <fieldset className="mt-2">
          <legend className="text-[clamp(20px,2.4vw,26px)] font-semibold tracking-[-0.02em]">{q.q}</legend>
          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            {q.options.map((o) => (
              <button
                key={o.label}
                type="button"
                onClick={() => {
                  const next = [...answers, o.pack];
                  if (next.length === qs.length) onResult(recommendPack(next));
                  else setAnswers(next);
                }}
                className="press min-h-14 rounded-xl bg-surface-2 px-5 py-3 text-left text-[16px] font-medium ring-1 ring-ink/10 hover:bg-ink hover:text-bone"
              >
                {o.label}
              </button>
            ))}
          </div>
        </fieldset>
      )}
    </div>
  );
}

/* ——— Panel: bottom sheet on phones, side panel on desktop ——— */

function Panel({
  open,
  selection,
  setSelection,
  onClose,
  onChangePack,
}: {
  open: boolean;
  selection: Selection;
  setSelection: (s: Selection) => void;
  onClose: () => void;
  onChangePack: () => void;
}) {
  const category = getCategory(selection.categoryId);
  const pack = getPack(category, selection.packId);
  const quote = computeQuote(selection);
  const payments = paymentOptions(category, quote);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  // Latest onClose without re-running the open effect on every render (that used to steal focus).
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });
  const drag = useSheetDrag(panelRef, () => onCloseRef.current());
  const set = (patch: Partial<Selection>) => setSelection({ ...selection, ...patch });
  const toggle = (key: "extras" | "modules", id: string) =>
    set({ [key]: selection[key].includes(id) ? selection[key].filter((x) => x !== id) : [...selection[key], id] });

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
      if (e.key === "Tab" && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>("a[href],button:not([disabled])");
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const counter = category.counter;
  const showCounter = counter && !pack.hidden;
  const suggestion = suggestedPack(category, pack, selection);
  const limit = moduleLimit(pack, selection.extras);
  const suggestionText =
    category.modules && limit !== null && selection.modules.length > limit
      ? `Plus de ${limit} module${limit > 1 ? "s" : ""} ?`
      : `Plus de ${pack.included} produits ?`;

  return (
    <div className={`fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`} inert={!open}>
      <div
        aria-hidden
        onClick={onClose}
        className={`absolute inset-0 bg-ink/50 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="panel-title"
        className={`sheet absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col rounded-t-3xl bg-bone text-ink md:inset-y-0 md:right-0 md:left-auto md:max-h-none md:w-[480px] md:rounded-l-3xl md:rounded-tr-none ${
          open ? "sheet-open" : ""
        }`}
      >
        <div {...drag} className="touch-none md:touch-auto">
        <div aria-hidden className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-ink/20 md:hidden" />
        <div className="flex items-start justify-between gap-4 px-5 pt-4 sm:px-7 md:pt-7">
          <div className="min-w-0">
            <p className="text-[14px] text-ink/65">{category.label}</p>
            <h2 id="panel-title" className="mt-1 text-[24px] leading-tight font-semibold tracking-[-0.02em]">
              {pack.name}
            </h2>
            <button
              type="button"
              onClick={onChangePack}
              className="press mt-1 inline-flex min-h-10 items-center text-[14px] underline decoration-ink/30 underline-offset-4 hover:decoration-copper"
            >
              Changer de pack
            </button>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="press inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-ink px-4 text-[14px] font-medium text-bone hover:bg-copper"
          >
            Fermer
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
              <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        </div>

        <div className="mt-4 flex-1 overflow-y-auto overscroll-contain px-5 pb-6 sm:px-7">
          {showCounter && (
            <PanelBlock title={counter.label}>
              <div className="flex items-center justify-between gap-4 rounded-xl bg-surface p-3 ring-1 ring-ink/10">
                <button
                  type="button"
                  aria-label={`Retirer ${counter.step}`}
                  disabled={selection.qty <= counter.min}
                  onClick={() => set({ qty: Math.max(counter.min, selection.qty - counter.step) })}
                  className="press grid h-12 w-12 place-items-center rounded-full bg-ink text-[22px] text-bone disabled:opacity-30"
                >
                  −
                </button>
                <p className="text-center" aria-live="polite">
                  <span className="wide num block text-[32px]">{selection.qty}</span>
                  <span className="text-[14px] text-ink/65">
                    {counter.kind === "pages"
                      ? `${formatDA(counter.unitPrice ?? 0)} DA par page`
                      : pack.included == null
                        ? "Produits illimités"
                        : `Jusqu'à ${pack.included} dans ce pack`}
                  </span>
                </p>
                <button
                  type="button"
                  aria-label={`Ajouter ${counter.step}`}
                  onClick={() => set({ qty: selection.qty + counter.step })}
                  className="press grid h-12 w-12 place-items-center rounded-full bg-ink text-[22px] text-bone"
                >
                  +
                </button>
              </div>
              {suggestion && (
                <div className="swap mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-ink px-4 py-3 text-[15px] text-bone">
                  <span>
                    {suggestionText} <span className="font-semibold text-copper">{suggestion.name}</span> est fait pour vous.
                  </span>
                  <button
                    type="button"
                    onClick={() => set({ packId: suggestion.id })}
                    className="press min-h-10 rounded-full bg-copper px-4 text-[14px] font-medium text-bone hover:bg-bone hover:text-ink"
                  >
                    Passer à {suggestion.name}
                  </button>
                </div>
              )}
            </PanelBlock>
          )}

          {category.modules && (
            <PanelBlock
              title={
                limit === null
                  ? "Vos modules : tous sont inclus"
                  : `Vos modules : ${selection.modules.length} choisi${selection.modules.length > 1 ? "s" : ""}, ${limit} inclus dans ce pack`
              }
            >
              <ul className="grid grid-cols-2 gap-2">
                {category.modules.map((m) => {
                  const on = limit === null || selection.modules.includes(m.id);
                  return (
                    <li key={m.id}>
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={on}
                        aria-disabled={limit === null}
                        onClick={limit === null ? undefined : () => toggle("modules", m.id)}
                        className={`press flex min-h-14 w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-[15px] font-medium ${
                          on ? "bg-ink text-bone" : "bg-surface ring-1 ring-ink/10 hover:ring-ink/30"
                        }`}
                      >
                        <span aria-hidden className={`grid h-5 w-5 shrink-0 place-items-center rounded-md ${on ? "bg-copper text-bone" : "ring-2 ring-ink/25"}`}>
                          {on && <Check />}
                        </span>
                        {m.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
              {suggestion && (
                <div className="swap mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-ink px-4 py-3 text-[15px] text-bone">
                  <span>
                    {suggestionText} <span className="font-semibold text-copper">{suggestion.name}</span> est fait pour vous.
                  </span>
                  <button
                    type="button"
                    onClick={() => set({ packId: suggestion.id })}
                    className="press min-h-10 rounded-full bg-copper px-4 text-[14px] font-medium text-bone hover:bg-bone hover:text-ink"
                  >
                    Passer à {suggestion.name}
                  </button>
                </div>
              )}
            </PanelBlock>
          )}

          {category.extras.length > 0 && !pack.hidden && (
            <PanelBlock title="Voulez-vous ajouter… ?">
              <ul className="grid gap-2">
                {category.extras.map((e) => {
                  const included = pack.includesExtras?.includes(e.id);
                  const amount = extraAmount(category, pack, e, selection.qty);
                  const price = included
                    ? "Inclus dans ce pack"
                    : e.per === "month"
                      ? `+ ${formatDA(amount)} DA / mois`
                      : e.per === "year"
                        ? `+ ${formatDA(amount)} DA / an`
                      : e.per === "page"
                        ? `+ ${formatDA(amount)} DA (${formatDA(e.price)} DA × ${selection.qty} pages)`
                        : e.per === "20products"
                          ? `+ ${formatDA(amount)} DA (${formatDA(e.price)} DA par 20 produits)`
                          : `+ ${formatDA(amount)} DA`;
                  return (
                    <li key={e.id}>
                      <SwitchRow
                        on={included || selection.extras.includes(e.id)}
                        disabled={included}
                        onClick={() => toggle("extras", e.id)}
                        label={e.label}
                        price={price}
                      />
                    </li>
                  );
                })}
              </ul>
            </PanelBlock>
          )}

          <PanelBlock title="Comment voulez-vous payer ?">
            <div role="radiogroup" aria-label="Paiement" className="grid gap-2">
              {payments.map((o) => {
                const on = selection.payment === o.id;
                return (
                  <button
                    key={o.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => set({ payment: o.id })}
                    className={`press flex min-h-16 w-full items-center gap-4 rounded-xl px-5 py-4 text-left ${
                      on ? "bg-ink text-bone" : "bg-surface ring-1 ring-ink/10 hover:ring-ink/30"
                    }`}
                  >
                    <span aria-hidden className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ring-2 ${on ? "ring-copper" : "ring-ink/30"}`}>
                      {on && <span className="h-3 w-3 rounded-full bg-copper" />}
                    </span>
                    <span>
                      <span className="num block text-[16px] font-semibold">{o.title}</span>
                      {o.detail && <span className={`num mt-0.5 block text-[14px] ${on ? "text-bone/75" : "text-ink/70"}`}>{o.detail}</span>}
                    </span>
                  </button>
                );
              })}
            </div>
          </PanelBlock>
        </div>

        <div className="border-t border-ink/10 bg-surface px-5 pt-4 pb-[max(16px,env(safe-area-inset-bottom))] sm:px-7">
          <div className="flex items-start justify-between gap-4" aria-live="polite">
            <p className="pt-1 text-[14px] text-ink/70">Prix final</p>
            <div className="text-right">
              {quote.oneTime > 0 && (
                <p className="wide num text-[clamp(24px,6vw,32px)] leading-none text-copper">
                  <CountUp value={quote.oneTime} /> <span className="text-[0.5em] tracking-normal">DA</span>
                </p>
              )}
              {quote.yearly > 0 && (
                <p className={`wide num leading-none text-copper ${quote.oneTime ? "mt-2 text-[20px]" : "text-[clamp(24px,6vw,32px)]"}`}>
                  <CountUp value={quote.yearly} /> <span className="text-[0.5em] tracking-normal">DA / an</span>
                </p>
              )}
              {quote.monthly > 0 && (
                <p className="num mt-2 text-[16px] font-semibold">+ {formatDA(quote.monthly)} DA / mois</p>
              )}
            </div>
          </div>
          {(quote.yearly > 0 || quote.monthly > 0) && quote.oneTime > 0 && (
            <p className="mt-2 text-[13px] text-ink/65">Les montants par an ou par mois sont payés à part.</p>
          )}
          <a
            href={whatsappLink(buildMessage(selection))}
            target="_blank"
            rel="noopener noreferrer"
            className="press mt-4 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-copper px-6 text-[16px] font-medium text-bone hover:bg-ink"
          >
            <WhatsAppIcon /> Envoyer ma demande sur WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

/** Swipe the sheet down to close it (phones). Follows the finger, closes past 100px or on a quick flick. */
function useSheetDrag(panelRef: React.RefObject<HTMLDivElement | null>, close: () => void) {
  const start = useRef<{ y: number; t: number } | null>(null);
  const reset = (el: HTMLDivElement) => {
    el.style.transition = "";
    el.style.transform = "";
  };
  return {
    onPointerDown: (e: React.PointerEvent) => {
      if (e.pointerType === "mouse" || window.matchMedia("(min-width: 768px)").matches) return;
      if ((e.target as HTMLElement).closest("button,a")) return;
      start.current = { y: e.clientY, t: performance.now() };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      if (panelRef.current) panelRef.current.style.transition = "none";
    },
    onPointerMove: (e: React.PointerEvent) => {
      if (!start.current || !panelRef.current) return;
      const dy = e.clientY - start.current.y;
      // Downwards follows the finger; upwards resists.
      panelRef.current.style.transform = `translateY(${dy > 0 ? dy : dy * 0.2}px)`;
    },
    onPointerUp: (e: React.PointerEvent) => {
      if (!start.current || !panelRef.current) return;
      const dy = e.clientY - start.current.y;
      const velocity = dy / (performance.now() - start.current.t);
      start.current = null;
      const el = panelRef.current;
      reset(el);
      if (dy > 100 || velocity > 0.5) close();
    },
    onPointerCancel: () => {
      start.current = null;
      if (panelRef.current) reset(panelRef.current);
    },
  };
}

function PanelBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6 first:mt-2">
      <h3 className="mb-3 text-[17px] font-semibold">{title}</h3>
      {children}
    </section>
  );
}

function SwitchRow({
  on,
  disabled,
  onClick,
  label,
  price,
}: {
  on: boolean;
  disabled?: boolean;
  onClick: () => void;
  label: string;
  price: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={`press flex min-h-16 w-full items-center gap-4 rounded-xl px-5 py-3 text-left ${
        on ? "bg-ink text-bone" : "bg-surface ring-1 ring-ink/10 hover:ring-ink/30"
      } ${disabled ? "cursor-default" : ""}`}
    >
      <span className="min-w-0 flex-1">
        <span className="block text-[16px] leading-snug font-semibold">{label}</span>
        <span className={`num mt-0.5 block text-[14px] ${on ? "text-copper" : "text-ink/70"}`}>{price}</span>
      </span>
      <Toggle on={on} />
    </button>
  );
}

function FloatingWhatsApp({ hidden }: { hidden: boolean }) {
  return (
    <a
      href={whatsappLink("Bonjour Getclick, j'ai une question.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Écrire sur WhatsApp"
      className={`press fixed right-4 bottom-4 z-50 grid h-14 w-14 place-items-center rounded-full bg-copper text-bone shadow-[0_12px_32px_rgba(23,18,15,0.25)] transition-[opacity,transform] duration-200 hover:bg-ink sm:right-6 sm:bottom-6 ${
        hidden ? "pointer-events-none scale-90 opacity-0" : ""
      }`}
    >
      <WhatsAppIcon />
    </a>
  );
}

/* ——— Trust ——— */

function Trust() {
  const groups = CATEGORIES.map((c) => ({ c, items: DELIVERED[c.id] ?? [] })).filter((g) => g.items.length > 0);
  return (
    <section aria-label="Pourquoi nous faire confiance" className="mx-auto max-w-[1320px] px-5 pt-24 sm:px-8">
      {groups.map(({ c, items }) => (
        <div key={c.id} className="mb-10">
          <h2 className="text-[20px] font-semibold">{c.label} déjà livrés</h2>
          <ul className="mt-4 grid gap-4 md:grid-cols-3">
            {items.map((s) => (
              <li key={s.url} className="reveal overflow-hidden rounded-2xl bg-surface ring-1 ring-ink/10">
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.image} alt={`Projet livré : ${s.name}`} className="aspect-[4/3] w-full object-cover object-top" loading="lazy" />
                  <span className="block px-5 py-4 text-[15px] font-medium">{s.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="reveal overflow-hidden rounded-3xl bg-ink text-bone">
        <ul className="grid md:grid-cols-3">
          {PROMISES.map((p, i) => (
            <li
              key={p.id}
              className={`px-6 py-8 sm:px-8 sm:py-10 ${i > 0 ? "border-t border-bone/10 md:border-t-0 md:border-l" : ""}`}
            >
              <p className="text-[clamp(22px,2.2vw,28px)] leading-[1.15] font-semibold tracking-[-0.02em]">
                {p.text.split(", ")[0]}
                {p.text.includes(", ") && <span className="text-copper">, {p.text.split(", ").slice(1).join(", ")}</span>}
              </p>
              <p className="mt-3 max-w-[34ch] text-[16px] leading-[1.55] text-bone/70">{p.detail}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-20 grid gap-10 lg:grid-cols-12">
        <h2 className="wide reveal text-[clamp(40px,4vw,56px)] lg:col-span-4">Questions</h2>
        <div className="grid gap-2 lg:col-span-8">
          {FAQS.map((f, i) => (
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
      </div>
    </section>
  );
}

function CategoryIcon({ id, className = "" }: { id: CategoryId; className?: string }) {
  const paths: Record<CategoryId, string> = {
    vitrine: "M3 5h18v12H3zM8 21h8M12 17v4M3 9h18",
    catalogue: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
    ecommerce: "M5 8h14l-1 13H6zM9 8V6a3 3 0 0 1 6 0v2",
    gestion: "M4 20V10M10 20V4M16 20v-7M22 20H2",
    saas: "M3 7h18v10H3zM7 7V5h10v2M7 12h4M14 12h3",
    ia: "M4 5h16v11H9l-5 4zM9 10h.01M12 10h.01M15 10h.01",
  };
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[id]} />
    </svg>
  );
}

/* ——— Kept from the design system ——— */

/** Animates from the last shown value to the new one, so every tap updates smoothly. */
function CountUp({ value }: { value: number }) {
  const [n, setN] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const start = from.current;
    if (start === value) return;
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 450;
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const k = duration ? Math.min((t - t0) / duration, 1) : 1;
      const eased = 1 - Math.pow(1 - k, 3);
      const v = Math.round((start + (value - start) * eased) / 100) * 100;
      from.current = v;
      setN(v);
      if (k < 1) raf = requestAnimationFrame(step);
      else {
        from.current = value;
        setN(value);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{formatDA(n)}</>;
}

function Toggle({ on }: { on: boolean }) {
  return (
    <span aria-hidden className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 ${on ? "bg-copper" : "bg-ink/20"}`}>
      <span
        className="absolute top-1 left-1 h-5 w-5 rounded-full bg-bone transition-transform duration-200"
        style={{ transform: `translateX(${on ? 20 : 0}px)`, transitionTimingFunction: "var(--ease-out)" }}
      />
    </span>
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
      <div className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between gap-6 px-5 sm:px-8">
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

/** Fixed page backdrop after the reference component: tone glow, lines that draw in, rising sparks. */
function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[900px] [background:radial-gradient(70%_55%_at_50%_0%,rgba(169,70,27,0.10),transparent_70%)]" />
      <div className="bg-grid">
        {/* A few cells filled with the brand colours, aligned to the grid. Hidden on phones where they would sit under content. */}
        <span className="bg-tile hidden bg-copper lg:block" style={{ "--col": -4, "--row": 2, "--d": "500ms" } as React.CSSProperties} />
        <span className="bg-tile hidden bg-copper/15 lg:block" style={{ "--col": -4, "--row": 3, "--d": "650ms" } as React.CSSProperties} />
        <span className="bg-tile hidden bg-surface lg:block" style={{ "--col": 3, "--row": 2, "--d": "750ms" } as React.CSSProperties} />
        <span className="bg-tile hidden bg-ink lg:block" style={{ "--col": 4, "--row": 2, "--d": "850ms" } as React.CSSProperties} />
      </div>
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
  return <canvas ref={ref} aria-hidden className="fixed inset-0 h-full w-full" />;
}

function Check({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden className={className}>
      <path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Footer() {
  return (
    <footer className="mt-20 bg-ink pb-4 text-bone">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
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
