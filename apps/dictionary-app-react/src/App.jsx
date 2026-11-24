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
            copyright 2026
          </p>

          <p className='lexicon-colophon-text'>
            Author &bull; Patrick Kiprop
          </p>
          <p className='lexicon-colophon-text'>
            All rights reserved
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
  return <Dictionary endpoint='http://localhost:8000/dict' initialWord='hello' />;
}
