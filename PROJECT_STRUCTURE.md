# 📁 Struttura Progetto MAV Tracker

Documentazione dell'organizzazione del codice e delle directory del progetto.

## 🌲 Tree Completo

```
mav-tracker-react/
├── 📄 Configurazione Root
│   ├── package.json              # Dipendenze e scripts NPM
│   ├── vite.config.js            # Configurazione Vite
│   ├── vercel.json               # Configurazione Vercel
│   ├── .eslintrc.cjs             # Configurazione ESLint
│   ├── .gitignore                # File da ignorare in Git
│   ├── .env.example              # Template variabili d'ambiente
│   └── .env.local.example        # Template dettagliato env vars
│
├── 📚 Documentazione
│   ├── README.md                 # Documentazione principale
│   ├── QUICK_START.md            # Setup rapido 5 minuti
│   ├── DEPLOYMENT.md             # Guida deployment dettagliata
│   ├── CHANGELOG.md              # Storia versioni
│   └── PROJECT_STRUCTURE.md      # Questo file
│
├── 🛠️ Scripts Utility
│   ├── setup.sh                  # Script setup automatico
│   └── scripts/
│       └── check-env.js          # Verifica configurazione env
│
├── 🌐 Public Assets
│   └── public/
│       ├── manifest.json         # PWA manifest
│       └── robots.txt            # SEO robots
│
├── 🎯 Source Code
│   └── src/
│       ├── main.jsx              # Entry point React
│       ├── App.jsx               # Root component
│       │
│       ├── 🎨 Styling
│       │   └── styles/
│       │       └── global.css    # Stili globali e variabili CSS
│       │
│       ├── ⚙️ Configuration
│       │   └── config/
│       │       └── supabase.js   # Client Supabase + env vars
│       │
│       ├── 🪝 Custom Hooks
│       │   └── hooks/
│       │       ├── useAuth.js    # Hook autenticazione
│       │       └── useWorkouts.js # Hook gestione workout
│       │
│       ├── 🧮 Utilities
│       │   └── utils/
│       │       └── calculations.js # Funzioni calcoli e helpers
│       │
│       └── 🧩 Components
│           └── components/
│               ├── Dashboard.jsx  # Schermata home
│               ├── Workout.jsx    # Creazione/modifica workout
│               ├── History.jsx    # Storico workout
│               ├── Stats.jsx      # Statistiche e grafici
│               │
│               ├── Auth/          # Componenti autenticazione
│               │   ├── Login.jsx
│               │   └── Register.jsx
│               │
│               └── UI/            # Componenti UI riutilizzabili
│                   ├── TabBar.jsx
│                   ├── Toast.jsx
│                   ├── Timer.jsx
│                   └── ExerciseBlock.jsx
│
└── 🔄 CI/CD
    └── .github/
        └── workflows/
            └── deploy.yml        # GitHub Actions workflow

```

## 📦 Descrizione Directory

### `/src` - Source Code Principale

#### `main.jsx`
Entry point dell'applicazione. Monta il componente `<App />` sul DOM.

#### `App.jsx`
Root component che orchestra:
- Routing tra tab (Dashboard, Workout, History, Stats)
- Gestione stato globale (auth, workouts, toast, timer)
- Rendering condizionale (auth screens vs main app)
- Modal settings

### `/src/components` - Componenti React

#### 🏠 Componenti Pagina Principale
- **Dashboard.jsx**: Home con statistiche e workout recenti
- **Workout.jsx**: Form creazione/modifica workout con gestione esercizi e set
- **History.jsx**: Lista workout passati con azioni (edit, delete, duplicate)
- **Stats.jsx**: Grafici progressi e personal records

#### 🔐 `/Auth` - Autenticazione
- **Login.jsx**: Form login con email/password
- **Register.jsx**: Form registrazione nuovo utente

#### 🎨 `/UI` - Componenti UI Riutilizzabili
- **TabBar.jsx**: Barra navigazione inferiore (4 tab)
- **Toast.jsx**: Notifiche temporanee
- **Timer.jsx**: Timer galleggiante per recupero
- **ExerciseBlock.jsx**: Card esercizio con gestione set (add/edit/delete)

### `/src/hooks` - Custom Hooks

#### `useAuth.js`
Hook per gestione autenticazione:
- `user`: Oggetto utente corrente
- `loading`: Stato caricamento auth
- `signIn(email, password)`: Login
- `signUp(email, password)`: Registrazione
- `signOut()`: Logout

#### `useWorkouts.js`
Hook per gestione workout:
- `workouts`: Array workout caricati
- `loading`: Stato caricamento
- `saveWorkout(data, exercises, editId)`: Salva/aggiorna workout
- `deleteWorkout(id)`: Elimina workout
- `reloadWorkouts()`: Ricarica dati

### `/src/utils` - Funzioni Utility

#### `calculations.js`
Funzioni helper per calcoli:
- `calculateTonnage(workouts)`: Tonnellaggio totale
- `calculateExerciseTonnage(sets)`: Tonnellaggio esercizio
- `generateMAVSequence(target)`: Genera sequenza MAV automatica
- `getPersonalRecords(workouts)`: Estrae PR (solo MAV)
- `getChartData(workouts, exercise)`: Dati per grafici
- `getUniqueExercises(workouts)`: Lista esercizi unici
- `formatDate(dateString)`: Formattazione data italiana

### `/src/config` - Configurazione

#### `supabase.js`
- Inizializza client Supabase
- Legge env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- Configura persistenza sessione
- Export singleton client

### `/src/styles` - Styling

#### `global.css`
- Reset CSS
- Variabili CSS custom (`:root`)
- Stili componenti base (buttons, forms, cards)
- Utility classes
- Animazioni
- Media queries

## 🗃️ Database Schema (Supabase)

```sql
exercises
├── id (BIGSERIAL PK)
├── name (VARCHAR UNIQUE)
└── created_at (TIMESTAMPTZ)

workouts
├── id (BIGSERIAL PK)
├── user_id (UUID FK → auth.users)
├── date (DATE)
├── notes (VARCHAR)
└── created_at (TIMESTAMPTZ)

workout_exercises
├── id (BIGSERIAL PK)
├── workout_id (BIGINT FK → workouts)
├── exercise_id (BIGINT FK → exercises)
└── created_at (TIMESTAMPTZ)

workout_sets
├── id (BIGSERIAL PK)
├── workout_exercise_id (BIGINT FK → workout_exercises)
├── weight (NUMERIC)
├── reps (INTEGER)
├── type (VARCHAR: WARMUP|RAMP|MAV|BACKOFF)
└── created_at (TIMESTAMPTZ)
```

### Relazioni
- 1 User → N Workouts
- 1 Workout → N Workout_Exercises
- 1 Workout_Exercise → N Workout_Sets
- 1 Exercise → N Workout_Exercises (reusable)

### Row Level Security (RLS)
Tutti gli utenti vedono solo i propri dati grazie alle policy RLS configurate.

## 🔄 Data Flow

### 1. Authentication Flow
```
Login/Register → useAuth hook → Supabase Auth → Session → Update user state
```

### 2. Workout Creation Flow
```
Workout Component
  ↓
Add Exercises (via ExerciseBlock)
  ↓
Add Sets (weight, reps, type)
  ↓
Click "Salva"
  ↓
useWorkouts.saveWorkout()
  ↓
Supabase Insert/Update
  ↓
Reload data
  ↓
Navigate to Dashboard
```

### 3. Data Loading Flow
```
App Mount → useAuth → Get User → useWorkouts → Load Workouts from Supabase → Update State → Render Components
```

## 🎨 Styling Architecture

### CSS Variables (`:root`)
```css
--primary: #667eea
--success: #10b981
--warning: #f59e0b
--danger: #ef4444
--text: #1a1a1a
--border: #e5e5e5
```

### Component Styles
- **Atomic**: Classi base riutilizzabili (`.btn`, `.card`, `.form-input`)
- **BEM-like**: Nomi descrittivi (`.exercise-block`, `.set-row`, `.tab-bar`)
- **Modifier classes**: Stati e varianti (`.active`, `.editing`, `.btn-primary`)

### Responsive
- Design mobile-first
- Breakpoint: `max-width: 500px` per container principale
- Touch-friendly UI (padding adeguato, font leggibili)

## 🚀 Build & Deploy Flow

### Development
```bash
npm run dev → Vite Dev Server (port 3000) → Hot Module Replacement
```

### Production Build
```bash
npm run build → Vite Build → Optimize & Bundle → Output: /dist
```

### Deployment (Vercel)
```
Git Push → GitHub → Trigger GitHub Actions → Build with env vars → Deploy to Vercel → Live!
```

### Environment Variables Flow
```
Development: .env.local → Vite → import.meta.env.VITE_*
Production: GitHub Secrets → Vercel Env Vars → Build → Embedded in bundle
```

## 🔧 Development Guidelines

### Componenti
- Componenti funzionali con hooks
- Props validation tramite PropTypes (opzionale, usare TypeScript per progetti grandi)
- Componenti piccoli e riutilizzabili
- Separazione logica (presentational vs container)

### State Management
- Local state con `useState` per UI state
- Custom hooks per business logic
- Props drilling minimizzato (considerare Context se necessario in futuro)

### Styling
- CSS modules se il progetto cresce
- Classnames condizionali con template literals
- Evitare inline styles eccetto per dynamic styles

### Performance
- Lazy loading per code splitting (se necessario)
- Memoization con `useMemo`/`useCallback` per calcoli pesanti
- Ottimizzazione re-renders con `React.memo`

## 📊 Metrics & Monitoring

### Performance
- Lighthouse CI (configurabile)
- Vercel Analytics (opzionale)
- Bundle size monitoring

### Errors
- Console errors in dev
- Sentry integration (opzionale)
- Supabase logs per errori backend

## 🔮 Future Enhancements

Possibili espansioni architetturali:

1. **State Management**: Redux/Zustand per stato più complesso
2. **TypeScript**: Migrazione per type safety
3. **Testing**: Jest + React Testing Library
4. **E2E Testing**: Playwright/Cypress
5. **Storybook**: Documentazione componenti UI
6. **Monorepo**: Se si aggiungono mobile apps (React Native)

---

**Ultimo aggiornamento**: 2025-01-10 (v3.0.0)
