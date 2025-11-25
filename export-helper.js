// Lokale HTML zu Canvas Export-Funktion
// Ersetzt html2canvas für lokale Verwendung ohne externe Bibliothek

async function htmlToCanvas(element, options = {}) {
    const scale = options.scale || 2;
    const backgroundColor = options.backgroundColor || null;
    
    return new Promise(async (resolve, reject) => {
        try {
            // Hole Dimensionen
            const rect = element.getBoundingClientRect();
            const width = Math.ceil(rect.width);
            const height = Math.ceil(rect.height);
            
            // Erstelle Canvas
            const canvas = document.createElement('canvas');
            canvas.width = width * scale;
            canvas.height = height * scale;
            const ctx = canvas.getContext('2d');
            
            // Skaliere Context
            ctx.scale(scale, scale);
            
            // Setze Hintergrund
            if (backgroundColor) {
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(0, 0, width, height);
            }
            
            // Konvertiere alle Bilder zu Data URLs (verhindert Tainted Canvas)
            const images = element.querySelectorAll('img');
            const imageDataUrls = new Map();
            
            await Promise.all(Array.from(images).map(async (imgEl) => {
                try {
                    // Wenn bereits Data URL, verwende diese
                    if (imgEl.src.startsWith('data:')) {
                        imageDataUrls.set(imgEl.src, imgEl.src);
                        return;
                    }
                    
                    // Erstelle temporäres Canvas um Bild zu Data URL zu konvertieren
                    const imgCanvas = document.createElement('canvas');
                    const imgCtx = imgCanvas.getContext('2d');
                    
                    return new Promise((resolveImg) => {
                        const img = new Image();
                        
                        // Für lokale Dateien: keine crossOrigin
                        // Für externe URLs: crossOrigin = 'anonymous' wenn möglich
                        if (imgEl.src.startsWith('http://') || imgEl.src.startsWith('https://')) {
                            img.crossOrigin = 'anonymous';
                        }
                        
                        img.onload = function() {
                            try {
                                imgCanvas.width = img.width;
                                imgCanvas.height = img.height;
                                imgCtx.drawImage(img, 0, 0);
                                
                                // Konvertiere zu Data URL
                                const dataUrl = imgCanvas.toDataURL('image/png');
                                imageDataUrls.set(imgEl.src, dataUrl);
                            } catch (e) {
                                // Falls fehlschlägt, verwende Original
                                imageDataUrls.set(imgEl.src, imgEl.src);
                            }
                            resolveImg();
                        };
                        
                        img.onerror = function() {
                            // Falls Bild nicht geladen werden kann, verwende Original
                            imageDataUrls.set(imgEl.src, imgEl.src);
                            resolveImg();
                        };
                        
                        img.src = imgEl.src;
                    });
                } catch (e) {
                    imageDataUrls.set(imgEl.src, imgEl.src);
                }
            }));
            
            // Klone Element und ersetze Bild-URLs durch Data URLs
            const clone = element.cloneNode(true);
            clone.style.position = 'absolute';
            clone.style.left = '0';
            clone.style.top = '0';
            clone.style.margin = '0';
            
            // Ersetze alle Bild-URLs im Klon
            const clonedImages = clone.querySelectorAll('img');
            clonedImages.forEach((clonedImg, index) => {
                const originalImg = images[index];
                if (originalImg && imageDataUrls.has(originalImg.src)) {
                    clonedImg.src = imageDataUrls.get(originalImg.src);
                }
            });
            
            // Kopiere alle berechneten Styles
            function inlineStyles(src, dst) {
                const styles = window.getComputedStyle(src);
                for (let i = 0; i < styles.length; i++) {
                    const prop = styles[i];
                    if (prop && !prop.startsWith('-webkit-')) {
                        try {
                            dst.style.setProperty(prop, styles.getPropertyValue(prop));
                        } catch (e) {
                            // Ignoriere nicht-setzbare Properties
                        }
                    }
                }
            }
            
            inlineStyles(element, clone);
            
            // Kopiere Styles für alle Kinder
            const srcElements = element.querySelectorAll('*');
            const dstElements = clone.querySelectorAll('*');
            srcElements.forEach((src, idx) => {
                if (dstElements[idx]) {
                    inlineStyles(src, dstElements[idx]);
                }
            });
            
            // Spezielle Behandlung für vertikal zentrierte Elemente (wie im Original-Code)
            // Rarity - Text innerhalb der Border zentrieren
            const origRarity = element.querySelector('.rarity');
            const cloneRarity = clone.querySelector('.rarity');
            if (origRarity && cloneRarity) {
                const csR = window.getComputedStyle(origRarity);
                cloneRarity.style.display = 'inline-flex';
                cloneRarity.style.alignItems = 'center'; // Zentriert Text innerhalb Border
                cloneRarity.style.justifyContent = csR.justifyContent || 'center';
                cloneRarity.style.lineHeight = '1';
                cloneRarity.style.verticalAlign = 'middle';
                const rr = origRarity.getBoundingClientRect();
                if (rr) {
                    cloneRarity.style.height = Math.round(rr.height) + 'px';
                } else {
                    cloneRarity.style.minHeight = '18px';
                }
                if (csR.fontFamily) cloneRarity.style.fontFamily = csR.fontFamily;
                // Padding anpassen: top um 2px erhöhen, bottom um 2px reduziert für Text-Zentrierung
                const padding = csR.padding ? csR.padding.split(' ').map(p => parseFloat(p) || 0) : [2, 8, 2, 8];
                if (padding.length === 4) {
                    cloneRarity.style.padding = `${padding[0] + 2}px ${padding[1]}px ${Math.max(0, padding[2] - 2)}px ${padding[3]}px`;
                } else if (padding.length === 2) {
                    cloneRarity.style.padding = `${padding[0] + 2}px ${padding[1]}px`;
                } else {
                    cloneRarity.style.padding = csR.padding || '4px 8px';
                }
                if (csR.borderRadius) cloneRarity.style.borderRadius = csR.borderRadius;
            }
            
            // Card Number - Text innerhalb der Border zentrieren
            const origNum = element.querySelector('.card-number');
            const cloneNum = clone.querySelector('.card-number');
            if (origNum && cloneNum) {
                const csN = window.getComputedStyle(origNum);
                cloneNum.style.display = 'inline-flex';
                cloneNum.style.alignItems = 'center'; // Zentriert Text innerhalb Border
                cloneNum.style.justifyContent = csN.justifyContent || 'center';
                cloneNum.style.lineHeight = '1';
                cloneNum.style.verticalAlign = 'middle';
                const nr = origNum.getBoundingClientRect();
                if (nr) {
                    cloneNum.style.height = Math.round(nr.height) + 'px';
                } else {
                    cloneNum.style.minHeight = '18px';
                }
                if (csN.fontFamily) cloneNum.style.fontFamily = csN.fontFamily;
                // Padding anpassen für Text-Zentrierung
                const padding = csN.padding ? csN.padding.split(' ').map(p => parseFloat(p) || 0) : [2, 8, 2, 8];
                if (padding.length === 4) {
                    cloneNum.style.padding = `${padding[0] + 2}px ${padding[1]}px ${Math.max(0, padding[2] - 2)}px ${padding[3]}px`;
                } else if (padding.length === 2) {
                    cloneNum.style.padding = `${padding[0] + 2}px ${padding[1]}px`;
                } else {
                    cloneNum.style.padding = csN.padding || '4px 8px';
                }
                if (csN.borderRadius) cloneNum.style.borderRadius = csN.borderRadius;
            }
            
            // Type Pill - Text innerhalb der Border zentrieren
            const origTypePill = element.querySelector('.type-pill');
            const cloneTypePill = clone.querySelector('.type-pill');
            if (origTypePill && cloneTypePill) {
                const csT = window.getComputedStyle(origTypePill);
                cloneTypePill.style.display = 'inline-flex';
                cloneTypePill.style.alignItems = 'center'; // Zentriert Text innerhalb Border
                cloneTypePill.style.justifyContent = csT.justifyContent || 'center';
                cloneTypePill.style.lineHeight = '1';
                cloneTypePill.style.verticalAlign = 'middle';
                if (csT.position) cloneTypePill.style.position = csT.position;
                if (csT.top) cloneTypePill.style.top = csT.top;
                const tr = origTypePill.getBoundingClientRect();
                if (tr) {
                    cloneTypePill.style.height = Math.round(tr.height) + 'px';
                }
                // Padding anpassen für Text-Zentrierung - 1px zusätzlich nach unten
                const padding = csT.padding ? csT.padding.split(' ').map(p => parseFloat(p) || 0) : [4, 8, 4, 8];
                if (padding.length === 4) {
                    cloneTypePill.style.padding = `${padding[0] + 5}px ${padding[1]}px ${Math.max(0, padding[2] - 3)}px ${padding[3]}px`;
                } else if (padding.length === 2) {
                    cloneTypePill.style.padding = `${padding[0] + 5}px ${padding[1]}px`;
                } else {
                    cloneTypePill.style.padding = csT.padding || '7px 8px';
                }
                if (csT.borderRadius) cloneTypePill.style.borderRadius = csT.borderRadius;
                if (csT.fontFamily) cloneTypePill.style.fontFamily = csT.fontFamily;
            }
            
            // SVG ForeignObject Methode
            const svgNS = 'http://www.w3.org/2000/svg';
            const svg = document.createElementNS(svgNS, 'svg');
            svg.setAttribute('width', width);
            svg.setAttribute('height', height);
            svg.setAttribute('xmlns', svgNS);
            
            // ForeignObject
            const foreignObject = document.createElementNS(svgNS, 'foreignObject');
            foreignObject.setAttribute('width', width);
            foreignObject.setAttribute('height', height);
            foreignObject.appendChild(clone);
            svg.appendChild(foreignObject);
            
            // Serialisiere SVG
            const svgStr = new XMLSerializer().serializeToString(svg);
            
            // Konvertiere SVG String zu Data URL (verhindert CORS-Probleme)
            const svgDataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr);
            
            // Lade SVG als Bild
            const img = new Image();
            img.onload = function() {
                try {
                    // Zeichne auf Canvas
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas);
                } catch (error) {
                    // Fallback falls SVG-Methode fehlschlägt
                    drawFallback(ctx, element, rect, width, height, imageDataUrls, resolve, canvas);
                }
            };
            
            img.onerror = function() {
                // Fallback falls SVG nicht geladen werden kann
                drawFallback(ctx, element, rect, width, height, imageDataUrls, resolve, canvas);
            };
            
            img.src = svgDataUrl;
            
        } catch (error) {
            reject(error);
        }
    });
}

// Fallback-Methode: Zeichne manuell wichtige Elemente
function drawFallback(ctx, element, rect, width, height, imageDataUrls, resolve, canvas) {
    try {
        // Hintergrund
        const bg = window.getComputedStyle(element).backgroundColor;
        if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, width, height);
        }
        
        // Border
        const border = window.getComputedStyle(element).borderColor;
        const borderWidth = parseFloat(window.getComputedStyle(element).borderWidth) || 0;
        if (borderWidth > 0 && border !== 'transparent') {
            ctx.strokeStyle = border;
            ctx.lineWidth = borderWidth;
            ctx.strokeRect(borderWidth / 2, borderWidth / 2, width - borderWidth, height - borderWidth);
        }
        
        // Bilder rendern
        const images = element.querySelectorAll('img');
        if (images.length === 0) {
            resolve(canvas);
            return;
        }
        
        let imagesLoaded = 0;
        const totalImages = images.length;
        
        images.forEach((imgEl) => {
            const imgSrc = imageDataUrls.get(imgEl.src) || imgEl.src;
            const img = new Image();
            
            img.onload = function() {
                try {
                    const imgRect = imgEl.getBoundingClientRect();
                    const x = imgRect.left - rect.left;
                    const y = imgRect.top - rect.top;
                    ctx.drawImage(img, x, y, imgRect.width, imgRect.height);
                } catch (e) {
                    console.warn('Could not draw image:', e);
                }
                
                imagesLoaded++;
                if (imagesLoaded === totalImages) {
                    resolve(canvas);
                }
            };
            
            img.onerror = function() {
                imagesLoaded++;
                if (imagesLoaded === totalImages) {
                    resolve(canvas);
                }
            };
            
            img.src = imgSrc;
        });
    } catch (error) {
        resolve(canvas); // Return canvas even if fallback fails
    }
}

// Export als html2canvas-kompatible Funktion
window.html2canvas = htmlToCanvas;
