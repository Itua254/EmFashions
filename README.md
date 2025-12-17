# Em Fashions 🛍️

A modern, mobile-first fashion ecommerce platform built with Next.js and Supabase.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the SQL in `supabase-schema.sql` in your Supabase SQL Editor
3. Get your credentials from Project Settings → API
4. Update `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Run Development Server
```bash
npm run dev
```

Visit **http://localhost:3000**

## 📱 Routes

- `/` - Storefront
- `/cart` - Shopping cart  
- `/admin` - Product management

## ✨ Features

✅ Admin dashboard with product CRUD  
✅ Image uploads to Supabase Storage  
✅ Responsive product grid  
✅ Client-side cart with Zustand  
✅ Stripe & M-Pesa checkout placeholders  
✅ Premium Ekka-inspired design  
✅ Framer Motion animations  

## 🔐 Security Note

⚠️ **Authentication not yet implemented**. Admin dashboard is publicly accessible. This will be added in Phase 3.

## 📚 Full Documentation

See the artifacts folder for complete setup instructions, deployment guide, and troubleshooting.

## 🛠️ Tech Stack

- Next.js 15 + TypeScript
- Tailwind CSS v4
- shadcn/ui components
- Framer Motion
- Zustand (state)
- Supabase (backend)

---

Built with ❤️ for Em Fashions
