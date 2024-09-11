import { Router, Request, Response } from 'express';

// router は既に定義されていますが、別途インポートしている router を使っていないので不要
// import router from './category';

const categoryRouter = Router();

// ダミーデータ（データベースの代わり）
const category = [
  { id: 1, name: '給料', type: 'income', description: '月給' },
  { id: 2, name: '食料品', type: 'expense', description: 'スーパーでの買い物' },
];

// カテゴリーの一覧を取得する
categoryRouter.get('/', (req: Request, res: Response) => {
  res.json(category);
});

export default categoryRouter;
