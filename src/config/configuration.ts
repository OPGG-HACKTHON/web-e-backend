import 'dotenv/config';
export default () => ({
  database: {
    host: process.env.DATABASE_HOST || '',
    user: process.env.DATABASE_USER || '',
    name: process.env.DATABASE_NAME || '',
    password: process.env.DATABASE_PASSWORD || '',
    port: process.env.DATABASE_PORT || '',
  },
});
