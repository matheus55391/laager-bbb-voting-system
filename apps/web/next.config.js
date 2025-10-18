/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },

  // transpilePackages: [
  //   '@fullcalendar/common',
  //   '@fullcalendar/daygrid',
  //   '@fullcalendar/interaction',
  //   '@fullcalendar/react',
  //   '@fullcalendar/timegrid',
  // ],

  experimental: {
    forceSwcTransforms: true,
  },

  webpack: (config, { isServer, webpack }) => {
    // Let Next.js handle CSS files instead of injecting them at runtime with style-loader.
    // Removing the custom rule avoids runtime CSS injection which can cause a flash-of-unstyled-content
    // (FOUC) or delayed CSS on reload. Next.js has built-in support for global and modular CSS.
    // config.module = config.module || {}
    // config.module.rules = config.module.rules || []

    // config.module.rules.push({
    //   test: /\.css$/,
    //   use: ['style-loader', 'css-loader', 'postcss-loader'],
    // })

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        buffer: require.resolve('buffer/'),
        process: require.resolve('process/browser'),
        stream: require.resolve('stream-browserify'),
        util: require.resolve('util/'),
        zlib: require.resolve('browserify-zlib'),
      }

      config.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        })
      )
    }

    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
      ignored: /node_modules/,
    }

    return config
  },

  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },

  compiler: {
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig
