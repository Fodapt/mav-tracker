#!/usr/bin/env node

/**
 * Script di verifica configurazione environment
 * Esegui con: node scripts/check-env.js
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Verifica Configurazione MAV Tracker\n');
console.log('=' .repeat(50));

// Check .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.log('\n❌ File .env.local NON trovato!');
  console.log('\n📝 Azioni necessarie:');
  console.log('   1. Copia .env.example in .env.local');
  console.log('   2. Aggiungi le tue credenziali Supabase');
  console.log('\n   cp .env.example .env.local\n');
  process.exit(1);
}

console.log('✅ File .env.local trovato');

// Read and parse .env.local
const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n');
const vars = {};

lines.forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      vars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

// Check required variables
const required = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY'
];

let allValid = true;

console.log('\n📋 Variabili richieste:\n');

required.forEach(varName => {
  const value = vars[varName];
  const exists = !!value;
  const isPlaceholder = value && (
    value.includes('xxxxx') || 
    value.includes('your-') || 
    value.includes('[project')
  );
  
  if (!exists) {
    console.log(`   ❌ ${varName}: NON DEFINITA`);
    allValid = false;
  } else if (isPlaceholder) {
    console.log(`   ⚠️  ${varName}: PLACEHOLDER (sostituisci con valore reale)`);
    allValid = false;
  } else {
    const preview = value.length > 30 ? value.substring(0, 30) + '...' : value;
    console.log(`   ✅ ${varName}: ${preview}`);
  }
});

// Validate format
if (vars.VITE_SUPABASE_URL && !vars.VITE_SUPABASE_URL.includes('xxxxx')) {
  if (!vars.VITE_SUPABASE_URL.startsWith('https://')) {
    console.log('\n   ⚠️  VITE_SUPABASE_URL dovrebbe iniziare con https://');
    allValid = false;
  }
  if (!vars.VITE_SUPABASE_URL.includes('supabase.co')) {
    console.log('\n   ⚠️  VITE_SUPABASE_URL dovrebbe contenere supabase.co');
    allValid = false;
  }
}

if (vars.VITE_SUPABASE_ANON_KEY && !vars.VITE_SUPABASE_ANON_KEY.includes('xxxxx')) {
  if (!vars.VITE_SUPABASE_ANON_KEY.startsWith('eyJ')) {
    console.log('\n   ⚠️  VITE_SUPABASE_ANON_KEY sembra non valida (dovrebbe iniziare con eyJ)');
    allValid = false;
  }
}

console.log('\n' + '='.repeat(50));

if (allValid) {
  console.log('\n✅ CONFIGURAZIONE VALIDA!\n');
  console.log('Puoi avviare l\'app con: npm run dev\n');
  process.exit(0);
} else {
  console.log('\n❌ CONFIGURAZIONE INCOMPLETA\n');
  console.log('📝 Prossimi passi:');
  console.log('   1. Crea un progetto su https://supabase.com');
  console.log('   2. Vai su Settings → API');
  console.log('   3. Copia Project URL e anon key');
  console.log('   4. Aggiornali in .env.local');
  console.log('   5. Riesegui questo script: node scripts/check-env.js\n');
  process.exit(1);
}
