# BHASA-RAKSHAK Setup Instructions

## Quick Start with Your Supabase Project

Your Supabase Project ID: `zdtozitfyjtzudpkhjwx`

### 1. Create Environment File

Create a `.env.local` file in your project root with these exact values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://zdtozitfyjtzudpkhjwx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkdG96aXRmeWp0enVkcGtoand4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwOTU3NDMsImV4cCI6MjA3MjY3MTc0M30.YourAnonKeyHere
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkdG96aXRmeWp0enVkcGtoand4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzA5NTc0MywiZXhwIjoyMDcyNjcxNzQzfQ.MTAmTOvs_m9v5gBnj21FEiPDIjEk5z87EIjJRhvIcyU
```

**Important:** You need to get your actual anon key from your Supabase dashboard. The one I provided is a placeholder.

### 2. Get Your Anon Key

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/zdtozitfyjtzudpkhjwx
2. Go to Settings > API
3. Copy the "anon public" key
4. Replace `YourAnonKeyHere` in the `.env.local` file with your actual anon key

### 3. Set Up Database

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the entire contents of `supabase-schema.sql`
4. Paste and execute the SQL to create all tables and policies

### 4. Set Up Storage

1. Go to Storage in your Supabase dashboard
2. Create a new bucket called `contributions`
3. Set it to public
4. Add this policy:

```sql
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'contributions');
CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'contributions' AND auth.role() = 'authenticated');
```

### 5. Install and Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 6. Test the Application

1. Open http://localhost:3000
2. Try signing up for a new account
3. Test the upload functionality
4. Explore the different pages

### 7. Configure Authentication (Optional)

To enable Google/GitHub login:

1. Go to Authentication > Providers in Supabase
2. Enable and configure Google OAuth
3. Enable and configure GitHub OAuth
4. Add your domain to authorized origins

## Troubleshooting

### Common Issues:

1. **"Invalid API key" error**
   - Make sure you're using the correct anon key from your Supabase dashboard
   - Check that the `.env.local` file is in the project root

2. **Database connection issues**
   - Verify the Supabase URL is correct
   - Make sure you've run the SQL schema

3. **File upload not working**
   - Check that the storage bucket is created and public
   - Verify the storage policies are set up correctly

4. **Authentication not working**
   - Check that RLS policies are enabled
   - Verify the database schema was executed correctly

## Next Steps

Once everything is working:

1. **Customize the content** - Update the landing page text, testimonials, etc.
2. **Add real data** - Upload some sample dialect content
3. **Configure admin users** - Set up admin accounts for content moderation
4. **Deploy to production** - Follow the DEPLOYMENT.md guide

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Check the Supabase logs in your dashboard
3. Verify all environment variables are correct
4. Make sure the database schema was executed successfully

Your project should now be fully functional! 🎉
