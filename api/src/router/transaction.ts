import { Router, Request, Response } from 'express';

const transactionRouter = Router();

// ダミーデータ（データベースの代わり）
const transactions = [
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
];

// 入出金の一覧を取得する
transactionRouter.get('/', (req: Request, res: Response) => {
  res.json(transactions);
});

// 特定の入出金の詳細を取得する
transactionRouter.get('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10); // リクエストパラメータからIDを取得し、整数に変換
  const transaction = transactions.find((t) => t.id === id); // IDに一致するトランザクションを検索

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
    description,
  };

  transactions.push(newTransaction);
  return res.status(201).json(newTransaction); // 必ず何かを返す
});

// 既存の入出金データの更新
transactionRouter.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { date, type, amount, category, description } = req.body;

  // parseInt は基数を指定しない場合、文字列の最初の文字によって基数を自動的に推測しますが、これは予期しない動作を引き起こす可能性があるため、ESLint で警告が表示。parseInt に第2引数として 10 を指定することで、常に10進数として数値を解析するように明示的に指定している。
  // const transaction = transactions.find((t) => t.id === parseInt(id));
  const transaction = transactions.find((t) => t.id === parseInt(id, 10)); // 基数（10）を追加

  if (!transaction) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  if (date) transaction.date = date;
  if (type) transaction.type = type;
  if (amount) transaction.amount = amount;
  if (category) transaction.category = category;
  if (description) transaction.description = description;

  // Return the updated transaction as the response
  return res.json(transaction); // 修正ポイント：return を追加
});

// 入出金履歴の削除
transactionRouter.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  const transactionIndex = transactions.findIndex(
    (t) => t.id === parseInt(id, 10),
  );

  if (transactionIndex === -1) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  transactions.splice(transactionIndex, 1);

  // 削除完了後にレスポンスを返す
  return res.json({ message: 'Transaction deleted' });
});

export default transactionRouter;
