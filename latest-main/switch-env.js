#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get environment argument
const environment = process.argv[2];

if (!environment) {
  console.log('❌ Please specify an environment: dev, prod, or staging');
  console.log('Usage: node switch-env.js <environment>');
  console.log('Examples:');
  console.log('  node switch-env.js dev');
  console.log('  node switch-env.js prod');
  console.log('  node switch-env.js staging');
  process.exit(1);
}

// Normalize environment names
let env;
switch (environment.toLowerCase()) {
  case 'dev':
  case 'development':
    env = 'development';
    break;
  case 'prod':
  case 'production':
    env = 'production';
    break;
  case 'staging':
    env = 'staging';
    break;
  default:
    console.log(`❌ Unknown environment: ${environment}`);
    console.log('Available environments: dev, prod, staging');
    process.exit(1);
}

const sourceFile = `.env.${env}`;
const targetFile = '.env.local';

// Check if source file exists
if (!fs.existsSync(sourceFile)) {
  console.log(`❌ Environment file '${sourceFile}' not found!`);
  console.log('Available environment files:');
  fs.readdirSync('.')
    .filter(file => file.startsWith('.env.'))
    .forEach(file => console.log(`  - ${file}`));
  process.exit(1);
}

// Backup current .env.local if it exists
if (fs.existsSync(targetFile)) {
  const backup = `.env.local.backup.${new Date().toISOString().replace(/[:.]/g, '-')}`;
  fs.copyFileSync(targetFile, backup);
  console.log(`📋 Backed up current .env.local to ${backup}`);
}

// Copy the environment file
fs.copyFileSync(sourceFile, targetFile);

console.log(`✅ Successfully switched to ${env} environment!`);
console.log(`📁 Copied ${sourceFile} → ${targetFile}`);

// Show current environment variables
console.log('\n🔧 Current environment configuration:');
const content = fs.readFileSync(targetFile, 'utf8');
content.split('\n')
  .filter(line => line.match(/^NEXT_PUBLIC_/) || line.match(/^NODE_ENV/))
  .forEach(line => console.log(`  ${line}`));
