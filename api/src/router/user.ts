
import { Router, Request, Response } from 'express';
import router from './user';

const userRouter = Router();

// ダミーデータ（データベースの代わり）
let users = [
  { id: 1, username: '松本友花', email: 'yuka@gmail.com', birthday: '1990-09-16' },
  { id: 2, username: '松本たける', email: 'takeru@gmail.com', birthday: '2021-03-21' }
];

// ユーザーの一覧を取得する
userRouter.get('/', (req: Request, res: Response) => {
  res.json(users);
});

// 特定のユーザーの詳細を取得する
// http://localhost:4000/user/1
userRouter.get('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10); // リクエストパラメータからIDを取得し、整数に変換
  const user = users.find(u => u.id === id); // IDに一致するユーザー情報を検索

  if (user) {
    res.json(user); // ユーザーデータを返す
  } else {
    res.status(404).json({ error: 'User not found' }); // 該当するIDが見つからない場合
  }
});

export default userRouter;

