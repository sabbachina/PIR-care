# 🚀 Guida Deployment PIR & CARE su GitHub Pages

## 📋 Prerequisiti

Prima di iniziare, assicurati di avere:
- Un account GitHub (gratuito)
- Git installato sul tuo computer
- Un browser web moderno

## 🎯 Step-by-Step Guide

### Passo 1: Scarica i File

Scarica tutti i file della webapp PIR & CARE dal computer link fornito.

### Passo 2: Crea un Nuovo Repository su GitHub

1. Vai su [github.com](https://github.com) e accedi
2. Clicca su "+" in alto a destra e seleziona "New repository"
3. Compila i campi:
   - **Repository name**: `pir-care-app` (o un nome a tua scelta)
   - **Description**: "PIR & CARE - Smart Baggage Management System"
   - **Public**: Seleziona "Public" per usare GitHub Pages gratuitamente
   - **Non** aggiungere README, .gitignore o license (li abbiamo già)
4. Clicca su "Create repository"

### Passo 3: Carica i File su GitHub

#### Opzione A: Usando la Web Interface (Più Semplice)

1. Nel repository appena creato, clicca su "uploading an existing file"
2. Trascina tutti i file e cartelle della webapp
3. Scrivi un messaggio di commit: "Initial commit - PIR & CARE App"
4. Clicca su "Commit changes"

#### Opzione B: Usando Git da Linea di Comando

```bash
# 1. Naviga nella cartella dell'app
cd /percorso/della/tua/cartella/pir-care-app

# 2. Inizializza Git
git init

# 3. Aggiungi tutti i file
git add .

# 4. Crea il primo commit
git commit -m "Initial commit - PIR & CARE App"

# 5. Collega al repository remoto (sostituisci [username] con il tuo username GitHub)
git remote add origin https://github.com/[username]/pir-care-app.git

# 6. Rinomina il branch principale
git branch -M main

# 7. Push dei file
git push -u origin main
```

### Passo 4: Attiva GitHub Pages

1. Nel tuo repository su GitHub, clicca su **"Settings"** (Impostazioni)
2. Nel menu laterale sinistro, scorri e clicca su **"Pages"**
3. Nella sezione "Build and deployment":
   - **Source**: Seleziona "Deploy from a branch"
   - **Branch**: Seleziona "main" e "/ (root)"
   - Clicca su **"Save"**
4. Aspetta 1-2 minuti per il deployment

### Passo 5: Accedi alla Tua Webapp

Dopo il deployment, la tua webapp sarà disponibile su:

```
https://[tuo-username].github.io/pir-care-app/
```

Sostituisci `[tuo-username]` con il tuo username GitHub.

## ✅ Verifica il Deployment

1. Apri l'URL della tua webapp nel browser
2. Verifica che la homepage si carichi correttamente
3. Testa le funzionalità principali:
   - Cambio lingua
   - Navigazione tra le sezioni
   - Form di compilazione PIR

## 🔄 Aggiornamenti Futuri

Per aggiornare la webapp in futuro:

### Con Web Interface:

1. Vai al tuo repository su GitHub
2. Clicca sul file da modificare
3. Clicca sull'icona della matita per editare
4. Fai le modifiche
5. Commit delle modifiche
6. GitHub Pages si aggiornerà automaticamente in 1-2 minuti

### Con Git:

```bash
# 1. Fai le tue modifiche ai file localmente

# 2. Aggiungi i file modificati
git add .

# 3. Crea un commit con un messaggio descrittivo
git commit -m "Descrizione delle modifiche"

# 4. Push al repository
git push origin main
```

Il deployment automatico partirà grazie al workflow GitHub Actions!

## 🛠️ Troubleshooting

### Problema: La pagina mostra 404

**Soluzione:**
- Verifica che GitHub Pages sia attivato nelle Settings
- Controlla che il branch sia "main" e la cartella sia "/ (root)"
- Aspetta 5 minuti e prova a ricaricare la pagina
- Svuota la cache del browser (Ctrl+Shift+R o Cmd+Shift+R)

### Problema: Gli stili CSS non si caricano

**Soluzione:**
- Verifica che il file `styles.css` sia nella root del repository
- Controlla che non ci siano errori nella console del browser (F12)
- Verifica i percorsi dei file in `index.html`

### Problema: Le traduzioni non funzionano

**Soluzione:**
- Verifica che il file `translations.js` sia caricato correttamente
- Controlla la console del browser per errori JavaScript
- Assicurati che `translations.js` sia linkato prima di `app.js` nell'HTML

## 🌐 Custom Domain (Opzionale)

Se vuoi usare un dominio personalizzato (es. pircare.com):

1. Acquista un dominio da un registrar (GoDaddy, Namecheap, etc.)
2. In GitHub Pages Settings, aggiungi il custom domain
3. Nel tuo registrar, crea un record DNS CNAME che punta a:
   ```
   [tuo-username].github.io
   ```
4. Aspetta la propagazione DNS (24-48 ore)

## 📊 Monitoraggio

GitHub fornisce statistiche di accesso:
- Vai su "Insights" > "Traffic" nel tuo repository
- Vedi visualizzazioni, visitatori unici, fonti di traffico

## 🔒 Sicurezza

Per proteggere l'applicazione:

1. **HTTPS**: GitHub Pages fornisce HTTPS automaticamente
2. **Secrets**: Non includere mai API keys o secrets nei file pubblici
3. **Privacy**: Ricorda che il repository pubblico è visibile a tutti

## 💡 Best Practices

1. **Commit Frequenti**: Fai commit piccoli e frequenti con messaggi chiari
2. **Branch**: Usa branch separati per feature in sviluppo
3. **Testing**: Testa localmente prima di fare push
4. **Backup**: Mantieni una copia locale di sicurezza
5. **Documentazione**: Aggiorna il README per ogni modifica significativa

## 🎓 Risorse Utili

- [Documentazione GitHub Pages](https://docs.github.com/pages)
- [Guida Git](https://git-scm.com/book/en/v2)
- [GitHub Actions](https://docs.github.com/actions)
- [HTML/CSS/JS Reference](https://developer.mozilla.org/en-US/)

## 📞 Supporto

Se hai problemi con il deployment:

1. Controlla la [documentazione ufficiale di GitHub Pages](https://docs.github.com/pages)
2. Cerca su [Stack Overflow](https://stackoverflow.com/questions/tagged/github-pages)
3. Contatta il team: hangarprogram@adr.it

## 🎉 Congratulazioni!

Hai deployato con successo PIR & CARE su GitHub Pages!

La tua webapp è ora live e accessibile da chiunque nel mondo. 🌍

---

**Fatto con ❤️ per Aeroporti di Roma - Hangar Program 2024**
