import request from 'supertest';
import express from 'express';
// このテストでは、transactionRouter をインポートしてテスト用のExpressアプリに組み込むことで、トランザクションAPIの動作を検証します。
import transactionRouter from '../../src/router/transaction';  // transactionRouterをインポート

// Expressアプリケーションをセットアップ
// app は、Expressアプリケーションのインスタンスを作成しています。このインスタンスがAPIサーバーとして機能します。
const app = express();
// app.use(express.json()) は、Expressのミドルウェアを使ってリクエストボディをJSON形式にパースするための設定です。これにより、POSTやPUTリクエストで送信されたJSONデータをサーバー側で適切に処理できます。
// 例えば、クライアントから送信されたリクエストボディ（トランザクションデータなど）をJSONとして読み取り、その内容に基づいてAPIが処理を行います。
app.use(express.json());  // JSONボディをパースするために必要
// /transactions パスに対するリクエストが transactionRouter で処理されるように設定されています。
// 例えば、GET /transactions や POST /transactions といったリクエストは、この transactionRouter によって処理されることになります。
app.use('/transactions', transactionRouter);

// describe: テストケースをグループ化する関数です。この場合、Transaction API というグループ名のもとで、トランザクションAPIに関するテストケースをまとめています。
// このグループ内で、正常なリクエストと異常なリクエストの2つのケースがテストされます。
describe('Transaction API', () => {
  // 正常系: トランザクション一覧を取得
  // /transactions エンドポイントに対して GET リクエストを送り、トランザクション一覧が正しく返されるかを確認しています。   
  it('should return the list of transactions', async () => {
    // supertest を使って、/transactions エンドポイントに GET リクエストを送ります。このリクエストに対するレスポンスが正しく返ってくるかどうかを検証します。
    const response = await request(app).get('/transactions');
    // レスポンスのステータスコードが 200 （OK）であることを確認します。200 は、リクエストが正常に処理されたことを示すHTTPステータスコードです。
    expect(response.status).toBe(200); // ステータスコードが200であることを確認
    // レスポンスのボディ（response.body）が、期待されるトランザクションデータと一致しているかを確認します。具体的には、2件のトランザクション（id: 1 と id: 2）が含まれていることを確認しています。
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

    // 異常系: 存在しないIDのトランザクションを取得
    // 存在しないID (/transactions/999) に対して GET リクエストを送信した場合、サーバーが適切なエラーレスポンス（404 Not Found）を返すかどうかをテストします。
    it('should return 404 if the transaction is not found', async () => {
      // 存在しないトランザクションID（999）に対してリクエストを送信し、期待されるエラーハンドリングが行われるかを確認します。
      const response = await request(app).get('/transactions/999');
      // ステータスコードが 404 であることを確認します。404 は「Not Found（見つからない）」を意味し、指定されたリソース（この場合はトランザクションID）が存在しないことを示します。   
      expect(response.status).toBe(404); // ステータスコードが404であることを確認
      // レスポンスのボディに、{ error: 'Transaction not found' } というエラーメッセージが含まれていることを確認します。これにより、存在しないトランザクションIDに対する適切なエラーメッセージが返されることを確認しています。   
      expect(response.body).toEqual({ error: 'Transaction not found' }); // エラーメッセージのプロパティを修正
  });
     
  // 正常系: 特定のトランザクションをIDで取得
  // /transactions/1 エンドポイントに対してリクエストを送り、ID 1 のトランザクションデータが正しく返されるかをテストしています。   
  it('should return a specific transaction by ID', async () => {
    // supertest を使って、/transactions/1 に GET リクエストを送ります。このリクエストに対するレスポンスが正しいかどうかを確認します。
    const response = await request(app).get('/transactions/1');
    // レスポンスのステータスコードが 200 であることを確認しています。200 は、リクエストが成功したことを示すHTTPステータスコードです。
    expect(response.status).toBe(200); // ステータスコードが200であることを確認
    // レスポンスのボディ（response.body）が期待するトランザクションデータと一致していることを確認しています。具体的には、ID 1 のトランザクションデータが正しく返されているかをチェックしています。
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
  // 存在しないトランザクションID (/transactions/999) に対してリクエストを送信した場合、サーバーが適切なエラーレスポンス（404 Not Found）を返すかどうかをテストします。   
  it('should return 404 if the transaction is not found', async () => {
    // 存在しないID（999）のトランザクションに対してリクエストを送り、適切なエラーハンドリングが行われるかを確認しています。
    const response = await request(app).get('/transactions/999');
    // ステータスコードが 404 であることを確認します。404 は「Not Found（リソースが見つからない）」を示し、指定されたIDのトランザクションが存在しないことを意味します。
    expect(response.status).toBe(404); // ステータスコードが404であることを確認
    // レスポンスボディに { error: 'Transaction not found' } というエラーメッセージが含まれていることを確認します。これにより、存在しないトランザクションIDに対して適切なエラーメッセージが返されることを確認しています。
    expect(response.body).toEqual({ error: 'Transaction not found' }); // エラーメッセージを確認
  });

  // 正常系: 新規トランザクションを作成
  // 新しいトランザクションを /transactions エンドポイントに POST リクエストを送信して作成し、正常に作成されることを確認します。
  it('should create a new transaction', async () => {
    const newTransaction = {
      date: '2024-09-10',
      type: 'income',
      amount: 2000,
      category: 'bonus',
      description: 'Bonus payment',
    };
    // supertest を使って、APIの /transactions エンドポイントに POST リクエストを送信し、トランザクションデータをサーバーに送ります。
    const response = await request(app)
      .post('/transactions')
      .send(newTransaction); // トランザクションデータを送信
    // ステータスコードが 201 であることを確認します。201 は「Created」を意味し、リソース（この場合はトランザクション）が正常に作成されたことを示します。
    expect(response.status).toBe(201); // ステータスコードが201であることを確認
    // レスポンスのボディが、作成されたトランザクションデータと一致しているかを確認します。
    // トランザクションのIDは 3 であることも確認しています。
    expect(response.body).toEqual({
      id: 3, // 3番目のトランザクションとして作成されることを確認
      ...newTransaction,
    });
  });

  // 異常系: 必須フィールドが欠落している場合
  // 必須フィールドが欠けたトランザクションデータを送信した際、適切なエラーハンドリングが行われるかをテストします。
  it('should return 400 if required fields are missing', async () => {
    // 不完全なトランザクションデータで、date や category などの必須フィールドが欠けています:
    const incompleteTransaction = {
      type: 'income',
      amount: 2000,
    };
    // 不完全なデータを POST リクエストで送信し、サーバーがどのように処理するかを確認します。
    const response = await request(app)
      .post('/transactions')
      .send(incompleteTransaction); // 不完全なトランザクションデータを送信
    // ステータスコードが 400 であることを確認します。400 は「Bad Request」を意味し、リクエストに不備があった場合に返されるエラーステータスです。
    expect(response.status).toBe(400); // ステータスコードが400であることを確認
    // レスポンスボディに、{ error: 'Missing required fields' } というエラーメッセージが含まれていることを確認します。
    expect(response.body).toEqual({ error: 'Missing required fields' }); // エラーメッセージを確認
  });

  // 正常系: トランザクションを更新
  // 既存のトランザクション（/transactions/1）に対して更新リクエストを送信し、正しく更新されるかをテストします。   
  it('should update an existing transaction', async () => {
    // 更新するための新しいトランザクションデータが指定されています。
    const updatedTransaction = {
      date: '2024-09-05',
      type: 'income',
      amount: 3000,
      category: 'salary',
      description: 'Salary adjustment',
    };
    // supertest を使って、トランザクションID 1 に対して PUT リクエストを送り、更新されたトランザクションデータをサーバーに送信します。
    const response = await request(app)
      .put('/transactions/1')
      .send(updatedTransaction); // トランザクションデータを送信
    // ステータスコードが 200 であることを確認します。200 は「OK」を意味し、リクエストが正常に処理されたことを示します。
    expect(response.status).toBe(200); // ステータスコードが200であることを確認
    // レスポンスのボディに返されるデータが、更新されたトランザクションデータと一致していることを確認します。IDは 1 のままで、それ以外のフィールドは新しいデータに更新されていることをチェックしています。
    expect(response.body).toEqual({
      id: 1, // IDは1のままであることを確認
      ...updatedTransaction,
    });
  });

  // 異常系: 存在しないトランザクションの更新
  // 存在しないトランザクション（/transactions/999）に対して更新リクエストを送信した場合に、サーバーが適切に 404 Not Found エラーレスポンスを返すかを確認します。   
  it('should return 404 if updating a non-existent transaction', async () => {
    // 存在しないトランザクションID 999 に対して PUT リクエストを送信します。
    const response = await request(app)
      .put('/transactions/999')
      .send({
        date: '2024-09-05',
        type: 'expense',
        amount: 1000,
        category: 'entertainment',
        description: 'Movie tickets',
      });
    // ステータスコードが 404 であることを確認します。404 は「Not Found」を意味し、指定されたリソース（この場合はトランザクションID 999）が存在しないことを示します。
    expect(response.status).toBe(404); // ステータスコードが404であることを確認
    // レスポンスボディに、{ error: 'Transaction not found' } というエラーメッセージが含まれていることを確認します。
    expect(response.body).toEqual({ error: 'Transaction not found' }); // エラーメッセージを確認
  });

  // 正常系: トランザクションを削除
  // 既存のトランザクション（/transactions/1）を削除するリクエストを送信し、削除が正常に行われるかどうかをテストします。   
  it('should delete a transaction', async () => {
    // supertest を使って、トランザクションID 1 に対して DELETE リクエストを送信します。これにより、ID 1 のトランザクションが削除されることを期待しています。
    const response = await request(app).delete('/transactions/1');
    // ステータスコードが 200 であることを確認します。200 はリクエストが正常に処理され、削除が成功したことを示すHTTPステータスコードです。
    expect(response.status).toBe(200); // ステータスコードが200であることを確認
    // レスポンスのボディに、削除が成功したことを示すメッセージ（{ message: 'Transaction deleted' }）が含まれていることを確認します。
    expect(response.body).toEqual({ message: 'Transaction deleted' }); // 削除メッセージを確認
  });

  // 異常系: 存在しないトランザクションの削除
  // 存在しないトランザクション（/transactions/999）を削除しようとした場合に、APIが適切なエラーレスポンスを返すかどうかをテストします。   
  it('should return 404 if deleting a non-existent transaction', async () => {
    // 存在しないID（999）のトランザクションに対して DELETE リクエストを送信します。このトランザクションは存在しないため、エラーハンドリングが必要です。
    const response = await request(app).delete('/transactions/999');
    // ステータスコードが 404 であることを確認します。404 は「Not Found（見つからない）」を意味し、指定されたトランザクションIDが存在しないことを示します。
    expect(response.status).toBe(404); // ステータスコードが404であることを確認
    // レスポンスのボディに、{ error: 'Transaction not found' } というエラーメッセージが含まれていることを確認します。これは、削除しようとしたトランザクションが存在しないことを示すメッセージです。
    expect(response.body).toEqual({ error: 'Transaction not found' }); // エラーメッセージを確認
  });
});
