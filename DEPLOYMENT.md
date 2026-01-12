# 🚀 Guida Deployment MAV Tracker

Questa guida ti accompagnerà passo-passo nel deployment dell'applicazione MAV Tracker usando GitHub Secrets e Vercel.

## 📋 Prerequisiti

- Account GitHub
- Account Vercel (gratuito)
- Account Supabase (gratuito)
- Git installato localmente
- Node.js 18+ installato

## 🗄️ Step 1: Setup Database Supabase

### 1.1 Crea progetto Supabase

1. Vai su [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Crea un nuovo progetto (scegli nome, password, regione)
4. Aspetta che il progetto sia pronto (~2 minuti)

### 1.2 Configura Database

1. Nel dashboard Supabase, vai su **SQL Editor**
2. Click "New query"
3. Copia e incolla lo schema SQL completo dal README.md (sezione "Configura Supabase")
4. Click "Run" per eseguire lo script
5. Verifica che le tabelle siano create: vai su **Table Editor** e dovresti vedere:
   - `exercises`
   - `workouts`
   - `workout_exercises`
   - `workout_sets`

### 1.3 Abilita Authentication

1. Vai su **Authentication** → **Providers**
2. Assicurati che **Email** sia abilitato
3. In **Email Templates**, puoi personalizzare l'email di conferma (opzionale)

### 1.4 Ottieni le credenziali

1. Vai su **Settings** → **API**
2. Copia e salva in un posto sicuro:
   - **Project URL** (es. `https://xxxxx.supabase.co`)
   - **anon/public key** (la chiave lunga che inizia con `eyJ...`)

⚠️ **IMPORTANTE**: NON condividere mai la `service_role` key pubblicamente!

---

## 📦 Step 2: Setup Repository GitHub

### 2.1 Prepara il progetto localmente

```bash
# Naviga nella cartella del progetto
cd mav-tracker-react

# Inizializza Git (se non già fatto)
git init

# Aggiungi tutti i file
git add .

# Primo commit
git commit -m "Initial commit - MAV Tracker v3.0"
```

### 2.2 Crea repository su GitHub

1. Vai su [github.com](https://github.com)
2. Click sul "+" in alto a destra → "New repository"
3. Nome repository: `mav-tracker` (o quello che preferisci)
4. Lascia tutto il resto come default (Public o Private a tua scelta)
5. **NON** inizializzare con README, .gitignore o license (già presenti localmente)
6. Click "Create repository"

### 2.3 Push del codice

```bash
# Collega il repository remoto (usa l'URL fornito da GitHub)
git remote add origin https://github.com/TUO-USERNAME/mav-tracker.git

# Rinomina branch principale in 'main'
git branch -M main

# Push del codice
git push -u origin main
```

### 2.4 Configura GitHub Secrets

1. Nel tuo repository GitHub, vai su **Settings** → **Secrets and variables** → **Actions**
2. Click "New repository secret"
3. Aggiungi i seguenti secrets uno alla volta:

**Secret 1: VITE_SUPABASE_URL**
- Name: `VITE_SUPABASE_URL`
- Value: `https://xxxxx.supabase.co` (il tuo Project URL da Supabase)

**Secret 2: VITE_SUPABASE_ANON_KEY**
- Name: `VITE_SUPABASE_ANON_KEY`
- Value: La tua anon key da Supabase (inizia con `eyJ...`)

---

## 🌐 Step 3: Deploy su Vercel

### 3.1 Crea account Vercel

1. Vai su [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. **Importante**: Registrati con lo stesso account GitHub che hai usato per il repository

### 3.2 Importa progetto

1. Nel dashboard Vercel, click "Add New..." → "Project"
2. Vercel mostrerà i tuoi repository GitHub
3. Click "Import" sul repository `mav-tracker`

### 3.3 Configura Build Settings

Vercel dovrebbe rilevare automaticamente le impostazioni Vite:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

Se non le rileva, impostale manualmente.

### 3.4 Aggiungi Environment Variables

**CRITICO**: Prima di fare il deploy, aggiungi le variabili d'ambiente:

1. Nella schermata di import, espandi la sezione **Environment Variables**
2. Aggiungi le seguenti variabili:

**Variabile 1:**
- Key: `VITE_SUPABASE_URL`
- Value: `https://xxxxx.supabase.co`
- Select environments: Production, Preview, Development (tutte e tre)

**Variabile 2:**
- Key: `VITE_SUPABASE_ANON_KEY`
- Value: La tua anon key
- Select environments: Production, Preview, Development (tutte e tre)

### 3.5 Deploy!

1. Click "Deploy"
2. Vercel inizierà il build (ci vorranno 1-2 minuti)
3. Una volta completato, vedrai "Congratulations! 🎉"
4. Click sul link del dominio per aprire la tua app (es. `mav-tracker.vercel.app`)

---

## 🔄 Step 4: Setup Deploy Automatico con GitHub Actions (Opzionale)

Se vuoi usare GitHub Actions per il deploy automatico:

### 4.1 Ottieni Token Vercel

1. Vai su [vercel.com](https://vercel.com)
2. Click sulla tua foto profilo → **Settings**
3. Vai su **Tokens**
4. Click "Create Token"
5. Nome: `GitHub Actions`
6. Scope: Lascia i permessi di default
7. Click "Create Token"
8. **COPIA IL TOKEN SUBITO** (non sarà più visibile)

### 4.2 Ottieni Project ID e Org ID

Dopo il primo deploy su Vercel:

1. Nel dashboard del progetto Vercel, vai su **Settings**
2. Troverai:
   - **Project ID** (stringa alfanumerica)
   - **Team ID/Org ID** (o vai su Settings del tuo account → General)

### 4.3 Aggiungi Secrets a GitHub

Torna su GitHub → Settings → Secrets and variables → Actions

Aggiungi questi 3 nuovi secrets:

- Name: `VERCEL_TOKEN` / Value: Il token creato al punto 4.1
- Name: `VERCEL_PROJECT_ID` / Value: Il Project ID da Vercel
- Name: `VERCEL_ORG_ID` / Value: Il Team/Org ID da Vercel

### 4.4 Verifica GitHub Actions

1. Il file `.github/workflows/deploy.yml` è già presente nel repository
2. Fai un push qualsiasi:
   ```bash
   # Modifica qualcosa (es. README)
   git add .
   git commit -m "Test deploy automatico"
   git push
   ```
3. Vai su GitHub → **Actions** tab
4. Vedrai il workflow "Deploy to Vercel" in esecuzione
5. Quando completa, l'app sarà aggiornata su Vercel

---

## ✅ Step 5: Verifica e Test

### 5.1 Test dell'applicazione

1. Apri l'URL Vercel della tua app
2. Prova a registrare un nuovo account
3. Controlla la tua email per il link di conferma
4. Accedi e prova a creare un workout
5. Verifica che i dati vengano salvati correttamente

### 5.2 Troubleshooting comune

**Problema: "Configurazione Supabase mancante"**
- Soluzione: Verifica che le env variables siano state aggiunte correttamente su Vercel
- Vai su Vercel → Progetto → Settings → Environment Variables
- Se mancano o sono errate, aggiungile/modificale e fai "Redeploy"

**Problema: "Database connection error"**
- Soluzione: Verifica che lo schema SQL sia stato eseguito correttamente su Supabase
- Vai su Supabase → Table Editor e verifica che le tabelle esistano

**Problema: "Cannot read property of undefined"**
- Soluzione: Probabilmente un errore nel database. Controlla i logs:
  - Vercel: Progetto → Deployments → Click sul deployment → Functions tab → Logs
  - Supabase: Logs & Analytics → Query Performance

**Problema: Build fallisce su Vercel**
- Soluzione 1: Verifica i logs di build su Vercel
- Soluzione 2: Controlla che package.json non abbia dipendenze mancanti
- Soluzione 3: Prova a fare build locale: `npm run build`

---

## 🔧 Configurazioni Avanzate

### Custom Domain (Opzionale)

1. Su Vercel, vai su Settings → Domains
2. Aggiungi il tuo dominio custom
3. Segui le istruzioni per configurare DNS

### Auto-deploy da altri branch

Modifica `.github/workflows/deploy.yml`:
```yaml
on:
  push:
    branches: [main, develop, staging]  # Aggiungi altri branch
```

### Deploy Preview per Pull Requests

È già configurato nel workflow! Ogni PR avrà un deploy di preview automatico.

---

## 📊 Monitoring e Manutenzione

### Logs Vercel
- Dashboard Progetto → Deployments → Click su deployment → Logs

### Logs Supabase
- Dashboard → Logs & Analytics

### Analytics Vercel (Opzionale)
- Dashboard Progetto → Analytics
- Vedi visite, performance, etc.

### Backup Database
- Supabase fa backup automatici
- Per export manuale: Dashboard → Database → Backup & Restore

---

## 🎉 Completato!

Congratulazioni! La tua app MAV Tracker è ora:
- ✅ Deployata su Vercel
- ✅ Con database cloud su Supabase
- ✅ Deploy automatico ad ogni push
- ✅ Variabili d'ambiente sicure con GitHub Secrets
- ✅ Accessibile da qualsiasi dispositivo

### Prossimi passi suggeriti:

1. **PWA**: Trasforma l'app in una Progressive Web App installabile
2. **Custom Domain**: Collega un tuo dominio personale
3. **Analytics**: Aggiungi Google Analytics o Vercel Analytics
4. **Backup Strategy**: Imposta backup regolari del database
5. **Monitoring**: Configura alerting per errori critici

---

## 🆘 Bisogno di aiuto?

- [Documentazione Vercel](https://vercel.com/docs)
- [Documentazione Supabase](https://supabase.com/docs)
- [Documentazione Vite](https://vitejs.dev)
- [React Docs](https://react.dev)

**Bug o domande?** Apri un issue su GitHub!
