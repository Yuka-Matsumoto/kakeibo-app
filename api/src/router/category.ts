import { Router, Request, Response } from 'express';

const categoryRouter = Router();

// ダミーデータ（データベースの代わり）
export const categories = [
  { id: 1, name: '給料', type: 'income', description: '月給' },
  { id: 2, name: '食料品', type: 'expense', description: 'スーパーでの買い物' },
];

// IDに基づいてカテゴリーを取得する関数
export const getCategoryById = (id: number) => {
  return categories.find((category) => category.id === id) || null;
};

// カテゴリーの一覧を取得するエンドポイント
categoryRouter.get('/', (req: Request, res: Response) => {
  res.json(categories);
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

// 新規のカテゴリーを作成するエンドポイント
categoryRouter.post('/', (req: Request, res: Response) => {
  const { name, type, description } = req.body;

  if (!name || !type || !description) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const newCategory = {
    id: categories.length + 1,
    name,
    type,
    description,
  };

  categories.push(newCategory);
  return res.status(201).json(newCategory);
});

// カテゴリーを更新するエンドポイント
categoryRouter.put('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const category = getCategoryById(id);

  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }

  const { name, type, description } = req.body;

  if (name) category.name = name;
  if (type) category.type = type;
  if (description) category.description = description;

  return res.json(category);
});

// カテゴリーを削除するエンドポイント
categoryRouter.delete('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const index = categories.findIndex((category) => category.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Category not found' });
  }

  categories.splice(index, 1);
  return res.json({ message: 'Category deleted' });
});

export default categoryRouter;
