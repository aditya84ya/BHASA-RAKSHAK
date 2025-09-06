const fs = require('fs');
const path = require('path');

console.log('🔍 Checking environment configuration...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envExists = fs.existsSync(envPath);

console.log(`📁 .env.local file exists: ${envExists ? '✅ Yes' : '❌ No'}`);

if (envExists) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('\n📄 .env.local content:');
  console.log('─'.repeat(50));
  console.log(envContent);
  console.log('─'.repeat(50));
  
  // Check for required variables
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ];
  
  console.log('\n🔑 Required environment variables:');
  requiredVars.forEach(varName => {
    const hasVar = envContent.includes(varName);
    console.log(`  ${varName}: ${hasVar ? '✅ Found' : '❌ Missing'}`);
  });
} else {
  console.log('\n❌ .env.local file not found!');
  console.log('Please create it with the following content:');
  console.log('─'.repeat(50));
  console.log('NEXT_PUBLIC_SUPABASE_URL=https://zdtozitfyjtzudpkhjwx.supabase.co');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here');
  console.log('─'.repeat(50));
}

// Check package.json
console.log('\n📦 Checking dependencies...');
const packagePath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

const requiredDeps = [
  '@supabase/supabase-js',
  '@supabase/auth-helpers-nextjs'
];

requiredDeps.forEach(dep => {
  const hasDep = packageJson.dependencies[dep];
  console.log(`  ${dep}: ${hasDep ? `✅ ${hasDep}` : '❌ Missing'}`);
});

console.log('\n🚀 Next steps:');
console.log('1. Make sure .env.local exists with correct values');
console.log('2. Run: npm install');
console.log('3. Run: npm run dev');
console.log('4. Visit: http://localhost:3000/test-auth');
