/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
      return [
          {
              source: '/api/line/',
              destination: '/api/line',
              permanent: true,
          },
      ]
  },
}

module.exports = nextConfig