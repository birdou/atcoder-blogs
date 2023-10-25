# AtcoderBlogs
Atcoderのブログリンクを一覧形式で記録できるようにした学習支援サイト

## 開発用コンテナの起動方法
docker-compose.ymlが存在するディレクトリ内で以下のコマンドを実行してコンテナ作成
```bash
docker compose up -d
```

## フロントエンドのサーバー起動方法
コンテナに入る
```bash
docker exec -it atcoder-blogs-frontend bash
```

サーバー起動コマンドを実行
```bash
cd atcoder-blogs-frontend
npm start
```

## バックエンドのサーバー起動方法
コンテナに入る
```bash
docker exec -it atcoder-blogs-backend bash
```

初回のみデータベースのマイグレーションを行う
```bash
go run migration/migration.go
```

サーバー起動コマンドを実行
```bash
go run main.go
```