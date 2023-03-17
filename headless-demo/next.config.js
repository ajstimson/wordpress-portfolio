module.exports = {
    i18n: {
        locales: ["en"],
        defaultLocale: "en",
    },
    async rewrites() {
        return [{
            source: '/assets/:path*',
            destination: `${process.env.NEXT_CMS_API_BASE_URL}/wp-content/uploads/:path*`,
        }]
    },

}