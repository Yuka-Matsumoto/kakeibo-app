import request from 'supertest';
import express from 'express';
import userRouter from '../../src/router/user'; // userRouterをインポート

// Expressアプリケーションをセットアップ
const app = express();
app.use(express.json());
app.use('/users', userRouter);

describe('User API', () => {
  // 正常系: ユーザー一覧を取得
  it('should return the list of users', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
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
    ]);
  });

  // 正常系: 特定のユーザーをIDで取得
  it('should return a specific user by ID', async () => {
    const response = await request(app).get('/users/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      username: '松本友花',
      email: 'yuka@gmail.com',
      birthday: '1990-09-16',
    });
  });

  // 異常系: 存在しないIDでリクエストを送る
  it('should return 404 for a non-existent user ID', async () => {
    const response = await request(app).get('/users/999');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'User not found' });
  });

  // 異常系: 無効なID（文字列など）を送った場合
  it('should return 400 for an invalid user ID', async () => {
    const response = await request(app).get('/users/abc');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Invalid user ID' });
  });

  // 正常系: 新規ユーザーを登録
  it('should create a new user', async () => {
    const newUser = {
      username: '佐々木クロ',
      email: 'kuro@gmail.com',
      birthday: '1985-05-05',
    };

    const response = await request(app).post('/users').send(newUser);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: 3, // 3番目のユーザーとして登録されることを確認
      ...newUser,
    });
  });

  // 異常系: 新規ユーザー登録時に必須フィールドが欠落している場合
  it('should return 400 if required fields are missing', async () => {
    const incompleteUser = {
      username: '山田花子',
    };

    const response = await request(app).post('/users').send(incompleteUser);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Missing required fields' });
  });

  // 正常系: ユーザー情報を更新
  it('should update an existing user', async () => {
    const updatedUser = {
      username: '松本新太郎',
      email: 'shintaro@gmail.com',
      birthday: '1991-01-01',
    };

    const response = await request(app).put('/users/1').send(updatedUser);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      ...updatedUser,
    });
  });

  // 異常系: 存在しないユーザー情報を更新しようとした場合
  it('should return 404 if updating a non-existent user', async () => {
    const response = await request(app).put('/users/999').send({
      username: '花子',
      email: 'hanako@gmail.com',
      birthday: '1995-05-05',
    });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'User not found' });
  });

  // 正常系: ユーザー情報を削除
  it('should delete a user', async () => {
    const response = await request(app).delete('/users/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'User deleted' });
  });

  // 異常系: 存在しないユーザー情報を削除しようとした場合
  it('should return 404 if deleting a non-existent user', async () => {
    const response = await request(app).delete('/users/999');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'User not found' });
  });
});
