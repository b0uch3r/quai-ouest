/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        // CORS pour l'endpoint public (formulaire site GitHub Pages)
        source: '/api/reservations/public',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://b0uch3r.github.io' },
          { key: 'Access-Control-Allow-Methods', value: 'POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
