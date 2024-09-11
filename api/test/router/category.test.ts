import request from 'supertest';
import express from 'express';
import categoryRouter, { getCategoryById } from '../../src/router/category';

// Expressアプリケーションをセットアップ
const app = express();
app.use('/categories', categoryRouter);

describe('Category API', () => {
  // 正常系: カテゴリーの一覧を取得
  it('should return the list of categories', async () => {
    const response = await request(app).get('/categories');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { id: 1, name: '給料', type: 'income', description: '月給' },
      { id: 2, name: '食料品', type: 'expense', description: 'スーパーでの買い物' },
    ]);
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
    // 型を手動で変換してテスト
    expect(getCategoryById(('invalid' as unknown) as number)).toBeNull();
  });
});
