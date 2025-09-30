# 🏗️ Architettura Tecnica PIR & CARE

## 📐 Panoramica Architetturale

PIR & CARE è un'applicazione web progressiva (PWA) single-page costruita con tecnologie web moderne e ottimizzata per performance e user experience.

## 🎯 Stack Tecnologico

### Frontend
- **HTML5**: Markup semantico e accessibile
- **CSS3**: Styling moderno con variabili CSS, Grid e Flexbox
- **JavaScript ES6+**: Logica applicativa vanilla (no framework)
- **Chart.js**: Visualizzazione dati per dashboard
- **Font Awesome 6**: Sistema di icone

### Storage
- **LocalStorage**: Persistenza dati lato client
- **SessionStorage**: Dati temporanei di sessione

### Deployment
- **GitHub Pages**: Hosting statico gratuito
- **GitHub Actions**: CI/CD automatizzato

## 📊 Diagramma dell'Architettura

```
┌─────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                     │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │   Landing   │  │ PIR Form     │  │  Tracking &      │   │
│  │   Page      │  │ (5 Steps)    │  │  Dashboard       │   │
│  └─────────────┘  └──────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        BUSINESS LOGIC LAYER                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │ Form Validation │  │  Translation    │  │   State     │ │
│  │    Module       │  │    Engine       │  │  Management │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Signature     │  │  Document OCR   │  │  Analytics  │ │
│  │    Module       │  │  (Simulated)    │  │   Module    │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        DATA LAYER                             │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │  LocalStorage   │  │  SessionStorage │                   │
│  │  (Form Data)    │  │  (Temp Data)    │                   │
│  └─────────────────┘  └─────────────────┘                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    INTEGRATION LAYER (Future)                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │  PIR Backend    │  │   InsurTech     │  │   Handler   │ │
│  │      API        │  │   Partner API   │  │     API     │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🗂️ Struttura Moduli

### 1. **Core Module** (`app.js`)

#### Responsabilità:
- Inizializzazione applicazione
- Gestione routing interno
- Coordinamento moduli

#### Componenti Chiave:
```javascript
// Stato globale
let currentStep = 1;
let formData = {
    documents: {},
    personal: {},
    flight: {},
    baggage: {},
    signature: null
};

// Lifecycle
initializeApp()
setupEventListeners()
```

### 2. **Translation Module** (`translations.js`)

#### Responsabilità:
- Gestione traduzioni multilingua
- Switching dinamico lingua
- Persistenza preferenze utente

#### Struttura Dati:
```javascript
const translations = {
    it: { /* traduzioni italiane */ },
    en: { /* traduzioni inglesi */ },
    es: { /* traduzioni spagnole */ },
    fr: { /* traduzioni francesi */ },
    de: { /* traduzioni tedesche */ },
    zh: { /* traduzioni cinesi */ }
};
```

#### API Pubblica:
```javascript
translate(key, lang)          // Ottiene traduzione
updatePageLanguage(lang)      // Aggiorna UI
getStoredLanguage()          // Recupera lingua salvata
```

### 3. **Form Management Module**

#### Responsabilità:
- Gestione wizard multi-step
- Validazione input
- Auto-save progressivo

#### Flow:
```
Step 1: Document Upload
    ↓
Step 2: Personal Info
    ↓
Step 3: Flight Info
    ↓
Step 4: Baggage Description
    ↓
Step 5: Review & Sign
    ↓
Submit PIR
```

#### Validazione:
```javascript
validateStep(step) {
    switch(step) {
        case 1: // Verifica documenti caricati
        case 2: // Valida dati personali
        case 3: // Valida dati volo
        case 4: // Valida descrizione bagaglio
        case 5: // Verifica firma e consenso
    }
}
```

### 4. **Document Processing Module**

#### Responsabilità:
- Upload file immagini
- Preview documenti
- Simulazione OCR/Computer Vision

#### Tecnologie:
- FileReader API per lettura file
- Canvas API per manipolazione immagini
- Base64 encoding per storage

```javascript
handleFileUpload(event, type, containerId) {
    // 1. Leggi file
    // 2. Mostra preview
    // 3. Simula estrazione dati AI
    // 4. Popola form automaticamente
}
```

### 5. **Signature Module**

#### Responsabilità:
- Cattura firma digitale
- Gestione touch/mouse events
- Export firma come immagine

#### Implementazione:
```javascript
setupSignaturePad() {
    // Canvas-based signature capture
    // Touch & mouse event handlers
    // Data URL export
}
```

### 6. **Tracking Module**

#### Responsabilità:
- Visualizzazione stato PIR
- Timeline interattiva
- Simulazione aggiornamenti stato

```javascript
// Stati possibili
const states = [
    'submitted',   // PIR ricevuto
    'searching',   // Ricerca in corso
    'found',       // Bagaglio trovato
    'shipping',    // In consegna
    'delivered'    // Consegnato
];
```

### 7. **Analytics Module** (Dashboard)

#### Responsabilità:
- Visualizzazione KPI
- Charts e grafici
- Tabelle dati

#### Metriche Visualizzate:
- PIR totali e trend
- Tempo medio gestione
- Casi risolti
- Revenue generato
- Distribuzione per compagnia

## 🔄 Flusso Dati

### User Journey Flow

```
┌──────────────┐
│ User Arrives │
│   at Airport │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│  Access Webapp   │◄─── Via QR Code, Totem, Chatbot
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Select Language │
└──────┬───────────┘
       │
       ▼
┌──────────────────────┐
│  Upload Documents    │
│  (Boarding Pass + ID)│
└──────┬───────────────┘
       │
       ▼
┌──────────────────┐
│  AI Extracts Data│◄─── Computer Vision (Simulated)
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Complete Profile │
│   & Flight Info  │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│    Describe      │
│     Baggage      │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Review & Sign   │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│   Submit PIR     │◄─── Generate Reference Number
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Track Status    │◄─── Real-time Updates
└──────────────────┘
```

## 🔐 Sicurezza

### Client-Side Security

1. **Input Sanitization**
```javascript
// Sanitizza input utente
function sanitizeInput(input) {
    return input
        .replace(/[<>]/g, '')
        .trim();
}
```

2. **XSS Prevention**
- Uso di textContent invece di innerHTML
- Escape di caratteri speciali
- Content Security Policy (CSP)

3. **Data Privacy**
- Nessun dato sensibile in localStorage permanente
- Clear data on session end
- GDPR compliant

### HTTPS
- GitHub Pages fornisce HTTPS automaticamente
- Tutti i dati in transito sono criptati

## ⚡ Performance

### Ottimizzazioni Implementate

1. **Lazy Loading**
   - Caricamento sezioni on-demand
   - Immagini ottimizzate

2. **Caching**
   - Service Worker ready
   - LocalStorage per preferenze

3. **Minimizzazione**
   - CSS ottimizzato con variabili
   - JavaScript modulare

4. **Responsive Images**
   - Adattamento dimensioni
   - WebP support ready

### Metriche Target

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.0s
- **Lighthouse Score**: > 90

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile First Approach */
/* Mobile: 320px - 767px */
/* Tablet: 768px - 1023px */
/* Desktop: 1024px+ */

@media (max-width: 768px) {
    /* Mobile optimizations */
}
```

### Touch Optimizations
- Minimum tap target: 44x44px
- Swipe gestures ready
- Signature pad touch-friendly

## 🌐 Browser Compatibility

### Supportati
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

### Polyfills Necessari
- Nessuno (uso di funzionalità ES6+ ben supportate)

### Progressive Enhancement
- Funzionalità base senza JavaScript
- Fallback per browser obsoleti

## 🔌 API Integration (Future)

### Backend API Structure

```javascript
// POST /api/v1/pir
{
    "personal": { /* ... */ },
    "flight": { /* ... */ },
    "baggage": { /* ... */ },
    "documents": [
        { "type": "boarding_pass", "data": "base64..." },
        { "type": "id_document", "data": "base64..." }
    ],
    "signature": "base64...",
    "language": "it"
}

// Response
{
    "reference": "PIR-FCO-2024-001234",
    "status": "submitted",
    "tracking_url": "/api/v1/pir/PIR-FCO-2024-001234"
}
```

### Third-Party Integrations

1. **Computer Vision API**
   - Google Cloud Vision
   - AWS Rekognition
   - Azure Computer Vision

2. **InsurTech Partner API**
   - Claim submission
   - Status tracking
   - Reimbursement processing

3. **Handler Systems**
   - Baggage tracking
   - Delivery updates

## 🧪 Testing Strategy

### Unit Testing (Future)
```javascript
// Jest framework
describe('Form Validation', () => {
    test('validates required fields', () => {
        expect(validateStep(2)).toBe(false);
    });
});
```

### E2E Testing (Future)
- Cypress for end-to-end flows
- Playwright for cross-browser testing

### Manual Testing Checklist
- ✅ Form completion flow
- ✅ Language switching
- ✅ File upload
- ✅ Signature capture
- ✅ Responsive layouts
- ✅ Cross-browser compatibility

## 📊 Monitoring & Analytics

### Metriche da Tracciare

1. **User Behavior**
   - Page views
   - Step completion rates
   - Drop-off points
   - Average completion time

2. **Technical**
   - Error rates
   - API response times
   - Browser/device distribution

3. **Business**
   - PIR submissions
   - Language preferences
   - Peak usage hours

### Tools Suggeriti
- Google Analytics 4
- Hotjar per heatmaps
- Sentry per error tracking

## 🚀 Deployment Pipeline

```
┌─────────────┐
│  Developer  │
└──────┬──────┘
       │ git push
       ▼
┌─────────────┐
│   GitHub    │
└──────┬──────┘
       │ triggers
       ▼
┌──────────────┐
│ GitHub       │
│ Actions      │
└──────┬───────┘
       │ builds
       ▼
┌──────────────┐
│ GitHub Pages │◄── Auto-deploy
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Production │
│     Live     │
└──────────────┘
```

## 📈 Scalabilità

### Vertical Scaling
- Ottimizzazione codice
- Caching aggressivo
- Code splitting

### Horizontal Scaling
- CDN distribution
- Multiple regions
- Load balancing (se necessario backend)

### Database (Future Backend)
```
┌──────────────┐
│  PostgreSQL  │◄── Primary DB (PIR data)
└──────────────┘

┌──────────────┐
│    Redis     │◄── Cache layer
└──────────────┘

┌──────────────┐
│      S3      │◄── Document storage
└──────────────┘
```

## 🔧 Manutenzione

### Aggiornamenti Regolari
- Dipendenze (Chart.js, Font Awesome)
- Security patches
- Feature enhancements

### Backup Strategy
- Git repository = backup automatico
- Export dati utente su richiesta

## 📝 Documentazione

### Documenti Tecnici
- ✅ Questo documento (ARCHITECTURE.md)
- ✅ README.md (guida utente)
- ✅ DEPLOYMENT_GUIDE.md (deployment)
- [ ] API_DOCUMENTATION.md (future)

### Code Documentation
- JSDoc comments nel codice
- Inline comments per logica complessa
- README in ogni modulo

---

**Versione**: 1.0.0  
**Ultimo aggiornamento**: Gennaio 2024  
**Team**: PIR & CARE - Aeroporti di Roma
