// supertestはExpressなどのNode.jsアプリケーションに対するHTTPリクエストをシミュレート（模擬実験）してサーバーのエンドポイントをテストできるツール
import request from 'supertest';
// expressのフレームワークを利用してテストする
import express from 'express';
// categoryRouter = ルーティングのロジックが定義されたモジュール
// getCategoryById = 関数名（指定されたIDでカテゴリーを取得する）
// categories = ダミーデータ
import categoryRouter, { getCategoryById, categories } from '../../src/router/category';

// Expressアプリケーションをセットアップ
// テスト対象のExpressアプリケーションを定義している
const app = express();
// リクエストボディをJSONとしてパースします
// Webアプリケーションが受け取ったデータ（リクエストボディ）を、コンピュータが理解しやすい形式であるJSONに変換する処理のことです。
app.use(express.json()); // JSONボディのパース 
// これにより、/categories に対するリクエストが categoryRouter で処理されるようになります。
app.use('/categories', categoryRouter);

// beforeEach = 各テストが実行される前に実行される処理です。ここでは、categories 配列をクリア（length = 0）して、再度初期データを追加しています。
describe('getCategoryById', () => {
  // テストが始まる前に categories を初期状態に戻す
    beforeEach(() => {
      categories.length = 0;
      categories.push(
        { id: 1, name: '給料', type: 'income', description: '月給' },
        { id: 2, name: '食料品', type: 'expense', description: 'スーパーでの買い物' }
      );
    });

  // 正常系: IDに基づいて特定のカテゴリーを取得
  // GET /categories/1 に対するリクエストが正しいカテゴリー（id: 1）を返すかどうかを確認しています。 　
  it('should return a specific category by ID', async () => {
    // supertest を使って、/categories/1 エンドポイントにGETリクエストを送り、その結果を取得します。
    const response = await request(app).get('/categories/1');
    // レスポンスのステータスコードが 200 (成功) であることを確認します。
    expect(response.status).toBe(200);
    // レスポンスの内容が期待するカテゴリー情報と一致しているか確認します。
    expect(response.body).toEqual({
      id: 1,
      name: '給料',
      type: 'income',
      description: '月給',
    });
  });

  // 異常系: 存在しないIDのカテゴリーをリクエスト
  // 存在しないカテゴリーID (/categories/999) に対してリクエストを送った際、404エラーが返るかどうかを確認します。   
  it('should return 404 if the category is not found', async () => {
    // 存在しないID (999) を指定してリクエストを送信。
    const response = await request(app).get('/categories/999');
    // ステータスコードが 404 であることを確認します。
    expect(response.status).toBe(404);
    // レスポンスの内容が "Category not found" というエラーメッセージであることを確認します。
    expect(response.body).toEqual({ message: 'Category not found' });
  });

  // 正常系: 新規カテゴリーを作成
  // 新しいカテゴリーを作成するエンドポイント (POST /categories) が正常に動作するかどうかをテストします。   
  it('should create a new category', async () => {
    const newCategory = {
      name: 'エンターテインメント',
      type: 'expense',
      description: '映画館での支出',
    };

    // supertest を使って、/categories エンドポイントに対して POST リクエストを送信します。newCategory のデータがサーバーに送られます。
    const response = await request(app).post('/categories').send(newCategory);
    // サーバーから返されたレスポンスのステータスコードをチェックします。201 は「作成成功」を示すHTTPステータスコードです。
    expect(response.status).toBe(201);
    // レスポンスのボディが、期待した内容と一致しているか確認します。id: 3 は、サーバーが新しく作成したカテゴリーに割り当てたIDで、他のデータは送信した newCategory の内容をそのまま含んでいることを確認します。
    expect(response.body).toEqual({
      id: 3, // 新しいカテゴリーのIDが3になる
      ...newCategory,
    });
  });

  // 異常系: 必須フィールドが欠落している場合
  // カテゴリー作成時に、必要なデータ（必須フィールド）が欠落している場合、適切にエラーを返すかをテストします。   
  it('should return 400 if required fields are missing', async () => {
    // 欠落したデータでリクエストを送信します。この例では、name だけが指定され、type や description が欠けています。
    const incompleteCategory = {
      name: '旅行',
    };

    // 不完全なカテゴリー情報（name だけ）を含んだリクエストをサーバーに送信します。
    const response = await request(app).post('/categories').send(incompleteCategory);
    // サーバーが返すステータスコードを確認します。400 は「Bad Request（リクエストに問題がある）」を示すエラーステータスです。
    expect(response.status).toBe(400);
    // レスポンスのボディには、エラーメッセージとして Missing required fields が返されることを確認します。
    expect(response.body).toEqual({ message: 'Missing required fields' });
  });

  // 正常系: カテゴリーを更新
  // 既存のカテゴリー（/categories/1）を更新するエンドポイント (PUT /categories/:id) が正常に動作するかをテストしています。
  it('should update an existing category', async () => {
    // 更新後のカテゴリー情報です。ここでは、name、type、description が新しい値で指定されています。
    const updatedCategory = {
      name: '給料（更新後）',
      type: 'income',
      description: '月給の増額',
    };

    // supertest を使って、カテゴリーID 1 に対して PUT リクエストを送り、カテゴリーを更新します。updatedCategory のデータが送信されます。
    const response = await request(app).put('/categories/1').send(updatedCategory);
    // レスポンスのステータスコードが 200 であることを確認します。200 は成功を示すHTTPステータスコードです。
    expect(response.status).toBe(200);
    // レスポンスのボディが、更新後のカテゴリー情報と一致しているか確認します。id: 1 はそのままで、その他の情報（name、type、description）が更新された内容に変更されていることを確認します。
    expect(response.body).toEqual({
      id: 1,
      ...updatedCategory,
    });
  });

  // 異常系: 存在しないカテゴリーの更新
  // 存在しないカテゴリー（/categories/999）に対して更新リクエストを送った場合に、適切にエラーが返されるかを確認するテストです。
  it('should return 404 if updating a non-existent category', async () => {
    // 存在しないカテゴリーID 999 に対して PUT リクエストを送ります。このIDに対応するカテゴリーは存在しないため、エラーが発生するはずです。
    const response = await request(app)
      .put('/categories/999')
      .send({
        name: '旅行',
        type: 'expense',
        description: '出張費',
      });
    // レスポンスのステータスコードが 404 であることを確認します。404 は「Not Found（リソースが見つからない）」を示すエラーステータスです。
    expect(response.status).toBe(404);
    // レスポンスのボディが、{ message: 'Category not found' } というエラーメッセージを含んでいることを確認します。
    expect(response.body).toEqual({ message: 'Category not found' });
  });

  // 正常系: カテゴリーを削除
  // 既存のカテゴリー（/categories/1）を削除するエンドポイント (DELETE /categories/:id) が正常に動作するかをテストします。
  it('should delete a category', async () => {
    // supertest を使って、カテゴリーID 1 に対して DELETE リクエストを送信します。これはID 1 のカテゴリーを削除しようとするリクエストです。
    const response = await request(app).delete('/categories/1');
    // サーバーから返されたレスポンスのステータスコードが 200 であることを確認します。200 は成功を意味し、削除処理が正常に完了したことを示しています。
    expect(response.status).toBe(200);
    // レスポンスのボディが { message: 'Category deleted' } であることを確認します。これは削除が成功したことを示すメッセージです。
    expect(response.body).toEqual({ message: 'Category deleted' });
  });

  // 異常系: 存在しないカテゴリーの削除
  // 存在しないカテゴリー（/categories/999）に対して削除リクエストを送った場合に、適切にエラーが返されるかを確認するテストです。
  it('should return 404 if deleting a non-existent category', async () => {
    // 存在しないカテゴリーID 999 に対して DELETE リクエストを送信します。このIDに対応するカテゴリーが存在しないため、エラーレスポンスが返されることを期待します。
    const response = await request(app).delete('/categories/999');
    // サーバーが返すステータスコードが 404 であることを確認します。404 は「Not Found（リソースが見つからない）」を示すエラーステータスです。
    expect(response.status).toBe(404);
    // レスポンスのボディが { message: 'Category not found' } というエラーメッセージであることを確認します。
    expect(response.body).toEqual({ message: 'Category not found' });
  });
});

// describe: テストケースをグループ化するための関数です。getCategoryById という関数に対して、複数のテストをまとめています。
// getCategoryById: 渡された ID に基づいて特定のカテゴリーを取得する関数です。テストの目的は、この関数が期待通りに動作するかどうかを確認することです。
describe('getCategoryById', () => {
  // 正常系: 正しいIDを使用してカテゴリーを取得
  // 有効なIDを渡したときに getCategoryById が正しいカテゴリー情報を返すかどうかをテストしています。
  it('should return the correct category for a valid ID', () => {
    // getCategoryById(1) という関数呼び出しに対して、期待されるカテゴリー情報をチェックしています。この場合、id: 1 のカテゴリー（「給料」）が正しく返されることを期待しています。
    expect(getCategoryById(1)).toEqual({
      id: 1,
      name: '給料',
      type: 'income',
      description: '月給',
    });
    // 同様に、id: 2 のカテゴリー（「食料品」）が返されることを確認しています。
    expect(getCategoryById(2)).toEqual({
      id: 2,
      name: '食料品',
      type: 'expense',
      description: 'スーパーでの買い物',
    });
  });

  // 異常系: 存在しないIDを使用した場合
  // 存在しないIDを渡したときに、getCategoryById が適切に null を返すかどうかをテストしています。 
  it('should return null for an invalid ID', () => {
    // 存在しないID（999）を指定して getCategoryById を呼び出した場合、null が返されることを期待しています。
    expect(getCategoryById(999)).toBeNull();
  });

  // 異常系: 無効な型（文字列など）を渡した場合
  // 無効な入力（例えば、文字列などの数値ではない型）を渡したときに、関数が適切に null を返すかどうかをテストしています。 
  it('should handle non-number inputs gracefully', () => {
    // getCategoryById に文字列 'invalid' を無理やり数値として渡していますが、それでも関数が例外を投げずに null を返すことを期待しています。
    expect(getCategoryById(('invalid' as unknown) as number)).toBeNull();
  });
});
