## 家計簿アプリ(kakeibo-app)
クライアント側からHTTPリクエストを送信して利用できるバックエンドAPIです。
フロントエンドは含まれていません。

### 主な機能
```
ユーザー管理: ユーザーの新規登録、　編集、削除
カテゴリー管理: カテゴリーの追加、編集、削除（例: 給料、食費、娯楽など）
トランザクション管理: 収入や支出のトランザクションの追加、編集、削除
入出金一覧表示: 各トランザクションを日付、カテゴリー、金額ごとに表示
データの保存: サーバー上でデータを永続化（データベースは後に実装予定）
```
### 使用技術
```
Node.js: サーバーサイドのJavaScriptランタイム
Express: Node.jsのウェブフレームワーク
TypeScript: 静的型付けのJavaScriptスーパーセット
Docker: コンテナ化のためのプラットフォーム
Jest & Supertest: テストフレームワーク（APIエンドポイントのテストに使用）
ESLint & Prettier: コードの品質とスタイルを保つためのツール
```

### ディレクトリ構造
```
Section4-1/
├── api/
│   ├── node_modules/
│   ├── src/
│   │   ├── router/
│   │   │   ├── category.ts
│   │   │   ├── transaction.ts
│   │   │   └── user.ts
│   │   ├── app.ts
│   ├── test/router/
│   │   ├── category.test.ts
│   │   ├── transaction.test.ts
│   │   ├── user.test.ts
│   ├── .env
│   ├── .eslintrc.json
│   ├── .prettierrc
│   ├── Dockerfile
│   ├── package-lock.json
│   ├── package.json
│   ├── settings.json
│   ├── tsconfig.json
├── compose.yaml
├── design.md
```
