import express from 'express';
import userRouter from './router/user';
import transactionRouter from './router/transaction';
import categoryRouter from './router/category';

const app = express();
const port = 4000;

// ルーターをセットアップ
app.use('/user', userRouter);
app.use('/transaction', transactionRouter);
app.use('/category', categoryRouter);

app.get('/', (req, res) => {
    res.send('家計簿アプリ');
  });

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});