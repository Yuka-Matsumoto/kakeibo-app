import request from 'supertest';
import express from 'express';
import categoryRouter, {
  getCategoryById,
  categories,
} from '../../src/router/category';

// Expressアプリケーションをセットアップ
const app = express();
app.use(express.json()); // JSONボディのパース
app.use('/categories', categoryRouter);

describe('getCategoryById', () => {
  // テストが始まる前に categories を初期状態に戻す
  beforeEach(() => {
    categories.length = 0;
    categories.push(
      { id: 1, name: '給料', type: 'income', description: '月給' },
      {
        id: 2,
        name: '食料品',
        type: 'expense',
        description: 'スーパーでの買い物',
      },
    );
  });

  // 正常系: IDに基づいて特定のカテゴリーを取得
  it('should return a specific category by ID', async () => {
    const response = await request(app).get('/categories/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      name: '給料',
      type: 'income',
      description: '月給',
    });
  });

  // 異常系: 存在しないIDのカテゴリーをリクエスト
  it('should return 404 if the category is not found', async () => {
    const response = await request(app).get('/categories/999');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Category not found' });
  });

  // 正常系: 新規カテゴリーを作成
  it('should create a new category', async () => {
    const newCategory = {
      name: 'エンターテインメント',
      type: 'expense',
      description: '映画館での支出',
    };

    const response = await request(app).post('/categories').send(newCategory);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: 3, // 新しいカテゴリーのIDが3になる
      ...newCategory,
    });
  });

  // 異常系: 必須フィールドが欠落している場合
  it('should return 400 if required fields are missing', async () => {
    const incompleteCategory = {
      name: '旅行',
    };

    const response = await request(app)
      .post('/categories')
      .send(incompleteCategory);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Missing required fields' });
  });

  // 正常系: カテゴリーを更新
  it('should update an existing category', async () => {
    const updatedCategory = {
      name: '給料（更新後）',
      type: 'income',
      description: '月給の増額',
    };

    const response = await request(app)
      .put('/categories/1')
      .send(updatedCategory);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      ...updatedCategory,
    });
  });

  // 異常系: 存在しないカテゴリーの更新
  it('should return 404 if updating a non-existent category', async () => {
    const response = await request(app).put('/categories/999').send({
      name: '旅行',
      type: 'expense',
      description: '出張費',
    });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Category not found' });
  });

  // 正常系: カテゴリーを削除
  it('should delete a category', async () => {
    const response = await request(app).delete('/categories/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Category deleted' });
  });

  // 異常系: 存在しないカテゴリーの削除
  it('should return 404 if deleting a non-existent category', async () => {
    const response = await request(app).delete('/categories/999');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Category not found' });
  });
});

describe('getCategoryById', () => {
  // 正常系: 正しいIDを使用してカテゴリーを取得
  it('should return the correct category for a valid ID', () => {
    expect(getCategoryById(1)).toEqual({
      id: 1,
      name: '給料',
      type: 'income',
      description: '月給',
    });
    expect(getCategoryById(2)).toEqual({
      id: 2,
      name: '食料品',
      type: 'expense',
      description: 'スーパーでの買い物',
    });
  });

  // 異常系: 存在しないIDを使用した場合
  it('should return null for an invalid ID', () => {
    expect(getCategoryById(999)).toBeNull();
  });

  // 異常系: 無効な型（文字列など）を渡した場合
  it('should handle non-number inputs gracefully', () => {
    expect(getCategoryById('invalid' as unknown as number)).toBeNull();
  });
});
