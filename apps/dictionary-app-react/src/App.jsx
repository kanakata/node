import React, { useState, useRef, useEffect } from 'react';

/**
 * Built-in 1894 specimen lexicon used gracefully when the Express `/dict`
 * endpoint is offline (such as during standalone UI previewing).
 */
const SPECIMEN_LEXICON = {
  ephemeral: {
    syllables: 'e·phem·er·al',
    phonetic: '/ɪˈfɛm.ər.əl/',
    pos: 'adj.',
    etymology: 'From Greek ephēmeros, lasting only a day (epi- + hēmera, day).',
    senses: [
      {
        text: 'Beginning and ending in a day; existing only for a brief, transitory span.',
        example: '“The ephemeral bloom of the night-cereus fades before dawn.”',
      },
      {
        text: 'Short-lived; fleeting in human memory or fashion.',
      },
    ],
  },
  vellum: {
    syllables: 'vel·lum',
    phonetic: '/ˈvɛl.əm/',
    pos: 'n.',
    etymology:
      'From Old French veelin, fine parchment made from calfskin (veel, calf).',
    senses: [
      {
        text: 'A fine, prepared skin of a calf, kid, or lamb, rendered smooth for illuminated manuscripts, charters, or sumptuous bookbinding.',
        example:
          '“The indenture was engrossed upon heavy vellum with iron-gall ink.”',
      },
      {
        text: 'A stout, cream-tinted rag paper manufactured in imitation of genuine parchment.',
      },
    ],
  },
  serendipity: {
    syllables: 'ser·en·dip·i·ty',
    phonetic: '/ˌsɛr.ənˈdɪp.ɪ.ti/',
    pos: 'n.',
    etymology:
      'Coined by Horace Walpole (1754) from the Persian tale The Three Princes of Serendip.',
    senses: [
      {
        text: 'The faculty of making fortunate and unexpected discoveries by accident and sagacity while in search of something else.',
        example:
          '“By pure serendipity, the scholar uncovered the missing quarto behind a loose wainscot.”',
      },
    ],
  },
  lexicon: {
    syllables: 'lex·i·con',
    phonetic: '/ˈlɛk.sɪ.kɒn/',
    pos: 'n.',
    etymology:
      'From Greek lexikon (biblion), word-book, from lexis, word or speech.',
    senses: [
      {
        text: 'A vocabulary, dictionary, or word-book containing an alphabetical arrangement of the words of a language with their significations.',
      },
      {
        text: 'The complete stock of terms belonging to a particular art, science, or author.',
      },
    ],
  },
  palimpsest: {
    syllables: 'pal·imp·sest',
    phonetic: '/ˈpæl.ɪmp.sɛst/',
    pos: 'n.',
    etymology:
      'From Greek palimpsēstos, scraped clean again (palin, again + psēn, to rub smooth).',
    senses: [
      {
        text: 'A parchment or tablet from which earlier writing has been effaced or scraped away to make room for a new text, often leaving faint traces of the original beneath.',
      },
      {
        text: 'Anything bearing visible layers or vestiges of its earlier history.',
      },
    ],
  },
  'iron-gall': {
    syllables: 'i·ron-gall',
    phonetic: '/ˈaɪ.ərn ɡɔːl/',
    pos: 'n. & adj.',
    etymology:
      'Compound of ferrous sulfate (copperas) and tannic acids extracted from oak galls.',
    senses: [
      {
        text: 'A purple-black ink formulated from iron salts and oak-gall tannins, prized from antiquity through the nineteenth century for its permanence upon rag paper.',
        example:
          '“Entries were inscribed in iron-gall ink that bites deeply into the fibre.”',
      },
    ],
  },
};

const QUICK_SPECIMENS = [
  'ephemeral',
  'vellum',
  'serendipity',
  'lexicon',
  'palimpsest',
  'iron-gall',
];

/**
 * Converts a 1-based positive integer into an uppercase Roman numeral (I, II, III, IV...).
 */
function toRomanNumeral(num) {
  const map = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];
  let remaining = Math.max(1, Math.floor(num));
  let result = '';

  for (const [value, symbol] of map) {
    while (remaining >= value) {
      result += symbol;
      remaining -= value;
    }
  }
  return result;
}

/**
 * Injects Google Fonts (`IM Fell English`, `EB Garamond`, `Courier Prime`) and
 * self-contained 1894 Victorian print-shop styling so the component renders
 * identically whether dropped into Vite or previewed standalone.
 */
function LexiconStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:ital@0;1&family=EB+Garamond:ital,wght@0,400..700;1,400..600&family=IM+Fell+English:ital@0;1&display=swap');

      :root {
        --bg-rag-paper: #EFE4CE;
        --bg-index-card: #FBF6EC;
        --bg-inset-well: #EFE3CC;
        --ink-gall: #1A1612;
        --ink-sepia: #463A2E;
        --ink-faded: #746452;
        --ink-oxblood: #7C2D12;
        --ink-oxblood-deep: #5B1F0B;
        --rule-dark: #1A1612;
        --rule-mid: #9C8A72;
        --rule-faint: #D4C5AC;
        --shadow-plate: 0 2px 0 rgba(26, 22, 18, 0.14),
          0 16px 34px -16px rgba(26, 22, 18, 0.32);

        --font-display: 'IM Fell English', 'Baskerville', Georgia, serif;
        --font-serif: 'EB Garamond', 'Palatino Linotype', Georgia, serif;
        --font-mono: 'Courier Prime', 'Courier New', monospace;
      }

      *, *::before, *::after {
        box-sizing: border-box;
        margin:0px;
        padding:0px;
      }

      .lexicon-viewport {
        min-height: 100dvh;
        width: 100%;
        background-color: var(--bg-rag-paper);
        background-image:
          /* Subtle foxing age spots */
          radial-gradient(circle at 12% 16%, rgba(124, 45, 18, 0.08) 0px, transparent 3px),
          radial-gradient(circle at 87% 22%, rgba(110, 66, 28, 0.08) 0px, transparent 4px),
          radial-gradient(circle at 81% 84%, rgba(124, 45, 18, 0.09) 0px, transparent 3.5px),
          radial-gradient(circle at 19% 78%, rgba(98, 58, 24, 0.07) 0px, transparent 2.5px),
          /* Fine horizontal laid-paper watermark lines */
          repeating-linear-gradient(
            0deg,
            rgba(26, 22, 18, 0.02) 0px,
            rgba(26, 22, 18, 0.02) 1px,
            transparent 1px,
            transparent 4px
          ),
          /* Darkened folio edge vignette */
          radial-gradient(
            ellipse at 50% 45%,
            rgba(255, 251, 242, 0.35) 0%,
            rgba(168, 144, 108, 0.44) 100%
          );
        color: var(--ink-gall);
        font-family: var(--font-serif);
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: clamp(1rem, 3.5vw, 2.5rem) 1rem 3rem;
        line-height: 1.6;
        position: relative;
        overflow-x: hidden;
      }

      .lexicon-grain-overlay {
        position: fixed;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 40;
        opacity: 0.22;
        mix-blend-mode: multiply;
      }

      .lexicon-folio {
        width: 100%;
        max-width: 660px;
        display: flex;
        flex-direction: column;
        gap: 1.45rem;
        position: relative;
        z-index: 1;
      }

      /* ------------------------------------------------------------------------
         1894 Broadsheet Masthead
         ------------------------------------------------------------------------ */
      .lexicon-masthead {
        background-color: var(--bg-index-card);
        border: 2px solid var(--rule-dark);
        padding: 0.9rem 1.25rem 1.25rem;
        box-shadow: var(--shadow-plate);
        position: relative;
        text-align: center;
      }

      .lexicon-masthead::before {
        content: '';
        position: absolute;
        inset: 4px;
        border: 1px solid var(--rule-mid);
        pointer-events: none;
      }

      .lexicon-running-header {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        gap: 0.35rem;
        font-family: var(--font-mono);
        font-size: 0.68rem;
        letter-spacing: 0.13em;
        text-transform: uppercase;
        color: var(--ink-sepia);
        padding-bottom: 0.55rem;
        margin-bottom: 0.75rem;
        border-bottom: 1px solid var(--rule-dark);
      }

      .lexicon-title-wrap {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .lexicon-title {
        margin: 0;
        font-family: var(--font-display);
        font-size: clamp(2.15rem, 6vw, 3.05rem);
        font-weight: 400;
        letter-spacing: 0.06em;
        line-height: 1.05;
        color: var(--ink-gall);
        text-transform: uppercase;
        text-shadow: 0.5px 0.5px 0 rgba(26, 22, 18, 0.22);
      }

      .lexicon-subtitle {
        margin: 0.25rem 0 0;
        font-family: var(--font-display);
        font-style: italic;
        font-size: 1.02rem;
        color: var(--ink-sepia);
      }

      .lexicon-woodcut-rule {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.65rem;
        margin-top: 0.65rem;
        color: var(--ink-oxblood);
        font-size: 0.92rem;
        letter-spacing: 0.2em;
        user-select: none;
      }

      .lexicon-woodcut-rule::before,
      .lexicon-woodcut-rule::after {
        content: '';
        height: 1px;
        flex: 1;
        max-width: 110px;
        background: linear-gradient(90deg, transparent, var(--rule-dark), transparent);
      }

      .lexicon-stamp {
        display: inline-block;
        margin-top: 0.65rem;
        padding: 0.14rem 0.55rem;
        border: 1.5px double var(--ink-oxblood);
        color: var(--ink-oxblood);
        font-family: var(--font-mono);
        font-size: 0.63rem;
        font-weight: 700;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        transform: rotate(-1.8deg);
        opacity: 0.88;
      }

      @media (min-width: 560px) {
        .lexicon-stamp {
          position: absolute;
          right: 0.2rem;
          bottom: -0.25rem;
          margin-top: 0;
          transform: rotate(-5deg);
        }
      }

      /* ------------------------------------------------------------------------
         Card Catalog Drawer Search Form
         ------------------------------------------------------------------------ */
      .lexicon-catalog {
        background-color: var(--bg-index-card);
        border: 2px solid var(--rule-dark);
        padding: 1.2rem 1.35rem 1.15rem;
        box-shadow: var(--shadow-plate);
        position: relative;
      }

      .lexicon-catalog::before {
        content: '';
        position: absolute;
        inset: 4px;
        border: 1px solid var(--rule-faint);
        pointer-events: none;
      }

      .lexicon-catalog-top {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        font-family: var(--font-mono);
        font-size: 0.72rem;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--ink-sepia);
        margin-bottom: 0.6rem;
      }

      .lexicon-catalog-code {
        color: var(--ink-faded);
        font-size: 0.66rem;
      }

      .lexicon-search-row {
        display: flex;
        flex-direction: column;
        gap: 0.65rem;
        position: relative;
        z-index: 1;
      }

      @media (min-width: 520px) {
        .lexicon-search-row {
          flex-direction: row;
          align-items: stretch;
        }
      }

      .lexicon-input-wrap {
        position: relative;
        flex: 1;
        display: flex;
        align-items: center;
      }

      .lexicon-input {
        width: 100%;
        min-height: 46px;
        padding: 0.55rem 2.35rem 0.55rem 0.85rem;
        font-family: var(--font-display);
        font-size: 1.22rem;
        color: var(--ink-gall);
        background-color: var(--bg-inset-well);
        border: 2px solid var(--rule-dark);
        border-radius: 0;
        box-shadow: inset 1px 2px 4px rgba(26, 22, 18, 0.14);
        transition: background-color 0.15s ease, border-color 0.15s ease,
          box-shadow 0.15s ease;
      }

      .lexicon-input::placeholder {
        color: var(--ink-faded);
        font-style: italic;
        font-size: 1.05rem;
      }

      .lexicon-input:focus {
        outline: none;
        background-color: #FFFDF8;
        border-color: var(--ink-oxblood);
        box-shadow: inset 1px 2px 4px rgba(26, 22, 18, 0.08),
          0 0 0 2px rgba(124, 45, 18, 0.22);
      }

      .lexicon-clear-btn {
        position: absolute;
        right: 0.45rem;
        width: 30px;
        height: 30px;
        border: none;
        background: transparent;
        color: var(--ink-sepia);
        font-family: var(--font-mono);
        font-size: 1.15rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color 0.14s ease;
      }

      .lexicon-clear-btn:hover {
        color: var(--ink-oxblood);
      }

      .lexicon-clear-btn:focus-visible {
        outline: 2px solid var(--ink-oxblood);
        outline-offset: 1px;
      }

      .lexicon-submit-btn {
        min-height: 46px;
        padding: 0.6rem 1.5rem;
        font-family: var(--font-display);
        font-size: 1.02rem;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--bg-index-card);
        background-color: var(--ink-gall);
        border: 2px solid var(--ink-gall);
        border-radius: 0;
        box-shadow: 2px 2px 0 var(--rule-mid);
        cursor: pointer;
        white-space: nowrap;
        transition: background-color 0.15s ease, border-color 0.15s ease,
          transform 0.08s ease, box-shadow 0.08s ease;
      }

      .lexicon-submit-btn:hover:not(:disabled) {
        background-color: var(--ink-oxblood);
        border-color: var(--ink-oxblood-deep);
      }

      .lexicon-submit-btn:active:not(:disabled) {
        transform: translate(1px, 1px);
        box-shadow: 1px 1px 0 var(--rule-mid);
      }

      .lexicon-submit-btn:focus-visible {
        outline: 2px solid var(--ink-oxblood);
        outline-offset: 2px;
      }

      .lexicon-submit-btn:disabled {
        opacity: 0.62;
        cursor: not-allowed;
      }

      /* Quick-Consult Index Slips */
      .lexicon-slips-bar {
        margin-top: 0.9rem;
        padding-top: 0.7rem;
        border-top: 1px dashed var(--rule-mid);
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.45rem;
        position: relative;
        z-index: 1;
      }

      .lexicon-slips-label {
        font-family: var(--font-mono);
        font-size: 0.68rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--ink-faded);
        margin-right: 0.15rem;
      }

      .lexicon-slip-pill {
        background-color: #F3E9D4;
        border: 1px solid var(--rule-mid);
        box-shadow: 1px 1px 0 rgba(26, 22, 18, 0.14);
        padding: 0.2rem 0.6rem;
        font-family: var(--font-display);
        font-style: italic;
        font-size: 0.95rem;
        color: var(--ink-sepia);
        cursor: pointer;
        transition: all 0.14s ease;
      }

      .lexicon-slip-pill:hover,
      .lexicon-slip-pill[aria-pressed="true"] {
        color: var(--ink-oxblood);
        border-color: var(--ink-oxblood);
        background-color: #FFFDF8;
        transform: translateY(-1px);
      }

      .lexicon-slip-pill:focus-visible {
        outline: 2px solid var(--ink-oxblood);
        outline-offset: 1px;
      }

      /* ------------------------------------------------------------------------
         Double-Ruled Broadsheet Index Plate (Definitions Output)
         ------------------------------------------------------------------------ */
      .lexicon-plate {
        background-color: var(--bg-index-card);
        border: 2.5px solid var(--rule-dark);
        padding: clamp(1.6rem, 4.5vw, 2.45rem) clamp(1.35rem, 4vw, 2.2rem);
        box-shadow: var(--shadow-plate);
        min-height: 255px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: relative;
      }

      .lexicon-plate::before {
        content: '';
        position: absolute;
        inset: 5px;
        border: 1px solid var(--rule-mid);
        pointer-events: none;
      }

      .lexicon-corner {
        position: absolute;
        font-size: 0.85rem;
        line-height: 1;
        color: var(--ink-sepia);
        background-color: var(--bg-index-card);
        padding: 0 3px;
        pointer-events: none;
        user-select: none;
      }

      .lexicon-corner-tl { top: 1px; left: 7px; }
      .lexicon-corner-tr { top: 1px; right: 7px; transform: scaleX(-1); }
      .lexicon-corner-bl { bottom: 1px; left: 7px; transform: scaleY(-1); }
      .lexicon-corner-br { bottom: 1px; right: 7px; transform: scale(-1, -1); }

      /* Headword & Metadata Header */
      .lexicon-entry-header {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: baseline;
        gap: 0.5rem 1rem;
        padding-bottom: 0.8rem;
        margin-bottom: 1.25rem;
        border-bottom: 3px double var(--rule-dark);
      }

      .lexicon-headword-group {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: 0.65rem;
      }

      .lexicon-headword {
        margin: 0;
        font-family: var(--font-display);
        font-size: clamp(2rem, 5vw, 2.6rem);
        font-weight: 400;
        color: var(--ink-gall);
        line-height: 1.1;
        letter-spacing: 0.02em;
      }

      .lexicon-headword::first-letter {
        font-size: 1.18em;
        color: var(--ink-oxblood);
      }

      .lexicon-phonetic {
        font-family: var(--font-serif);
        font-size: 1.06rem;
        color: var(--ink-sepia);
      }

      .lexicon-pos {
        font-family: var(--font-display);
        font-style: italic;
        font-size: 1.05rem;
        color: var(--ink-oxblood);
      }

      .lexicon-folio-meta {
        font-family: var(--font-mono);
        font-size: 0.7rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--ink-faded);
      }

      /* Roman Numeral Senses */
      .lexicon-senses {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 1.05rem;
      }

      .lexicon-sense-item {
        display: grid;
        grid-template-columns: 2.5rem 1fr;
        align-items: baseline;
        font-size: 1.18rem;
        line-height: 1.65;
        color: var(--ink-gall);
      }

      .lexicon-roman {
        font-family: var(--font-display);
        font-size: 0.96rem;
        letter-spacing: 0.04em;
        color: var(--ink-oxblood);
      }

      .lexicon-example {
        display: block;
        margin-top: 0.3rem;
        font-style: italic;
        font-size: 1.03rem;
        color: var(--ink-sepia);
        padding-left: 0.75rem;
        border-left: 1.5px solid var(--rule-mid);
      }

      .lexicon-etymology {
        margin: 1.25rem 0 0;
        padding-top: 0.75rem;
        border-top: 1px solid var(--rule-faint);
        font-size: 0.98rem;
        color: var(--ink-sepia);
      }

      .lexicon-etymology-label {
        font-variant: small-caps;
        letter-spacing: 0.08em;
        font-weight: 600;
        color: var(--ink-gall);
      }

      /* Provenance Footnote Banner (/dict Archive vs Preview Specimen) */
      .lexicon-source-badge {
        margin: 1.25rem 0 0;
        padding-top: 0.65rem;
        border-top: 1px dotted var(--rule-mid);
        font-family: var(--font-mono);
        font-size: 0.68rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--ink-faded);
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        gap: 0.4rem;
      }

      .lexicon-source-tag {
        color: var(--ink-oxblood);
        font-weight: 700;
      }

      /* Empty, Loading & Error States */
      .lexicon-state-panel {
        text-align: center;
        padding: 1.2rem 0.5rem;
      }

      .lexicon-state-fleuron {
        font-size: 1.45rem;
        color: var(--ink-oxblood);
        margin-bottom: 0.45rem;
        line-height: 1;
      }

      .lexicon-state-heading {
        margin: 0;
        font-family: var(--font-display);
        font-size: 1.3rem;
        font-style: italic;
        color: var(--ink-sepia);
      }

      .lexicon-state-caption {
        margin: 0.45rem 0 0;
        font-family: var(--font-mono);
        font-size: 0.7rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--ink-faded);
      }

      .lexicon-state-error .lexicon-state-heading {
        color: var(--ink-oxblood);
        font-style: normal;
      }

      /* ------------------------------------------------------------------------
         Printer's Colophon Footer
         ------------------------------------------------------------------------ */
      .lexicon-colophon {
        text-align: center;
        padding-top: 0.25rem;
        color: var(--ink-sepia);
      }

      .lexicon-colophon-ornament {
        font-size: 0.85rem;
        color: var(--ink-faded);
        letter-spacing: 0.35em;
        margin-bottom: 0.3rem;
      }

      .lexicon-colophon-text {
        margin: 0;
        font-family: var(--font-display);
        font-style: italic;
        font-size: 0.98rem;
        letter-spacing: 0.03em;
      }

      .lexicon-colophon-sub {
        margin: 0.2rem 0 0;
        font-family: var(--font-mono);
        font-size: 0.64rem;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--ink-faded);
      }
    `}</style>
  );
}

/**
 * 1894 Victorian Print-Shop & Iron-Gall Ink Pocket Lexicon Component.
 * Queries `GET /dict?word=...` on your Express backend and falls back cleanly
 * to a specimen lexicon when previewed without a live server.
 *
 * @param {Object} props
 * @param {string} [props.endpoint='/dict'] - Backend endpoint path.
 * @param {string} [props.initialWord=''] - Optional word to look up on mount.
 */
export function Dictionary({ endpoint = '/dict', initialWord = '' }) {
  const [query, setQuery] = useState(initialWord);
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'empty' | 'error'
  const [entry, setEntry] = useState(null);
  const [statusNote, setStatusNote] = useState({
    fleuron: '❦',
    heading: 'Inscribe a word in the drawer above to turn to its leaf.',
    caption: 'Lexicon Open • Awaiting Inquiry',
  });

  const inputRef = useRef(null);

  /**
   * Executes a dictionary lookup against the Express `/dict` endpoint,
   * falling back to `SPECIMEN_LEXICON` if the backend is offline.
   */
  const consultLexicon = async (rawWord) => {
    const trimmed = rawWord.trim();

    if (!trimmed) {
      setEntry(null);
      setStatus('error');
      setStatusNote({
        fleuron: '❧',
        heading: 'Pray inscribe a word before consulting the lexicon.',
        caption: 'Blank Slip Submitted',
      });
      inputRef.current?.focus();
      return;
    }

    setStatus('loading');
    setStatusNote({
      fleuron: '❖',
      heading: 'Turning the leaves…',
      caption: `Seeking “${trimmed}” in the compendium`,
    });

    const normalizedKey = trimmed.toLowerCase();

    try {
      const response = await fetch(
        `${endpoint}?word=${encodeURIComponent(trimmed)}`,
        {
          method: 'GET',
          headers: { Accept: 'application/json' },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        setEntry(null);
        setStatus('empty');
        setStatusNote({
          fleuron: '∅',
          heading: `No leaf found for “${trimmed}” in this edition.`,
          caption: 'Verify orthography and try again',
        });
        return;
      }

      // Enrich live Express string array with archival metadata if available
      const meta = SPECIMEN_LEXICON[normalizedKey];
      const senses = data.map((item) =>
        typeof item === 'string'
          ? { text: item }
          : {
              text:
                item.definition || item.meaning || item.text || String(item),
              example: item.example || '',
            }
      );

      setEntry({
        word: trimmed,
        headword: meta?.syllables || trimmed.toLowerCase(),
        phonetic: meta?.phonetic || '',
        pos: meta?.pos || '',
        etymology: meta?.etymology || '',
        senses,
        source: 'archive',
      });
      setStatus('success');
    } catch (err) {
      // Graceful fallback to built-in specimen folio when /dict is offline
      const specimen = SPECIMEN_LEXICON[normalizedKey];

      if (specimen) {
        setEntry({
          word: trimmed,
          headword: specimen.syllables,
          phonetic: specimen.phonetic,
          pos: specimen.pos,
          etymology: specimen.etymology,
          senses: specimen.senses,
          source: 'specimen',
        });
        setStatus('success');
      } else {
        console.error('Lexicon lookup failed:', err);
        setEntry(null);
        setStatus('error');
        setStatusNote({
          fleuron: '❧',
          heading: `Unable to retrieve “${trimmed}” from the /dict press.`,
          caption:
            'Start your Express server or select an index specimen above',
        });
      }
    }
  };

  useEffect(() => {
    if (initialWord.trim()) {
      consultLexicon(initialWord);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialWord]);

  const handleSubmit = (e) => {
    e.preventDefault();
    consultLexicon(query);
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const handleSpecimenClick = (specimenWord) => {
    setQuery(specimenWord);
    consultLexicon(specimenWord);
  };

  const isLoading = status === 'loading';

  return (
    <div className='lexicon-viewport'>
      <LexiconStyles />

      {/* Organic Rag-Paper Grain Overlay */}
      <svg className='lexicon-grain-overlay' aria-hidden='true'>
        <filter id='victorian-rag-grain'>
          <feTurbulence
            type='fractalNoise'
            baseFrequency='0.78'
            numOctaves='4'
            stitchTiles='stitch'
          />
          <feColorMatrix type='saturate' values='0' />
        </filter>
        <rect width='100%' height='100%' filter='url(#victorian-rag-grain)' />
      </svg>

      <div className='lexicon-folio'>
        {/* 1894 Broadsheet Masthead */}
        <header className='lexicon-masthead'>
          <div className='lexicon-running-header'>
            <span>A Compendium of the English Tongue</span>
            <span>Est. MDCCCXCIV &bull; Folio I</span>
          </div>

          <div className='lexicon-title-wrap'>
            <h1 className='lexicon-title'>The Pocket Lexicon</h1>
            <p className='lexicon-subtitle'>
              Orthography, Pronunciation &amp; Signification of Words
            </p>
            <div className='lexicon-woodcut-rule' aria-hidden='true'>
              <span>&#8212; &#10087; &#10070; &#10087; &#8212;</span>
            </div>
            <span className='lexicon-stamp'>Archival Edition</span>
          </div>
        </header>

        {/* Card Catalog Search Drawer */}
        <form className='lexicon-catalog' onSubmit={handleSubmit} noValidate>
          <div className='lexicon-catalog-top'>
            <label htmlFor='lexicon-word-input'>Consult the Index</label>
            <span className='lexicon-catalog-code'>
              Drawer A&ndash;Z &bull; No. 1894
            </span>
          </div>

          <div className='lexicon-search-row'>
            <div className='lexicon-input-wrap'>
              <input
                ref={inputRef}
                id='lexicon-word-input'
                name='word'
                type='text'
                className='lexicon-input'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='e.g., ephemeral, vellum, serendipity...'
                autoComplete='off'
                autoCapitalize='none'
                spellCheck='false'
                required
              />
              {query.length > 0 && (
                <button
                  type='button'
                  className='lexicon-clear-btn'
                  onClick={handleClear}
                  aria-label='Clear search field'
                  title='Clear'
                >
                  &times;
                </button>
              )}
            </div>

            <button
              type='submit'
              className='lexicon-submit-btn'
              disabled={isLoading}
            >
              {isLoading ? 'Consulting…' : 'Consult'}
            </button>
          </div>

          {/* Quick-Consult Specimen Index Slips */}
          <div
            className='lexicon-slips-bar'
            aria-label='Quick-consult specimen words'
          >
            <span className='lexicon-slips-label'>Index Slips:</span>
            {QUICK_SPECIMENS.map((item) => {
              const isActive =
                status === 'success' &&
                entry?.word.toLowerCase() === item.toLowerCase();
              return (
                <button
                  key={item}
                  type='button'
                  className='lexicon-slip-pill'
                  aria-pressed={isActive}
                  onClick={() => handleSpecimenClick(item)}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </form>

        {/* Double-Ruled Broadsheet Index Plate */}
        <main className='lexicon-plate' aria-live='polite'>
          <span className='lexicon-corner lexicon-corner-tl' aria-hidden='true'>
            &#10087;
          </span>
          <span className='lexicon-corner lexicon-corner-tr' aria-hidden='true'>
            &#10087;
          </span>
          <span className='lexicon-corner lexicon-corner-bl' aria-hidden='true'>
            &#10087;
          </span>
          <span className='lexicon-corner lexicon-corner-br' aria-hidden='true'>
            &#10087;
          </span>

          {status === 'success' && entry ? (
            <article aria-label={`Definition of ${entry.word}`}>
              <header className='lexicon-entry-header'>
                <div className='lexicon-headword-group'>
                  <h2 className='lexicon-headword'>{entry.headword}</h2>
                  {entry.phonetic && (
                    <span className='lexicon-phonetic'>{entry.phonetic}</span>
                  )}
                  {entry.pos && (
                    <span className='lexicon-pos'>{entry.pos}</span>
                  )}
                </div>

                <span className='lexicon-folio-meta'>
                  Leaf {entry.word.charAt(0).toUpperCase()} &bull;{' '}
                  {entry.senses.length}{' '}
                  {entry.senses.length === 1 ? 'Sense' : 'Senses'}
                </span>
              </header>

              <ol className='lexicon-senses'>
                {entry.senses.map((sense, index) => (
                  <li key={index} className='lexicon-sense-item'>
                    <span className='lexicon-roman'>
                      {toRomanNumeral(index + 1)}.
                    </span>
                    <div>
                      <span>{sense.text}</span>
                      {sense.example && (
                        <span className='lexicon-example'>{sense.example}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ol>

              {entry.etymology && (
                <p className='lexicon-etymology'>
                  <span className='lexicon-etymology-label'>Etymology. </span>
                  {entry.etymology}
                </p>
              )}

              <div className='lexicon-source-badge'>
                <span>
                  Provenance:{' '}
                  <strong className='lexicon-source-tag'>
                    {entry.source === 'archive'
                      ? 'Live /dict Archive'
                      : 'Preview Specimen Folio'}
                  </strong>
                </span>
                <span>
                  {entry.source === 'archive'
                    ? 'Served via Express JSON Endpoint'
                    : '/dict Offline • Built-in Plate'}
                </span>
              </div>
            </article>
          ) : (
            <div
              className={
                status === 'error'
                  ? 'lexicon-state-panel lexicon-state-error'
                  : 'lexicon-state-panel'
              }
              role={status === 'error' ? 'alert' : undefined}
            >
              <div className='lexicon-state-fleuron' aria-hidden='true'>
                {statusNote.fleuron}
              </div>
              <p className='lexicon-state-heading'>{statusNote.heading}</p>
              <p className='lexicon-state-caption'>{statusNote.caption}</p>
            </div>
          )}
        </main>

        {/* Printer's Colophon Footer */}
        <footer className='lexicon-colophon'>
          <div className='lexicon-colophon-ornament' aria-hidden='true'>
            &#10070; &#10087; &#10070;
          </div>
          <p className='lexicon-colophon-text'>
            Printed in Nairobi &bull; Folio Press
          </p>
          <p className='lexicon-colophon-sub'>
            Iron-Gall Ink &bull; Set in Fell English &amp; Garamond Metal Type
          </p>
        </footer>
      </div>
    </div>
  );
}

/**
 * Root App component rendering the Dictionary lexicon.
 */
export default function App() {
  return <Dictionary endpoint='/dict' />;
}
