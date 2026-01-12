#!/bin/bash

# MAV Tracker - Setup Script
# Questo script automatizza il setup iniziale del progetto

set -e  # Exit on error

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║                                                        ║"
echo "║        🏋️  MAV Tracker - Setup Automatico 🏋️         ║"
echo "║                                                        ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo -e "${BLUE}📋 Verifica prerequisiti...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js non trovato!${NC}"
    echo "Installa Node.js da: https://nodejs.org"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) installato${NC}"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm non trovato!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm $(npm -v) installato${NC}"
echo ""

# Install dependencies
echo -e "${BLUE}📦 Installazione dipendenze...${NC}"
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dipendenze installate con successo${NC}"
else
    echo -e "${RED}❌ Errore durante l'installazione delle dipendenze${NC}"
    exit 1
fi
echo ""

# Check if .env.local exists
echo -e "${BLUE}🔐 Verifica configurazione environment...${NC}"

if [ -f ".env.local" ]; then
    echo -e "${GREEN}✅ File .env.local trovato${NC}"
else
    echo -e "${YELLOW}⚠️  File .env.local non trovato${NC}"
    echo ""
    echo "Vuoi creare .env.local dal template? (s/n)"
    read -r response
    
    if [[ "$response" =~ ^([sS][iI]|[sS])$ ]]; then
        if [ -f ".env.local.example" ]; then
            cp .env.local.example .env.local
            echo -e "${GREEN}✅ File .env.local creato${NC}"
            echo ""
            echo -e "${YELLOW}⚠️  IMPORTANTE: Modifica .env.local con le tue credenziali Supabase!${NC}"
            echo ""
            echo "Passaggi successivi:"
            echo "  1. Vai su https://supabase.com e crea un progetto"
            echo "  2. Esegui lo schema SQL (vedi README.md)"
            echo "  3. Copia URL e anon key da Settings → API"
            echo "  4. Aggiornali in .env.local"
            echo "  5. Riesegui: npm run dev"
            echo ""
        else
            echo -e "${RED}❌ Template .env.local.example non trovato${NC}"
            exit 1
        fi
    else
        echo -e "${YELLOW}Setup incompleto. Crea manualmente .env.local prima di continuare.${NC}"
        exit 1
    fi
fi
echo ""

# Run environment check
echo -e "${BLUE}🔍 Verifica configurazione environment...${NC}"
if [ -f "scripts/check-env.js" ]; then
    node scripts/check-env.js
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║                                                ║${NC}"
        echo -e "${GREEN}║        ✅ Setup completato con successo!       ║${NC}"
        echo -e "${GREEN}║                                                ║${NC}"
        echo -e "${GREEN}╚════════════════════════════════════════════════╝${NC}"
        echo ""
        echo -e "${BLUE}📝 Prossimi comandi utili:${NC}"
        echo ""
        echo -e "  ${GREEN}npm run dev${NC}      - Avvia server di sviluppo"
        echo -e "  ${GREEN}npm run build${NC}    - Build per produzione"
        echo -e "  ${GREEN}npm run preview${NC}  - Preview build produzione"
        echo ""
        echo -e "${BLUE}🚀 Per il deployment su Vercel:${NC}"
        echo "   Leggi DEPLOYMENT.md per istruzioni dettagliate"
        echo ""
        echo -e "${BLUE}📖 Documentazione:${NC}"
        echo "   - README.md: Guida completa"
        echo "   - QUICK_START.md: Setup rapido"
        echo "   - DEPLOYMENT.md: Deploy su Vercel"
        echo ""
    else
        echo ""
        echo -e "${YELLOW}⚠️  Configurazione incompleta${NC}"
        echo "Segui le istruzioni sopra per completare il setup"
        echo ""
    fi
else
    echo -e "${YELLOW}⚠️  Script di verifica non trovato, continuo comunque...${NC}"
fi

echo -e "${GREEN}Grazie per aver scelto MAV Tracker! 💪${NC}"
echo ""
