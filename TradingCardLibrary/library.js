const STORAGE_KEY = 'cardLibraryCollection';

// DOM Elements
const cardsGrid = document.getElementById('cardsGrid');
const searchInput = document.getElementById('searchInput');
const typeFilter = document.getElementById('typeFilter');
const rarityFilter = document.getElementById('rarityFilter');
const sortSelect = document.getElementById('sortSelect');
const cardCount = document.getElementById('cardCount');
const cardModal = document.getElementById('cardModal');
const modalCardContainer = document.getElementById('modalCardContainer');
const closeModal = document.getElementById('closeModal');

// Card Collection
let allCards = [];
let filteredCards = [];

// Initialize
async function init() {
    setupEventListeners();
    await loadCardsFromFolder();
    loadCollection(); // Load from localStorage (merge with folder cards)
    updateFilters(); // Update filter dropdowns with loaded cards
    applyFilters(); // Initial render
}

// Load cards from cards folder
async function loadCardsFromFolder() {
    try {
        // Try to load cards-index.json
        const indexResponse = await fetch('cards-index.json');
        if (!indexResponse.ok) {
            console.error('cards-index.json nicht gefunden');
            return;
        }
        
        const cardFiles = await indexResponse.json();
        const loadedCards = [];
        
        // Load each card file
        for (const cardFile of cardFiles) {
            try {
                const cardResponse = await fetch(cardFile);
                if (cardResponse.ok) {
                    const cardData = await cardResponse.json();
                    if (validateCardData(cardData)) {
                        loadedCards.push(cardData);
                    }
                }
            } catch (error) {
                console.warn(`Fehler beim Laden von ${cardFile}:`, error);
            }
        }
        
        // Merge with existing cards (avoid duplicates by cardNumber)
        for (const loadedCard of loadedCards) {
            const existingIndex = allCards.findIndex(
                card => card.cardNumber === loadedCard.cardNumber
            );
            if (existingIndex >= 0) {
                // Update existing card
                allCards[existingIndex] = loadedCard;
            } else {
                // Add new card
                allCards.push(loadedCard);
            }
        }
        
        if (loadedCards.length > 0) {
            console.log(`${loadedCards.length} Karte(n) aus Ordner geladen`);
            saveCollection();
            updateFilters(); // Update filters after loading
        }
    } catch (error) {
        console.error('Fehler beim Laden der Karten aus dem Ordner:', error);
    }
}

// Load collection from localStorage
function loadCollection() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const storedCards = JSON.parse(stored);
            // Merge stored cards with folder cards (folder cards take priority)
            for (const storedCard of storedCards) {
                const existingIndex = allCards.findIndex(
                    card => card.cardNumber === storedCard.cardNumber
                );
                if (existingIndex < 0) {
                    // Only add if not already loaded from folder
                    allCards.push(storedCard);
                }
            }
        }
    } catch (error) {
        console.error('Fehler beim Laden der Sammlung:', error);
    }
}

// Save collection to localStorage
function saveCollection() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allCards));
    } catch (error) {
        console.error('Fehler beim Speichern der Sammlung:', error);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Filters
    searchInput.addEventListener('input', applyFilters);
    typeFilter.addEventListener('change', applyFilters);
    rarityFilter.addEventListener('change', applyFilters);
    sortSelect.addEventListener('change', applyFilters);

    // Modal
    closeModal.addEventListener('click', () => {
        cardModal.hidden = true;
    });

    modalCardContainer.addEventListener('click', (e) => {
        if (e.target === modalCardContainer || e.target.closest('.modal-overlay')) {
            cardModal.hidden = true;
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !cardModal.hidden) {
            cardModal.hidden = true;
        }
    });
}

// Validate card data structure
function validateCardData(data) {
    return data &&
        typeof data === 'object' &&
        typeof data.name === 'string' &&
        (typeof data.type === 'string' || data.type === undefined) &&
        (typeof data.hp === 'number' || typeof data.hp === 'string') &&
        (Array.isArray(data.attacks) || (data.attackMode === 'description' && data.description)) &&
        typeof data.cardNumber === 'string';
}

// Update filter dropdowns
function updateFilters() {
    console.log(`updateFilters aufgerufen. Anzahl Karten: ${allCards.length}`);
    
    // Get unique types
    const types = [...new Set(allCards.map(card => card.type).filter(Boolean))].sort();
    console.log('Gefundene Typen:', types);
    typeFilter.innerHTML = '<option value="">Alle Typen</option>' +
        types.map(type => `<option value="${type}">${type}</option>`).join('');

    // Get unique rarities
    const rarities = [...new Set(allCards.map(card => card.rarity).filter(Boolean))].sort();
    console.log('Gefundene Raritäten:', rarities);
    rarityFilter.innerHTML = '<option value="">Alle Raritäten</option>' +
        rarities.map(rarity => `<option value="${rarity}">${rarity}</option>`).join('');
}

// Apply filters and search
function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedType = typeFilter.value;
    const selectedRarity = rarityFilter.value;
    const sortBy = sortSelect.value;

    filteredCards = allCards.filter(card => {
        const matchesSearch = !searchTerm ||
            card.name.toLowerCase().includes(searchTerm) ||
            card.type.toLowerCase().includes(searchTerm) ||
            (card.rarity && card.rarity.toLowerCase().includes(searchTerm)) ||
            card.cardNumber.includes(searchTerm);

        const matchesType = !selectedType || card.type === selectedType;
        const matchesRarity = !selectedRarity || card.rarity === selectedRarity;

        return matchesSearch && matchesType && matchesRarity;
    });

    // Sort cards
    filteredCards.sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.name.localeCompare(b.name, 'de');
            case 'hp':
                const hpA = typeof a.hp === 'number' ? a.hp : parseInt(a.hp) || 0;
                const hpB = typeof b.hp === 'number' ? b.hp : parseInt(b.hp) || 0;
                return hpB - hpA;
            case 'type':
                return a.type.localeCompare(b.type, 'de') || a.name.localeCompare(b.name, 'de');
            case 'rarity':
                return (a.rarity || '').localeCompare(b.rarity || '', 'de');
            case 'number':
            default:
                return a.cardNumber.localeCompare(b.cardNumber);
        }
    });

    renderCards();
}

// Render cards grid
function renderCards() {
    if (filteredCards.length === 0) {
        cardsGrid.innerHTML = `
            <div class="empty-state">
                <h3>Keine Karten gefunden</h3>
                <p>Versuchen Sie andere Filter.</p>
            </div>
        `;
        cardCount.textContent = '0 Karten';
        return;
    }

    cardsGrid.innerHTML = filteredCards.map((card, index) => 
        createCardHTML(card, index)
    ).join('');

    // Add click listeners
    document.querySelectorAll('.card-wrapper').forEach(wrapper => {
        wrapper.addEventListener('click', () => {
            const index = parseInt(wrapper.dataset.index);
            showCardDetail(filteredCards[index]);
        });
    });

    cardCount.textContent = `${filteredCards.length} von ${allCards.length} Karten`;
}

// Helper function to normalize hex color (from CardBuilder)
function normalizeColor(color) {
    if (!color) return '';
    // Ensure color starts with #
    if (!color.startsWith('#')) {
        color = '#' + color;
    }
    // Validate hex color format
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(color)) {
        return '';
    }
    // Normalize to 6-digit hex
    if (color.length === 4) {
        color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
    }
    return color;
}

// Create card HTML with color styling
function createCardHTML(card, index) {
    const attack1 = card.attacks[0] || { name: '', damage: 0, description: '' };
    const attack2 = card.attacks[1] || { name: '', damage: 0, description: '' };

    // Normalize all colors from card data
    const cardNameColor = normalizeColor(card.cardNameColor);
    const typeTextColor = normalizeColor(card.typeTextColor);
    const typeBorderColor = normalizeColor(card.typeBorderColor);
    const hpLabelColor = normalizeColor(card.hpLabelColor);
    const hpValueColor = normalizeColor(card.hpValueColor);
    const borderColor = normalizeColor(card.borderColor);
    const innerColor = normalizeColor(card.innerColor);
    const rarityTextColor = normalizeColor(card.rarityTextColor);
    const rarityBorderColor = normalizeColor(card.rarityBorderColor);
    const cardNumberTextColor = normalizeColor(card.cardNumberTextColor);
    const cardNumberBorderColor = normalizeColor(card.cardNumberBorderColor);
    const footerTextColor = normalizeColor(card.footerTextColor);
    const atkNameColor = normalizeColor(card.atkNameColor);
    const atkDmgColor = normalizeColor(card.atkDmgColor);
    const atkDescColor = normalizeColor(card.atkDescColor);

    // Build inline styles with escaped values
    const cardStyle = [
        borderColor ? `border-color: ${escapeCssValue(borderColor)};` : '',
        innerColor ? `background-color: ${escapeCssValue(innerColor)};` : ''
    ].filter(Boolean).join(' ');

    const cardTopStyle = innerColor ? `background-color: ${escapeCssValue(innerColor)};` : '';
    const cardBodyStyle = innerColor ? `background-color: ${escapeCssValue(innerColor)};` : '';
    const cardFooterStyle = innerColor ? `background-color: ${escapeCssValue(innerColor)};` : '';
    
    const cardNameStyle = cardNameColor ? `color: ${escapeCssValue(cardNameColor)};` : '';
    const typePillStyle = [
        typeTextColor ? `color: ${escapeCssValue(typeTextColor)};` : '',
        typeBorderColor ? `border-color: ${escapeCssValue(typeBorderColor)};` : ''
    ].filter(Boolean).join(' ');
    
    const hpLabelStyle = hpLabelColor ? `color: ${escapeCssValue(hpLabelColor)};` : '';
    const hpValueStyle = hpValueColor ? `color: ${escapeCssValue(hpValueColor)};` : '';
    
    const footerTextStyle = footerTextColor ? `color: ${escapeCssValue(footerTextColor)};` : '';
    const rarityStyle = [
        rarityTextColor ? `color: ${escapeCssValue(rarityTextColor)};` : '',
        rarityBorderColor ? `border-color: ${escapeCssValue(rarityBorderColor)};` : ''
    ].filter(Boolean).join(' ');
    
    const cardNumberStyle = [
        cardNumberTextColor ? `color: ${escapeCssValue(cardNumberTextColor)};` : '',
        cardNumberBorderColor ? `border-color: ${escapeCssValue(cardNumberBorderColor)};` : ''
    ].filter(Boolean).join(' ');
    
    const attackNameStyle = atkNameColor ? `color: ${escapeCssValue(atkNameColor)};` : '';
    const attackDmgStyle = atkDmgColor ? `color: ${escapeCssValue(atkDmgColor)};` : '';
    const attackDescStyle = atkDescColor ? `color: ${escapeCssValue(atkDescColor)};` : '';
    
    // New fields
    const lineColor = normalizeColor(card.lineColor);
    const imageBgColor = normalizeColor(card.imageBgColor);
    const typeVisible = card.typeVisible !== false; // Default to true if not specified
    const hpVisible = card.hpVisible !== false; // Default to true if not specified
    const attackMode = card.attackMode || 'attacks';
    const description = card.description || {};
    const descTitleColor = normalizeColor(description.titleColor);
    const descTextColor = normalizeColor(description.textColor);
    
    // Line color style
    const lineColorStyle = lineColor ? `background-color: ${escapeCssValue(lineColor)};` : '';
    const borderBottomStyle = lineColor ? `border-bottom-color: ${escapeCssValue(lineColor)};` : '';
    const borderTopStyle = lineColor ? `border-top-color: ${escapeCssValue(lineColor)};` : '';
    
    // Image background color
    const cardHeroStyle = imageBgColor ? `background-color: ${escapeCssValue(imageBgColor)};` : '';
    
    // Description styles
    const descTitleStyle = descTitleColor ? `color: ${escapeCssValue(descTitleColor)};` : '';
    const descTextStyle = descTextColor ? `color: ${escapeCssValue(descTextColor)};` : '';
    
    // Build card body content based on attackMode
    let cardBodyContent = '';
    if (attackMode === 'description' && description) {
        // Description mode
        cardBodyContent = `
            <div class="attack">
                <div class="attack-line">
                    <span class="attack-name"${descTitleStyle ? ` style="${descTitleStyle}"` : attackNameStyle ? ` style="${attackNameStyle}"` : ''}>${escapeHtml(description.title || '—')}</span>
                </div>
                ${description.text ? `<div class="attack-desc"${descTextStyle ? ` style="${descTextStyle}"` : attackDescStyle ? ` style="${attackDescStyle}"` : ''} style="white-space: pre-wrap;">${escapeHtml(description.text)}</div>` : ''}
            </div>
        `;
    } else {
        // Attacks mode
        const attack1 = card.attacks && card.attacks[0] ? card.attacks[0] : { name: '', damage: 0, description: '', damageVisible: true, damageColor: '' };
        const attack2 = card.attacks && card.attacks[1] ? card.attacks[1] : { name: '', damage: 0, description: '', damageVisible: true, damageColor: '' };
        
        const atk1DmgColor = normalizeColor(attack1.damageColor);
        const atk2DmgColor = normalizeColor(attack2.damageColor);
        const atk1DmgStyle = atk1DmgColor ? `color: ${escapeCssValue(atk1DmgColor)};` : (attackDmgStyle || '');
        const atk2DmgStyle = atk2DmgColor ? `color: ${escapeCssValue(atk2DmgColor)};` : (attackDmgStyle || '');
        
        cardBodyContent = `
            <div class="attack">
                <div class="attack-line">
                    <span class="attack-name"${attackNameStyle ? ` style="${attackNameStyle}"` : ''}>${escapeHtml(attack1.name || '—')}</span>
                    ${attack1.damageVisible !== false ? `<span class="attack-dmg"${atk1DmgStyle ? ` style="${atk1DmgStyle}"` : ''}>${attack1.damage || 0}</span>` : ''}
                </div>
                ${attack1.description ? `<div class="attack-desc"${attackDescStyle ? ` style="${attackDescStyle}"` : ''}>${escapeHtml(attack1.description)}</div>` : ''}
            </div>
            <div class="divider"${lineColorStyle ? ` style="${lineColorStyle}"` : ''}></div>
            <div class="attack">
                <div class="attack-line">
                    <span class="attack-name"${attackNameStyle ? ` style="${attackNameStyle}"` : ''}>${escapeHtml(attack2.name || '—')}</span>
                    ${attack2.damageVisible !== false ? `<span class="attack-dmg"${atk2DmgStyle ? ` style="${atk2DmgStyle}"` : ''}>${attack2.damage || 0}</span>` : ''}
                </div>
                ${attack2.description ? `<div class="attack-desc"${attackDescStyle ? ` style="${attackDescStyle}"` : ''}>${escapeHtml(attack2.description)}</div>` : ''}
            </div>
        `;
    }

    return `
        <div class="card-wrapper" data-index="${index}">
            <div class="card"${cardStyle ? ` style="${cardStyle}"` : ''}>
                <div class="card-top"${cardTopStyle ? ` style="${cardTopStyle}"` : ''}${borderBottomStyle ? ` style="${cardTopStyle} ${borderBottomStyle}"` : borderBottomStyle ? ` style="${borderBottomStyle}"` : ''}>
                    <div class="card-name">
                        <span${cardNameStyle ? ` style="${cardNameStyle}"` : ''}>${escapeHtml(card.name || 'Unbenannt')}</span>
                        ${card.type && typeVisible ? `<span class="type-pill"${typePillStyle ? ` style="${typePillStyle}"` : ''}>${escapeHtml(card.type)}</span>` : ''}
                    </div>
                    ${hpVisible ? `<div class="card-hp">
                        <span class="hp-label"${hpLabelStyle ? ` style="${hpLabelStyle}"` : ''}>HP</span>
                        <span class="hp-value"${hpValueStyle ? ` style="${hpValueStyle}"` : ''}>${card.hp || 0}</span>
                    </div>` : '<div class="card-hp" style="visibility: hidden;"><span class="hp-label">HP</span><span class="hp-value">100</span></div>'}
                </div>
                <div class="card-hero"${cardHeroStyle ? ` style="${cardHeroStyle}"` : ''}${borderBottomStyle ? ` style="${cardHeroStyle} ${borderBottomStyle}"` : borderBottomStyle ? ` style="${borderBottomStyle}"` : ''}>
                    <img src="${card.coverDataUrl || '../CardBuilder/sample.png'}" alt="${escapeHtml(card.name)}" />
                </div>
                <div class="card-body"${cardBodyStyle ? ` style="${cardBodyStyle}"` : ''}>
                    ${cardBodyContent}
                </div>
                <div class="card-footer"${cardFooterStyle ? ` style="${cardFooterStyle}"` : ''}${borderTopStyle ? ` style="${cardFooterStyle} ${borderTopStyle}"` : borderTopStyle ? ` style="${borderTopStyle}"` : ''}>
                    <span${footerTextStyle ? ` style="${footerTextStyle}"` : ''}>${escapeHtml(card.footerNote || '')}</span>
                    <div class="footer-right">
                        ${card.rarity ? `<span class="rarity"${rarityStyle ? ` style="${rarityStyle}"` : ''}>${escapeHtml(card.rarity)}</span>` : ''}
                        <span class="card-number"${cardNumberStyle ? ` style="${cardNumberStyle}"` : ''}>${card.cardNumber || '#0000000000'}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Show card detail in modal
function showCardDetail(card) {
    modalCardContainer.innerHTML = createCardHTML(card, 0);
    cardModal.hidden = false;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Escape CSS value for safe inline style usage
function escapeCssValue(value) {
    // Colors are already validated by normalizeColor, but escape any special chars just in case
    return String(value).replace(/[<>\"'&]/g, '');
}

// Initialize on load
init();

