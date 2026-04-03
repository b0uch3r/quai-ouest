const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const INDEX_PATH = path.join(ROOT, 'index.html');
const MENU_PATH = path.join(ROOT, 'content', 'menu.json');

const RESTAURANT_SCHEMA_START = '<!-- GENERATED:RESTAURANT_SCHEMA START -->';
const RESTAURANT_SCHEMA_END = '<!-- GENERATED:RESTAURANT_SCHEMA END -->';
const MENU_SECTION_START = '<!-- GENERATED:MENU_SECTION START -->';
const MENU_SECTION_END = '<!-- GENERATED:MENU_SECTION END -->';

const RESTAURANT_DATA = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'Quai Ouest',
  description: 'Restaurant bistronomique face à la mer, cuisine de saison avec produits frais et locaux',
  url: 'https://b0uch3r.github.io/quai-ouest/',
  telephone: '+33298290809',
  email: 'quai.ouest29250@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '1 Promenade de Penarth',
    addressLocality: 'Saint-Pol-de-Léon',
    postalCode: '29250',
    addressRegion: 'Finistère',
    addressCountry: 'FR'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 48.6847,
    longitude: -3.987
  },
  servesCuisine: ['Bistronomique', 'Fruits de mer', 'Bretonne'],
  priceRange: '€€',
  foundingDate: '2018-03-21',
  award: "Tripadvisor Travellers' Choice 2025",
  sameAs: [
    'https://www.instagram.com/quaiouest.stpol/',
    'https://www.facebook.com/p/Quai-Ouest-100068821471690/',
    'https://www.google.com/maps/?cid=17426717769622004663',
    'https://www.tripadvisor.fr/Restaurant_Review-g660194-d23568654-Reviews-Quai_Ouest-Saint_Pol_de_Leon_Finistere_Brittany.html',
    'https://www.roscoff-tourisme.com/fr/fiche/restauration/quai-ouest-saint-pol-de-leon_TFORESBRE029FS000LK/'
  ],
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Wednesday', opens: '12:00', closes: '14:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Thursday', opens: '12:00', closes: '14:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Thursday', opens: '19:00', closes: '21:30' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '12:00', closes: '14:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '19:00', closes: '21:30' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '12:00', closes: '14:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '19:00', closes: '21:30' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '12:00', closes: '14:00' }
  ],
  image: 'https://b0uch3r.github.io/quai-ouest/assets/images/hero-terrasse-plage.jpg',
  acceptsReservations: true
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function collapseWhitespace(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseSimplePrice(price) {
  if (!price) return null;
  const match = collapseWhitespace(price).match(/^(\d+(?:,\d+)?)\s*€$/);
  return match ? match[1].replace(',', '.') : null;
}

function joinParts(parts, separator = ' · ') {
  return parts.filter(Boolean).join(separator);
}

function sortMenuSections(sections) {
  return [...sections].sort((left, right) => {
    const leftOrder = Number.isFinite(left.order) ? left.order : Number.MAX_SAFE_INTEGER;
    const rightOrder = Number.isFinite(right.order) ? right.order : Number.MAX_SAFE_INTEGER;
    return leftOrder - rightOrder;
  });
}

function replaceGeneratedBlock(source, startMarker, endMarker, replacement) {
  const startIndex = source.indexOf(startMarker);
  const endIndex = source.indexOf(endMarker);

  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    throw new Error(`Impossible de trouver le bloc ${startMarker}`);
  }

  const insertionStart = startIndex + startMarker.length;
  return `${source.slice(0, insertionStart)}\n${replacement}\n${source.slice(endIndex)}`;
}

function renderCourseOption(option) {
  const description = option.description
    ? `\n                <span class="menu-course-option-desc">${escapeHtml(option.description)}</span>`
    : '';

  return [
    '              <div class="menu-course-option">',
    `                <span class="menu-course-option-name">${escapeHtml(option.name)}</span>${description}`,
    '              </div>'
  ].join('\n');
}

function renderFixedMenuBlock(block) {
  const cardClass = block.id ? ` menu-card--${block.id}` : '';
  const courses = block.courses.map((course) => {
    const options = course.options
      .map((option, index) => {
        const rendered = renderCourseOption(option);
        if (index === 0) return rendered;
        return ['              <div class="menu-course-separator">ou</div>', rendered].join('\n');
      })
      .join('\n');

    return [
      '        <section class="menu-formula-course">',
      `          <h5>${escapeHtml(course.title)}</h5>`,
      '          <div class="menu-formula-options">',
      options,
      '          </div>',
      '        </section>'
    ].join('\n');
  }).join('\n');

  const footnotes = Array.isArray(block.footnotes) && block.footnotes.length > 0
    ? [
        '      <div class="menu-block-footnotes">',
        ...block.footnotes.map((note) => `        <p>${escapeHtml(note)}</p>`),
        '      </div>'
      ].join('\n')
    : '';

  return [
    `      <article class="carte-block menu-formula-card${cardClass}">`,
    '        <div class="menu-formula-header">',
    '          <div>',
    block.subtitle ? `            <span class="menu-card-badge">${escapeHtml(block.subtitle)}</span>` : '',
    `            <h4>${escapeHtml(block.title)}</h4>`,
    '          </div>',
    `          <div class="menu-formula-price">${escapeHtml(block.price)}</div>`,
    '        </div>',
    '        <div class="menu-formula-courses">',
    courses,
    '        </div>',
    footnotes,
    '      </article>'
  ].filter(Boolean).join('\n');
}

function renderMenuListItem(item) {
  const hasPriceVariants = Array.isArray(item.priceVariants) && item.priceVariants.length > 0;
  const description = item.description
    ? `\n              <div class="menu-item-desc">${escapeHtml(item.description)}</div>`
    : '';
  const itemClass = hasPriceVariants ? 'menu-item menu-item--with-variants' : 'menu-item';
  const priceClass = item.price ? 'menu-item-price' : 'menu-item-price menu-item-price-empty';
  const priceValue = item.price ? escapeHtml(item.price) : '&nbsp;';
  const priceMarkup = hasPriceVariants
    ? [
        '            <div class="menu-item-prices" aria-label="Formats et prix">',
        ...item.priceVariants.map((variant) => [
          '              <div class="menu-price-variant">',
          `                <span class="menu-price-variant-label">${escapeHtml(variant.label)}</span>`,
          `                <span class="menu-price-variant-value">${escapeHtml(variant.price)}</span>`,
          '              </div>'
        ].join('\n')),
        '            </div>'
      ].join('\n')
    : `            <div class="${priceClass}">${priceValue}</div>`;

  return [
    `          <div class="${itemClass}">`,
    '            <div>',
      `              <div class="menu-item-name">${escapeHtml(item.name)}</div>${description}`,
    '            </div>',
    priceMarkup,
    '          </div>'
  ].join('\n');
}

function renderMenuListBlock(block) {
  const cardClass = block.id ? ` menu-card--${block.id}` : '';
  const subtitle = block.subtitle
    ? `        <span class="menu-card-badge">${escapeHtml(block.subtitle)}</span>\n`
    : '';
  const items = block.items.map(renderMenuListItem).join('\n');
  const footnotes = Array.isArray(block.footnotes) && block.footnotes.length > 0
    ? [
        '        <div class="menu-block-footnotes">',
        ...block.footnotes.map((note) => `          <p>${escapeHtml(note)}</p>`),
        '        </div>'
      ].join('\n')
    : '';

  return [
    `      <article class="carte-block menu-list-card${cardClass}">`,
    '        <div class="menu-list-head">',
    subtitle.trimEnd(),
    `          <h4>${escapeHtml(block.title)}</h4>`,
    block.description ? `          <p>${escapeHtml(block.description)}</p>` : '',
    '        </div>',
    '        <div class="menu-list-items">',
    items,
    '        </div>',
    footnotes,
    '      </article>'
  ].filter(Boolean).join('\n');
}

function renderBlock(block) {
  if (block.type === 'fixed-menu') return renderFixedMenuBlock(block);
  if (block.type === 'menu-list') return renderMenuListBlock(block);
  throw new Error(`Type de bloc inconnu: ${block.type}`);
}

function renderSectionBlocks(section) {
  if (section.layout !== 'stacks') {
    return [
      '        <div class="carte-block-grid">',
      section.blocks.map(renderBlock).join('\n'),
      '        </div>'
    ].join('\n');
  }

  const blockMap = new Map(section.blocks.map((block) => [block.id, block]));
  const referencedIds = new Set();

  const columns = section.columns.map((column, index) => {
    const renderedBlocks = column.map((blockId) => {
      const block = blockMap.get(blockId);
      if (!block) {
        throw new Error(`Bloc introuvable "${blockId}" dans la section "${section.id}"`);
      }
      referencedIds.add(blockId);
      return renderBlock(block);
    }).join('\n');

    return [
      `          <div class="carte-stack-column carte-stack-column--${index + 1}">`,
      renderedBlocks,
      '          </div>'
    ].join('\n');
  }).join('\n');

  const missingBlocks = section.blocks
    .filter((block) => block.id && !referencedIds.has(block.id))
    .map((block) => block.id);

  if (missingBlocks.length > 0) {
    throw new Error(`Blocs non places dans la section "${section.id}" : ${missingBlocks.join(', ')}`);
  }

  return [
    '        <div class="carte-block-grid carte-block-grid--stacks">',
    columns,
    '        </div>'
  ].join('\n');
}

function renderSection(section, index) {
  const headingId = `carte-heading-${section.id}`;
  const panelId = `carte-panel-${section.id}`;
  const toggleId = `carte-toggle-${section.id}`;
  const isInitiallyExpanded = index === 0 ? 'true' : 'false';
  const toggleActionLabel = index === 0 ? 'Masquer' : 'Afficher';
  const toggleText = index === 0 ? 'Masquer' : 'Voir';

  return [
    `      <section class="carte-group reveal" id="carte-${escapeHtml(section.id)}" data-collapsible="true">`,
    '        <div class="carte-group-head">',
    section.kicker ? `          <span class="carte-kicker">${escapeHtml(section.kicker)}</span>` : '',
    '          <div class="carte-group-title-row">',
    `            <h3 id="${headingId}">${escapeHtml(section.title)}</h3>`,
    `            <button class="carte-group-toggle" id="${toggleId}" type="button" aria-expanded="${isInitiallyExpanded}" aria-controls="${panelId}" aria-label="${toggleActionLabel} la section ${escapeHtml(section.title)}">`,
    `              <span class="carte-group-toggle-text">${toggleText}</span>`,
    '              <span class="carte-group-toggle-icon" aria-hidden="true"></span>',
    '            </button>',
    '          </div>',
    section.description ? `          <p>${escapeHtml(section.description)}</p>` : '',
    '        </div>',
    `        <div class="carte-group-panel" id="${panelId}" role="region" aria-labelledby="${headingId}">`,
    renderSectionBlocks(section),
    '        </div>',
    '      </section>'
  ].filter(Boolean).join('\n');
}

function renderMenuSection(menu) {
  const sortedSections = sortMenuSections(menu.sections);
  const navLinks = sortedSections
    .map((section) => `        <a href="#carte-${escapeHtml(section.id)}">${escapeHtml(section.navLabel || section.title)}</a>`)
    .join('\n');
  const sections = sortedSections.map(renderSection).join('\n\n');

  return [
    '  <section id="carte">',
    '    <div class="section-inner">',
    '      <div class="reveal">',
    `        <h2 class="section-title">${escapeHtml(menu._meta.sectionTitle)}</h2>`,
    `        <p class="section-subtitle">${escapeHtml(menu._meta.sectionSubtitle)}</p>`,
    '        <div class="wave-divider"></div>',
    '      </div>',
    '',
    '      <div class="carte-intro reveal">',
    `        <p>${escapeHtml(menu._meta.intro)}</p>`,
    '      </div>',
    '',
    '      <nav class="carte-nav reveal" aria-label="Navigation dans la carte">',
    navLinks,
    '      </nav>',
    '',
    sections,
    '',
    `      <p class="carte-note reveal">${escapeHtml(menu._meta.note)}</p>`,
    '    </div>',
    '  </section>'
  ].join('\n');
}

function buildFixedMenuSchemaItem(block) {
  const description = block.courses.map((course) => {
    const options = course.options
      .map((option) => joinParts([option.name, option.description], ' — '))
      .join(' | ');
    return `${course.title}: ${options}`;
  }).join(' / ');

  const item = {
    '@type': 'MenuItem',
    name: block.title,
    description: joinParts([block.subtitle, description], ' • ')
  };

  const price = parseSimplePrice(block.price);
  if (price) {
    item.offers = {
      '@type': 'Offer',
      price,
      priceCurrency: 'EUR'
    };
  }

  return item;
}

function buildMenuListSchemaItems(block) {
  return block.items.map((item) => {
    const schemaItem = {
      '@type': 'MenuItem',
      name: item.name
    };

    if (item.description) {
      schemaItem.description = item.description;
    }

    const price = parseSimplePrice(item.price);
    if (price) {
      schemaItem.offers = {
        '@type': 'Offer',
        price,
        priceCurrency: 'EUR'
      };
    } else if (Array.isArray(item.priceVariants) && item.priceVariants.length > 0) {
      const parsedVariantPrices = item.priceVariants
        .map((variant) => parseSimplePrice(variant.price))
        .filter(Boolean)
        .map(Number);

      if (parsedVariantPrices.length > 0) {
        schemaItem.offers = {
          '@type': 'AggregateOffer',
          lowPrice: String(Math.min(...parsedVariantPrices)),
          highPrice: String(Math.max(...parsedVariantPrices)),
          offerCount: String(parsedVariantPrices.length),
          priceCurrency: 'EUR'
        };
      }
    }

    return schemaItem;
  });
}

function buildMenuSchemaSections(menu) {
  return sortMenuSections(menu.sections).flatMap((section) => section.blocks.map((block) => {
    const schemaSection = {
      '@type': 'MenuSection',
      name: block.title
    };

    if (block.subtitle) schemaSection.description = block.subtitle;

    if (block.type === 'fixed-menu') {
      schemaSection.hasMenuItem = [buildFixedMenuSchemaItem(block)];
    } else if (block.type === 'menu-list') {
      schemaSection.hasMenuItem = buildMenuListSchemaItems(block);
    }

    return schemaSection;
  }));
}

function renderRestaurantSchema(menu) {
  const schema = {
    ...RESTAURANT_DATA,
    hasMenu: {
      '@type': 'Menu',
      name: `${menu._meta.sectionTitle} du Quai Ouest`,
      description: menu._meta.schemaDescription,
      hasMenuSection: buildMenuSchemaSections(menu)
    }
  };

  const json = JSON.stringify(schema, null, 2)
    .split('\n')
    .map((line) => `  ${line}`)
    .join('\n');

  return ['  <script type="application/ld+json">', json, '  </script>'].join('\n');
}

function main() {
  const menu = JSON.parse(fs.readFileSync(MENU_PATH, 'utf8'));
  const indexHtml = fs.readFileSync(INDEX_PATH, 'utf8');

  let nextHtml = replaceGeneratedBlock(
    indexHtml,
    RESTAURANT_SCHEMA_START,
    RESTAURANT_SCHEMA_END,
    renderRestaurantSchema(menu)
  );

  nextHtml = replaceGeneratedBlock(
    nextHtml,
    MENU_SECTION_START,
    MENU_SECTION_END,
    renderMenuSection(menu)
  );

  fs.writeFileSync(INDEX_PATH, nextHtml, 'utf8');
  console.log(`Carte regeneree depuis ${path.relative(ROOT, MENU_PATH)}.`);
}

main();
