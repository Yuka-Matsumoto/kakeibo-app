# ベースイメージとしてNodeのLTSバージョンを使用
FROM node:lts

# 作業ディレクトリを設定
WORKDIR /usr/src/app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションの全ファイルをコピー
COPY . .

# ts-node-devをグローバルにインストール
RUN npm install -g ts-node-dev

# コンテナが使用するポートを開放
EXPOSE 4000

# アプリケーションを起動するコマンド
CMD ["npm", "run", "dev"]
