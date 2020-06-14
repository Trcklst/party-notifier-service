require('dotenv').config();

export default {
  services: {
    authService: process.env.AUTH_SERVICE
  },
  jwtSecret: process.env.JWT_SECRET,
  app: {
    wsPort: Number(process.env.WSPORT)
  },
  database: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dbname: process.env.DB_NAME
  },
  rabbitMq: {
    host: process.env.RABBITMQ_HOST,
    queue: process.env.RABBITMQ_QUEUE
  }
};
