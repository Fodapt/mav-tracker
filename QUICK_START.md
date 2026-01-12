# ⚡ Quick Start - MAV Tracker

Avvia l'app in 5 minuti!

## 🚀 Setup Rapido

### 1. Clone e Install
```bash
git clone https://github.com/tuo-username/mav-tracker.git
cd mav-tracker
npm install
```

### 2. Setup Supabase (2 minuti)
1. Vai su [supabase.com](https://supabase.com) → Crea progetto
2. SQL Editor → Esegui lo schema dal README.md
3. Settings → API → Copia URL e anon key

### 3. Environment Variables
Crea `.env.local` nella root:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run!
```bash
npm run dev
```

Apri http://localhost:3000 🎉

---

## 📦 Deploy su Vercel (1 minuto)

### Via UI (Più semplice)
1. Push su GitHub
2. [Importa su Vercel](https://vercel.com/new)
3. Aggiungi le env variables
4. Deploy!

### Via CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

Aggiungi env variables quando richiesto.

---

## 🎯 Comandi Utili

```bash
npm run dev      # Dev server
npm run build    # Production build
npm run preview  # Preview build locale
npm run lint     # Check codice
```

---

## 🆘 Problemi?

**App non si avvia**: Verifica che `.env.local` esista e sia corretto

**Errori DB**: Verifica che lo schema SQL sia stato eseguito su Supabase

**Build fallisce**: Controlla i logs e verifica le dipendenze

---

**Guida completa**: Vedi [README.md](./README.md) e [DEPLOYMENT.md](./DEPLOYMENT.md)
