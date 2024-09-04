### kakeibo_next 設計書

## APIが提供するリソース一覧
・入出金
・ユーザー情報
・カテゴリ別分析


## 【入出金 (ユーザーの収入や支出を管理するためのリソース)】
GET /transaction     　　　-入出金の一覧を取得する
GET /transaction/{id}     -特定の入出金の詳細の取得
POST /transaction         -新規の入出金データの登録
PUT /transaction/{id}　   -既存の入出金データの更新
DELETE /transaction/{id}　-入出金履歴の削除

## レスポンスデータ
id: 123(number)
data: 日付(string)
type: 収入or支出(income, expense)
amount: 金額(number)
category: カテゴリー(string)
description: 説明(string)

## リクエストとレスポンスのサンプル
GET /transaction

{
  "data": {
    "transaction": [
	      {
     　　　"data": "2024-09-02",
	 　　　　"type": income,
	 　　　　"amount": 200000,
	 　　　　"category": "給料",
     　　　"description": "月給"
	      }
    ]
  }
}

## 【ユーザー情報 (ユーザーの登録や管理を行うためのリソース)】
GET /user/{id}    -特定のユーザー情報一覧の取得
POST /user        -新規のユーザーを登録
PUT /user/{id}    -ユーザー情報の更新
DELETE /user/{id} -ユーザー情報の削除

## レスポンスデータ
id: 123(number)
username: 氏名(string)
email: eメールアドレス(string)
birthday: 誕生日(string)

## リクエストとレスポンスのサンプル
GET /user

{
  "data": {
    "user": [
	      {
     　　　"id": "123,
	 　　　　"username": yuka_matsumoto,
	 　　　　"email": yuka.gmail.com,
	 　　　　"birthday": "1990-09-16"
	      }
    ]
  }
}

## 【カテゴリー別分析】
GET /category          -カテゴリー情報一覧の取得
GET /category/{id}     -特定のカテゴリー情報の取得
POST /category         -新規のカテゴリー情報の作成
PUT /category/{id}     -カテゴリー情報の更新
DELETE /category/{id}  -カテゴリー情報の削除

## レスポンスデータ
id: 123(number)
name: カテゴリー名(string)
type: 収入or支出(income, expense)
description: 説明(string)

## リクエストとレスポンスのサンプル
GET /category

{
  "data": {
    "category": [
	      {
     　　　"id": "123,
	 　　　　"name": 食料品,
	 　　　　"type": income,
	 　　　　"description": "スーパーでの買い物"
	      }
    ]
  }
}


