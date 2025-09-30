# PIR & CARE - Smart Baggage Management System

![PIR & CARE Logo](https://img.shields.io/badge/PIR%20%26%20CARE-Smart%20Baggage-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)
![License](https://img.shields.io/badge/license-MIT-yellow)

## 📋 Panoramica del Progetto

**PIR & CARE** è la prima piattaforma digitale aeroportuale per la gestione intelligente dei bagagli smarriti, sviluppata per il programma Hangar di Aeroporti di Roma (ADR).

### 🎯 Obiettivi

- Ridurre il tempo di compilazione del PIR (Property Irregularity Report) da 25 a 5 minuti
- Eliminare le barriere linguistiche tramite supporto multilingua
- Fornire assistenza AI per la compilazione guidata dei moduli
- Offrire tracking real-time del processo di rimborso
- Creare un nuovo modello di revenue per ADR tramite partnership innovative

### ✨ Caratteristiche Principali

- **🤖 Assistenza AI Multilingue**: Compilazione guidata in 6 lingue (IT, EN, ES, FR, DE, ZH)
- **📸 Computer Vision**: Scan automatico di documenti di viaggio
- **✍️ Firma Digitale**: Firma elettronica integrata
- **📊 Tracking Real-Time**: Monitoraggio dello stato del bagaglio
- **📱 Responsive Design**: Ottimizzato per desktop, tablet e mobile
- **🔒 GDPR Compliant**: Conforme alle normative sulla privacy

## 🚀 Demo Live

**[Visualizza la Demo](https://[tuo-username].github.io/pir-care-app/)**

## 📸 Screenshots

### Home Page
Landing page con CTA chiaro e spiegazione delle funzionalità

### Form Compilazione PIR
Wizard a 5 step per la compilazione guidata

### Tracking Status
Timeline interattiva per monitorare lo stato del bagaglio

### Dashboard Analytics
Dashboard per gli operatori ADR con statistiche e KPI

## 🛠️ Tecnologie Utilizzate

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Charts**: Chart.js per visualizzazioni dati
- **Icons**: Font Awesome 6
- **Storage**: LocalStorage per dati temporanei
- **Deployment**: GitHub Pages

## 📦 Installazione e Deploy

### Opzione 1: Deploy su GitHub Pages (Consigliato)

1. **Fork o clona il repository**
```bash
git clone https://github.com/[tuo-username]/pir-care-app.git
cd pir-care-app
```

2. **Push su GitHub**
```bash
git init
git add .
git commit -m "Initial commit - PIR & CARE App"
git branch -M main
git remote add origin https://github.com/[tuo-username]/pir-care-app.git
git push -u origin main
```

3. **Attiva GitHub Pages**
   - Vai su Settings > Pages
   - Source: Deploy from a branch
   - Branch: main / (root)
   - Salva

4. **Accedi all'app**
   - L'app sarà disponibile su: `https://[tuo-username].github.io/pir-care-app/`

### Opzione 2: Esecuzione Locale

1. **Avvia un server locale**
```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (http-server)
npx http-server -p 8000

# Con PHP
php -S localhost:8000
```

2. **Apri il browser**
```
http://localhost:8000
```

## 📁 Struttura del Progetto

```
pir-care-app/
│
├── index.html           # Pagina principale
├── styles.css           # Stili CSS
├── app.js              # Logica applicazione
├── translations.js     # Traduzioni multilingua
├── README.md           # Documentazione
└── LICENSE            # Licenza MIT
```

## 🎨 Customizzazione

### Modifica dei Colori

Nel file `styles.css`, modifica le variabili CSS:

```css
:root {
    --primary-color: #0066cc;      /* Colore principale */
    --secondary-color: #00a651;    /* Colore secondario */
    --success-color: #28a745;      /* Colore successo */
    /* ... altri colori ... */
}
```

### Aggiunta di Nuove Lingue

Nel file `translations.js`, aggiungi una nuova lingua:

```javascript
const translations = {
    // ... lingue esistenti ...
    
    // Nuova lingua
    pt: {
        heroTitle: "Perdeu a sua bagagem?",
        heroSubtitle: "Complete seu PIR em 5 minutos...",
        // ... altre traduzioni ...
    }
};
```

Aggiungi il pulsante della lingua in `index.html`:

```html
<button class="lang-option" data-lang="pt">
    <i class="fas fa-flag"></i>
    <span>Português</span>
</button>
```

## 🔌 Integrazione API (Future)

Il sistema è predisposto per l'integrazione con API backend:

```javascript
// app.js - Esempio di integrazione API

async function submitPIR() {
    try {
        const response = await fetch('https://api.pircare.com/v1/pir', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_API_KEY'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        // Gestisci la risposta
    } catch (error) {
        console.error('Errore durante l\'invio:', error);
    }
}
```

## 📊 Business Model

### Revenue Streams

1. **Canone Concessione Spazi**: €150K-200K/anno per uso spazi area arrivi
2. **Revenue Sharing**: 20% dei margini partner InsurTech
3. **Licensing Tecnologia**: €150K/aeroporto per licenza software
4. **Data Analytics**: Insights e analytics su comportamenti passeggeri

### Target Utenti

- **126,000+ passeggeri/anno** a Fiumicino con bagaglio smarrito
- **21 milioni passeggeri in arrivo** potenziali utenti del servizio
- **Acceptance rate obiettivo**: 5% anno 1 → 20% anno 5

### Scalabilità

**Fase 1 (Anno 1)**: Lancio FCO
**Fase 2 (Anno 2)**: Espansione CIA
**Fase 3 (Anno 3)**: Licensing nazionale (MXP, VCE)
**Fase 4-5 (Anni 4-5)**: Espansione europea

## 🧪 Testing

### Test Manuale

1. **Test Compilazione Completa**
   - Carica documenti
   - Compila tutti i campi
   - Firma digitalmente
   - Verifica invio PIR

2. **Test Multilingua**
   - Cambia lingua in tutte le 6 disponibili
   - Verifica traduzioni corrette

3. **Test Responsivo**
   - Testa su desktop (1920x1080)
   - Testa su tablet (768x1024)
   - Testa su mobile (375x667)

### Browser Supportati

- ✅ Chrome/Edge (v90+)
- ✅ Firefox (v88+)
- ✅ Safari (v14+)
- ✅ Opera (v76+)

## 📈 KPI e Metriche

### Metriche Operative

- **Tempo medio compilazione**: Target 5 minuti (vs 25 tradizionale)
- **Tasso completamento**: Target >85%
- **NPS**: Target +20 punti su touchpoint

### Metriche di Business

- **Acceptance Rate**: 5% → 20% in 5 anni
- **Revenue per PAX**: €4-8 per caso gestito
- **CAC (Customer Acquisition Cost)**: Minimizzato da posizionamento aeroporto

## 🤝 Contributi

Questo progetto è stato sviluppato per il programma Hangar di ADR. Per contributi o suggerimenti:

1. Fork il progetto
2. Crea un feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit delle modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📄 Licenza

Questo progetto è rilasciato sotto licenza MIT. Vedi il file `LICENSE` per dettagli.

## 👥 Team PIR & CARE

- **Giorgia Roticiani** - Caposquadra - giorgia.roticiani@adr.it
- **Marco Monini** - marco.monini@adr.it
- **Riccardo Sabbadini** - riccardo.sabbadini@adr.it
- **Cristina D'Eramo** - cristina.deramo@adr.it
- **Fabio Matta** - fabio.matta@adr.it

## 📞 Contatti e Supporto

- **Email**: hangarprogram@adr.it
- **Website**: [www.adr.it](https://www.adr.it)
- **Sede**: Via Pier Paolo Racchetti, 1 - 00054 Fiumicino (Roma)

## 🙏 Ringraziamenti

- Aeroporti di Roma S.p.A. per l'opportunità
- Hangar Program per il supporto
- Tutti i partecipanti e valutatori del programma

---

**Made with ❤️ for Aeroporti di Roma - Hangar Program 2024**

## 🔮 Roadmap Futura

### v1.1 (Q2 2024)
- [ ] Integrazione API backend
- [ ] Sistema di notifiche push
- [ ] Chat supporto in tempo reale
- [ ] Upload documenti multipli ottimizzato

### v1.2 (Q3 2024)
- [ ] Computer Vision avanzata con OCR
- [ ] LLM per assistenza conversazionale
- [ ] Integrazione pagamenti per servizi premium
- [ ] App mobile nativa (iOS/Android)

### v2.0 (Q4 2024)
- [ ] Sistema di matching AI bagagli
- [ ] Blockchain per certificazione documenti
- [ ] Realtà aumentata per identificazione bagagli
- [ ] Marketplace servizi complementari

---

**🚀 Deploy ora la tua istanza su GitHub Pages e inizia a gestire i bagagli smarriti in modo intelligente!**
