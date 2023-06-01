import startServer from './index';

const port = process.argv[2] ? parseInt(process.argv[2]) : 3000;

startServer(port)
  .then(app => {
    console.log(`Server started on http://localhost:${port}`);
  })
  .catch(err => {
    console.error('Failed to start server', err);
    process.exit(1);
  });
