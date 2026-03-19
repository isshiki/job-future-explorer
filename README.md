# AI職業影響度チェッカー

米国BLSデータとAI影響度スコアをもとに、341職種の雇用見通しとAI影響をまとめた静的Webページです。
職業名での検索、分類フィルター（伸びる・中間・危機）、列ソートなどの機能を備えています。

**公開URL:** https://isshiki.github.io/job-future-explorer/

---

## 機能

- **キーワード検索** — 日本語名・英語名のどちらでも絞り込み可能
- **分類フィルター** — 伸びる / 中間 / 危機 の3分類で絞り込み
- **列ソート** — 職業名・雇用増減率・AI影響度をクリックで昇降順切り替え
- **色分け表示** — 分類ごとにカラードット＋行背景色で視覚化
- **CSVダウンロード** — 現在の表示データをCSVファイルとして保存
- **BLSリンク** — 各職業名をクリックするとBLS公式ページへ移動

---

## データについて

### 元データの構成

このWebアプリのデータは、以下の流れで作成されています。

```
米国労働統計局（BLS）OOH
        ↓
Andrej Karpathy 氏による可視化ツール（karpathy/jobs）
        ↓
本プロジェクト（日本語化・3分類・AI影響度スコア追加）
```

## 出典・データ利用について（重要）

本プロジェクトは、米国労働統計局（BLS）の [BLS Occupational Outlook Handbook](https://www.bls.gov/ooh/) の公開データ、および Andrej Karpathy 氏の [karpathy/jobs](https://github.com/karpathy/jobs) ／ [US Job Market Visualizer](https://karpathy.ai/jobs/) で用いられているAI影響度スコアを基に、日本語化・再構成および独自分類を行った非公式の可視化プロジェクトです。

- 雇用増減率などの職業統計データ: [BLS Occupational Outlook Handbook](https://www.bls.gov/ooh/)
- AI影響度スコア: [karpathy/jobs](https://github.com/karpathy/jobs) で生成されたLLMによる推計値を参照
- 日本語訳、3分類、UI、検索・絞り込み機能:  本プロジェクト独自

本プロジェクトは Andrej Karpathy 氏および BLS の公式プロジェクトではありません。  
AI影響度は「仕事がどの程度変化しうるか」の目安であり、職業の消滅を意味するものではありません。  
また、雇用増減率は米国データであり、日本国内の状況を直接示すものではありません。

### 各データの説明

| 項目 | 内容 | 出典 |
|------|------|------|
| 雇用増減率 | 米国の2024〜2034年の雇用予測（%） | [BLS Occupational Outlook Handbook](https://www.bls.gov/ooh/) |
| AI影響度 | AIによって仕事内容が変化する可能性（0〜10） | LLM（Gemini 3 Flash）による推計。[karpathy/jobs](https://github.com/karpathy/jobs) のスコアを参照 |
| 職業名（日本語） | 英語職業名の日本語訳 | 本プロジェクトによる翻訳・独自分析 |
| 3分類 | 伸びる・中間・危機 | 本プロジェクトによる基準に基づく分類 |

### 分類の基準

| 分類 | 条件 |
|------|------|
| **伸びる** | AI影響度 ≤ 4 かつ 雇用増減率 ≥ +7%（37職種） |
| **危機** | AI影響度 ≥ 8 かつ 雇用増減率 < 0%（17職種） |
| **中間** | 上記以外（287職種） |

> **注意：** 雇用増減率は米国の予測値であり、日本の状況とは異なります。AI影響度はLLMによる推計であり、職業の消滅を意味するものではありません。

---

## 関連リンク

- **本プロジェクト公開ページ** — https://isshiki.github.io/job-future-explorer/
- **[karpathy/jobs](https://github.com/karpathy/jobs)** — BLSデータの収集・AI露出スコア生成ツール（Andrej Karpathy 氏）
- **[US Job Market Visualizer](https://karpathy.ai/jobs/)** — karpathy/jobs に基づく職業可視化Webアプリ
- **[BLS Occupational Outlook Handbook](https://www.bls.gov/ooh/)** — 米国労働統計局の職業別雇用予測データベース

---

## 技術構成

| 項目 | 内容 |
|------|------|
| フレームワーク | なし（HTML / CSS / Vanilla JS） |
| ビルドツール | なし |
| ホスティング | GitHub Pages |
| データ形式 | `data/ai_analysis.json`（341件） |

ビルドステップが不要なため、リポジトリを clone して `index.html` をブラウザで開くか、
ローカルで `python -m http.server` を起動すれば動作確認できます。

---

## ライセンス

[Apache License 2.0](LICENSE)
