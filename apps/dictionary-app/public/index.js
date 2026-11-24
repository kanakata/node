(() => {
  const plateBody = document.getElementById('plate-body');
  const form = document.getElementById('form');
  const wordInput = document.getElementById('word');
  const submitBtn = document.getElementById('submit-btn');
  const clearBtn = document.getElementById('clear-btn');
  const sampleSlips = document.querySelectorAll('.paper-slip');

  // Built-in 19th-century archival lexicon used when /dict is offline
  const ANTIQUE_LEXICON = {
    ephemeral: {
      syllables: 'e·phem·er·al',
      phonetic: '/ɪˈfɛm.ər.əl/',
      pos: 'adj.',
      etymology:
        'From Greek ephēmeros, lasting only a day (epi- + hēmera, day).',
      senses: [
        {
          text: 'Beginning and ending in a day; existing only for a brief, transitory span.',
          example:
            '“The ephemeral bloom of the night-cereus fades before dawn.”',
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
        'Coined by Horace Walpole (1754) from the Persian fairy tale The Three Princes of Serendip.',
      senses: [
        {
          text: 'The faculty of making fortunate and unexpected discoveries by accident and sagacity while in search of something else.',
          example:
            '“By pure serendipity, the scholar uncovered the missing quarto behind a loose wainscot.”',
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
    gossamer: {
      syllables: 'gos·sa·mer',
      phonetic: '/ˈɡɒs.ə.mər/',
      pos: 'n. & adj.',
      etymology:
        'Middle English gosesomer (“goose summer”), mild autumn days when cobwebs float in the air.',
      senses: [
        {
          text: 'A fine, filmy cobweb spun by small spiders, seen floating in calm autumn air or spread upon dewy grass.',
        },
        {
          text: 'Any delicate, gauzy, or exceedingly light fabric or substance.',
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
    apothecary: {
      syllables: 'a·poth·e·car·y',
      phonetic: '/əˈpɒθ.ə.kɛr.i/',
      pos: 'n.',
      etymology:
        'From Late Latin apothecarius, storekeeper, from Greek apothēkē, storehouse.',
      senses: [
        {
          text: 'One who prepares, compounds, and dispenses drugs, tinctures, and medicinal simples for healing.',
        },
      ],
    },
  };

  /**
   * Converts 1-based integers into uppercase Roman numerals (I, II, III, IV...).
   */
  function toRoman(num) {
    const numerals = [
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
    let n = Math.max(1, Math.floor(num));
    let result = '';
    for (const [value, symbol] of numerals) {
      while (n >= value) {
        result += symbol;
        n -= value;
      }
    }
    return result;
  }

  /**
   * Renders a centered status, loading, or error panel inside the broadsheet plate.
   */
  function renderStatus({
    heading,
    caption = '',
    fleuron = '❦',
    isError = false,
  }) {
    plateBody.textContent = '';

    const panel = document.createElement('div');
    panel.className = isError ? 'state-panel state-error' : 'state-panel';
    if (isError) {
      panel.setAttribute('role', 'alert');
    }

    const ornament = document.createElement('div');
    ornament.className = 'state-fleuron';
    ornament.setAttribute('aria-hidden', 'true');
    ornament.textContent = fleuron;

    const titleEl = document.createElement('p');
    titleEl.className = 'state-heading';
    titleEl.textContent = heading;

    panel.appendChild(ornament);
    panel.appendChild(titleEl);

    if (caption) {
      const captionEl = document.createElement('p');
      captionEl.className = 'state-caption';
      captionEl.textContent = caption;
      panel.appendChild(captionEl);
    }

    plateBody.appendChild(panel);
  }

  /**
   * Renders an authentic 19th-century dictionary entry from either live /dict JSON
   * or the built-in archival fallback lexicon.
   */
  function renderEntry(word, payload, isFallback = false) {
    plateBody.textContent = '';

    const normalizedKey = word.toLowerCase();
    const archivalMeta = ANTIQUE_LEXICON[normalizedKey];

    // Normalize payload into an array of sense objects
    let senses = [];
    if (Array.isArray(payload)) {
      senses = payload.map((item) => {
        if (typeof item === 'string') {
          return { text: item };
        }
        return {
          pos: item.partOfSpeech || item.pos || '',
          text:
            item.definition ||
            item.meaning ||
            item.text ||
            JSON.stringify(item),
          example: item.example || '',
        };
      });
    } else if (payload && Array.isArray(payload.senses)) {
      senses = payload.senses;
    }

    // Entry Header
    const header = document.createElement('div');
    header.className = 'entry-header';

    const headGroup = document.createElement('div');
    headGroup.className = 'headword-group';

    const headwordEl = document.createElement('h2');
    headwordEl.className = 'headword';
    headwordEl.textContent =
      (archivalMeta && archivalMeta.syllables) || normalizedKey;
    headGroup.appendChild(headwordEl);

    if (archivalMeta && archivalMeta.phonetic) {
      const phoneticEl = document.createElement('span');
      phoneticEl.className = 'phonetic';
      phoneticEl.textContent = archivalMeta.phonetic;
      headGroup.appendChild(phoneticEl);
    }

    if (archivalMeta && archivalMeta.pos) {
      const posEl = document.createElement('span');
      posEl.className = 'pos-tag';
      posEl.textContent = archivalMeta.pos;
      headGroup.appendChild(posEl);
    }

    const folioCode = document.createElement('span');
    folioCode.className = 'entry-folio-code';
    const count = senses.length;
    folioCode.textContent = `Leaf ${normalizedKey
      .charAt(0)
      .toUpperCase()} • ${count} ${count === 1 ? 'Sense' : 'Senses'}`;

    header.appendChild(headGroup);
    header.appendChild(folioCode);
    plateBody.appendChild(header);

    // Roman Numeral Senses List
    const list = document.createElement('ol');
    list.className = 'definitions-list';

    senses.forEach((sense, idx) => {
      const li = document.createElement('li');
      li.className = 'definition-item';

      const num = document.createElement('span');
      num.className = 'roman-numeral';
      num.textContent = `${toRoman(idx + 1)}.`;

      const body = document.createElement('div');
      body.className = 'def-body';

      if (sense.pos) {
        const inlinePos = document.createElement('span');
        inlinePos.className = 'def-pos-inline';
        inlinePos.textContent = sense.pos;
        body.appendChild(inlinePos);
      }

      const textNode = document.createTextNode(sense.text);
      body.appendChild(textNode);

      if (sense.example) {
        const exEl = document.createElement('span');
        exEl.className = 'def-example';
        exEl.textContent = sense.example;
        body.appendChild(exEl);
      }

      li.appendChild(num);
      li.appendChild(body);
      list.appendChild(li);
    });

    plateBody.appendChild(list);

    // Etymology Block (when available)
    if (archivalMeta && archivalMeta.etymology) {
      const etym = document.createElement('p');
      etym.className = 'etymology-note';

      const etymLabel = document.createElement('span');
      etymLabel.className = 'etymology-label';
      etymLabel.textContent = 'Etymology. ';

      etym.appendChild(etymLabel);
      etym.appendChild(document.createTextNode(archivalMeta.etymology));
      plateBody.appendChild(etym);
    }

    // Subtle Archival Note when using built-in fallback data
    if (isFallback) {
      const footnote = document.createElement('p');
      footnote.className = 'archival-footnote';
      footnote.textContent =
        '❖ Fallback Folio Entry — Rendered from pocket plate (/dict service offline).';
      plateBody.appendChild(footnote);
    }
  }

  /**
   * Queries GET /dict?word=... and falls back gracefully if offline.
   */
  async function lookupWord(rawWord) {
    const word = rawWord.trim();

    if (!word) {
      renderStatus({
        fleuron: '❧',
        heading: 'Pray inscribe a word before consulting the lexicon.',
        caption: 'Blank Slip Submitted',
        isError: true,
      });
      wordInput.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Consulting…';
    renderStatus({
      fleuron: '❖',
      heading: 'Turning the leaves…',
      caption: `Seeking “${word}” in the compendium`,
    });

    try {
      const response = await fetch(`/dict?word=${encodeURIComponent(word)}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        renderStatus({
          fleuron: '∅',
          heading: `No leaf found for “${word}” in this edition.`,
          caption: 'Verify orthography and try again',
        });
        return;
      }

      renderEntry(word, data, false);
    } catch (error) {
      const fallbackEntry = ANTIQUE_LEXICON[word.toLowerCase()];
      if (fallbackEntry) {
        renderEntry(word, fallbackEntry, true);
      } else {
        console.error('Lexicon lookup error:', error);
        renderStatus({
          fleuron: '❧',
          heading: 'The press is momentarily unreachable.',
          caption: 'Connect the /dict endpoint or select an index slip above',
          isError: true,
        });
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Consult';
    }
  }

  function syncClearButton() {
    clearBtn.classList.toggle('visible', wordInput.value.length > 0);
  }

  wordInput.addEventListener('input', syncClearButton);

  clearBtn.addEventListener('click', () => {
    wordInput.value = '';
    syncClearButton();
    wordInput.focus();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    lookupWord(wordInput.value);
  });

  sampleSlips.forEach((slip) => {
    slip.addEventListener('click', () => {
      const sampleWord = slip.dataset.word || '';
      wordInput.value = sampleWord;
      syncClearButton();
      lookupWord(sampleWord);
    });
  });
})();
