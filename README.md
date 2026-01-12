# MAV Tracker - React Version 3.0

Applicazione web professionale per il tracking degli allenamenti basati sulla metodologia MAV (Miglior Alzata Veloce / Maximum Achievable Volume).

## 🚀 Caratteristiche

- ✅ Autenticazione sicura con Supabase
- 📊 Dashboard con statistiche in tempo reale
- 💪 Registrazione workout con supporto multi-metodologia (MAV, AMRAP, tradizionali)
- 📈 Grafici di progressione per esercizio
- 🏆 Tracking dei Personal Records (PR)
- ⏱️ Timer per pause tra le serie
- 📱 Ottimizzato per mobile (iPhone) e desktop
- 🔄 Sincronizzazione cloud con Supabase
- ✏️ Modifica e duplicazione workout
- 🎯 Sequenza MAV automatica

## 📋 Prerequisiti

- Node.js 18+ e npm
- Account Supabase (gratuito)
- Account GitHub (per deployment)

## 🛠️ Setup Locale

### 1. Clona il repository

```bash
git clone https://github.com/tuo-username/mav-tracker.git
cd mav-tracker
```

### 2. Installa le dipendenze

```bash
npm install
```

### 3. Configura Supabase

1. Crea un progetto su [Supabase](https://supabase.com)
2. Vai su `Settings` > `API`
3. Copia Project URL e anon/public key

### 4. Configura le variabili d'ambiente

Crea un file `.env.local` nella root del progetto:

```env
VITE_SUPABASE_URL=https://tuoprogetto.supabase.co
VITE_SUPABASE_ANON_KEY=tua_chiave_anon_key
```

### 5. Setup Database Supabase

Esegui le query SQL dal file `database-setup.sql` nel SQL Editor di Supabase (vedi sezione Database Setup completa nel README)

### 6. Avvia il server di sviluppo

```bash
npm run dev
```

L'app sarà disponibile su `http://localhost:3000`

## 🚀 Deployment su Vercel (Consigliato)

### 1. Push su GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/tuo-username/mav-tracker.git
git push -u origin main
```

### 2. Deploy su Vercel

1. Vai su [Vercel](https://vercel.com)
2. Clicca "New Project"
3. Importa il repository GitHub
4. In "Environment Variables" aggiungi:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Clicca "Deploy"

## 🔒 Sicurezza

- ✅ Variabili d'ambiente sicure tramite GitHub Secrets/Vercel
- ✅ Row Level Security (RLS) su Supabase
- ✅ Autenticazione gestita da Supabase Auth
- ✅ API keys mai committate nel codice

## 📚 Struttura del Progetto

```
mav-tracker/
├── src/
│   ├── components/      # Componenti React
│   │   ├── Auth/       # Login/Register
│   │   └── UI/         # Componenti riutilizzabili
│   ├── config/         # Configurazione Supabase
│   ├── hooks/          # Custom hooks
│   ├── utils/          # Utility functions
│   └── styles/         # CSS globale
├── .env.example        # Template variabili
├── package.json
└── vite.config.js
```

## 🛠️ Scripts

- `npm run dev` - Server di sviluppo
- `npm run build` - Build produzione
- `npm run preview` - Preview build

## 📄 Licenza

MIT

---

**MAV Tracker v3.0** - Tracking intelligente per allenamenti MAV
