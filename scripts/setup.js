#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up BHASA-RAKSHAK...\n');

// Check if .env.local already exists
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env.local already exists. Please check setup-instructions.md for manual setup.');
  process.exit(0);
}

// Create .env.local file
const envContent = `NEXT_PUBLIC_SUPABASE_URL=https://zdtozitfyjtzudpkhjwx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkdG96aXRmeWp0enVkcGtoand4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwOTU3NDMsImV4cCI6MjA3MjY3MTc0M30.YourAnonKeyHere
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkdG96aXRmeWp0enVkcGtoand4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzA5NTc0MywiZXhwIjoyMDcyNjcxNzQzfQ.MTAmTOvs_m9v5gBnj21FEiPDIjEk5z87EIjJRhvIcyU
`;

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file');
  console.log('⚠️  IMPORTANT: You need to get your actual anon key from Supabase dashboard');
  console.log('   Go to: https://supabase.com/dashboard/project/zdtozitfyjtzudpkhjwx');
  console.log('   Navigate to Settings > API and copy the "anon public" key');
  console.log('   Replace "YourAnonKeyHere" in .env.local with your actual key\n');
  
  console.log('📋 Next steps:');
  console.log('1. Update .env.local with your anon key');
  console.log('2. Run the SQL schema in your Supabase dashboard');
  console.log('3. Create the "contributions" storage bucket');
  console.log('4. Run: npm install');
  console.log('5. Run: npm run dev');
  console.log('\n🎉 Your BHASA-RAKSHAK project is ready!');
  
} catch (error) {
  console.error('❌ Error creating .env.local:', error.message);
  console.log('\nPlease create .env.local manually following setup-instructions.md');
}
