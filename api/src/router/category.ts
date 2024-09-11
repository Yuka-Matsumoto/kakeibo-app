import { Router, Request, Response } from 'express';

const categoryRouter = Router();

// ダミーデータ（データベースの代わり）
const category = [
  { id: 1, name: '給料', type: 'income', description: '月給' },
  { id: 2, name: '食料品', type: 'expense', description: 'スーパーでの買い物' },
];

// IDに基づいてカテゴリーを取得する関数
export const getCategoryById = (id: number) => {
    return category.find(category => category.id === id) || null;
  };

// カテゴリーの一覧を取得するエンドポイント
categoryRouter.get('/', (req: Request, res: Response) => {
  res.json(category);
});

// 特定のIDのカテゴリーを取得するエンドポイント
categoryRouter.get('/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const category = getCategoryById(id);
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  });

export default categoryRouter;
