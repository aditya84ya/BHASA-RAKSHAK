# BHASA-RAKSHAK Deployment Guide

This guide will help you deploy the BHASA-RAKSHAK application to production.

## Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- A deployment platform account (Vercel recommended)

## 1. Supabase Setup

### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new account
2. Create a new project
3. Note down your project URL and anon key

### Database Setup

1. Go to the SQL Editor in your Supabase dashboard
2. Copy and paste the contents of `supabase-schema.sql`
3. Execute the SQL to create all tables and policies

### Storage Setup

1. Go to Storage in your Supabase dashboard
2. Create a new bucket called `contributions`
3. Set the bucket to public
4. Configure the bucket policy to allow authenticated users to upload

### Authentication Setup

1. Go to Authentication > Providers in your Supabase dashboard
2. Enable Email provider
3. Configure Google OAuth (optional):
   - Go to Google Cloud Console
   - Create OAuth 2.0 credentials
   - Add your domain to authorized origins
   - Add the credentials to Supabase
4. Configure GitHub OAuth (optional):
   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Create a new OAuth App
   - Add the credentials to Supabase

## 2. Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 3. Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## 4. Deployment Options

### Option 1: Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "New Project" and import your GitHub repository
4. Add environment variables in Vercel dashboard
5. Deploy

### Option 2: Netlify

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `out` folder to Netlify
3. Add environment variables in Netlify dashboard

### Option 3: Railway

1. Connect your GitHub repository to Railway
2. Add environment variables
3. Deploy

## 5. Post-Deployment Configuration

### Update Supabase Settings

1. Add your production domain to Supabase Auth settings
2. Update OAuth redirect URLs if using social login
3. Configure CORS settings for your domain

### Domain Configuration

1. Set up a custom domain (optional)
2. Configure SSL certificate
3. Update DNS settings

## 6. Monitoring and Maintenance

### Analytics

- Set up Google Analytics (optional)
- Monitor Supabase usage and limits
- Track user engagement metrics

### Backup

- Enable Supabase automatic backups
- Set up database backups
- Monitor storage usage

### Security

- Regularly update dependencies
- Monitor for security vulnerabilities
- Review user permissions and RLS policies

## 7. Troubleshooting

### Common Issues

1. **Authentication not working**
   - Check environment variables
   - Verify Supabase configuration
   - Check CORS settings

2. **File uploads failing**
   - Verify storage bucket configuration
   - Check file size limits
   - Verify RLS policies

3. **Database errors**
   - Check RLS policies
   - Verify user permissions
   - Check database connection

### Support

- Check the [README.md](README.md) for more information
- Review Supabase documentation
- Check Next.js documentation for deployment issues

## 8. Performance Optimization

### Production Optimizations

1. Enable Next.js Image Optimization
2. Configure CDN for static assets
3. Optimize database queries
4. Implement caching strategies

### Monitoring

1. Set up error tracking (Sentry)
2. Monitor performance metrics
3. Track user analytics
4. Monitor server resources

## 9. Scaling Considerations

### Database Scaling

- Monitor database performance
- Consider read replicas for heavy read loads
- Implement connection pooling

### Application Scaling

- Use Vercel's automatic scaling
- Consider edge functions for global performance
- Implement proper caching

### Storage Scaling

- Monitor storage usage
- Implement file compression
- Consider CDN for media files

## 10. Security Checklist

- [ ] Environment variables secured
- [ ] RLS policies configured
- [ ] CORS settings updated
- [ ] OAuth providers configured
- [ ] SSL certificate installed
- [ ] Regular security updates
- [ ] User data protection measures
- [ ] Backup strategy implemented

---

For more detailed information, refer to the [README.md](README.md) file.
