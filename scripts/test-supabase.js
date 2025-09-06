const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Testing Supabase Connection...\n')

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables!')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? 'Set' : 'Missing')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('1. Testing basic connection...')
    const { data, error } = await supabase.from('profiles').select('count').limit(1)
    
    if (error) {
      console.error('❌ Database connection failed:', error.message)
    } else {
      console.log('✅ Database connection successful')
    }

    console.log('\n2. Testing authentication...')
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.log('ℹ️  No user logged in (expected):', authError.message)
    } else {
      console.log('✅ User found:', user?.id)
    }

    console.log('\n3. Testing sign up...')
    const testEmail = `test-${Date.now()}@example.com`
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: 'testpassword123'
    })

    if (signUpError) {
      console.error('❌ Sign up failed:', signUpError.message)
    } else {
      console.log('✅ Sign up successful:', signUpData.user?.id)
    }

    console.log('\n4. Testing sign in...')
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: 'testpassword123'
    })

    if (signInError) {
      console.error('❌ Sign in failed:', signInError.message)
    } else {
      console.log('✅ Sign in successful:', signInData.user?.id)
    }

    console.log('\n5. Testing sign out...')
    const { error: signOutError } = await supabase.auth.signOut()
    
    if (signOutError) {
      console.error('❌ Sign out failed:', signOutError.message)
    } else {
      console.log('✅ Sign out successful')
    }

    console.log('\n🎉 All tests completed!')

  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

testConnection()
