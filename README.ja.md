<p align="left">
  <img src="assets/quest-icon-v2.svg" alt="クエスト設計のアイコン：Q の内側に直角の接続線と円形ノードで構成した対称のツリー" width="160" height="160">
</p>

# GameQuestDesignerSkill

[![中文](https://img.shields.io/badge/语言-中文-20231F?style=flat-square)](README.md) [![English](https://img.shields.io/badge/Language-English-20231F?style=flat-square)](README.en.md) [![日本語](https://img.shields.io/badge/言語-日本語-D74632?style=flat-square)](README.ja.md)

RPG のクエスト設計全体を支援する、プロジェクトに適応可能な Skill 集です。クエストシステムの仕様書、エディターの説明、シナリオ、世界設定からプロジェクトのルールを把握し、クエスト分析、要件定義、フロー設計、実装仕様、ロジックプロトタイプ、品質レビュー、オリジナルクエストの制作、制作要件の整理、チーム間の引き継ぎに対応します。

「章―幕―クエストグループ―クエスト―目標」、Quest/Target モデル、宣言的なクエスト設計などを理解できますが、プロジェクト資料で採用が確認できた場合にのみ適用します。特定チームの内部工程を、すべての RPG に共通する標準とは扱いません。資料がなくてもコンセプト案を作成できますが、未確認のシステム機能を明示します。非公開のプロジェクト資料はプロジェクト内に保存し、汎用 Skill パッケージには含めません。

## ダウンロードとインストール

### npx によるインストールと更新

Node.js 20 以降と npm が必要です。CLI はリポジトリに含まれており、事前のグローバルインストールは不要です。

`package.json` と `bin/` を含むバージョンが GitHub の main にプッシュされた後は、リポジトリから直接実行できます。

~~~bash
# 全 Skill をインストール（既存の Skill はスキップ）
npx --yes --package=github:cloud-oc/GameQuestDesignerSkill#main quest-skills install

# インストール済みの本コレクションの Skill を更新（未導入の Skill は追加しない）
npx --yes --package=github:cloud-oc/GameQuestDesignerSkill#main quest-skills update

# 指定した Skill のみインストールまたは更新
npx --yes --package=github:cloud-oc/GameQuestDesignerSkill#main quest-skills install quest-design quest-review
npx --yes --package=github:cloud-oc/GameQuestDesignerSkill#main quest-skills update quest-design quest-review
~~~

このリポジトリの npm パッケージはまだ公開されていないため、`npx game-quest-designer-skills@latest` は使用しないでください。GitHub 経由では指定したブランチのバージョンを使用します。バージョンを固定する場合は、`#main` を公開済みタグまたは完全なコミット SHA に置き換えてください。

リポジトリをダウンロード済みの場合は、`node bin/quest-skills.mjs install` または `node bin/quest-skills.mjs update` を直接実行できます。npm への公開は不要です。

- `list`：本コレクションのインストール状況を表示します。
- `--dry-run`：ファイルを書き込まず、予定される操作を表示します。
- `--dest PATH`：インストール先を指定します。既定値は `$CODEX_HOME/skills`、未設定の場合は `~/.codex/skills` です。

更新はディレクトリ単位の置き換えであり、個人の変更はマージしません。内容に変更がある場合、旧ディレクトリ全体をインストール先と同じ親ディレクトリの `.quest-skill-backups/<一意のID>/<Skill名>/` に保存し、正確なパスをターミナルに表示します。内容が同じ場合はスキップします。復元するには、現在の該当 Skill を別の場所へ移し、バックアップを元の位置にコピーしてください。更新は Skill ごとに行われるため、途中で失敗しても、完了済みの別の Skill は元に戻りません。原因を解消してから再実行できます。

### リポジトリのダウンロード

Git を使わない場合：[GitHub リポジトリ](https://github.com/cloud-oc/GameQuestDesignerSkill)で **Code → Download ZIP** を選択し、展開してリポジトリのディレクトリを開きます。[main ブランチの ZIP を直接ダウンロード](https://github.com/cloud-oc/GameQuestDesignerSkill/archive/refs/heads/main.zip)することもできます。

Git を使う場合：

```bash
git clone https://github.com/cloud-oc/GameQuestDesignerSkill.git
cd GameQuestDesignerSkill
```

### 手動で全 Skill をインストール

展開またはクローンしたリポジトリのルートで、次のコマンドを実行してください（macOS / Linux、Bash / Zsh）。総合入口と 9 つの専門 Skill をインストールします。同名のディレクトリがある場合は、メッセージを表示してスキップします。

```bash
quest_skill_dir="${CODEX_HOME:-$HOME/.codex}/skills"
mkdir -p "$quest_skill_dir"
for quest_skill in game-quest-designer quest-understand quest-design quest-flow quest-spec quest-prototype quest-review quest-requirements quest-collab quest-docs; do
  if [ -e "$quest_skill_dir/$quest_skill" ]; then
    printf '既存のためスキップ：%s\n' "$quest_skill"
  else
    cp -R "$quest_skill" "$quest_skill_dir/$quest_skill"
  fi
done
```

Windows を使う場合やターミナルを使わない場合は、上記 10 個のディレクトリをユーザーディレクトリ内の `.codex/skills/` に手動でコピーしてください。`CODEX_HOME` を設定している場合は、その配下の `skills/` を使用します。

### 必要な Skill だけをインストール

必要なディレクトリだけをコピーできます。例えば `quest-design/` と `quest-review/` のみでも利用できます。各ディレクトリ内の `SKILL.md` と `agents/` を保持し、Markdown ファイル 1 つだけをダウンロードしないでください。

`$skill-installer` に対応する Codex 環境では、次のように依頼することもできます。

```text
$skill-installer を使って、cloud-oc/GameQuestDesignerSkill の main ブランチから、
quest-design と quest-review の各ディレクトリにある Skill をインストールしてください。
```

すべてインストールする場合は、ディレクトリ一覧を上記の全体インストール用コマンドにある 10 個の名前に置き換えてください。

### インストールの確認と更新

インストール後、次のメッセージで `$quest-design` または `$quest-review` を指定して呼び出します。表示されない場合は、パスが `skills/quest-design/SKILL.md` になっているか、途中に余分なリポジトリ階層が入っていないかを確認してください。

更新には上記の npx コマンドを使用できます。ローカルで管理する場合は ZIP を再ダウンロードするか、リポジトリ内で `git pull --ff-only` を実行し、その後 `node bin/quest-skills.mjs update` でインストール済みコピーを更新してください。手動コピーで置き換える場合は先にバックアップしてください。上記のシェルによるコピーは、既存ディレクトリをスキップします。

## 使い方

`game-quest-designer/` と、必要な `quest-*/` ディレクトリを、Skill ディレクトリ（Codex では通常 `~/.codex/skills/`）に並列に配置します。各ディレクトリに独自の `SKILL.md` と UI メタデータがあります。このリポジトリに置いてあるだけではインストール済みにはなりません。専門 Skill を総合入口のディレクトリ内に入れ子にしないでください。総合入口は `$game-quest-designer` で呼び出し、各専門 Skill は単独でもインストール・呼び出しが可能です。

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

開発文書に構想として書かれたクラウド文書アダプター、同期スクリプト、パーサーを、実装済み機能として扱うことはありません。環境で実際に利用できる文書ツールを優先し、上書きや一括同期には明確な操作権限の範囲を設けます。

## 保守と検証

インストーラーは Node.js 標準ライブラリを使用し、サードパーティーの実行時依存関係はありません。`npm test` でインストール、更新、バックアップ、繰り返し実行、プレビュー、対象ディレクトリの保護を確認し、`npm pack --dry-run` で配布内容を確認できます。npx は指定バージョンのインストーラーを取得します。インストーラー自体は同梱の Skill だけを扱い、Git の pull は実行しません。

設計手法は、プレイヤーの動機と情報開示、選択の結果と分岐コスト、共有 NPC とワールド状態、目標のカウントと報酬処理、セーブ・再開時の復旧、設定の受け入れ検証、プレイテスト観察といった RPG 制作上の課題を扱います。詳細は設計、フロー、実装仕様、検証の各 Skill で必要に応じて読み込みます。

判断はプロジェクト資料または明示した設計上の仮定に基づきます。手法と受け入れシナリオを追加したことは、実際のゲームでの検証や独立したモデル評価が完了したことを意味しません。

総合入口は [SKILL.md](game-quest-designer/SKILL.md) です。専門手法は各 Skill の `SKILL.md` で管理します。総合入口の `references/` は、総合 Skill だけをインストールした場合の基本手法として残しています。振る舞いの回帰シナリオは [evals/scenarios.md](evals/scenarios.md) を参照してください。skill-creator 付属の `quick_validate.py` で 10 個の Skill ディレクトリを個別に確認できます。構造検証だけでは、モデルの振る舞いやゲーム実行時の正しさは保証できません。

ライセンスは [Apache-2.0](LICENSE) です。
