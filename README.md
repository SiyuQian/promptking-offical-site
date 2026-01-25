# PromptKing Marketing Website

Production-ready marketing website for PromptKing built with Next.js 16.1.4.

## Features

- **Light, Clean Design**: Minimalist aesthetic with editorial precision
- **Responsive**: Mobile-first design that works on all devices
- **Fast**: Optimized with Next.js 16 and Turbopack
- **SEO Optimized**: Complete metadata, Open Graph, and robots.txt

## Getting Started

### Prerequisites

- Node.js 20.9+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
promptking-offical-site/
├── app/
│   ├── layout.tsx      # Root layout with fonts and metadata
│   ├── page.tsx        # Home page
│   ├── globals.css     # Global styles
│   └── icon.svg        # Favicon
├── components/
│   ├── navigation.tsx  # Sticky navigation
│   ├── hero.tsx        # Hero section
│   ├── features.tsx    # Features grid
│   ├── cta-section.tsx # Call-to-action section
│   └── footer.tsx      # Footer
└── public/
    └── robots.txt      # SEO robots file
```

## Configuration

The app URL for "Try Now" buttons is configured in each component:
- `components/navigation.tsx`
- `components/hero.tsx`
- `components/cta-section.tsx`
- `components/footer.tsx`

Default: `https://app.promptking.online`

## Tech Stack

- **Next.js 16.1.4**: React framework with App Router
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first styling
- **Turbopack**: Fast bundler (default in Next.js 16)
- **Google Fonts**: Playfair Display (display) + DM Sans (body)

## License

ISC
