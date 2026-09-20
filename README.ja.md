<h1>
  <img src="assets/quest-icon-v2.svg" alt="クエスト設計のアイコン：Q の内側に直角の接続線と円形ノードで構成した対称のツリー" width="48" height="48" align="absmiddle">
  GameQuestDesignerSkill
</h1>

[![npm](https://img.shields.io/npm/v/game-quest-designer-skills?style=flat-square&color=D74632)](https://www.npmjs.com/package/game-quest-designer-skills) [![中文](https://img.shields.io/badge/语言-中文-20231F?style=flat-square)](README.md) [![English](https://img.shields.io/badge/Language-English-20231F?style=flat-square)](README.en.md) [![日本語](https://img.shields.io/badge/言語-日本語-D74632?style=flat-square)](README.ja.md)

**クエストを、心に残る体験へ。**

RPG のクエスト設計を支える Skill 集です。物語、遊び、テンポ、行動への反応をつなぎ、最初の出会いから結末までを一つの体験として磨き上げ、チームが制作に使える資料にまとめます。

仕様書があっても、アイデアだけでも始められます。提供された資料をもとに考え、不足する情報は仮定として示します。非公開の資料はユーザーのプロジェクト内に保存します。

## できること

- **プロジェクトを知る**：`$quest-understand` で使える仕組み、クエストのルール、確認が必要な点を整理します。
- **クエストを考える**：`$quest-design` で人物の対立、プレイヤーの行動と結果を考え、制作規模を抑えた案も比較します。
- **レビューして直す**：`$quest-review` で具体的な場面の問題と修正案を示します。一本道、ゆっくりした展開、戦闘がないこと自体は欠点ではありません。
- **資料をまとめる**：概要、フロー、実装仕様、制作要件、レビュー記録から必要なものだけを作ります。
- **参照を確認する**：任意の `quest-package.json` でクエスト、手順、要件、テストを関連づけ、`quest-package-validate <path>` で ID の重複、参照切れ、到達できないノードを確認できます。エンジン設定ではありません。

## 0.2.2 の変更点

- 10 個の Skill の説明を読みやすくしました。まずプレイヤーの状況、行動、体験を説明し、その後に実装ルールを示します。
- 書き方の例を追加し、クエスト概要テンプレートを改訂しました。専門用語の羅列や不要な表を減らします。
- 中国語、英語、日本語の紹介文を更新しました。サイトには言語のドロップダウンを追加し、モバイル表示と FAQ の改行を調整しました。
- 既存の Skill は下記の `update` コマンドで更新できます。インストールコマンドと検証ツールのインターフェースは引き続き使えます。

## インストール

### npx を使用する

Node.js 20 以降と npm が必要です。グローバルインストールは不要です。

```bash
# すべての Skill をインストール（既存のディレクトリはスキップ）
npx --yes --package=game-quest-designer-skills@latest -- game-quest-designer-skills install

# インストール済みの本コレクションの Skill を更新
npx --yes --package=game-quest-designer-skills@latest -- game-quest-designer-skills update
```

指定した Skill だけをインストールする場合は、末尾に名前を追加します。

```bash
npx --yes --package=game-quest-designer-skills@latest -- game-quest-designer-skills install quest-design quest-review
```

更新では個人の変更をマージせず、対応する Skill ディレクトリを置き換えます。以前のディレクトリは、インストール先と同じ親ディレクトリの `.quest-skill-backups/` に保存されます。`--dry-run` で操作を確認し、`--dest PATH` でインストール先を指定できます。

### Agent にインストールを依頼する

次の文を Codex または Skill のインストールに対応した Agent にそのまま送信してください。

```text
このリポジトリにあるすべての Skill をインストールしてください：https://github.com/cloud-oc/GameQuestDesignerSkill
```
## 使い方

リポジトリのソースは `skills/` に集約されています。手動インストールでは、その中の `game-quest-designer/` と必要な `quest-*/` ディレクトリを、Skill ディレクトリ（Codex では通常 `~/.codex/skills/`）に並列にコピーします。各ディレクトリに独自の `SKILL.md` と UI メタデータがあります。このリポジトリに置いてあるだけではインストール済みにはなりません。専門 Skill を総合入口のディレクトリ内に入れ子にしないでください。総合入口は `$game-quest-designer` で呼び出し、各専門 Skill は単独でもインストール・呼び出しが可能です。

| 呼び出し | 用途 |
|---|---|
| `$game-quest-designer` | クエスト設計能力の選択と組み合わせ |
| `$quest-understand` | クエストシステム、対応機能、状態モデルの分析 |
| `$quest-design` | オリジナルクエスト、核となる体験、クエストの要件定義 |
| `$quest-flow` | シナリオからゲームプレイへの変換、分岐とフロー設計 |
| `$quest-spec` | 条件、目標、状態、アクション、実装仕様 |
| `$quest-prototype` | ロジックプロトタイプ、例外経路と復旧の検証 |
| `$quest-review` | 物語・プレイヤー体験のレビュー、設定データの検査 |
| `$quest-requirements` | 制作・演出要件、クエスト間のリソース再利用 |
| `$quest-collab` | プログラム、レベルデザイン、演出、UI チームへの引き継ぎ |
| `$quest-docs` | クエスト資料の読み取り、整理、同期 |

```text
$game-quest-designer を使って、提供したクエストシステムの説明と既存事例を読み、
このプロジェクト専用のクエスト設計ワークフローを作成してください。
不足情報を明示し、システムが対応していると推測しないでください。
```

自然言語でも依頼できます。

- 「このシナリオ概要から、クエストの要件定義、フロー設計、ロジックプロトタイプを作成してください。」
- 「このフローを Quest/Target、受注条件、アクションの実装仕様に変換し、不足しているスキーマ情報を明示してください。」
- 「プロジェクトの宣言的設計ルールに沿って設定を確認し、不安定な条件と Sandbox に移すべき演出処理を指摘してください。」
- 「このシナリオを物語、プレイヤー体験、クエストロジックの各フローに整理し、システム上の不足を示してください。」
- 「このエリアと利用可能なゲームプレイを使い、新規制作の範囲を抑えた独立クエストを設計してください。」
- 「この 3 つのクエストの NPC、アニメーション、演出要件を統合し、出典と再利用の確認事項を残してください。」
- 「このクエストの動機付け、お使いの単調さ、進行不能になる論理構造をレビューし、修正案を出してください。」

例：`$quest-design 既存 NPC とマップを再利用して、調査中心の村のサブクエストを設計してください`、`$quest-review アイテムを先に取得した場合、このクエストが進行不能になるか確認してください`。従来の `+コマンド` は総合入口で意図を指定する別名として解釈されますが、独立登録された Skill ではありません。

参照資料は必要に応じて読み込みます。プロジェクトのテンプレートを優先し、ない場合は必要最小限の読みやすい構成を使用します。機械で読み込む設定データは、実際の形式が判明しており、ユーザーが要求した場合にのみ出力します。設計上の確認は、ゲームエンジンでの実行テストとは異なります。

正式な引き継ぎでは、該当する専門 Skill が `assets/*-template.md` をコピーできます。クエスト、ビート、要件、テスト ID は成果物間で維持し、不要な項目はテンプレートを埋めるために範囲を広げず削除します。

開発文書に構想として書かれたクラウド文書アダプター、同期スクリプト、パーサーを、実装済み機能として扱うことはありません。環境で実際に利用できる文書ツールを優先し、上書きや一括同期には明確な操作権限の範囲を設けます。

## 保守と検証

インストーラーとクエストパッケージ検証ツールは Node.js 標準ライブラリのみを使用し、サードパーティの実行時依存関係はありません。`npm test` でインストール/更新の安全性、参照リンク、テンプレート配布、クエストパッケージ検証を確認し、`npm pack --dry-run` で配布内容を確認できます。npx は指定版のパッケージを取得し、インストーラー自身は同梱 Skill のみを操作して Git pull は実行しません。

### 自動ビルドと公開

- push または pull request ごとに Node.js 20/24 で検証し、npm `.tgz` を自動生成して GitHub Actions の成果物として 14 日間保存します。
- ローカルの `npm run build` は `prepack` で全テストを実行してから tarball を作成します。`npm publish` にも同じゲートが適用されます。
- `package.json` のバージョンと一致する `v*` タグを push すると、npm Trusted Publishing で自動公開します。`npm version patch --no-git-tag-version` でバージョンを上げ、`npm run build:site` と `npm test` を実行します。生成ページをコミットし、同じバージョンのタグを作成して push してください。

初回の自動公開前に、npm の `game-quest-designer-skills` 設定で GitHub Actions の Trusted Publisher を追加してください。所有者は `cloud-oc`、リポジトリは `GameQuestDesignerSkill`、ワークフローファイル名は `publish.yml` とし、直接の `npm publish` を許可します。これは一度だけ必要なアカウント設定です。未設定でもビルドは成功しますが、タグからの公開は認証に失敗します。OIDC を使用するため、長期 `NPM_TOKEN` は不要です。

設計手法は、プレイヤーの動機と情報開示、選択の結果と分岐コスト、共有 NPC とワールド状態、目標のカウントと報酬処理、セーブ・再開時の復旧、設定の受け入れ検証、プレイテスト観察といった RPG 制作上の課題を扱います。詳細は設計、フロー、実装仕様、検証の各 Skill で必要に応じて読み込みます。

判断はプロジェクト資料または明示した設計上の仮定に基づきます。手法と受け入れシナリオを追加したことは、実際のゲームでの検証や独立したモデル評価が完了したことを意味しません。

### リポジトリ構成

```text
skills/   個別にインストール可能な 10 個の Skill
bin/      npm インストーラーと中立バリデーター
test/     Node.js の構造・インストール・検証テスト
evals/    個別実行可能な振る舞い評価ケース
site/     GitHub Pages の利用ガイド
assets/   リポジトリ共通のブランド素材
```

総合入口は [SKILL.md](skills/game-quest-designer/SKILL.md) です。専門手法は `skills/*/SKILL.md` で管理します。総合入口の `references/` は、総合 Skill だけをインストールした場合の基本手法として残しています。振る舞いの回帰シナリオは [evals/scenarios.md](evals/scenarios.md) を参照してください。skill-creator 付属の `quick_validate.py` で `skills/` 配下の 10 ディレクトリを個別に確認できます。構造検証だけでは、モデルの振る舞いやゲーム実行時の正しさは保証できません。

ライセンスは [Apache-2.0](LICENSE) です。

## サイトと文案の更新

サイトは[中国語](https://cloud-oc.github.io/GameQuestDesignerSkill/)、[英語](https://cloud-oc.github.io/GameQuestDesignerSkill/en.html)、[日本語](https://cloud-oc.github.io/GameQuestDesignerSkill/ja.html)に対応しています。言語を切り替えても現在のセクションを保ち、各言語の URL を共有できます。

`site/locales/` の文案を編集した後、`npm run build:site` と `npm test` を実行します。生成した HTML も一緒にコミットしてください。3 言語でレイアウトを共有し、本文は静的なページとして読めます。

Skill の書き方は[設計文の例（中国語）](skills/game-quest-designer/references/writing-style.md)を参照してください。
