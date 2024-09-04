
import { Router, Request, Response } from 'express';

const transactionRouter = Router();

// ダミーデータ（データベースの代わり）
let transactions = [
    { id: 1, date: '2024-09-01', type: 'income', amount: 5000, category: 'salary', description: 'Monthly salary' },
    { id: 2, date: '2024-09-02', type: 'expense', amount: 1500, category: 'food', description: 'Grocery shopping' }
];

// 入出金の一覧を取得する
// http://localhost:4000/transaction
transactionRouter.get('/', (req: Request, res: Response) => {
    res.json(transactions);
});

// 特定の入出金の詳細を取得する
// http://localhost:4000/transaction/1
transactionRouter.get('/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10); // リクエストパラメータからIDを取得し、整数に変換
    const transaction = transactions.find(t => t.id === id); // IDに一致するトランザクションを検索
  
    if (transaction) {
      res.json(transaction); // トランザクションデータを返す
    } else {
      res.status(404).json({ error: 'Transaction not found' }); // 該当するIDが見つからない場合
    }
  });

// 新規の入出金データを作成する
transactionRouter.post('/', (req: Request, res: Response) => {
    const { date, type, amount, category, description } = req.body;

    if (!date || !type || !amount || !category) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const newTransaction = {
        id: transactions.length + 1,
        date,
        type,
        amount,
        category,
        description
    };

    transactions.push(newTransaction);
    res.status(201).json(newTransaction);
});

// 既存の入出金データの更新
transactionRouter.put('/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const { date, type, amount, category, description } = req.body;

    const transaction = transactions.find(t => t.id === parseInt(id));

    if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
    }

    if (date) transaction.date = date;
    if (type) transaction.type = type;
    if (amount) transaction.amount = amount;
    if (category) transaction.category = category;
    if (description) transaction.description = description;

    res.json(transaction);
});

// 入出金履歴の削除
transactionRouter.delete('/:id', (req: Request, res: Response) => {
    const { id } = req.params;

    const transactionIndex = transactions.findIndex(t => t.id === parseInt(id));

    if (transactionIndex === -1) {
        return res.status(404).json({ error: 'Transaction not found' });
    }

    transactions.splice(transactionIndex, 1);

    res.json({ message: 'Transaction deleted' });
});

export default transactionRouter;
