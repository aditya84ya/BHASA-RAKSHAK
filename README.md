# BHASA-RAKSHAK 🛡️

A production-ready MVP for preserving and learning dying dialects through community contributions and AI-powered tools.

## 🌟 Features

### Core Functionality
- **Community Contributions**: Upload audio, video, text, and image content in various dialects
- **AI-Powered Tools**: Automatic transcription, translation, and pronunciation feedback
- **Learning Platform**: Interactive flashcards, quizzes, and gamified learning experiences
- **Content Discovery**: Advanced search and filtering by dialect, region, and content type
- **User Roles**: Support for Contributors, Learners, Linguists, Researchers, and Admins

### User Roles
- **👤 Contributor**: Native speakers who upload dialect content
- **📚 Learner**: Anyone wanting to learn dialects through interactive content
- **🎓 Linguist**: Expert reviewers who verify and annotate content
- **🧑‍🔬 Researcher**: Access to research tools and data export features
- **🛠️ Admin**: Platform management and content moderation

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Real-time)
- **UI Components**: Lucide React icons, Framer Motion animations
- **State Management**: React Hooks, Context API
- **Authentication**: Supabase Auth with social login (Google, GitHub)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bhasa-rakshak
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Set up Supabase database**
   - Create a new Supabase project
   - Run the SQL schema from `supabase-schema.sql`
   - Enable Row Level Security (RLS) policies
   - Set up storage bucket for file uploads

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🗄️ Database Schema

The application uses a comprehensive PostgreSQL schema with the following main tables:

- **profiles**: User profiles with roles, points, and preferences
- **contributions**: Content uploads with metadata and verification status
- **comments**: User comments on contributions
- **likes**: User likes and engagement tracking
- **learning_progress**: User learning progress and achievements
- **flashcards**: Generated learning flashcards
- **quizzes**: Interactive quiz questions
- **conversations**: Chatbot conversation history
- **analytics**: Platform usage analytics

## 🎨 Design System

The application follows a modern, clean design with:
- **Color Palette**: Primary blue (#3b82f6), secondary grays, accent colors
- **Typography**: Inter font family for readability
- **Components**: Reusable, accessible UI components
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Animations**: Smooth transitions and micro-interactions

## 🔐 Security Features

- **Row Level Security (RLS)**: Database-level access control
- **Role-based Access**: Different permissions for different user types
- **File Upload Security**: Secure file handling and validation
- **Input Validation**: Client and server-side validation
- **Authentication**: Secure user authentication with Supabase

## 📱 Pages & Features

### Public Pages
- **Landing Page**: Hero section, features, testimonials
- **Explore Page**: Content discovery with search and filters
- **Content Detail**: Media player, transcript, translation, comments

### Authenticated Pages
- **Dashboard**: Contributor upload interface and progress tracking
- **Learning Hub**: Flashcards, quizzes, and games
- **Profile Settings**: User preferences and account management

### Admin Pages
- **Admin Dashboard**: User management and content moderation
- **Analytics**: Platform usage statistics and insights

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Static site generation with serverless functions
- **Railway**: Full-stack deployment with database
- **DigitalOcean**: VPS deployment with Docker

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Run the provided SQL schema
3. Configure storage bucket for file uploads
4. Set up authentication providers (Google, GitHub)
5. Configure RLS policies for security

### Environment Variables
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Optional: Analytics and Monitoring
NEXT_PUBLIC_GA_ID=your_google_analytics_id
SENTRY_DSN=your_sentry_dsn
```

## 📊 Analytics & Monitoring

The application includes built-in analytics for:
- User engagement and activity
- Content upload and verification rates
- Learning progress and completion rates
- Platform usage statistics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Team Krishna** for the vision and development
- **Supabase** for the backend infrastructure
- **Next.js** team for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for the beautiful icons

## 📞 Support

For support and questions:
- Email: support@bhasa-rakshak.com
- Documentation: [docs.bhasa-rakshak.com](https://docs.bhasa-rakshak.com)
- Issues: [GitHub Issues](https://github.com/your-org/bhasa-rakshak/issues)

---

**Preserve your dialect, Share your voice** 🗣️✨
