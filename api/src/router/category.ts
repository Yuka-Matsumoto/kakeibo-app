
import { Router, Request, Response } from 'express';
import router from './category';

const categoryRouter = Router();

// ダミーデータ（データベースの代わり）
let category = [
    { id: 1, name: '給料', type: 'income', description: '月給' },
    { id: 2, name: '食料品', type: 'expense', description: 'スーパーでの買い物' }
];

// カテゴリーの一覧を取得する
categoryRouter.get('/', (req: Request, res: Response) => {
    res.json(category);
});

export default categoryRouter;

