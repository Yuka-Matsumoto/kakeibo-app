import { Router, Request, Response } from 'express';

const userRouter = Router();

// ダミーデータ（データベースの代わり）
const users = [
  {
    id: 1,
    username: '松本友花',
    email: 'yuka@gmail.com',
    birthday: '1990-09-16',
  },
  {
    id: 2,
    username: '松本たける',
    email: 'takeru@gmail.com',
    birthday: '2021-03-21',
  },
];

// ユーザーの一覧を取得する
userRouter.get('/', (req: Request, res: Response) => {
  res.json(users);
});

// 特定のユーザーの詳細を取得する
userRouter.get('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  // Number.isNaN で数値の無効性を確認
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  const user = users.find((u) => u.id === id);

  if (user) {
    return res.json(user);
  }
  return res.status(404).json({ error: 'User not found' });
});

// 新規のユーザーを登録する
userRouter.post('/', (req: Request, res: Response) => {
  const { username, email, birthday } = req.body;

  if (!username || !email || !birthday) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newUser = {
    id: users.length + 1,
    username,
    email,
    birthday,
  };

  users.push(newUser);
  return res.status(201).json(newUser);
});

// ユーザー情報を更新する
userRouter.put('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  // Number.isNaN を使用して ID のチェックを行う
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { username, email, birthday } = req.body;

  if (username) user.username = username;
  if (email) user.email = email;
  if (birthday) user.birthday = birthday;

  return res.json(user);
});

// ユーザー情報を削除する
userRouter.delete('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  // Number.isNaN を使用して ID をチェック
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  const userIndex = users.findIndex((u) => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  users.splice(userIndex, 1);

  return res.json({ message: 'User deleted' });
});

export default userRouter;
