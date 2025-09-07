# 2509-gabaithon

## member
- kai
- nishiyama
- salieri256
- yuzu
- yotu
- ochi

## env
1. `.env.example` を複製し、ファイル名を `.env` もしくは `.env.local` に設定
  - これ以外の名前にすると git に commit されてしまうので注意
2. ファイルの内容を [ここ](https://discord.com/channels/1410219570576232572/1414343468272193647/1414343472168828950) の内容で更新
   
## supabase
基本的には使わなくて大丈夫ですが、ローカルですべて試す場合に使ったりします<br>
事前に Docker のセットアップが必須です

1. `npx supabase start` します（通常5-10分程度の初期化が入ります）
2. 起動が終了すると、コンソールに URL などの情報が書き出されます
   - アプリが使用する DB をこれにしたい場合、`.env` ファイルの中身を書き換えてください
