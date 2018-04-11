# 技術書典4向けの被サークルチェック数をSlackに垂れ流すbot

## setup

環境変数にEMAIL, PASSWORD, SLACK_WEBHOOK, SLACK_CHANNEL, SLACK_MENTIONを設定する。

```
EMAIL="hoge@example.com"
PASSWORD="技術書典のパスワード"
SLACK_WEBHOOK="https://hooks.slack.com/services/..............."
SLACK_CHANNEL="#hogehoge"
SLACK_MENTION=potato4d
```

SLACKで予めINCOMING_WEBHOOKを設定しておいてください。
EMAIL, PASSWORDは技術書典のログイン情報です。取り扱いはご注意を。

## Lambda

適当にZipで固めて exports.handler を対象にして動かします。

## ローカル実行

開発時は下記で適当にやってください。多分動きます。

yarnを使う場合

```sh
$ yarn
$ node -e "const { handler } = require('./');handler()"
```

npmを使う場合

```
$ npm i
$ node -e "const { handler } = require('./');handler()"
```

6時間ごとに、指定したチャンネルに被サークルチェック数を発言します。

