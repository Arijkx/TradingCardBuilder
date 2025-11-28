const el = (id) => document.getElementById(id);

const card = el('card');
const inputs = {
	name: el('cardName'),
	cardNameColor: el('cardNameColor'),
	cardNameColorHex: el('cardNameColorHex'),
	typeText: el('cardTypeText'),
	typeVisible: el('typeVisible'),
	typeTextColor: el('typeTextColor'),
	typeTextColorHex: el('typeTextColorHex'),
	typeBorderColor: el('typeBorderColor'),
	typeBorderColorHex: el('typeBorderColorHex'),
	hp: el('cardHp'),
	hpVisible: el('hpVisible'),
	hpLabelColor: el('hpLabelColor'),
	hpLabelColorHex: el('hpLabelColorHex'),
	hpValueColor: el('hpValueColor'),
	hpValueColorHex: el('hpValueColorHex'),
	cover: el('coverInput'),
	atk1Name: el('atk1Name'),
	atk1Dmg: el('atk1Dmg'),
	atk1DmgColor: el('atk1DmgColor'),
	atk1DmgColorHex: el('atk1DmgColorHex'),
	atk1DmgVisible: el('atk1DmgVisible'),
	atk1Desc: el('atk1Desc'),
	atk2Name: el('atk2Name'),
	atk2Dmg: el('atk2Dmg'),
	atk2DmgColor: el('atk2DmgColor'),
	atk2DmgColorHex: el('atk2DmgColorHex'),
	atk2DmgVisible: el('atk2DmgVisible'),
	atk2Desc: el('atk2Desc'),
	descTitle: el('descTitle'),
	descText: el('descText'),
	descTitleColor: el('descTitleColor'),
	descTitleColorHex: el('descTitleColorHex'),
	descTextColor: el('descTextColor'),
	descTextColorHex: el('descTextColorHex'),
    footer: el('footerNote'),
    rarity: el('rarity'),
    cardNumber: el('cardNumber'),
    borderColor: el('borderColor'),
    borderColorHex: el('borderColorHex'),
    lineColor: el('lineColor'),
    lineColorHex: el('lineColorHex'),
    innerColor: el('innerColor'),
    innerColorHex: el('innerColorHex'),
    imageBgColor: el('imageBgColor'),
    imageBgColorHex: el('imageBgColorHex'),
    rarityTextColor: el('rarityTextColor'),
    rarityBorderColor: el('rarityBorderColor'),
    cardNumberTextColor: el('cardNumberTextColor'),
    cardNumberBorderColor: el('cardNumberBorderColor'),
    footerTextColor: el('footerTextColor'),
    footerTextColorHex: el('footerTextColorHex'),
    rarityTextColorHex: el('rarityTextColorHex'),
    rarityBorderColorHex: el('rarityBorderColorHex'),
    cardNumberTextColorHex: el('cardNumberTextColorHex'),
    cardNumberBorderColorHex: el('cardNumberBorderColorHex'),
    atkNameColor: el('atkNameColor'),
    atkNameColorHex: el('atkNameColorHex'),
    atkDescColor: el('atkDescColor'),
    atkDescColorHex: el('atkDescColorHex')
};

const views = {
	name: el('viewName'),
	hp: el('viewHp'),
	cover: el('viewCover'),
	typeText: el('viewType'),
	atk1Name: el('viewAtk1Name'),
	atk1Dmg: el('viewAtk1Dmg'),
	atk1Desc: el('viewAtk1Desc'),
	atk2Name: el('viewAtk2Name'),
	atk2Dmg: el('viewAtk2Dmg'),
	atk2Desc: el('viewAtk2Desc'),
	attacksView: el('attacksView'),
	descriptionView: el('descriptionView'),
	descTitle: el('viewDescTitle'),
	descText: el('viewDescText'),
	footer: el('viewFooter'),
    rarity: el('viewRarity'),
    cardNumber: el('viewCardNumber')
};

function buildDownloadName(ext) {
    const num = (inputs.cardNumber?.value || '').replace(/\D/g, '').slice(0, 10).padStart(10, '0');
    const rawName = inputs.name?.value || 'card';
    const safeName = rawName.replace(/[^a-z0-9\- _]/gi, '').trim().replace(/\s+/g, '_');
    const base = `${num || '0000000000'}_${safeName || 'card'}`.toLowerCase();
    return `${base}.${ext}`;
}

// Persistence
const STORAGE_KEY = 'cardBuilderState';
function collectState() {
    const digits = (inputs.cardNumber?.value || '').replace(/\D/g, '').slice(0, 10).padStart(10, '0');
    return {
        name: inputs.name?.value || '',
        cardNameColor: inputs.cardNameColor?.value || '',
        type: inputs.typeText?.value || '',
        typeVisible: inputs.typeVisible?.checked !== false,
        typeTextColor: inputs.typeTextColor?.value || '',
        typeBorderColor: inputs.typeBorderColor?.value || '',
        hp: inputs.hp?.value || '',
        hpVisible: inputs.hpVisible?.checked !== false,
        hpLabelColor: inputs.hpLabelColor?.value || '',
        hpValueColor: inputs.hpValueColor?.value || '',
        coverDataUrl: views.cover?.src || '',
        attackMode: document.querySelector('[data-tab="attacks"]')?.classList.contains('active') ? 'attacks' : 'description',
        attacks: [
            { name: inputs.atk1Name?.value || '', damage: inputs.atk1Dmg?.value || '', description: inputs.atk1Desc?.value || '', damageVisible: inputs.atk1DmgVisible?.checked !== false, damageColor: inputs.atk1DmgColor?.value || '' },
            { name: inputs.atk2Name?.value || '', damage: inputs.atk2Dmg?.value || '', description: inputs.atk2Desc?.value || '', damageVisible: inputs.atk2DmgVisible?.checked !== false, damageColor: inputs.atk2DmgColor?.value || '' }
        ],
        description: {
            title: inputs.descTitle?.value || '',
            text: inputs.descText?.value || '',
            titleColor: inputs.descTitleColor?.value || '',
            textColor: inputs.descTextColor?.value || ''
        },
        footerNote: inputs.footer?.value || '',
        rarity: inputs.rarity?.value || '',
        cardNumber: `#${digits}`,
        borderColor: inputs.borderColor?.value || '',
        lineColor: inputs.lineColor?.value || '',
        innerColor: inputs.innerColor?.value || '',
        imageBgColor: inputs.imageBgColor?.value || '',
        rarityTextColor: inputs.rarityTextColor?.value || '',
        rarityBorderColor: inputs.rarityBorderColor?.value || '',
        cardNumberTextColor: inputs.cardNumberTextColor?.value || '',
        cardNumberBorderColor: inputs.cardNumberBorderColor?.value || '',
        footerTextColor: inputs.footerTextColor?.value || '',
        atkNameColor: inputs.atkNameColor?.value || '',
        atkDmgColor: inputs.atkDmgColor?.value || '',
        atkDescColor: inputs.atkDescColor?.value || ''
    };
}
function saveState() {
    try { 
        const state = collectState();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); 
        console.log('State saved to localStorage:', state);
    } catch (e) {
        console.error('Error saving state:', e);
    }
}
function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            // No saved state, initialize with defaults
            initializeDefaults();
            return;
        }
        const data = JSON.parse(raw);
        console.log('Loading state from localStorage:', data);
        if (inputs.name) inputs.name.value = data.name || '';
        if (data.cardNameColor) {
            setCardNameColor(data.cardNameColor);
        } else if (inputs.cardNameColor) {
            setCardNameColor('#c9d1d9');
        }
        if (inputs.typeText) inputs.typeText.value = data.type || '';
        if (inputs.typeVisible) inputs.typeVisible.checked = data.typeVisible !== false;
        if (data.typeTextColor) {
            setTypeTextColor(data.typeTextColor);
        } else if (inputs.typeTextColor) {
            setTypeTextColor('#8b949e');
        }
        if (data.typeBorderColor) {
            setTypeBorderColor(data.typeBorderColor);
        } else if (inputs.typeBorderColor) {
            setTypeBorderColor('#30363d');
        }
        if (inputs.hp) inputs.hp.value = String(data.hp ?? '');
        if (inputs.hpVisible) inputs.hpVisible.checked = data.hpVisible !== false;
        if (data.hpLabelColor) {
            setHpLabelColor(data.hpLabelColor);
        } else if (inputs.hpLabelColor) {
            setHpLabelColor('#8b949e');
        }
        if (data.hpValueColor) {
            setHpValueColor(data.hpValueColor);
        } else if (inputs.hpValueColor) {
            setHpValueColor('#58a6ff');
        }
        if (inputs.atk1Name) inputs.atk1Name.value = data.attacks?.[0]?.name || '';
        if (inputs.atk1Dmg) inputs.atk1Dmg.value = String(data.attacks?.[0]?.damage || '');
        if (inputs.atk1Desc) inputs.atk1Desc.value = data.attacks?.[0]?.description || '';
        if (inputs.atk1DmgVisible) inputs.atk1DmgVisible.checked = data.attacks?.[0]?.damageVisible !== false;
        if (inputs.atk1DmgColor) {
            if (data.attacks?.[0]?.damageColor) {
                setAttack1DmgColor(data.attacks[0].damageColor);
            } else if (data.atkDmgColor) {
                // Fallback to old shared color if individual color not set
                setAttack1DmgColor(data.atkDmgColor);
            } else {
                setAttack1DmgColor('#f85149');
            }
        }
        if (inputs.atk2Name) inputs.atk2Name.value = data.attacks?.[1]?.name || '';
        if (inputs.atk2Dmg) inputs.atk2Dmg.value = String(data.attacks?.[1]?.damage || '');
        if (inputs.atk2Desc) inputs.atk2Desc.value = data.attacks?.[1]?.description || '';
        if (inputs.atk2DmgVisible) inputs.atk2DmgVisible.checked = data.attacks?.[1]?.damageVisible !== false;
        if (inputs.atk2DmgColor) {
            if (data.attacks?.[1]?.damageColor) {
                setAttack2DmgColor(data.attacks[1].damageColor);
            } else if (data.atkDmgColor) {
                // Fallback to old shared color if individual color not set
                setAttack2DmgColor(data.atkDmgColor);
            } else {
                setAttack2DmgColor('#f85149');
            }
        }
        if (inputs.footer) inputs.footer.value = data.footerNote || '';
        if (inputs.rarity) inputs.rarity.value = data.rarity || '';
        if (inputs.cardNumber) inputs.cardNumber.value = (data.cardNumber || '').replace(/[^0-9]/g, '').slice(0, 10);
        if (data.borderColor) {
            setBorderColor(data.borderColor);
        } else if (inputs.borderColor) {
            setBorderColor('#30363d');
        }
        if (data.lineColor) {
            setLineColor(data.lineColor);
        } else if (inputs.lineColor) {
            setLineColor('#30363d');
        }
        if (data.innerColor) {
            setInnerColor(data.innerColor);
        } else if (inputs.innerColor) {
            setInnerColor('#000000');
        }
        if (data.imageBgColor) {
            setImageBgColor(data.imageBgColor);
        } else if (inputs.imageBgColor) {
            setImageBgColor('#0b0f14');
        }
        if (data.rarityTextColor) {
            setRarityTextColor(data.rarityTextColor);
        } else if (inputs.rarityTextColor) {
            setRarityTextColor('#c9d1d9');
        }
        if (data.rarityBorderColor) {
            setRarityBorderColor(data.rarityBorderColor);
        } else if (inputs.rarityBorderColor) {
            setRarityBorderColor('#30363d');
        }
        if (data.cardNumberTextColor) {
            setCardNumberTextColor(data.cardNumberTextColor);
        } else if (inputs.cardNumberTextColor) {
            setCardNumberTextColor('#c9d1d9');
        }
        if (data.cardNumberBorderColor) {
            setCardNumberBorderColor(data.cardNumberBorderColor);
        } else if (inputs.cardNumberBorderColor) {
            setCardNumberBorderColor('#30363d');
        }
        if (data.footerTextColor) {
            setFooterTextColor(data.footerTextColor);
        } else if (inputs.footerTextColor) {
            setFooterTextColor('#8b949e');
        }
        if (data.atkNameColor) {
            setAttackNameColor(data.atkNameColor);
        } else if (inputs.atkNameColor) {
            setAttackNameColor('#c9d1d9');
        }
        if (data.atkDmgColor) {
            setAttackDmgColor(data.atkDmgColor);
        } else if (inputs.atkDmgColor) {
            setAttackDmgColor('#f85149');
        }
        if (data.atkDescColor) {
            setAttackDescColor(data.atkDescColor);
        } else if (inputs.atkDescColor) {
            setAttackDescColor('#8b949e');
        }
        
        // Load attack mode and description
        if (data.attackMode === 'description') {
            switchTab('description');
        } else {
            switchTab('attacks');
        }
        if (data.description) {
            if (inputs.descTitle) inputs.descTitle.value = data.description.title || '';
            if (inputs.descText) inputs.descText.value = data.description.text || '';
            if (data.description.titleColor) {
                setDescTitleColor(data.description.titleColor);
            } else if (inputs.descTitleColor) {
                setDescTitleColor('#c9d1d9');
            }
            if (data.description.textColor) {
                setDescTextColor(data.description.textColor);
            } else if (inputs.descTextColor) {
                setDescTextColor('#8b949e');
            }
            if (views.descTitle) views.descTitle.textContent = data.description.title || 'Special Ability';
            if (views.descText) views.descText.textContent = data.description.text || 'Enter description text here...';
        }
        
        if (data.coverDataUrl) {
            views.cover.src = data.coverDataUrl;
            console.log('Cover image loaded from localStorage');
        }
        // trigger to update view
        inputs.name?.dispatchEvent(new Event('input'));
        inputs.typeText?.dispatchEvent(new Event('input'));
        inputs.hp?.dispatchEvent(new Event('input'));
        inputs.atk1Name?.dispatchEvent(new Event('input'));
        inputs.atk1Dmg?.dispatchEvent(new Event('input'));
        inputs.atk1Desc?.dispatchEvent(new Event('input'));
        inputs.atk2Name?.dispatchEvent(new Event('input'));
        inputs.atk2Dmg?.dispatchEvent(new Event('input'));
        inputs.atk2Desc?.dispatchEvent(new Event('input'));
        inputs.footer?.dispatchEvent(new Event('input'));
        inputs.rarity?.dispatchEvent(new Event('input'));
        inputs.cardNumber?.dispatchEvent(new Event('input'));
        inputs.borderColor?.dispatchEvent(new Event('input'));
        inputs.lineColor?.dispatchEvent(new Event('input'));
        inputs.innerColor?.dispatchEvent(new Event('input'));
        // Update visibility
        updateTypeVisibility();
        updateHpVisibility();
        updateDamageVisibility(1);
        updateDamageVisibility(2);
    } catch {}
}

// Initialize default values when no saved state exists
function initializeDefaults() {
    if (views.name && inputs.cardNameColor) {
        setCardNameColor(inputs.cardNameColor.value || defaultCardNameColor);
    }
    if (views.typeText && inputs.typeTextColor && inputs.typeBorderColor) {
        setTypeTextColor(inputs.typeTextColor.value || defaultTypeTextColor);
        setTypeBorderColor(inputs.typeBorderColor.value || defaultTypeBorderColor);
    }
    if (inputs.hpLabelColor && inputs.hpValueColor) {
        setHpLabelColor(inputs.hpLabelColor.value || defaultHpLabelColor);
        setHpValueColor(inputs.hpValueColor.value || defaultHpValueColor);
    }
    if (card && inputs.borderColor) {
        setBorderColor(inputs.borderColor.value || defaultBorderColor);
    }
    if (card && inputs.lineColor) {
        setLineColor(inputs.lineColor.value || defaultLineColor);
    }
    if (card && inputs.innerColor) {
        setInnerColor(inputs.innerColor.value || defaultInnerColor);
    }
    if (card && inputs.imageBgColor) {
        setImageBgColor(inputs.imageBgColor.value || defaultImageBgColor);
    }
    // Initialize other colors if needed (they have defaults in loadState)
    if (inputs.rarityTextColor) {
        setRarityTextColor(inputs.rarityTextColor.value || '#c9d1d9');
    }
    if (inputs.rarityBorderColor) {
        setRarityBorderColor(inputs.rarityBorderColor.value || '#30363d');
    }
    if (inputs.cardNumberTextColor) {
        setCardNumberTextColor(inputs.cardNumberTextColor.value || '#c9d1d9');
    }
    if (inputs.cardNumberBorderColor) {
        setCardNumberBorderColor(inputs.cardNumberBorderColor.value || '#30363d');
    }
    if (views.footer && inputs.footerTextColor) {
        setFooterTextColor(inputs.footerTextColor.value || '#8b949e');
    }
    if (inputs.atkNameColor) {
        setAttackNameColor(inputs.atkNameColor.value || '#c9d1d9');
    }
    if (inputs.atk1DmgColor) {
        setAttack1DmgColor(inputs.atk1DmgColor.value || '#f85149');
    }
    if (inputs.atk2DmgColor) {
        setAttack2DmgColor(inputs.atk2DmgColor.value || '#f85149');
    }
    if (inputs.atkDescColor) {
        setAttackDescColor(inputs.atkDescColor.value || '#8b949e');
    }
}

// Bind text/number inputs to preview
function bindLive(input, view, transform = (v) => v) {
    input.addEventListener('input', () => {
        const value = input.type === 'number' ? (input.value || '') : input.value;
        view.textContent = transform(value);
        saveState();
    });
}

bindLive(inputs.name, views.name, (v) => v || 'Octocat');

// Card name color setting
function setCardNameColor(color) {
    if (!color) return;
    if (!color.startsWith('#')) {
        color = '#' + color;
    }
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(color)) {
        return false;
    }
    if (color.length === 4) {
        color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
    }
    if (views.name) {
        views.name.style.color = color;
    }
    if (inputs.cardNameColor) {
        inputs.cardNameColor.value = color;
    }
    if (inputs.cardNameColorHex) {
        inputs.cardNameColorHex.value = color.toUpperCase();
    }
    saveState();
    return true;
}

if (inputs.cardNameColor) {
    inputs.cardNameColor.addEventListener('input', () => {
        if (inputs.cardNameColor.value) {
            setCardNameColor(inputs.cardNameColor.value);
        }
    });
}

if (inputs.cardNameColorHex) {
    inputs.cardNameColorHex.addEventListener('input', () => {
        const value = inputs.cardNameColorHex.value.trim();
        if (value) {
            setCardNameColor(value);
        }
    });
    inputs.cardNameColorHex.addEventListener('blur', () => {
        if (inputs.cardNameColor && inputs.cardNameColor.value) {
            inputs.cardNameColorHex.value = inputs.cardNameColor.value.toUpperCase();
        }
        saveState();
    });
}

// Initialize card name color (only if not loaded from state)
const defaultCardNameColor = '#c9d1d9';

// Type color settings (text and border)
function setTypeTextColor(color) {
    if (!color) return;
    if (!color.startsWith('#')) {
        color = '#' + color;
    }
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(color)) {
        return false;
    }
    if (color.length === 4) {
        color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
    }
    const typeEl = views.typeText;
    if (typeEl) {
        typeEl.style.color = color;
    }
    if (inputs.typeTextColor) {
        inputs.typeTextColor.value = color;
    }
    if (inputs.typeTextColorHex) {
        inputs.typeTextColorHex.value = color.toUpperCase();
    }
    saveState();
    return true;
}

function setTypeBorderColor(color) {
    if (!color) return;
    if (!color.startsWith('#')) {
        color = '#' + color;
    }
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(color)) {
        return false;
    }
    if (color.length === 4) {
        color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
    }
    const typeEl = views.typeText;
    if (typeEl) {
        typeEl.style.borderColor = color;
    }
    if (inputs.typeBorderColor) {
        inputs.typeBorderColor.value = color;
    }
    if (inputs.typeBorderColorHex) {
        inputs.typeBorderColorHex.value = color.toUpperCase();
    }
    saveState();
    return true;
}

if (inputs.typeTextColor) {
    inputs.typeTextColor.addEventListener('input', () => {
        if (inputs.typeTextColor.value) {
            setTypeTextColor(inputs.typeTextColor.value);
        }
    });
}

if (inputs.typeTextColorHex) {
    inputs.typeTextColorHex.addEventListener('input', () => {
        const value = inputs.typeTextColorHex.value.trim();
        if (value) {
            setTypeTextColor(value);
        }
    });
    inputs.typeTextColorHex.addEventListener('blur', () => {
        if (inputs.typeTextColor && inputs.typeTextColor.value) {
            inputs.typeTextColorHex.value = inputs.typeTextColor.value.toUpperCase();
        }
        saveState();
    });
}

if (inputs.typeBorderColor) {
    inputs.typeBorderColor.addEventListener('input', () => {
        if (inputs.typeBorderColor.value) {
            setTypeBorderColor(inputs.typeBorderColor.value);
        }
    });
}

if (inputs.typeBorderColorHex) {
    inputs.typeBorderColorHex.addEventListener('input', () => {
        const value = inputs.typeBorderColorHex.value.trim();
        if (value) {
            setTypeBorderColor(value);
        }
    });
    inputs.typeBorderColorHex.addEventListener('blur', () => {
        if (inputs.typeBorderColor && inputs.typeBorderColor.value) {
            inputs.typeBorderColorHex.value = inputs.typeBorderColor.value.toUpperCase();
        }
        saveState();
    });
}

// Initialize type colors (only if not loaded from state)
const defaultTypeTextColor = '#8b949e';
const defaultTypeBorderColor = '#30363d';

// HP color settings (label and value)
function setHpLabelColor(color) {
    if (!color) return;
    if (!color.startsWith('#')) {
        color = '#' + color;
    }
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(color)) {
        return false;
    }
    if (color.length === 4) {
        color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
    }
    const hpLabelEl = card?.querySelector('.hp-label');
    if (hpLabelEl) {
        hpLabelEl.style.color = color;
    }
    if (inputs.hpLabelColor) {
        inputs.hpLabelColor.value = color;
    }
    if (inputs.hpLabelColorHex) {
        inputs.hpLabelColorHex.value = color.toUpperCase();
    }
    saveState();
    return true;
}

function setHpValueColor(color) {
    if (!color) return;
    if (!color.startsWith('#')) {
        color = '#' + color;
    }
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(color)) {
        return false;
    }
    if (color.length === 4) {
        color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
    }
    const hpValueEl = views.hp;
    if (hpValueEl) {
        hpValueEl.style.color = color;
    }
    if (inputs.hpValueColor) {
        inputs.hpValueColor.value = color;
    }
    if (inputs.hpValueColorHex) {
        inputs.hpValueColorHex.value = color.toUpperCase();
    }
    saveState();
    return true;
}

if (inputs.hpLabelColor) {
    inputs.hpLabelColor.addEventListener('input', () => {
        if (inputs.hpLabelColor.value) {
            setHpLabelColor(inputs.hpLabelColor.value);
        }
    });
}

if (inputs.hpLabelColorHex) {
    inputs.hpLabelColorHex.addEventListener('input', () => {
        const value = inputs.hpLabelColorHex.value.trim();
        if (value) {
            setHpLabelColor(value);
        }
    });
    inputs.hpLabelColorHex.addEventListener('blur', () => {
        if (inputs.hpLabelColor && inputs.hpLabelColor.value) {
            inputs.hpLabelColorHex.value = inputs.hpLabelColor.value.toUpperCase();
        }
        saveState();
    });
}

if (inputs.hpValueColor) {
    inputs.hpValueColor.addEventListener('input', () => {
        if (inputs.hpValueColor.value) {
            setHpValueColor(inputs.hpValueColor.value);
        }
    });
}

if (inputs.hpValueColorHex) {
    inputs.hpValueColorHex.addEventListener('input', () => {
        const value = inputs.hpValueColorHex.value.trim();
        if (value) {
            setHpValueColor(value);
        }
    });
    inputs.hpValueColorHex.addEventListener('blur', () => {
        if (inputs.hpValueColor && inputs.hpValueColor.value) {
            inputs.hpValueColorHex.value = inputs.hpValueColor.value.toUpperCase();
        }
        saveState();
    });
}

// Initialize HP colors (only if not loaded from state)
const defaultHpLabelColor = '#8b949e';
const defaultHpValueColor = '#58a6ff';

bindLive(inputs.hp, views.hp, (v) => v || '100');
bindLive(inputs.typeText, views.typeText, (v) => v || 'Electric');
bindLive(inputs.atk1Name, views.atk1Name, (v) => v || 'Commit');
bindLive(inputs.atk1Dmg, views.atk1Dmg, (v) => v || '30');
bindLive(inputs.atk1Desc, views.atk1Desc, (v) => v || 'Adds additional damage per open issue');
bindLive(inputs.atk2Name, views.atk2Name, (v) => v || 'Merge');
bindLive(inputs.atk2Dmg, views.atk2Dmg, (v) => v || '90');
bindLive(inputs.atk2Desc, views.atk2Desc, (v) => v || 'Heals all status problems when CI is green');

// Description fields
bindLive(inputs.descTitle, views.descTitle, (v) => v || 'Special Ability');
if (inputs.descText && views.descText) {
    inputs.descText.addEventListener('input', () => {
        views.descText.textContent = inputs.descText.value || 'Enter description text here...';
        saveState();
    });
}

// Function to update damage visibility
function updateDamageVisibility(attackNumber) {
    const checkbox = attackNumber === 1 ? inputs.atk1DmgVisible : inputs.atk2DmgVisible;
    const damageView = attackNumber === 1 ? views.atk1Dmg : views.atk2Dmg;
    
    if (checkbox && damageView) {
        damageView.style.display = checkbox.checked ? '' : 'none';
    }
}

// Function to update type visibility
function updateTypeVisibility() {
    const checkbox = inputs.typeVisible;
    const typeView = views.typeText;
    
    if (checkbox && typeView) {
        typeView.style.display = checkbox.checked ? '' : 'none';
    }
}

// Function to update HP visibility
function updateHpVisibility() {
    const checkbox = inputs.hpVisible;
    const hpContainer = card?.querySelector('.card-hp');
    
    if (checkbox && hpContainer) {
        // Use visibility instead of display to maintain layout space
        hpContainer.style.visibility = checkbox.checked ? 'visible' : 'hidden';
    }
}

// Event listeners for damage visibility toggles
if (inputs.atk1DmgVisible) {
    inputs.atk1DmgVisible.addEventListener('change', () => {
        updateDamageVisibility(1);
        saveState();
    });
}

if (inputs.atk2DmgVisible) {
    inputs.atk2DmgVisible.addEventListener('change', () => {
        updateDamageVisibility(2);
        saveState();
    });
}

// Event listeners for type and HP visibility toggles
if (inputs.typeVisible) {
    inputs.typeVisible.addEventListener('change', () => {
        updateTypeVisibility();
        saveState();
    });
}

if (inputs.hpVisible) {
    inputs.hpVisible.addEventListener('change', () => {
        updateHpVisibility();
        saveState();
    });
}
bindLive(inputs.footer, views.footer, (v) => v || 'Tranding Card · 2025');
bindLive(inputs.rarity, views.rarity, (v) => v || 'Rare ★');
inputs.cardNumber && inputs.cardNumber.addEventListener('input', () => {
    const digits = (inputs.cardNumber.value || '').replace(/\D/g, '').slice(0, 10);
    const padded = (digits || '').padStart(10, '0');
    views.cardNumber.textContent = `#${padded}`;
    saveState();
});
// initialize
if (inputs.cardNumber) {
    const digits = (inputs.cardNumber.value || '').replace(/\D/g, '').slice(0, 10);
    const padded = (digits || '').padStart(10, '0');
    views.cardNumber.textContent = `#${padded || '0000000000'}`;
}

// Border color setting with hex code support
function setBorderColor(color) {
    if (!color) return;
    // Ensure color starts with #
    if (!color.startsWith('#')) {
        color = '#' + color;
    }
    // Validate hex color format
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(color)) {
        return false;
    }
    // Normalize to 6-digit hex
    if (color.length === 4) {
        color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
    }
    if (card) {
        card.style.borderColor = color;
    }
    if (inputs.borderColor) {
        inputs.borderColor.value = color;
    }
    if (inputs.borderColorHex) {
        inputs.borderColorHex.value = color.toUpperCase();
    }
    saveState();
    return true;
}

if (inputs.borderColor) {
    inputs.borderColor.addEventListener('input', () => {
        if (inputs.borderColor.value) {
            setBorderColor(inputs.borderColor.value);
        }
    });
}

if (inputs.borderColorHex) {
    inputs.borderColorHex.addEventListener('input', () => {
        const value = inputs.borderColorHex.value.trim();
        if (value) {
            setBorderColor(value);
        }
    });
    inputs.borderColorHex.addEventListener('blur', () => {
        // Ensure hex field shows current color value on blur
        if (inputs.borderColor && inputs.borderColor.value) {
            inputs.borderColorHex.value = inputs.borderColor.value.toUpperCase();
        }
        saveState();
    });
}

// Initialize border color (only if not loaded from state)
const defaultBorderColor = '#30363d';

// Line color setting (for all internal lines on the card)
function setLineColor(color) {
    if (!color) return;
    // Ensure color starts with #
    if (!color.startsWith('#')) {
        color = '#' + color;
    }
    // Validate hex color format
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(color)) {
        return false;
    }
    // Normalize to 6-digit hex
    if (color.length === 4) {
        color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
    }
    // Apply to all internal lines: card-top border-bottom, card-hero border-bottom, card-footer border-top, divider
    const cardTop = card?.querySelector('.card-top');
    const cardHero = card?.querySelector('.card-hero');
    const cardFooter = card?.querySelector('.card-footer');
    const divider = card?.querySelector('.divider');
    
    if (cardTop) cardTop.style.borderBottomColor = color;
    if (cardHero) cardHero.style.borderBottomColor = color;
    if (cardFooter) cardFooter.style.borderTopColor = color;
    if (divider) divider.style.backgroundColor = color;
    
    if (inputs.lineColor) {
        inputs.lineColor.value = color;
    }
    if (inputs.lineColorHex) {
        inputs.lineColorHex.value = color.toUpperCase();
    }
    saveState();
    return true;
}

if (inputs.lineColor) {
    inputs.lineColor.addEventListener('input', () => {
        if (inputs.lineColor.value) {
            setLineColor(inputs.lineColor.value);
        }
    });
}

if (inputs.lineColorHex) {
    inputs.lineColorHex.addEventListener('input', () => {
        const value = inputs.lineColorHex.value.trim();
        if (value) {
            setLineColor(value);
        }
    });
    inputs.lineColorHex.addEventListener('blur', () => {
        // Ensure hex field shows current color value on blur
        if (inputs.lineColor && inputs.lineColor.value) {
            inputs.lineColorHex.value = inputs.lineColor.value.toUpperCase();
        }
        saveState();
    });
}

// Initialize line color (only if not loaded from state)
const defaultLineColor = '#30363d';

// Inner color setting (card-top, card-body, card-footer)
function setInnerColor(color) {
    if (!color) return;
    // Ensure color starts with #
    if (!color.startsWith('#')) {
        color = '#' + color;
    }
    // Validate hex color format
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(color)) {
        return false;
    }
    // Normalize to 6-digit hex
    if (color.length === 4) {
        color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
    }
    // Apply to card, card-top, card-body, and card-footer
    if (card) card.style.backgroundColor = color;
    const cardTop = card?.querySelector('.card-top');
    const cardBody = card?.querySelector('.card-body');
    const cardFooter = card?.querySelector('.card-footer');
    if (cardTop) cardTop.style.backgroundColor = color;
    if (cardBody) cardBody.style.backgroundColor = color;
    if (cardFooter) cardFooter.style.backgroundColor = color;
    
    if (inputs.innerColor) {
        inputs.innerColor.value = color;
    }
    if (inputs.innerColorHex) {
        inputs.innerColorHex.value = color.toUpperCase();
    }
    saveState();
    return true;
}

if (inputs.innerColor) {
    inputs.innerColor.addEventListener('input', () => {
        if (inputs.innerColor.value) {
            setInnerColor(inputs.innerColor.value);
        }
    });
}

if (inputs.innerColorHex) {
    inputs.innerColorHex.addEventListener('input', () => {
        const value = inputs.innerColorHex.value.trim();
        if (value) {
            setInnerColor(value);
        }
    });
    inputs.innerColorHex.addEventListener('blur', () => {
        // Ensure hex field shows current color value on blur
        if (inputs.innerColor && inputs.innerColor.value) {
            inputs.innerColorHex.value = inputs.innerColor.value.toUpperCase();
        }
        saveState();
    });
}

function setImageBgColor(color) {
    if (!color) return;
    if (!color.startsWith('#')) {
        color = '#' + color;
    }
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(color)) {
        return false;
    }
    if (color.length === 4) {
        color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
    }
    const cardHero = card?.querySelector('.card-hero');
    if (cardHero) {
        cardHero.style.backgroundColor = color;
    }
    if (inputs.imageBgColor) {
        inputs.imageBgColor.value = color;
    }
    if (inputs.imageBgColorHex) {
        inputs.imageBgColorHex.value = color.toUpperCase();
    }
    saveState();
    return true;
}

if (inputs.imageBgColor) {
    inputs.imageBgColor.addEventListener('input', () => {
        if (inputs.imageBgColor.value) {
            setImageBgColor(inputs.imageBgColor.value);
        }
    });
}

if (inputs.imageBgColorHex) {
    inputs.imageBgColorHex.addEventListener('input', () => {
        const value = inputs.imageBgColorHex.value.trim();
        if (value) {
            setImageBgColor(value);
        }
    });
    inputs.imageBgColorHex.addEventListener('blur', () => {
        if (inputs.imageBgColor && inputs.imageBgColor.value) {
            inputs.imageBgColorHex.value = inputs.imageBgColor.value.toUpperCase();
        }
        saveState();
    });
}

// Initialize inner color (only if not loaded from state)
const defaultInnerColor = '#000000';
const defaultImageBgColor = '#0b0f14';

// Rarity color settings (text and border)
function setRarityTextColor(color) {
    if (!color) return;
    if (!color.startsWith('#')) {
        color = '#' + color;
    }
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(color)) {
        return false;
    }
    if (color.length === 4) {
        color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
    }
    const rarityEl = views.rarity;
    if (rarityEl) {
        rarityEl.style.color = color;
    }
    if (inputs.rarityTextColor) {
        inputs.rarityTextColor.value = color;
    }
    if (inputs.rarityTextColorHex) {
        inputs.rarityTextColorHex.value = color.toUpperCase();
    }
    saveState();
    return true;
}

function setRarityBorderColor(color) {
    if (!color) return;
    if (!color.startsWith('#')) {
        color = '#' + color;
    }
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(color)) {
        return false;
    }
    if (color.length === 4) {
        color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
    }
    const rarityEl = views.rarity;
    if (rarityEl) {
        rarityEl.style.borderColor = color;
    }
    if (inputs.rarityBorderColor) {
        inputs.rarityBorderColor.value = color;
    }
    if (inputs.rarityBorderColorHex) {
        inputs.rarityBorderColorHex.value = color.toUpperCase();
    }
    saveState();
    return true;
}

if (inputs.rarityTextColor) {
    inputs.rarityTextColor.addEventListener('input', () => {
        if (inputs.rarityTextColor.value) {
            setRarityTextColor(inputs.rarityTextColor.value);
        }
    });
}

if (inputs.rarityTextColorHex) {
    inputs.rarityTextColorHex.addEventListener('input', () => {
        const value = inputs.rarityTextColorHex.value.trim();
        if (value) {
            setRarityTextColor(value);
        }
    });
    inputs.rarityTextColorHex.addEventListener('blur', () => {
        if (inputs.rarityTextColor && inputs.rarityTextColor.value) {
            inputs.rarityTextColorHex.value = inputs.rarityTextColor.value.toUpperCase();
        }
        saveState();
    });
}

if (inputs.rarityBorderColor) {
    inputs.rarityBorderColor.addEventListener('input', () => {
        if (inputs.rarityBorderColor.value) {
            setRarityBorderColor(inputs.rarityBorderColor.value);
        }
    });
}

if (inputs.rarityBorderColorHex) {
    inputs.rarityBorderColorHex.addEventListener('input', () => {
        const value = inputs.rarityBorderColorHex.value.trim();
        if (value) {
            setRarityBorderColor(value);
        }
    });
    inputs.rarityBorderColorHex.addEventListener('blur', () => {
        if (inputs.rarityBorderColor && inputs.rarityBorderColor.value) {
            inputs.rarityBorderColorHex.value = inputs.rarityBorderColor.value.toUpperCase();
        }
        saveState();
    });
}

// Initialize rarity colors (only if not loaded from state - handled in loadState/initializeDefaults)
const defaultRarityTextColor = '#c9d1d9';
const defaultRarityBorderColor = '#30363d';

// Card number color settings (text and border)
function setCardNumberTextColor(color) {
    if (!color) return;
    if (!color.startsWith('#')) {
        color = '#' + color;
    }
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(color)) {
        return false;
    }
    if (color.length === 4) {
        color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
    }
    const cardNumberEl = views.cardNumber;
    if (cardNumberEl) {
        cardNumberEl.style.color = color;
    }
    if (inputs.cardNumberTextColor) {
        inputs.cardNumberTextColor.value = color;
    }
    if (inputs.cardNumberTextColorHex) {
        inputs.cardNumberTextColorHex.value = color.toUpperCase();
    }
    saveState();
    return true;
}

function setCardNumberBorderColor(color) {
    if (!color) return;
    if (!color.startsWith('#')) {
        color = '#' + color;
    }
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(color)) {
        return false;
    }
    if (color.length === 4) {
        color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
    }
    const cardNumberEl = views.cardNumber;
    if (cardNumberEl) {
        cardNumberEl.style.borderColor = color;
    }
    if (inputs.cardNumberBorderColor) {
        inputs.cardNumberBorderColor.value = color;
    }
    if (inputs.cardNumberBorderColorHex) {
        inputs.cardNumberBorderColorHex.value = color.toUpperCase();
    }
    saveState();
    return true;
}

if (inputs.cardNumberTextColor) {
    inputs.cardNumberTextColor.addEventListener('input', () => {
        if (inputs.cardNumberTextColor.value) {
            setCardNumberTextColor(inputs.cardNumberTextColor.value);
        }
    });
}

if (inputs.cardNumberTextColorHex) {
    inputs.cardNumberTextColorHex.addEventListener('input', () => {
        const value = inputs.cardNumberTextColorHex.value.trim();
        if (value) {
            setCardNumberTextColor(value);
        }
    });
    inputs.cardNumberTextColorHex.addEventListener('blur', () => {
        if (inputs.cardNumberTextColor && inputs.cardNumberTextColor.value) {
            inputs.cardNumberTextColorHex.value = inputs.cardNumberTextColor.value.toUpperCase();
        }
        saveState();
    });
}

if (inputs.cardNumberBorderColor) {
    inputs.cardNumberBorderColor.addEventListener('input', () => {
        if (inputs.cardNumberBorderColor.value) {
            setCardNumberBorderColor(inputs.cardNumberBorderColor.value);
        }
    });
}

if (inputs.cardNumberBorderColorHex) {
    inputs.cardNumberBorderColorHex.addEventListener('input', () => {
        const value = inputs.cardNumberBorderColorHex.value.trim();
        if (value) {
            setCardNumberBorderColor(value);
        }
    });
    inputs.cardNumberBorderColorHex.addEventListener('blur', () => {
        if (inputs.cardNumberBorderColor && inputs.cardNumberBorderColor.value) {
            inputs.cardNumberBorderColorHex.value = inputs.cardNumberBorderColor.value.toUpperCase();
        }
        saveState();
    });
}

// Initialize card number colors (only if not loaded from state - handled in loadState/initializeDefaults)
const defaultCardNumberTextColor = '#c9d1d9';
const defaultCardNumberBorderColor = '#30363d';

// Footer color settings (text and border)
function setFooterTextColor(color) {
    if (!color) return;
    if (!color.startsWith('#')) {
        color = '#' + color;
    }
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(color)) {
        return false;
    }
    if (color.length === 4) {
        color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
    }
    const footerEl = views.footer;
    if (footerEl) {
        footerEl.style.color = color;
    }
    if (inputs.footerTextColor) {
        inputs.footerTextColor.value = color;
    }
    if (inputs.footerTextColorHex) {
        inputs.footerTextColorHex.value = color.toUpperCase();
    }
    saveState();
    return true;
}

if (inputs.footerTextColor) {
    inputs.footerTextColor.addEventListener('input', () => {
        if (inputs.footerTextColor.value) {
            setFooterTextColor(inputs.footerTextColor.value);
        }
    });
}

if (inputs.footerTextColorHex) {
    inputs.footerTextColorHex.addEventListener('input', () => {
        const value = inputs.footerTextColorHex.value.trim();
        if (value) {
            setFooterTextColor(value);
        }
    });
    inputs.footerTextColorHex.addEventListener('blur', () => {
        if (inputs.footerTextColor && inputs.footerTextColor.value) {
            inputs.footerTextColorHex.value = inputs.footerTextColor.value.toUpperCase();
        }
        saveState();
    });
}

// Initialize footer colors (only if not loaded from state - handled in loadState/initializeDefaults)
const defaultFooterTextColor = '#8b949e';

// Attack color settings - applies to both attacks
function setAttackNameColor(color) {
    if (!color) return;
    if (!color.startsWith('#')) {
        color = '#' + color;
    }
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(color)) {
        return false;
    }
    if (color.length === 4) {
        color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
    }
    if (views.atk1Name) views.atk1Name.style.color = color;
    if (views.atk2Name) views.atk2Name.style.color = color;
    if (inputs.atkNameColor) inputs.atkNameColor.value = color;
    if (inputs.atkNameColorHex) inputs.atkNameColorHex.value = color.toUpperCase();
    saveState();
    return true;
}

function setAttack1DmgColor(color) {
    if (!color) return;
    if (!color.startsWith('#')) {
        color = '#' + color;
    }
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(color)) {
        return false;
    }
    if (color.length === 4) {
        color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
    }
    if (views.atk1Dmg) views.atk1Dmg.style.color = color;
    if (inputs.atk1DmgColor) inputs.atk1DmgColor.value = color;
    if (inputs.atk1DmgColorHex) inputs.atk1DmgColorHex.value = color.toUpperCase();
    saveState();
    return true;
}

function setAttack2DmgColor(color) {
    if (!color) return;
    if (!color.startsWith('#')) {
        color = '#' + color;
    }
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(color)) {
        return false;
    }
    if (color.length === 4) {
        color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
    }
    if (views.atk2Dmg) views.atk2Dmg.style.color = color;
    if (inputs.atk2DmgColor) inputs.atk2DmgColor.value = color;
    if (inputs.atk2DmgColorHex) inputs.atk2DmgColorHex.value = color.toUpperCase();
    saveState();
    return true;
}

function setAttackDescColor(color) {
    if (!color) return;
    if (!color.startsWith('#')) {
        color = '#' + color;
    }
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(color)) {
        return false;
    }
    if (color.length === 4) {
        color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
    }
    if (views.atk1Desc) views.atk1Desc.style.color = color;
    if (views.atk2Desc) views.atk2Desc.style.color = color;
    if (inputs.atkDescColor) inputs.atkDescColor.value = color;
    if (inputs.atkDescColorHex) inputs.atkDescColorHex.value = color.toUpperCase();
    saveState();
    return true;
}

// Attack color event listeners
if (inputs.atkNameColor) {
    inputs.atkNameColor.addEventListener('input', () => {
        if (inputs.atkNameColor.value) {
            setAttackNameColor(inputs.atkNameColor.value);
        }
    });
}

if (inputs.atk1DmgColor) {
    inputs.atk1DmgColor.addEventListener('input', () => {
        if (inputs.atk1DmgColor.value) {
            setAttack1DmgColor(inputs.atk1DmgColor.value);
        }
    });
}

if (inputs.atk2DmgColor) {
    inputs.atk2DmgColor.addEventListener('input', () => {
        if (inputs.atk2DmgColor.value) {
            setAttack2DmgColor(inputs.atk2DmgColor.value);
        }
    });
}

if (inputs.atk1DmgColorHex) {
    inputs.atk1DmgColorHex.addEventListener('input', () => {
        const value = inputs.atk1DmgColorHex.value.trim();
        if (value) {
            setAttack1DmgColor(value);
        }
    });
    inputs.atk1DmgColorHex.addEventListener('blur', () => {
        if (inputs.atk1DmgColor && inputs.atk1DmgColor.value) {
            inputs.atk1DmgColorHex.value = inputs.atk1DmgColor.value.toUpperCase();
        }
        saveState();
    });
}

if (inputs.atk2DmgColorHex) {
    inputs.atk2DmgColorHex.addEventListener('input', () => {
        const value = inputs.atk2DmgColorHex.value.trim();
        if (value) {
            setAttack2DmgColor(value);
        }
    });
    inputs.atk2DmgColorHex.addEventListener('blur', () => {
        if (inputs.atk2DmgColor && inputs.atk2DmgColor.value) {
            inputs.atk2DmgColorHex.value = inputs.atk2DmgColor.value.toUpperCase();
        }
        saveState();
    });
}

if (inputs.atkDescColor) {
    inputs.atkDescColor.addEventListener('input', () => {
        if (inputs.atkDescColor.value) {
            setAttackDescColor(inputs.atkDescColor.value);
        }
    });
}

if (inputs.atkNameColorHex) {
    inputs.atkNameColorHex.addEventListener('input', () => {
        const value = inputs.atkNameColorHex.value.trim();
        if (value) {
            setAttackNameColor(value);
        }
    });
    inputs.atkNameColorHex.addEventListener('blur', () => {
        if (inputs.atkNameColor && inputs.atkNameColor.value) {
            inputs.atkNameColorHex.value = inputs.atkNameColor.value.toUpperCase();
        }
        saveState();
    });
}

if (inputs.atkDescColorHex) {
    inputs.atkDescColorHex.addEventListener('input', () => {
        const value = inputs.atkDescColorHex.value.trim();
        if (value) {
            setAttackDescColor(value);
        }
    });
    inputs.atkDescColorHex.addEventListener('blur', () => {
        if (inputs.atkDescColor && inputs.atkDescColor.value) {
            inputs.atkDescColorHex.value = inputs.atkDescColor.value.toUpperCase();
        }
        saveState();
    });
}

// Description color settings
function setDescTitleColor(color) {
    if (!color) return;
    if (!color.startsWith('#')) {
        color = '#' + color;
    }
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(color)) {
        return false;
    }
    if (color.length === 4) {
        color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
    }
    if (views.descTitle) views.descTitle.style.color = color;
    if (inputs.descTitleColor) inputs.descTitleColor.value = color;
    if (inputs.descTitleColorHex) inputs.descTitleColorHex.value = color.toUpperCase();
    saveState();
    return true;
}

function setDescTextColor(color) {
    if (!color) return;
    if (!color.startsWith('#')) {
        color = '#' + color;
    }
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(color)) {
        return false;
    }
    if (color.length === 4) {
        color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
    }
    if (views.descText) views.descText.style.color = color;
    if (inputs.descTextColor) inputs.descTextColor.value = color;
    if (inputs.descTextColorHex) inputs.descTextColorHex.value = color.toUpperCase();
    saveState();
    return true;
}

if (inputs.descTitleColor) {
    inputs.descTitleColor.addEventListener('input', () => {
        if (inputs.descTitleColor.value) {
            setDescTitleColor(inputs.descTitleColor.value);
        }
    });
}

if (inputs.descTitleColorHex) {
    inputs.descTitleColorHex.addEventListener('input', () => {
        const value = inputs.descTitleColorHex.value.trim();
        if (value) {
            setDescTitleColor(value);
        }
    });
    inputs.descTitleColorHex.addEventListener('blur', () => {
        if (inputs.descTitleColor && inputs.descTitleColor.value) {
            inputs.descTitleColorHex.value = inputs.descTitleColor.value.toUpperCase();
        }
        saveState();
    });
}

if (inputs.descTextColor) {
    inputs.descTextColor.addEventListener('input', () => {
        if (inputs.descTextColor.value) {
            setDescTextColor(inputs.descTextColor.value);
        }
    });
}

if (inputs.descTextColorHex) {
    inputs.descTextColorHex.addEventListener('input', () => {
        const value = inputs.descTextColorHex.value.trim();
        if (value) {
            setDescTextColor(value);
        }
    });
    inputs.descTextColorHex.addEventListener('blur', () => {
        if (inputs.descTextColor && inputs.descTextColor.value) {
            inputs.descTextColorHex.value = inputs.descTextColor.value.toUpperCase();
        }
        saveState();
    });
}

// Tab navigation for Attacks/Description
function switchTab(tabName) {
    const attacksTab = el('attacksTab');
    const descriptionTab = el('descriptionTab');
    const attacksView = views.attacksView;
    const descriptionView = views.descriptionView;
    const attackBtn = document.querySelector('[data-tab="attacks"]');
    const descBtn = document.querySelector('[data-tab="description"]');
    
    if (tabName === 'attacks') {
        if (attacksTab) attacksTab.style.display = '';
        if (descriptionTab) descriptionTab.style.display = 'none';
        if (attacksView) attacksView.style.display = '';
        if (descriptionView) descriptionView.style.display = 'none';
        if (attackBtn) {
            attackBtn.classList.add('active');
            attackBtn.style.borderBottomColor = 'var(--accent)';
            attackBtn.style.color = 'var(--text)';
        }
        if (descBtn) {
            descBtn.classList.remove('active');
            descBtn.style.borderBottomColor = 'transparent';
            descBtn.style.color = 'var(--muted)';
        }
    } else {
        if (attacksTab) attacksTab.style.display = 'none';
        if (descriptionTab) descriptionTab.style.display = '';
        if (attacksView) attacksView.style.display = 'none';
        if (descriptionView) descriptionView.style.display = '';
        if (attackBtn) {
            attackBtn.classList.remove('active');
            attackBtn.style.borderBottomColor = 'transparent';
            attackBtn.style.color = 'var(--muted)';
        }
        if (descBtn) {
            descBtn.classList.add('active');
            descBtn.style.borderBottomColor = 'var(--accent)';
            descBtn.style.color = 'var(--text)';
        }
    }
    saveState();
}

// Tab button event listeners
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        switchTab(tab);
    });
});

// Initialize attack colors (only if not loaded from state - handled in loadState/initializeDefaults)

// Image Editor functionality
// Get actual card-hero dimensions
const cardHero = card?.querySelector('.card-hero');
const getCardHeroDimensions = () => {
	if (cardHero) {
		const rect = cardHero.getBoundingClientRect();
		return { width: rect.width, height: rect.height };
	}
	return { width: 404, height: 303 }; // Fallback to button dimensions
};

let imageEditorState = {
	image: null,
	scale: 100,
	x: 0,
	y: 0,
	previewWidth: 404,
	previewHeight: 303
};

const imageEditorModal = el('imageEditorModal');
const imageEditorPreview = el('imageEditorPreview');
const imageEditorImage = el('imageEditorImage');
const imageScaleSlider = el('imageScaleSlider');
const imageScaleValue = el('imageScaleValue');
const resetImagePositionBtn = el('resetImagePositionBtn');
const applyImageEditorBtn = el('applyImageEditorBtn');
const cancelImageEditorBtn = el('cancelImageEditorBtn');
const closeImageEditorModal = el('closeImageEditorModal');

function updateImageEditorDisplay() {
	if (!imageEditorImage.src) return;
	
	const scale = imageEditorState.scale / 100;
	const img = new Image();
	img.onload = () => {
		const displayWidth = img.width * scale;
		const displayHeight = img.height * scale;
		
		imageEditorImage.style.width = `${displayWidth}px`;
		imageEditorImage.style.height = `${displayHeight}px`;
		imageEditorImage.style.left = `${imageEditorState.x}px`;
		imageEditorImage.style.top = `${imageEditorState.y}px`;
	};
	if (imageEditorImage.complete && imageEditorImage.naturalWidth > 0) {
		const displayWidth = imageEditorImage.naturalWidth * (imageEditorState.scale / 100);
		const displayHeight = imageEditorImage.naturalHeight * (imageEditorState.scale / 100);
		
		imageEditorImage.style.width = `${displayWidth}px`;
		imageEditorImage.style.height = `${displayHeight}px`;
		imageEditorImage.style.left = `${imageEditorState.x}px`;
		imageEditorImage.style.top = `${imageEditorState.y}px`;
	} else {
		img.src = imageEditorImage.src;
	}
}

function resetImageEditorPosition() {
	if (!imageEditorImage.src) return;
	
	const img = new Image();
	img.onload = () => {
		const scale = imageEditorState.scale / 100;
		const displayWidth = img.width * scale;
		const displayHeight = img.height * scale;
		
		// Center the image
		imageEditorState.x = (imageEditorState.previewWidth - displayWidth) / 2;
		imageEditorState.y = (imageEditorState.previewHeight - displayHeight) / 2;
		
		updateImageEditorDisplay();
	};
	img.src = imageEditorImage.src;
}

// Drag functionality
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let dragStartImageX = 0;
let dragStartImageY = 0;

imageEditorPreview.addEventListener('mousedown', (e) => {
	if (imageEditorImage.src) {
		isDragging = true;
		imageEditorPreview.classList.add('dragging');
		dragStartX = e.clientX;
		dragStartY = e.clientY;
		dragStartImageX = imageEditorState.x;
		dragStartImageY = imageEditorState.y;
		e.preventDefault();
	}
});

document.addEventListener('mousemove', (e) => {
	if (!isDragging) return;
	
	const deltaX = e.clientX - dragStartX;
	const deltaY = e.clientY - dragStartY;
	
	imageEditorState.x = dragStartImageX + deltaX;
	imageEditorState.y = dragStartImageY + deltaY;
	
	updateImageEditorDisplay();
});

document.addEventListener('mouseup', () => {
	if (isDragging) {
		isDragging = false;
		imageEditorPreview.classList.remove('dragging');
	}
});

// Function to update scale
function updateImageScale(newScale) {
	const oldScale = imageEditorState.scale;
	imageEditorState.scale = Math.max(5, Math.min(1000, newScale));
	
	if (imageScaleSlider) {
		imageScaleSlider.value = imageEditorState.scale;
	}
	if (imageScaleValue) {
		imageScaleValue.textContent = `${imageEditorState.scale}%`;
	}
	
	// Adjust position to keep image centered relative to its previous center
	if (imageEditorImage.src && imageEditorImage.complete && imageEditorImage.naturalWidth > 0) {
		const img = imageEditorImage;
		const oldWidth = img.naturalWidth * oldScale / 100;
		const oldHeight = img.naturalHeight * oldScale / 100;
		const currentCenterX = imageEditorState.x + oldWidth / 2;
		const currentCenterY = imageEditorState.y + oldHeight / 2;
		
		const newWidth = img.naturalWidth * imageEditorState.scale / 100;
		const newHeight = img.naturalHeight * imageEditorState.scale / 100;
		
		imageEditorState.x = currentCenterX - newWidth / 2;
		imageEditorState.y = currentCenterY - newHeight / 2;
	}
	
	updateImageEditorDisplay();
}

// Scale slider
if (imageScaleSlider) {
	imageScaleSlider.addEventListener('input', (e) => {
		updateImageScale(parseInt(e.target.value));
	});
}

// Plus/Minus buttons for scale
const decreaseScaleBtn = el('decreaseScaleBtn');
const increaseScaleBtn = el('increaseScaleBtn');

if (decreaseScaleBtn) {
	decreaseScaleBtn.addEventListener('click', (e) => {
		e.preventDefault();
		updateImageScale(imageEditorState.scale - 1);
	});
}

if (increaseScaleBtn) {
	increaseScaleBtn.addEventListener('click', (e) => {
		e.preventDefault();
		updateImageScale(imageEditorState.scale + 1);
	});
}


// Apply edited image
function applyEditedImage() {
	if (!imageEditorImage.src) return;
	
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	
	// Use higher resolution (3x) for better quality
	const scaleFactor = 3;
	canvas.width = imageEditorState.previewWidth * scaleFactor;
	canvas.height = imageEditorState.previewHeight * scaleFactor;
	
	// Scale context for high DPI
	ctx.scale(scaleFactor, scaleFactor);
	
	// Don't fill background - preserve transparency so CSS background color can show through
	// The background color is handled by the .card-hero CSS background
	
	// Load and draw image
	const img = new Image();
	img.onload = () => {
		const scale = imageEditorState.scale / 100;
		const displayWidth = img.width * scale;
		const displayHeight = img.height * scale;
		
		// Use the current x/y position directly (scaled to preview dimensions)
		let x = imageEditorState.x;
		let y = imageEditorState.y;
		
		// If image hasn't been moved, center it
		if (x === 0 && y === 0) {
			x = (imageEditorState.previewWidth - displayWidth) / 2;
			y = (imageEditorState.previewHeight - displayHeight) / 2;
		}
		
		// Use image smoothing for better quality
		ctx.imageSmoothingEnabled = true;
		ctx.imageSmoothingQuality = 'high';
		
		ctx.drawImage(img, x, y, displayWidth, displayHeight);
		
		// Convert to data URL with high quality
		const dataUrl = canvas.toDataURL('image/png');
		views.cover.src = dataUrl;
		saveState();
		
		// Close modal
		imageEditorModal.classList.remove('active');
	};
	img.src = imageEditorImage.src;
}

if (applyImageEditorBtn) {
	applyImageEditorBtn.addEventListener('click', applyEditedImage);
}

// Cancel/Close handlers
function closeImageEditor() {
	imageEditorModal.classList.remove('active');
	imageEditorImage.src = '';
	const dimensions = getCardHeroDimensions();
	imageEditorState = {
		image: null,
		scale: 100,
		x: 0,
		y: 0,
		previewWidth: dimensions.width,
		previewHeight: dimensions.height
	};
	if (imageScaleSlider) {
		imageScaleSlider.value = 100;
		imageScaleSlider.min = 5;
		imageScaleSlider.max = 1000;
	}
	if (imageScaleValue) imageScaleValue.textContent = '100%';
}

// Function to open image editor with an image
function openImageEditor(imageUrl, resetState = true) {
	if (!imageUrl) return;
	
	imageEditorImage.src = imageUrl;
	
	// Update preview dimensions to match actual card-hero
	const dimensions = getCardHeroDimensions();
	imageEditorState.previewWidth = dimensions.width;
	imageEditorState.previewHeight = dimensions.height;
	imageEditorPreview.style.width = `${dimensions.width}px`;
	imageEditorPreview.style.height = `${dimensions.height}px`;
	
	if (resetState) {
		// Reset editor state
		imageEditorState.scale = 100;
		imageEditorState.x = 0;
		imageEditorState.y = 0;
		if (imageScaleSlider) imageScaleSlider.value = 100;
		if (imageScaleValue) imageScaleValue.textContent = '100%';
	}
	
	// Wait for image to load, then center it
	const img = new Image();
	img.onload = () => {
		if (resetState) {
			// Always use 100% scale
			imageEditorState.scale = 100;
			
			if (imageScaleSlider) {
				imageScaleSlider.value = 100;
			}
			if (imageScaleValue) {
				imageScaleValue.textContent = '100%';
			}
			
			// Center image initially
			const scale = imageEditorState.scale / 100;
			const displayWidth = img.width * scale;
			const displayHeight = img.height * scale;
			imageEditorState.x = (imageEditorState.previewWidth - displayWidth) / 2;
			imageEditorState.y = (imageEditorState.previewHeight - displayHeight) / 2;
		}
		
		updateImageEditorDisplay();
	};
	img.src = imageUrl;
	
	// Open modal
	imageEditorModal.classList.add('active');
}

// Close modal when clicking on backdrop
imageEditorModal.addEventListener('click', (e) => {
	if (e.target === imageEditorModal) {
		closeImageEditor();
	}
});

if (cancelImageEditorBtn) {
	cancelImageEditorBtn.addEventListener('click', closeImageEditor);
}

if (closeImageEditorModal) {
	closeImageEditorModal.addEventListener('click', closeImageEditor);
}

// Delete Image Modal
const deleteImageModal = el('deleteImageModal');
const closeDeleteImageModalBtn = el('closeDeleteImageModal');
const cancelDeleteImageBtn = el('cancelDeleteImageBtn');
const confirmDeleteImageBtn = el('confirmDeleteImageBtn');

function openDeleteImageModal() {
	if (deleteImageModal) {
		deleteImageModal.classList.add('active');
	}
}

function closeDeleteImageModal() {
	if (deleteImageModal) {
		deleteImageModal.classList.remove('active');
	}
}

function confirmDeleteImage() {
	// Reset to default image
	views.cover.src = 'sample.png';
	// Clear file input
	if (inputs.cover) {
		inputs.cover.value = '';
	}
	saveState();
	closeDeleteImageModal();
}

// Delete button - opens delete modal
const deleteImageBtn = el('deleteImageBtn');
if (deleteImageBtn) {
	deleteImageBtn.addEventListener('click', (e) => {
		e.preventDefault();
		openDeleteImageModal();
	});
}

if (closeDeleteImageModalBtn) {
	closeDeleteImageModalBtn.addEventListener('click', closeDeleteImageModal);
}

if (cancelDeleteImageBtn) {
	cancelDeleteImageBtn.addEventListener('click', closeDeleteImageModal);
}

if (confirmDeleteImageBtn) {
	confirmDeleteImageBtn.addEventListener('click', confirmDeleteImage);
}

// Close modal when clicking on backdrop
if (deleteImageModal) {
	deleteImageModal.addEventListener('click', (e) => {
		if (e.target === deleteImageModal) {
			closeDeleteImageModal();
		}
	});
}

// Cover image upload - opens editor
const uploadBtn = document.getElementById('uploadCoverBtn');
if (uploadBtn) uploadBtn.addEventListener('click', (e) => { e.preventDefault(); inputs.cover?.click(); });
inputs.cover.addEventListener('change', () => {
	const file = inputs.cover.files?.[0];
	if (!file) return;
	const reader = new FileReader();
	reader.onload = (e) => {
		const imageUrl = String(e.target?.result || '');
		openImageEditor(imageUrl, true);
	};
	reader.readAsDataURL(file);
});

// Export to PNG using html2canvas
el('exportPngBtn').addEventListener('click', async () => {
    // Ensure fonts and image are loaded
    if (document.fonts && document.fonts.ready) {
        try { await document.fonts.ready; } catch {}
    }
    if (views.cover && views.cover.src && !views.cover.complete) {
        await new Promise((resolve) => { views.cover.onload = resolve; views.cover.onerror = resolve; });
    }

    // Create a wrapper container with exact dimensions (no padding to avoid extra space)
    const wrapper = document.createElement('div');
    wrapper.style.background = 'transparent';
    wrapper.style.display = 'inline-block';
    wrapper.style.boxSizing = 'border-box';
    wrapper.style.width = '420px';
    wrapper.style.height = '600px';
    wrapper.style.position = 'relative';

    // Clone the card for stable rendering
    const clone = card.cloneNode(true);
    clone.style.display = 'block';
    clone.style.margin = '0';
    clone.style.width = '420px';
    clone.style.height = '600px';

    // Inline computed styles that html2canvas sometimes misses (box-shadow and header/footer colors)
    const cs = getComputedStyle(card);
    clone.style.boxShadow = cs.boxShadow; // include ring
    clone.style.background = cs.background;
    clone.style.color = cs.color;
    clone.style.borderColor = cs.borderColor; // preserve border color
    // Copy CSS custom properties to preserve theming
    for (let i = 0; i < cs.length; i++) {
        const prop = cs[i];
        if (prop && prop.startsWith('--')) {
            clone.style.setProperty(prop, cs.getPropertyValue(prop));
        }
    }

    const origTop = card.querySelector('.card-top');
    const cloneTop = clone.querySelector('.card-top');
    if (origTop && cloneTop) {
        const csTop = getComputedStyle(origTop);
        cloneTop.style.background = csTop.backgroundColor;
        cloneTop.style.color = csTop.color;
        cloneTop.style.borderBottom = csTop.borderBottom;
        cloneTop.style.borderBottomColor = csTop.borderBottomColor;
        // Preserve card name color
        const origCardName = origTop.querySelector('#viewName');
        const cloneCardName = cloneTop.querySelector('#viewName');
        if (origCardName && cloneCardName) {
            const csCardName = getComputedStyle(origCardName);
            cloneCardName.style.color = csCardName.color;
        }
    }

    const origHero = card.querySelector('.card-hero');
    const cloneHero = clone.querySelector('.card-hero');
    if (origHero && cloneHero) {
        const csHero = getComputedStyle(origHero);
        cloneHero.style.borderBottom = csHero.borderBottom;
        cloneHero.style.borderBottomColor = csHero.borderBottomColor;
    }

    const origBody = card.querySelector('.card-body');
    const cloneBody = clone.querySelector('.card-body');
    if (origBody && cloneBody) {
        const csBody = getComputedStyle(origBody);
        cloneBody.style.background = csBody.backgroundColor;
        cloneBody.style.color = csBody.color;
    }

    const origDivider = card.querySelector('.divider');
    const cloneDivider = clone.querySelector('.divider');
    if (origDivider && cloneDivider) {
        const csDivider = getComputedStyle(origDivider);
        cloneDivider.style.backgroundColor = csDivider.backgroundColor;
    }

    const origFooter = card.querySelector('.card-footer');
    const cloneFooter = clone.querySelector('.card-footer');
    if (origFooter && cloneFooter) {
        const csFooter = getComputedStyle(origFooter);
        cloneFooter.style.background = csFooter.backgroundColor;
        cloneFooter.style.color = csFooter.color;
        cloneFooter.style.borderTop = csFooter.borderTop;
        cloneFooter.style.borderTopColor = csFooter.borderTopColor;
        // Preserve footer text color
        const origFooterText = origFooter.querySelector('#viewFooter');
        const cloneFooterText = cloneFooter.querySelector('#viewFooter');
        if (origFooterText && cloneFooterText) {
            const csFooterText = getComputedStyle(origFooterText);
            cloneFooterText.style.color = csFooterText.color;
            cloneFooterText.style.borderColor = csFooterText.borderColor;
        }
    }

    // Preserve HP colors
    const origHpLabel = card.querySelector('.hp-label');
    const cloneHpLabel = clone.querySelector('.hp-label');
    if (origHpLabel && cloneHpLabel) {
        const csHpLabel = getComputedStyle(origHpLabel);
        cloneHpLabel.style.color = csHpLabel.color;
    }
    const origHpValue = card.querySelector('#viewHp');
    const cloneHpValue = clone.querySelector('#viewHp');
    if (origHpValue && cloneHpValue) {
        const csHpValue = getComputedStyle(origHpValue);
        cloneHpValue.style.color = csHpValue.color;
    }

    // Ensure rarity/card-number styles are preserved for centering in export
    const origRarity = card.querySelector('.rarity');
    const cloneRarity = clone.querySelector('.rarity');
    if (origRarity && cloneRarity) {
        const csR = getComputedStyle(origRarity);
        cloneRarity.style.display = 'inline-flex';
        cloneRarity.style.alignItems = csR.alignItems || 'center';
        cloneRarity.style.justifyContent = csR.justifyContent || 'center';
        cloneRarity.style.lineHeight = '1';
        cloneRarity.style.color = csR.color;
        cloneRarity.style.borderColor = csR.borderColor;
        // lock height to DOM height to avoid baseline drift in canvas
        const rr = origRarity ? origRarity.getBoundingClientRect() : null;
        if (rr) {
            cloneRarity.style.height = Math.round(rr.height) + 'px';
        } else {
            cloneRarity.style.minHeight = '18px';
        }
        if (csR?.fontFamily) cloneRarity.style.fontFamily = csR.fontFamily;
        if (csR?.padding) cloneRarity.style.padding = csR.padding;
        if (csR?.borderRadius) cloneRarity.style.borderRadius = csR.borderRadius;
    }
    const origNum = card.querySelector('.card-number');
    const cloneNum = clone.querySelector('.card-number');
    if (cloneNum) {
        const csN = origNum ? getComputedStyle(origNum) : null;
        cloneNum.style.display = 'inline-flex';
        cloneNum.style.alignItems = csN?.alignItems || 'center';
        cloneNum.style.justifyContent = csN?.justifyContent || 'center';
        cloneNum.style.lineHeight = '1';
        const nr = origNum ? origNum.getBoundingClientRect() : null;
        if (nr) {
            cloneNum.style.height = Math.round(nr.height) + 'px';
        } else {
            cloneNum.style.minHeight = '18px';
        }
        if (csN?.fontFamily) cloneNum.style.fontFamily = csN.fontFamily;
        if (csN?.padding) cloneNum.style.padding = csN.padding;
        if (csN?.borderRadius) cloneNum.style.borderRadius = csN.borderRadius;
    }

    // Align type pill similarly during export
    const origTypePill = card.querySelector('.type-pill');
    const cloneTypePill = clone.querySelector('.type-pill');
    if (cloneTypePill) {
        const csT = origTypePill ? getComputedStyle(origTypePill) : null;
        cloneTypePill.style.display = 'inline-flex';
        cloneTypePill.style.alignItems = csT?.alignItems || 'center';
        cloneTypePill.style.justifyContent = csT?.justifyContent || 'center';
        cloneTypePill.style.lineHeight = '1';
        cloneTypePill.style.color = csT?.color || '';
        cloneTypePill.style.borderColor = csT?.borderColor || '';
        const tr = origTypePill ? origTypePill.getBoundingClientRect() : null;
        if (tr) {
            cloneTypePill.style.height = Math.round(tr.height) + 'px';
        }
        if (csT?.padding) cloneTypePill.style.padding = csT.padding;
        if (csT?.borderRadius) cloneTypePill.style.borderRadius = csT.borderRadius;
        if (csT?.fontFamily) cloneTypePill.style.fontFamily = csT.fontFamily;
        // Preserve the slight upward offset if defined
        if (csT?.top) cloneTypePill.style.top = csT.top;
        if (csT?.position) cloneTypePill.style.position = csT.position;
    }

    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    await new Promise((r) => setTimeout(r, 30));
    
    // Create canvas with exact target dimensions (840x1200px at scale 2)
    const targetWidth = 840;
    const targetHeight = 1200;
    
    const canvas = await html2canvas(wrapper, {
        backgroundColor: null,
        scale: 2,
        useCORS: true
    });
    
    // Always crop to exact size (center crop to ensure perfect dimensions)
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = targetWidth;
    finalCanvas.height = targetHeight;
    const ctx = finalCanvas.getContext('2d');
    
    // Calculate center crop position to ensure card is centered
    const sourceX = Math.max(0, (canvas.width - targetWidth) / 2);
    const sourceY = Math.max(0, (canvas.height - targetHeight) / 2);
    
    // Draw the center portion (this ensures perfect 840x1200px output)
    ctx.drawImage(canvas, sourceX, sourceY, targetWidth, targetHeight, 0, 0, targetWidth, targetHeight);
    
    // Cleanup
    document.body.removeChild(wrapper);
    
    const dataUrl = finalCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = buildDownloadName('png');
    link.href = dataUrl;
    link.click();
});

// Export to JSON (download)
el('exportJsonBtn').addEventListener('click', () => {
    const digits = (inputs.cardNumber?.value || '').replace(/\D/g, '').slice(0, 10).padStart(10, '0');
    const data = {
        name: inputs.name?.value || '',
        cardNameColor: inputs.cardNameColor?.value || '',
        type: inputs.typeText?.value || '',
        typeVisible: inputs.typeVisible?.checked !== false,
        typeTextColor: inputs.typeTextColor?.value || '',
        typeBorderColor: inputs.typeBorderColor?.value || '',
        hp: Number(inputs.hp?.value || 0),
        hpVisible: inputs.hpVisible?.checked !== false,
        hpLabelColor: inputs.hpLabelColor?.value || '',
        hpValueColor: inputs.hpValueColor?.value || '',
        coverDataUrl: views.cover?.src || null,
        attackMode: document.querySelector('[data-tab="attacks"]')?.classList.contains('active') ? 'attacks' : 'description',
        attacks: [
            { name: inputs.atk1Name?.value || '', damage: Number(inputs.atk1Dmg?.value || 0), description: inputs.atk1Desc?.value || '', damageVisible: inputs.atk1DmgVisible?.checked !== false, damageColor: inputs.atk1DmgColor?.value || '' },
            { name: inputs.atk2Name?.value || '', damage: Number(inputs.atk2Dmg?.value || 0), description: inputs.atk2Desc?.value || '', damageVisible: inputs.atk2DmgVisible?.checked !== false, damageColor: inputs.atk2DmgColor?.value || '' }
        ],
        description: {
            title: inputs.descTitle?.value || '',
            text: inputs.descText?.value || '',
            titleColor: inputs.descTitleColor?.value || '',
            textColor: inputs.descTextColor?.value || ''
        },
        footerNote: inputs.footer?.value || '',
        rarity: inputs.rarity?.value || '',
        cardNumber: `#${digits}`,
        borderColor: inputs.borderColor?.value || '',
        lineColor: inputs.lineColor?.value || '',
        innerColor: inputs.innerColor?.value || '',
        imageBgColor: inputs.imageBgColor?.value || '',
        rarityTextColor: inputs.rarityTextColor?.value || '',
        rarityBorderColor: inputs.rarityBorderColor?.value || '',
        cardNumberTextColor: inputs.cardNumberTextColor?.value || '',
        cardNumberBorderColor: inputs.cardNumberBorderColor?.value || '',
        footerTextColor: inputs.footerTextColor?.value || '',
        atkNameColor: inputs.atkNameColor?.value || '',
        atkDescColor: inputs.atkDescColor?.value || '',
        exportedAt: new Date().toISOString()
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = buildDownloadName('json');
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
});

// Import from JSON (upload)
el('importJsonBtn').addEventListener('click', () => el('importJsonInput').click());
el('importJsonInput').addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
        const text = await file.text();
        const data = JSON.parse(text);
        // map into form
        inputs.name && (inputs.name.value = data.name || '');
        if (data.cardNameColor) {
            setCardNameColor(data.cardNameColor);
        } else if (inputs.cardNameColor) {
            setCardNameColor('#c9d1d9');
        }
        inputs.typeText && (inputs.typeText.value = data.type || '');
        if (inputs.typeVisible) inputs.typeVisible.checked = data.typeVisible !== false;
        if (data.typeTextColor) {
            setTypeTextColor(data.typeTextColor);
        } else if (inputs.typeTextColor) {
            setTypeTextColor('#8b949e');
        }
        if (data.typeBorderColor) {
            setTypeBorderColor(data.typeBorderColor);
        } else if (inputs.typeBorderColor) {
            setTypeBorderColor('#30363d');
        }
        inputs.hp && (inputs.hp.value = String(data.hp ?? ''));
        if (inputs.hpVisible) inputs.hpVisible.checked = data.hpVisible !== false;
        if (data.hpLabelColor) {
            setHpLabelColor(data.hpLabelColor);
        } else if (inputs.hpLabelColor) {
            setHpLabelColor('#8b949e');
        }
        if (data.hpValueColor) {
            setHpValueColor(data.hpValueColor);
        } else if (inputs.hpValueColor) {
            setHpValueColor('#58a6ff');
        }
        inputs.atk1Name && (inputs.atk1Name.value = data.attacks?.[0]?.name || '');
        inputs.atk1Dmg && (inputs.atk1Dmg.value = String(data.attacks?.[0]?.damage || ''));
        inputs.atk1Desc && (inputs.atk1Desc.value = data.attacks?.[0]?.description || '');
        if (inputs.atk1DmgVisible) inputs.atk1DmgVisible.checked = data.attacks?.[0]?.damageVisible !== false;
        if (inputs.atk1DmgColor) {
            if (data.attacks?.[0]?.damageColor) {
                setAttack1DmgColor(data.attacks[0].damageColor);
            } else if (data.atkDmgColor) {
                setAttack1DmgColor(data.atkDmgColor);
            } else {
                setAttack1DmgColor('#f85149');
            }
        }
        inputs.atk2Name && (inputs.atk2Name.value = data.attacks?.[1]?.name || '');
        inputs.atk2Dmg && (inputs.atk2Dmg.value = String(data.attacks?.[1]?.damage || ''));
        inputs.atk2Desc && (inputs.atk2Desc.value = data.attacks?.[1]?.description || '');
        if (inputs.atk2DmgVisible) inputs.atk2DmgVisible.checked = data.attacks?.[1]?.damageVisible !== false;
        if (inputs.atk2DmgColor) {
            if (data.attacks?.[1]?.damageColor) {
                setAttack2DmgColor(data.attacks[1].damageColor);
            } else if (data.atkDmgColor) {
                setAttack2DmgColor(data.atkDmgColor);
            } else {
                setAttack2DmgColor('#f85149');
            }
        }
        inputs.footer && (inputs.footer.value = data.footerNote || '');
        inputs.rarity && (inputs.rarity.value = data.rarity || '');
        inputs.cardNumber && (inputs.cardNumber.value = (data.cardNumber || '').replace(/[^0-9]/g, '').slice(0, 10));
        if (data.borderColor) {
            setBorderColor(data.borderColor);
        } else if (inputs.borderColor) {
            setBorderColor('#30363d');
        }
        if (data.lineColor) {
            setLineColor(data.lineColor);
        } else if (inputs.lineColor) {
            setLineColor('#30363d');
        }
        if (data.innerColor) {
            setInnerColor(data.innerColor);
        } else if (inputs.innerColor) {
            setInnerColor('#000000');
        }
        if (data.imageBgColor) {
            setImageBgColor(data.imageBgColor);
        } else if (inputs.imageBgColor) {
            setImageBgColor('#0b0f14');
        }
        if (data.rarityTextColor) {
            setRarityTextColor(data.rarityTextColor);
        } else if (inputs.rarityTextColor) {
            setRarityTextColor('#c9d1d9');
        }
        if (data.rarityBorderColor) {
            setRarityBorderColor(data.rarityBorderColor);
        } else if (inputs.rarityBorderColor) {
            setRarityBorderColor('#30363d');
        }
        if (data.cardNumberTextColor) {
            setCardNumberTextColor(data.cardNumberTextColor);
        } else if (inputs.cardNumberTextColor) {
            setCardNumberTextColor('#c9d1d9');
        }
        if (data.cardNumberBorderColor) {
            setCardNumberBorderColor(data.cardNumberBorderColor);
        } else if (inputs.cardNumberBorderColor) {
            setCardNumberBorderColor('#30363d');
        }
        if (data.footerTextColor) {
            setFooterTextColor(data.footerTextColor);
        } else if (inputs.footerTextColor) {
            setFooterTextColor('#8b949e');
        }
        if (data.atkNameColor) {
            setAttackNameColor(data.atkNameColor);
        } else if (inputs.atkNameColor) {
            setAttackNameColor('#c9d1d9');
        }
        if (data.atkDmgColor) {
            setAttackDmgColor(data.atkDmgColor);
        } else if (inputs.atkDmgColor) {
            setAttackDmgColor('#f85149');
        }
        if (data.atkDescColor) {
            setAttackDescColor(data.atkDescColor);
        } else if (inputs.atkDescColor) {
            setAttackDescColor('#8b949e');
        }
        if (data.coverDataUrl) views.cover.src = data.coverDataUrl;
        // trigger preview updates
        inputs.name?.dispatchEvent(new Event('input'));
        inputs.typeText?.dispatchEvent(new Event('input'));
        inputs.hp?.dispatchEvent(new Event('input'));
        inputs.atk1Name?.dispatchEvent(new Event('input'));
        inputs.atk1Dmg?.dispatchEvent(new Event('input'));
        inputs.atk1Desc?.dispatchEvent(new Event('input'));
        inputs.atk2Name?.dispatchEvent(new Event('input'));
        inputs.atk2Dmg?.dispatchEvent(new Event('input'));
        inputs.atk2Desc?.dispatchEvent(new Event('input'));
        inputs.footer?.dispatchEvent(new Event('input'));
        inputs.rarity?.dispatchEvent(new Event('input'));
        inputs.cardNumber?.dispatchEvent(new Event('input'));
        inputs.borderColor?.dispatchEvent(new Event('input'));
        inputs.lineColor?.dispatchEvent(new Event('input'));
        inputs.innerColor?.dispatchEvent(new Event('input'));
        // Update visibility
        updateTypeVisibility();
        updateHpVisibility();
        updateDamageVisibility(1);
        updateDamageVisibility(2);
        saveState();
    } catch {}
    e.target.value = '';
});

// Load from localStorage on start (must be called after all event listeners are set up)
// This is called at the end after all bindings are complete
window.addEventListener('beforeunload', saveState);

// Templates functionality
const TEMPLATES_STORAGE_KEY = 'cardBuilderTemplates';

let defaultTemplates = null;

async function loadDefaultTemplates() {
    if (defaultTemplates !== null) return defaultTemplates;
    
    try {
        const response = await fetch('templates.json');
        if (!response.ok) {
            console.warn('Could not load templates.json, using empty array');
            defaultTemplates = [];
            return defaultTemplates;
        }
        const data = await response.json();
        defaultTemplates = data.templates || [];
        return defaultTemplates;
    } catch (e) {
        console.warn('Error loading templates.json:', e);
        defaultTemplates = [];
        return defaultTemplates;
    }
}

function getTemplates() {
    try {
        const stored = localStorage.getItem(TEMPLATES_STORAGE_KEY);
        const userTemplates = stored ? JSON.parse(stored) : [];
        
        // Merge default templates with user templates
        // Default templates come first, then user templates
        const defaultTemplatesList = defaultTemplates || [];
        const allTemplates = [...defaultTemplatesList, ...userTemplates];
        
        return allTemplates;
    } catch (e) {
        console.error('Error loading templates:', e);
        return defaultTemplates || [];
    }
}

function saveTemplates(templates) {
    try {
        localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
    } catch (e) {
        console.error('Error saving templates:', e);
    }
}

let currentDeleteTemplateId = null;
let currentOverwriteAction = null; // Stores the function to execute on confirm

function openSaveTemplateModal() {
    const state = collectState();
    const modal = el('saveTemplateModal');
    const input = el('templateNameInput');
    if (modal && input) {
        input.value = state.name || '';
        modal.classList.add('active');
        input.focus();
        input.select();
    }
}

function closeSaveTemplateModal() {
    const modal = el('saveTemplateModal');
    const input = el('templateNameInput');
    const error = el('templateNameError');
    if (modal) {
        modal.classList.remove('active');
    }
    if (input) {
        input.value = '';
        input.classList.remove('error');
    }
    if (error) {
        error.style.display = 'none';
    }
}

function confirmSaveTemplate() {
    const input = el('templateNameInput');
    const error = el('templateNameError');
    
    if (!input || !input.value.trim()) {
        if (input) input.classList.add('error');
        if (error) error.style.display = 'block';
        input?.focus();
        return;
    }

    if (input) input.classList.remove('error');
    if (error) error.style.display = 'none';

    const templateName = input.value.trim();
    const state = collectState();
    const templates = getTemplates();
    const defaultTemplatesList = defaultTemplates || [];
    const userTemplates = templates.filter(t => !defaultTemplatesList.some(dt => dt.id === t.id));
    
    // Check if template with same name already exists (only in user templates)
    const existingTemplateIndex = userTemplates.findIndex(t => t.name.toLowerCase() === templateName.toLowerCase());
    
    if (existingTemplateIndex !== -1) {
        // Show overwrite confirmation modal
        openOverwriteModal(
            `A template with the name "${escapeHtml(templateName)}" already exists. Do you want to overwrite it?`,
            () => {
                // Replace existing template
                userTemplates[existingTemplateIndex] = {
                    id: userTemplates[existingTemplateIndex].id, // Keep original ID
                    name: templateName,
                    data: state,
                    createdAt: userTemplates[existingTemplateIndex].createdAt, // Keep original creation date
                    updatedAt: new Date().toISOString() // Add update timestamp
                };
                saveTemplates(userTemplates);
                renderTemplates();
                closeSaveTemplateModal();
            }
        );
    } else {
        // Add new template
        const newTemplate = {
            id: Date.now().toString(),
            name: templateName,
            data: state,
            createdAt: new Date().toISOString()
        };
        userTemplates.unshift(newTemplate); // Add to beginning
        saveTemplates(userTemplates);
        renderTemplates();
        closeSaveTemplateModal();
    }
}

function loadTemplate(templateData) {
    const data = templateData.data;
    if (inputs.name) inputs.name.value = data.name || '';
    if (data.cardNameColor) {
        setCardNameColor(data.cardNameColor);
    } else if (inputs.cardNameColor) {
        setCardNameColor('#c9d1d9');
    }
    if (inputs.typeText) inputs.typeText.value = data.type || '';
    if (inputs.typeVisible) inputs.typeVisible.checked = data.typeVisible !== false;
    if (data.typeTextColor) {
        setTypeTextColor(data.typeTextColor);
    } else if (inputs.typeTextColor) {
        setTypeTextColor('#8b949e');
    }
    if (data.typeBorderColor) {
        setTypeBorderColor(data.typeBorderColor);
    } else if (inputs.typeBorderColor) {
        setTypeBorderColor('#30363d');
    }
    if (inputs.hp) inputs.hp.value = String(data.hp ?? '');
    if (inputs.hpVisible) inputs.hpVisible.checked = data.hpVisible !== false;
    if (data.hpLabelColor) {
        setHpLabelColor(data.hpLabelColor);
    } else if (inputs.hpLabelColor) {
        setHpLabelColor('#8b949e');
    }
    if (data.hpValueColor) {
        setHpValueColor(data.hpValueColor);
    } else if (inputs.hpValueColor) {
        setHpValueColor('#58a6ff');
    }
    if (inputs.atk1Name) inputs.atk1Name.value = data.attacks?.[0]?.name || '';
    if (inputs.atk1Dmg) inputs.atk1Dmg.value = String(data.attacks?.[0]?.damage || '');
    if (inputs.atk1Desc) inputs.atk1Desc.value = data.attacks?.[0]?.description || '';
    if (inputs.atk1DmgVisible) inputs.atk1DmgVisible.checked = data.attacks?.[0]?.damageVisible !== false;
    if (inputs.atk1DmgColor) {
        if (data.attacks?.[0]?.damageColor) {
            setAttack1DmgColor(data.attacks[0].damageColor);
        } else if (data.atkDmgColor) {
            setAttack1DmgColor(data.atkDmgColor);
        } else {
            setAttack1DmgColor('#f85149');
        }
    }
    if (inputs.atk2Name) inputs.atk2Name.value = data.attacks?.[1]?.name || '';
    if (inputs.atk2Dmg) inputs.atk2Dmg.value = String(data.attacks?.[1]?.damage || '');
    if (inputs.atk2Desc) inputs.atk2Desc.value = data.attacks?.[1]?.description || '';
    if (inputs.atk2DmgVisible) inputs.atk2DmgVisible.checked = data.attacks?.[1]?.damageVisible !== false;
    if (inputs.atk2DmgColor) {
        if (data.attacks?.[1]?.damageColor) {
            setAttack2DmgColor(data.attacks[1].damageColor);
        } else if (data.atkDmgColor) {
            setAttack2DmgColor(data.atkDmgColor);
        } else {
            setAttack2DmgColor('#f85149');
        }
    }
    
    // Load attack mode and description
    if (data.attackMode === 'description') {
        switchTab('description');
    } else {
        switchTab('attacks');
    }
    if (data.description) {
        if (inputs.descTitle) inputs.descTitle.value = data.description.title || '';
        if (inputs.descText) inputs.descText.value = data.description.text || '';
        if (data.description.titleColor) {
            setDescTitleColor(data.description.titleColor);
        } else if (inputs.descTitleColor) {
            setDescTitleColor('#c9d1d9');
        }
        if (data.description.textColor) {
            setDescTextColor(data.description.textColor);
        } else if (inputs.descTextColor) {
            setDescTextColor('#8b949e');
        }
        if (views.descTitle) views.descTitle.textContent = data.description.title || 'Special Ability';
        if (views.descText) views.descText.textContent = data.description.text || 'Enter description text here...';
    }
    
    if (inputs.footer) inputs.footer.value = data.footerNote || '';
    if (inputs.rarity) inputs.rarity.value = data.rarity || '';
    if (inputs.cardNumber) inputs.cardNumber.value = (data.cardNumber || '').replace(/[^0-9]/g, '').slice(0, 10);
    if (data.borderColor) {
        setBorderColor(data.borderColor);
    } else if (inputs.borderColor) {
        setBorderColor('#30363d');
    }
    if (data.lineColor) {
        setLineColor(data.lineColor);
    } else if (inputs.lineColor) {
        setLineColor('#30363d');
    }
    if (data.innerColor) {
        setInnerColor(data.innerColor);
    } else if (inputs.innerColor) {
        setInnerColor('#000000');
    }
    if (data.imageBgColor) {
        setImageBgColor(data.imageBgColor);
    } else if (inputs.imageBgColor) {
        setImageBgColor('#0b0f14');
    }
    if (data.rarityTextColor) {
        setRarityTextColor(data.rarityTextColor);
    } else if (inputs.rarityTextColor) {
        setRarityTextColor('#c9d1d9');
    }
    if (data.rarityBorderColor) {
        setRarityBorderColor(data.rarityBorderColor);
    } else if (inputs.rarityBorderColor) {
        setRarityBorderColor('#30363d');
    }
    if (data.cardNumberTextColor) {
        setCardNumberTextColor(data.cardNumberTextColor);
    } else if (inputs.cardNumberTextColor) {
        setCardNumberTextColor('#c9d1d9');
    }
    if (data.cardNumberBorderColor) {
        setCardNumberBorderColor(data.cardNumberBorderColor);
    } else if (inputs.cardNumberBorderColor) {
        setCardNumberBorderColor('#30363d');
    }
    if (data.footerTextColor) {
        setFooterTextColor(data.footerTextColor);
    } else if (inputs.footerTextColor) {
        setFooterTextColor('#8b949e');
    }
    if (data.atkNameColor) {
        setAttackNameColor(data.atkNameColor);
    } else if (inputs.atkNameColor) {
        setAttackNameColor('#c9d1d9');
    }
    if (data.atkDmgColor) {
        setAttackDmgColor(data.atkDmgColor);
    } else if (inputs.atkDmgColor) {
        setAttackDmgColor('#f85149');
    }
    if (data.atkDescColor) {
        setAttackDescColor(data.atkDescColor);
    } else if (inputs.atkDescColor) {
        setAttackDescColor('#8b949e');
    }
    
    // Load attack mode and description
    if (data.attackMode === 'description') {
        switchTab('description');
    } else {
        switchTab('attacks');
    }
    if (data.description) {
        if (inputs.descTitle) inputs.descTitle.value = data.description.title || '';
        if (inputs.descText) inputs.descText.value = data.description.text || '';
        if (data.description.titleColor) {
            setDescTitleColor(data.description.titleColor);
        } else if (inputs.descTitleColor) {
            setDescTitleColor('#c9d1d9');
        }
        if (data.description.textColor) {
            setDescTextColor(data.description.textColor);
        } else if (inputs.descTextColor) {
            setDescTextColor('#8b949e');
        }
        if (views.descTitle) views.descTitle.textContent = data.description.title || 'Special Ability';
        if (views.descText) views.descText.textContent = data.description.text || 'Enter description text here...';
    }
    
    if (data.coverDataUrl) views.cover.src = data.coverDataUrl;
    // Trigger preview updates
    inputs.name?.dispatchEvent(new Event('input'));
    inputs.typeText?.dispatchEvent(new Event('input'));
    inputs.hp?.dispatchEvent(new Event('input'));
    inputs.atk1Name?.dispatchEvent(new Event('input'));
    inputs.atk1Dmg?.dispatchEvent(new Event('input'));
    inputs.atk1Desc?.dispatchEvent(new Event('input'));
    inputs.atk2Name?.dispatchEvent(new Event('input'));
    inputs.atk2Dmg?.dispatchEvent(new Event('input'));
    inputs.atk2Desc?.dispatchEvent(new Event('input'));
    inputs.footer?.dispatchEvent(new Event('input'));
    inputs.rarity?.dispatchEvent(new Event('input'));
    inputs.cardNumber?.dispatchEvent(new Event('input'));
    inputs.borderColor?.dispatchEvent(new Event('input'));
    inputs.innerColor?.dispatchEvent(new Event('input'));
    // Update damage visibility
    updateDamageVisibility(1);
    updateDamageVisibility(2);
    saveState();
}

function openDeleteTemplateModal(templateId) {
    const templates = getTemplates();
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    currentDeleteTemplateId = templateId;
    const modal = el('deleteTemplateModal');
    const message = el('deleteModalMessage');
    if (modal && message) {
        message.textContent = `Do you really want to delete the template "${escapeHtml(template.name)}"?`;
        modal.classList.add('active');
    }
}

function closeDeleteTemplateModal() {
    const modal = el('deleteTemplateModal');
    if (modal) {
        modal.classList.remove('active');
    }
    currentDeleteTemplateId = null;
}

function confirmDeleteTemplate() {
    if (!currentDeleteTemplateId) return;
    
    // Check if it's a default template (cannot be deleted)
    const defaultTemplatesList = defaultTemplates || [];
    const isDefaultTemplate = defaultTemplatesList.some(t => t.id === currentDeleteTemplateId);
    
    if (isDefaultTemplate) {
        alert('Default templates cannot be deleted.');
        closeDeleteTemplateModal();
        return;
    }
    
    const templates = getTemplates();
    const filtered = templates.filter(t => t.id !== currentDeleteTemplateId);
    
    // Only save user templates to localStorage
    const userTemplates = filtered.filter(t => !defaultTemplatesList.some(dt => dt.id === t.id));
    saveTemplates(userTemplates);
    renderTemplates();
    closeDeleteTemplateModal();
}

// Overwrite Template Modal functions
function openOverwriteModal(message, onConfirm) {
    const modal = el('overwriteTemplateModal');
    const messageEl = el('overwriteModalMessage');
    if (modal && messageEl) {
        messageEl.textContent = message;
        modal.classList.add('active');
        currentOverwriteAction = onConfirm;
    }
}

function closeOverwriteModal() {
    const modal = el('overwriteTemplateModal');
    if (modal) {
        modal.classList.remove('active');
    }
    currentOverwriteAction = null;
}

function confirmOverwrite() {
    if (currentOverwriteAction) {
        currentOverwriteAction();
        closeOverwriteModal();
    }
}

function renderTemplates() {
    const samplesList = el('samplesList');
    const templatesList = el('templatesList');
    
    const templates = getTemplates();
    const defaultTemplatesList = defaultTemplates || [];
    const userTemplates = templates.filter(t => !defaultTemplatesList.some(dt => dt.id === t.id));
    
    // Render Samples (Default Templates)
    if (samplesList) {
        if (defaultTemplatesList.length === 0) {
            samplesList.innerHTML = '<div style="text-align: center; color: var(--muted); padding: 20px; font-size: 12px;">No samples available</div>';
        } else {
            samplesList.innerHTML = defaultTemplatesList.map(template => {
                const date = new Date(template.createdAt);
                const dateStr = date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                return `
                    <div class="template-item">
                        <div class="template-info">
                            <div class="template-name">${escapeHtml(template.name)}</div>
                            <div class="template-date">${dateStr}</div>
                        </div>
                        <div class="template-actions">
                            <button class="btn template-btn" onclick="window.loadTemplateById('${template.id}')">Load</button>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }
    
    // Render User Templates
    if (templatesList) {
        if (userTemplates.length === 0) {
            templatesList.innerHTML = '<div style="text-align: center; color: var(--muted); padding: 20px; font-size: 12px;">No templates saved</div>';
        } else {
            templatesList.innerHTML = userTemplates.map(template => {
                const date = new Date(template.createdAt);
                const dateStr = date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                return `
                    <div class="template-item">
                        <div class="template-info">
                            <div class="template-name">${escapeHtml(template.name)}</div>
                            <div class="template-date">${dateStr}</div>
                        </div>
                        <div class="template-actions">
                            <button class="btn template-btn" onclick="window.loadTemplateById('${template.id}')">Load</button>
                            <button class="btn template-btn primary" onclick="window.saveToTemplateById('${template.id}')">Save</button>
                            <button class="btn template-btn delete" onclick="window.deleteTemplateById('${template.id}')">X</button>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make functions available globally for onclick handlers
window.loadTemplateById = (id) => {
    const templates = getTemplates();
    const template = templates.find(t => t.id === id);
    if (template) {
        loadTemplate(template);
    }
};

window.deleteTemplateById = (id) => {
    openDeleteTemplateModal(id);
};

window.saveToTemplateById = (id) => {
    const templates = getTemplates();
    const template = templates.find(t => t.id === id);
    if (!template) return;
    
    const defaultTemplatesList = defaultTemplates || [];
    const isDefault = defaultTemplatesList.some(dt => dt.id === id);
    
    // Show overwrite confirmation modal
    openOverwriteModal(
        `Do you want to save the current design to the template "${escapeHtml(template.name)}"? The existing template will be overwritten.`,
        () => {
            // Get current state
            const state = collectState();
            
            if (isDefault) {
                // For default templates, save as a new user template with a new ID
                const userTemplates = templates.filter(t => !defaultTemplatesList.some(dt => dt.id === t.id));
                const newTemplate = {
                    id: Date.now().toString(),
                    name: template.name + ' (Custom)',
                    data: state,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                userTemplates.push(newTemplate);
                saveTemplates(userTemplates);
            } else {
                // For user templates, update in place
                const userTemplates = templates.filter(t => !defaultTemplatesList.some(dt => dt.id === t.id));
                const templateIndex = userTemplates.findIndex(t => t.id === id);
                if (templateIndex !== -1) {
                    userTemplates[templateIndex] = {
                        id: template.id,
                        name: template.name,
                        data: state,
                        createdAt: template.createdAt,
                        updatedAt: new Date().toISOString()
                    };
                    saveTemplates(userTemplates);
                }
            }
            renderTemplates();
        }
    );
};

// Modal event listeners
// Save Template Modal
el('saveTemplateBtn')?.addEventListener('click', openSaveTemplateModal);
el('closeSaveModal')?.addEventListener('click', closeSaveTemplateModal);
el('cancelSaveBtn')?.addEventListener('click', closeSaveTemplateModal);
el('confirmSaveBtn')?.addEventListener('click', confirmSaveTemplate);

// Close modal when clicking outside
el('saveTemplateModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'saveTemplateModal') {
        closeSaveTemplateModal();
    }
});

el('deleteTemplateModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'deleteTemplateModal') {
        closeDeleteTemplateModal();
    }
});

// Delete Template Modal
el('closeDeleteModal')?.addEventListener('click', closeDeleteTemplateModal);
el('cancelDeleteBtn')?.addEventListener('click', closeDeleteTemplateModal);
el('confirmDeleteBtn')?.addEventListener('click', confirmDeleteTemplate);

// Overwrite Template Modal
el('closeOverwriteModal')?.addEventListener('click', closeOverwriteModal);
el('cancelOverwriteBtn')?.addEventListener('click', closeOverwriteModal);
el('confirmOverwriteBtn')?.addEventListener('click', confirmOverwrite);

// Close overwrite modal when clicking outside
el('overwriteTemplateModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'overwriteTemplateModal') {
        closeOverwriteModal();
    }
});

// Allow Enter key to submit in save modal
el('templateNameInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        confirmSaveTemplate();
    }
    if (e.key === 'Escape') {
        closeSaveTemplateModal();
    }
});

// Allow Escape key to close delete modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const saveModal = el('saveTemplateModal');
        const deleteModal = el('deleteTemplateModal');
        if (saveModal && saveModal.classList.contains('active')) {
            closeSaveTemplateModal();
        }
        if (deleteModal && deleteModal.classList.contains('active')) {
            closeDeleteTemplateModal();
        }
    }
});

// Reset function to reset all inputs to default values
function resetForm() {
    // Reset text inputs to empty
    if (inputs.name) inputs.name.value = '';
    if (inputs.typeText) inputs.typeText.value = '';
    if (inputs.typeVisible) inputs.typeVisible.checked = true;
    if (inputs.hp) inputs.hp.value = '100';
    if (inputs.hpVisible) inputs.hpVisible.checked = true;
    if (inputs.atk1Name) inputs.atk1Name.value = '';
    if (inputs.atk1Dmg) inputs.atk1Dmg.value = '';
    if (inputs.atk1Desc) inputs.atk1Desc.value = '';
    if (inputs.atk1DmgVisible) inputs.atk1DmgVisible.checked = true;
    if (inputs.atk2Name) inputs.atk2Name.value = '';
    if (inputs.atk2Dmg) inputs.atk2Dmg.value = '';
    if (inputs.atk2Desc) inputs.atk2Desc.value = '';
    if (inputs.atk2DmgVisible) inputs.atk2DmgVisible.checked = true;
    if (inputs.descTitle) inputs.descTitle.value = '';
    if (inputs.descText) inputs.descText.value = '';
    if (inputs.footer) inputs.footer.value = '';
    if (inputs.rarity) inputs.rarity.value = '';
    if (inputs.cardNumber) inputs.cardNumber.value = '';
    
    // Reset color inputs to defaults
    setCardNameColor('#c9d1d9');
    setTypeTextColor('#8b949e');
    setTypeBorderColor('#30363d');
    setHpLabelColor('#8b949e');
    setHpValueColor('#58a6ff');
    setBorderColor('#30363d');
    setLineColor('#30363d');
    setInnerColor('#000000');
    setImageBgColor('#0b0f14');
    setRarityTextColor('#c9d1d9');
    setRarityBorderColor('#30363d');
    setCardNumberTextColor('#c9d1d9');
    setCardNumberBorderColor('#30363d');
    setFooterTextColor('#8b949e');
    setAttackNameColor('#c9d1d9');
    setAttack1DmgColor('#f85149');
    setAttack2DmgColor('#f85149');
    setAttackDescColor('#8b949e');
    setDescTitleColor('#c9d1d9');
    setDescTextColor('#8b949e');
    
    // Reset image to sample.png
    if (views.cover) views.cover.src = 'sample.png';
    
    // Reset file input
    if (inputs.cover) inputs.cover.value = '';
    
    // Trigger preview updates
    inputs.name?.dispatchEvent(new Event('input'));
    inputs.typeText?.dispatchEvent(new Event('input'));
    inputs.hp?.dispatchEvent(new Event('input'));
    inputs.atk1Name?.dispatchEvent(new Event('input'));
    inputs.atk1Dmg?.dispatchEvent(new Event('input'));
    inputs.atk1Desc?.dispatchEvent(new Event('input'));
    inputs.atk2Name?.dispatchEvent(new Event('input'));
    inputs.atk2Dmg?.dispatchEvent(new Event('input'));
    inputs.atk2Desc?.dispatchEvent(new Event('input'));
    inputs.footer?.dispatchEvent(new Event('input'));
    inputs.rarity?.dispatchEvent(new Event('input'));
    inputs.cardNumber?.dispatchEvent(new Event('input'));
    if (inputs.descTitle) inputs.descTitle.dispatchEvent(new Event('input'));
    if (inputs.descText) inputs.descText.dispatchEvent(new Event('input'));
    
    // Reset to attacks tab
    switchTab('attacks');
    
    // Update visibility
    updateTypeVisibility();
    updateHpVisibility();
    updateDamageVisibility(1);
    updateDamageVisibility(2);
    
    // Save state after reset
    saveState();
}

// Reset Modal functions
function openResetModal() {
    const modal = el('resetModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeResetModal() {
    const modal = el('resetModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function confirmReset() {
    resetForm();
    closeResetModal();
}

// Reset button event listener
el('resetBtn')?.addEventListener('click', openResetModal);

// Reset Modal event listeners
el('closeResetModal')?.addEventListener('click', closeResetModal);
el('cancelResetBtn')?.addEventListener('click', closeResetModal);
el('confirmResetBtn')?.addEventListener('click', confirmReset);

// Close modal when clicking outside
el('resetModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'resetModal') {
        closeResetModal();
    }
});

// Allow Escape key to close reset modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const saveModal = el('saveTemplateModal');
        const deleteModal = el('deleteTemplateModal');
        const resetModal = el('resetModal');
        if (saveModal && saveModal.classList.contains('active')) {
            closeSaveTemplateModal();
        }
        if (deleteModal && deleteModal.classList.contains('active')) {
            closeDeleteTemplateModal();
        }
        if (resetModal && resetModal.classList.contains('active')) {
            closeResetModal();
        }
    }
});

// Backup Templates Modal functions
function openBackupModal() {
    const modal = el('backupTemplateModal');
    const message = el('backupMessage');
    if (modal) {
        modal.classList.add('active');
    }
    if (message) {
        message.style.display = 'none';
        message.textContent = '';
    }
}

function closeBackupModal() {
    const modal = el('backupTemplateModal');
    const message = el('backupMessage');
    if (modal) {
        modal.classList.remove('active');
    }
    if (message) {
        message.style.display = 'none';
        message.textContent = '';
    }
    // Reset file input
    const fileInput = el('uploadBackupInput');
    if (fileInput) fileInput.value = '';
}

function showBackupMessage(text, isError = false) {
    const message = el('backupMessage');
    if (message) {
        message.textContent = text;
        message.style.display = 'block';
        message.style.color = isError ? 'var(--danger)' : 'var(--muted)';
    }
}

function downloadBackup() {
    try {
        const templates = getTemplates();
        const backupData = {
            version: '1.0',
            exportedAt: new Date().toISOString(),
            templates: templates
        };
        const json = JSON.stringify(backupData, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        link.download = `templates-backup-${dateStr}.json`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        showBackupMessage(`${templates.length} template(s) successfully downloaded.`);
    } catch (e) {
        console.error('Error downloading backup:', e);
        showBackupMessage('Error downloading templates.', true);
    }
}

function uploadBackup() {
    const fileInput = el('uploadBackupInput');
    if (fileInput) {
        fileInput.click();
    }
}

function handleBackupUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const text = e.target?.result;
            if (!text) {
                showBackupMessage('Error: File could not be read.', true);
                return;
            }
            const backupData = JSON.parse(text);
            
            // Validate backup structure
            if (!backupData.templates || !Array.isArray(backupData.templates)) {
                showBackupMessage('Error: Invalid backup format.', true);
                return;
            }
            
            const importedTemplates = backupData.templates;
            const currentTemplates = getTemplates();
            
            // Merge templates: replace existing ones with same id, add new ones
            const templateMap = new Map();
            
            // Add current templates to map
            currentTemplates.forEach(t => {
                templateMap.set(t.id, t);
            });
            
            // Merge imported templates (overwrite existing, add new)
            let replacedCount = 0;
            let addedCount = 0;
            importedTemplates.forEach(t => {
                if (templateMap.has(t.id)) {
                    templateMap.set(t.id, t);
                    replacedCount++;
                } else {
                    templateMap.set(t.id, t);
                    addedCount++;
                }
            });
            
            // Convert map back to array
            const mergedTemplates = Array.from(templateMap.values());
            
            // Save merged templates
            saveTemplates(mergedTemplates);
            renderTemplates();
            
            // Show success message
            let message = '';
            if (addedCount > 0 && replacedCount > 0) {
                message = `${addedCount} template(s) added, ${replacedCount} template(s) replaced.`;
            } else if (addedCount > 0) {
                message = `${addedCount} template(s) added.`;
            } else if (replacedCount > 0) {
                message = `${replacedCount} template(s) replaced.`;
            } else {
                message = 'No changes.';
            }
            showBackupMessage(message);
        } catch (e) {
            console.error('Error uploading backup:', e);
            showBackupMessage('Error uploading backup file. Please check the format.', true);
        }
    };
    reader.onerror = () => {
        showBackupMessage('Error reading file.', true);
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
}

// Backup Modal event listeners
el('backupTemplateBtn')?.addEventListener('click', openBackupModal);
el('closeBackupModal')?.addEventListener('click', closeBackupModal);
el('closeBackupBtn')?.addEventListener('click', closeBackupModal);
el('downloadBackupBtn')?.addEventListener('click', downloadBackup);
el('uploadBackupBtn')?.addEventListener('click', uploadBackup);
el('uploadBackupInput')?.addEventListener('change', handleBackupUpload);

// Close backup modal when clicking outside
el('backupTemplateModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'backupTemplateModal') {
        closeBackupModal();
    }
});

// Allow Escape key to close backup modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const saveModal = el('saveTemplateModal');
        const deleteModal = el('deleteTemplateModal');
        const resetModal = el('resetModal');
        const backupModal = el('backupTemplateModal');
        const overwriteModal = el('overwriteTemplateModal');
        if (saveModal && saveModal.classList.contains('active')) {
            closeSaveTemplateModal();
        }
        if (deleteModal && deleteModal.classList.contains('active')) {
            closeDeleteTemplateModal();
        }
        if (resetModal && resetModal.classList.contains('active')) {
            closeResetModal();
        }
        if (backupModal && backupModal.classList.contains('active')) {
            closeBackupModal();
        }
        if (overwriteModal && overwriteModal.classList.contains('active')) {
            closeOverwriteModal();
        }
    }
});

// Symbol copy functionality
document.querySelectorAll('.symbol-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
        const symbol = btn.getAttribute('data-symbol');
        if (!symbol) return;
        
        try {
            await navigator.clipboard.writeText(symbol);
            // Visual feedback
            const originalText = btn.textContent;
            btn.textContent = '✓';
            btn.style.background = 'var(--brand)';
            btn.style.borderColor = 'var(--brand)';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.style.borderColor = '';
            }, 500);
        } catch (err) {
            console.error('Failed to copy symbol:', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = symbol;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                const originalText = btn.textContent;
                btn.textContent = '✓';
                btn.style.background = 'var(--brand)';
                btn.style.borderColor = 'var(--brand)';
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.style.borderColor = '';
                }, 500);
            } catch (fallbackErr) {
                console.error('Fallback copy failed:', fallbackErr);
            }
            document.body.removeChild(textArea);
        }
    });
});

// Load from localStorage on start (called after all event listeners are set up)
// Script is loaded at end of body, so DOM is ready - call immediately
(async () => {
    // Load default templates first
    await loadDefaultTemplates();
    
    loadState();
    // Initialize visibility after loading state
    updateTypeVisibility();
    updateHpVisibility();
    updateDamageVisibility(1);
    updateDamageVisibility(2);
    // Initialize tab state (default to attacks if not set)
    if (!document.querySelector('[data-tab="attacks"]')?.classList.contains('active') && 
        !document.querySelector('[data-tab="description"]')?.classList.contains('active')) {
        switchTab('attacks');
    }
    renderTemplates();
})();

