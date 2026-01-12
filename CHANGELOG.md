# Changelog

Tutte le modifiche significative al progetto MAV Tracker sono documentate in questo file.

Il formato è basato su [Keep a Changelog](https://keepachangelog.com/it/1.0.0/),
e questo progetto aderisce al [Semantic Versioning](https://semver.org/lang/it/).

## [3.0.0] - 2025-01-10

### 🎉 Migrazione Completa a React + Vite

Reimplementazione completa dell'applicazione MAV Tracker in React con architettura moderna e modulare.

### ✨ Added
- Architettura React con componenti modulari e riutilizzabili
- Custom hooks per gestione stato (useAuth, useWorkouts)
- Build system Vite per sviluppo veloce e build ottimizzate
- Gestione sicura delle variabili d'ambiente tramite GitHub Secrets
- Deploy automatico su Vercel tramite GitHub Actions
- Supporto per editing inline dei set durante il workout
- Funzionalità di duplicazione workout
- Script di verifica configurazione environment (`scripts/check-env.js`)
- Documentazione completa (README, DEPLOYMENT, QUICK_START)
- Configurazione ESLint per code quality
- PWA manifest preparato per future implementazioni
- Vercel.json con ottimizzazioni caching

### 🔄 Changed
- Migrato da single-file HTML a architettura React modulare
- Migliorata separazione delle responsabilità con pattern component-based
- Ottimizzata gestione stato con React hooks
- Migliorata UX per editing workout e set
- Configurazione database ora tramite variabili d'ambiente invece che UI

### 🛠️ Technical
- **Frontend**: React 18.2 + Vite 5.0
- **Database**: Supabase con Row Level Security
- **Charts**: Chart.js 4.4 + react-chartjs-2
- **Deployment**: Vercel con GitHub Actions CI/CD
- **Environment**: Gestione sicura con .env.local e GitHub Secrets

### 📝 Documentation
- README.md completo con setup e deployment
- DEPLOYMENT.md con guida step-by-step dettagliata
- QUICK_START.md per setup rapido in 5 minuti
- .env.local.example con commenti dettagliati
- Documentazione GitHub Actions workflow

### 🔒 Security
- Variabili d'ambiente non più hardcoded
- .env.local git-ignored per sicurezza
- Supporto GitHub Secrets per deploy automatici
- Row Level Security policies su Supabase

---

## [2.3.0] - 2024-12-XX (Versione HTML Precedente)

### Added
- Editing completo workout esistenti
- Duplicazione workout
- Editing inline set individuali
- "Quick Add Multi-Sets" per inserimento rapido

### Changed
- Migliorata UX per modifica workout
- Supporto multi-metodologia (MAV + tradizionale + AMRAP)

---

## [2.2.0] - 2024-XX-XX

### Added
- Integrazione Supabase per cloud sync
- Autenticazione utenti
- Database PostgreSQL con RLS

---

## [2.1.0] - 2024-XX-XX

### Added
- Sequenze MAV automatiche
- Grafici progressi per esercizio
- Personal Records tracking

---

## [2.0.0] - 2024-XX-XX

### Added
- Versione cloud con localStorage
- Multi-device support
- Timer recupero

---

## [1.0.0] - 2024-XX-XX

### Added
- Versione iniziale single-file HTML
- Tracking workout base
- Calcolo tonnellaggio
- Supporto MAV methodology

---

## 🚀 Roadmap Futura

Vedi [GitHub Issues](https://github.com/tuo-username/mav-tracker/issues) per features pianificate.

### In Considerazione
- [ ] PWA completa installabile
- [ ] Modalità offline avanzata
- [ ] Export/Import dati (CSV, JSON)
- [ ] Template workout predefiniti
- [ ] Social sharing progressi
- [ ] Dark mode
- [ ] Multi-lingua (EN, IT, ES)
- [ ] Integrazione wearables (opzionale)
- [ ] Analytics avanzate
- [ ] Community features (opzionale)

---

**Tipo di Modifiche:**
- `Added` - Nuove features
- `Changed` - Modifiche a features esistenti
- `Deprecated` - Features che saranno rimosse
- `Removed` - Features rimosse
- `Fixed` - Bug fixes
- `Security` - Vulnerabilità fixate
