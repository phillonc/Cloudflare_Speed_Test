# Cloudflare Speed Test Application

A modern web application for testing server response times and network performance across Cloudflare's global network. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🌍 Interactive world map showing test locations
- 📊 Real-time performance metrics
- 📈 Visual data representation with charts
- 🌓 Dark/Light mode support
- 📱 Responsive design
- 🔄 CSV export functionality

## Prerequisites

Before you begin, ensure you have:

- Node.js 18.x or later
- npm 9.x or later
- A Google Maps API key for the map functionality

## Environment Variables

Create a `.env.local` file in the root directory with:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cloudflare-speedtest
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Configuration

### Google Maps

The application uses Google Maps for visualization. To set up:

1. Visit the [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the Maps JavaScript API
4. Create credentials (API key)
5. Add the API key to your `.env.local` file

### Test Locations

Test locations are configured in `lib/test-data.ts`. Each location requires:

- Unique identifier
- Name
- URL
- Geographic information (continent, country, region)
- Coordinates (latitude, longitude)

## Building for Production

```bash
npm run build
```

The application will be built to the `out` directory, ready for static hosting.

## Deployment

This is a static application that can be deployed to any static hosting service:

1. Build the application:
```bash
npm run build
```

2. Deploy the `out` directory to your hosting service

### Recommended Hosting Platforms

- Netlify
- Vercel
- Cloudflare Pages
- GitHub Pages

## Project Structure

```
├── app/                 # Next.js app directory
├── components/         # React components
│   ├── ui/            # UI components
│   └── ...            # Feature components
├── lib/               # Utilities and types
├── public/            # Static assets
└── styles/            # Global styles
```

## Key Technologies

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [@react-google-maps/api](https://react-google-maps-api-docs.netlify.app/) - Google Maps integration
- [Recharts](https://recharts.org/) - Data visualization

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.