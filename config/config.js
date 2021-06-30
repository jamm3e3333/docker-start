module.exports = {
    mongoUser: process.env.DB_USER,
    mongoPass: process.env.DB_PASS,
    mongoIP: process.env.DB_IP || "mongo",
    mongoPort: process.env.DB_PORT || 27017,
    port: process.env.PORT || 3000
}