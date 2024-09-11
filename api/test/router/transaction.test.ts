import request from 'supertest';
import express from 'express';
import transactionRouter from '../../src/router/transaction';  // transactionRouterをインポート

// Expressアプリケーションをセットアップ
const app = express();
app.use(express.json());  // JSONボディをパースするために必要
app.use('/transactions', transactionRouter);

describe('Transaction API', () => {
  // 正常系: トランザクション一覧を取得
  it('should return the list of transactions', async () => {
    const response = await request(app).get('/transactions');
    expect(response.status).toBe(200); // ステータスコードが200であることを確認
    expect(response.body).toEqual([
      {
        id: 1,
        date: '2024-09-01',
        type: 'income',
        amount: 5000,
        category: 'salary',
        description: 'Monthly salary',
      },
      {
        id: 2,
        date: '2024-09-02',
        type: 'expense',
        amount: 1500,
        category: 'food',
        description: 'Grocery shopping',
      },
    ]); // トランザクションの内容を確認
  });

  // 正常系: 特定のトランザクションをIDで取得
  it('should return a specific transaction by ID', async () => {
    const response = await request(app).get('/transactions/1');
    expect(response.status).toBe(200); // ステータスコードが200であることを確認
    expect(response.body).toEqual({
      id: 1,
      date: '2024-09-01',
      type: 'income',
      amount: 5000,
      category: 'salary',
      description: 'Monthly salary',
    }); // トランザクションの内容を確認
  });

  // 異常系: 存在しないトランザクションIDをリクエスト
  it('should return 404 if the transaction is not found', async () => {
    const response = await request(app).get('/transactions/999');
    expect(response.status).toBe(404); // ステータスコードが404であることを確認
    expect(response.body).toEqual({ error: 'Transaction not found' }); // エラーメッセージを確認
  });

  // 正常系: 新規トランザクションを作成
  it('should create a new transaction', async () => {
    const newTransaction = {
      date: '2024-09-10',
      type: 'income',
      amount: 2000,
      category: 'bonus',
      description: 'Bonus payment',
    };
    const response = await request(app)
      .post('/transactions')
      .send(newTransaction); // トランザクションデータを送信
    expect(response.status).toBe(201); // ステータスコードが201であることを確認
    expect(response.body).toEqual({
      id: 3, // 3番目のトランザクションとして作成されることを確認
      ...newTransaction,
    });
  });

  // 異常系: 必須フィールドが欠落している場合
  it('should return 400 if required fields are missing', async () => {
    const incompleteTransaction = {
      type: 'income',
      amount: 2000,
    };
    const response = await request(app)
      .post('/transactions')
      .send(incompleteTransaction); // 不完全なトランザクションデータを送信
    expect(response.status).toBe(400); // ステータスコードが400であることを確認
    expect(response.body).toEqual({ error: 'Missing required fields' }); // エラーメッセージを確認
  });

  // 正常系: トランザクションを更新
  it('should update an existing transaction', async () => {
    const updatedTransaction = {
      date: '2024-09-05',
      type: 'income',
      amount: 3000,
      category: 'salary',
      description: 'Salary adjustment',
    };
    const response = await request(app)
      .put('/transactions/1')
      .send(updatedTransaction); // トランザクションデータを送信
    expect(response.status).toBe(200); // ステータスコードが200であることを確認
    expect(response.body).toEqual({
      id: 1, // IDは1のままであることを確認
      ...updatedTransaction,
    });
  });

  // 異常系: 存在しないトランザクションの更新
  it('should return 404 if updating a non-existent transaction', async () => {
    const response = await request(app)
      .put('/transactions/999')
      .send({
        date: '2024-09-05',
        type: 'expense',
        amount: 1000,
        category: 'entertainment',
        description: 'Movie tickets',
      });
    expect(response.status).toBe(404); // ステータスコードが404であることを確認
    expect(response.body).toEqual({ error: 'Transaction not found' }); // エラーメッセージを確認
  });

  // 正常系: トランザクションを削除
  it('should delete a transaction', async () => {
    const response = await request(app).delete('/transactions/1');
    expect(response.status).toBe(200); // ステータスコードが200であることを確認
    expect(response.body).toEqual({ message: 'Transaction deleted' }); // 削除メッセージを確認
  });

  // 異常系: 存在しないトランザクションの削除
  it('should return 404 if deleting a non-existent transaction', async () => {
    const response = await request(app).delete('/transactions/999');
    expect(response.status).toBe(404); // ステータスコードが404であることを確認
    expect(response.body).toEqual({ error: 'Transaction not found' }); // エラーメッセージを確認
  });
});
