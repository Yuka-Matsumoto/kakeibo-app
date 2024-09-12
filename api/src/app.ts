import express from 'express';
import userRouter from './router/user.ts';
import transactionRouter from './router/transaction.ts';
import categoryRouter from './router/category.ts';

const app = express();
const port = 4000;

// ルーターをセットアップ
// /user というエンドポイントにアクセスした場合、userRouter にルーティングされます。userRouter には /user 以下の詳細なエンドポイント（例: /user/:id, /user/create など）が定義されています。
app.use('/user', userRouter);
app.use('/transaction', transactionRouter);
app.use('/category', categoryRouter);

app.get('/', (req, res) => {
  res.send('家計簿アプリ');
});

// サーバーが正常に起動した際に、console.log でサーバーの起動を知らせるメッセージを出力しています。
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
