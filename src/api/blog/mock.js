import axios from "axios";
import MockAdapter from "axios-mock-adapter";

// モックインスタンスの作成（APIレスポンスの遅延を設定）
const mock = new MockAdapter(axios, { delayResponse: 1500 });

// テストAPIキー
export const VALID_API_KEY = "test-api-key-abc";

// タグデータ生成関数
const createTag = (name) => {
  // シンプルなID生成
  const generateId = () => {
    return Math.random().toString(36).substring(2, 11);
  };

  // 現在の日時をISO文字列形式で取得
  const now = new Date().toISOString();

  return {
    id: generateId(),
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
    revisedAt: now,
    name: name,
  };
};

// ブログ記事データ
const postsData1 = [
  {
    id: "post1",
    title: "Vue.jsでポートフォリオサイトを作成した話",
    content:
      '<h2 id="had7ce3f1cb">見出し2</h2><p style="text-align: start">日本語のテキストはこのように表示されます。</p><p style="text-align: start">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p><h3 id="h594976e74f">見出し3</h3><p style="text-align: start">日本語のテキストはこのように表示されます。</p><p style="text-align: start">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p><h4 id="h88e8c523a3">見出し4</h4><p style="text-align: start">文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル</p><h5 id="h169558c650">見出し5</h5><p style="text-align: start">文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル</p><h2 style="text-align: start" id="h6548903b5d"><strong>太字</strong></h2><p style="text-align: start">日本語のテキストは<strong>このように</strong>表示されます。</p><h2 style="text-align: start" id="h7e0b65841d"><strong>斜体</strong></h2><p style="text-align: start">日本語のテキストは<em>このように</em>表示されます。</p><h2 style="text-align: start" id="hf531356f88"><strong>下線</strong></h2><p style="text-align: start">日本語のテキストは<u>このように</u>表示されます。</p><h2 style="text-align: start" id="hdd1fc8dfe3"><strong>打ち消し線</strong></h2><p style="text-align: start">日本語のテキストは<s>このように</s>表示されます。</p><p style="text-align: start"></p><p style="text-align: start"><code>インラインコード</code></p><p style="text-align: start">寄テキストせ左</p><p style="text-align: center">テキスト寄せ中央</p><p style="text-align: right">テキスト寄せ右</p><h2 style="text-align: start" id="hcf2b66e679"><strong>コード</strong></h2><p style="text-align: start">日本語のテキストは<code>このように</code>表示されます。</p><h2 style="text-align: start" id="hbfbcb364fd"><strong>区切り線</strong></h2><hr><h2 style="text-align: start" id="hdf0456f9a2"><strong>引用</strong></h2><blockquote><p style="text-align: start">日本語のテキストはこのように表示されます。</p><p style="text-align: start">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p></blockquote><h2 style="text-align: start" id="h5c7cf48e04"><strong>コードブロック</strong></h2><div data-filename="test.js"><pre><code class="language-javascript">const taskInput = document.getElementById(&quot;taskInput&quot;);　// tesafdadasfaaaaaaaaaaaaaafffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff\nconst taskList = document.getElementById(&quot;taskList&quot;);\n\nfunction addTask() {\n  const taskText = taskInput.value.trim();\n  if (taskText === &quot;&quot;) {\n    alert(&quot;タスクを入力してください。&quot;);\n    return;\n  }\n\n  const li = document.createElement(&quot;li&quot;);\n  li.textContent = taskText;\n\n  const deleteBtn = document.createElement(&quot;span&quot;);\n  deleteBtn.textContent = &quot;削除&quot;;\n  deleteBtn.className = &quot;delete-btn&quot;;\n  deleteBtn.onclick = () =&gt; li.remove();\n\n  li.appendChild(deleteBtn);\n  taskList.appendChild(li);\n\n  taskInput.value = &quot;&quot;;\n\n  const result = users.filter(u =&gt; u.isActive &amp;&amp; u.score &gt; 70 &amp;&amp; u.department !== &apos;HR&apos; &amp;&amp; u.region === &apos;APAC&apos; &amp;&amp; u.tags.includes(&apos;priority&apos;) &amp;&amp; u.tags.includes(&apos;remote&apos;) &amp;&amp; u.joinedAt &lt; &apos;2023-01-01&apos; &amp;&amp; u.projects.length &gt; 3 &amp;&amp; u.phone.startsWith(&apos;+81&apos;)).map(u =&gt; ({ id: u.id, name: `${u.firstName} ${u.lastName}`, email: u.email.toLowerCase(), score: u.score, role: u.role, dept: u.department, region: u.region, phone: u.phone, joinedAt: new Date(u.joinedAt).toISOString(), manager: u.manager?.name ?? &apos;N/A&apos;, projectNames: u.projects.map(p =&gt; p.name).join(&apos;, &apos;) })).sort((a, b) =&gt; b.score - a.score || a.name.localeCompare(b.name)).slice(0, 100).reduce((acc, cur) =&gt; acc + (cur.score * (cur.role === &apos;manager&apos; ? 1.5 : cur.role === &apos;staff&apos; ? 1.1 : 1)), 0);\n\n}</code></pre></div><h2 style="text-align: start" id="h361fd99869"><strong>テーブル</strong></h2><h3 style="text-align: start" id="h8f9b0b2801"><strong>最初の列がヘッダー</strong></h3><table><tbody><tr><th colspan="1" rowspan="1"><p style="text-align: unset"><strong>ライブラリ</strong></p></th><th colspan="1" rowspan="1"><p style="text-align: unset"><strong>Svelte</strong></p></th><th colspan="1" rowspan="1"><p style="text-align: unset"><strong>React</strong></p></th><th colspan="1" rowspan="1"><p style="text-align: unset"><strong>Vue</strong></p></th><th colspan="1" rowspan="1"><p style="text-align: unset"><strong>Angular</strong></p></th></tr><tr><th colspan="1" rowspan="1"><p style="text-align: unset"><strong>フレームワーク</strong></p></th><td colspan="1" rowspan="1"><p style="text-align: unset">SvelteKit</p></td><td colspan="1" rowspan="1"><p style="text-align: unset">Next.js</p></td><td colspan="1" rowspan="1"><p style="text-align: unset">Nuxt.js</p></td><td colspan="1" rowspan="1"><p style="text-align: unset"></p></td></tr><tr><th colspan="1" rowspan="1"><p style="text-align: unset"><strong>フォーム</strong></p></th><td colspan="1" rowspan="1"><p style="text-align: unset">Superforms</p></td><td colspan="1" rowspan="1"><p style="text-align: unset">React Hook Form</p></td><td colspan="1" rowspan="1"><p style="text-align: unset">FormKit</p></td><td colspan="1" rowspan="1"><p style="text-align: unset">Formly</p></td></tr></tbody></table><p><br>testです</p><h3 style="text-align: start" id="h4f12deeab3"><strong>初の列が非ヘッダー</strong></h3><table><tbody><tr><th colspan="1" rowspan="1"><p style="text-align: unset"><strong>Svelte</strong></p></th><th colspan="1" rowspan="1"><p style="text-align: unset"><strong>React</strong></p></th><th colspan="1" rowspan="1"><p style="text-align: unset"><strong>Vue</strong></p></th><th colspan="1" rowspan="1"><p style="text-align: unset"><strong>Angular</strong></p></th></tr><tr><td colspan="1" rowspan="1"><p style="text-align: unset">SvelteKit</p></td><td colspan="1" rowspan="1"><p style="text-align: unset">Next.js</p></td><td colspan="1" rowspan="1"><p style="text-align: unset">Nuxt.js</p></td><td colspan="1" rowspan="1"><p style="text-align: unset"></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: unset">Superforms</p></td><td colspan="1" rowspan="1"><p style="text-align: unset">React Hook Form</p></td><td colspan="1" rowspan="1"><p style="text-align: unset">FormKit</p></td><td colspan="1" rowspan="1"><p style="text-align: unset">Formly</p></td></tr></tbody></table><h2 style="text-align: start" id="h4334dcd5e5"><strong>リスト</strong></h2><ul><li>Svelte</li><li>SvelteKit</li><li>Superforms</li></ul><h2 style="text-align: start" id="h8baf1c3620"><strong>番号付きリスト</strong></h2><ol><li>Svelte</li><li>SvelteKit</li><li>Superforms</li></ol><h2 style="text-align: start" id="he4ba96ecb5"><strong>リンク</strong></h2><p style="text-align: start"><a href="https://kit.svelte.dev/" target="_blank" rel="noopener noreferrer nofollow"><u>SvelteKitのホームページ</u></a></p><h2 style="text-align: start" id="h7b3c950f25"><strong>画像</strong></h2><figure><img src="https://images.microcms-assets.io/assets/44ba6b35d3e64e87a847af3e575fd7b2/9f5a28c5b6fa408480eb6ef89afb87e8/blog-template.png" alt="" width="1200" height="630"></figure><h2 style="text-align: start" id="ha6836ab6e0"><strong>埋め込み</strong></h2><div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;"><iframe src="https://www.youtube.com/embed/O0Tqm9ifxf0?rel=0" style="top: 0; left: 0; width: 100%; height: 100%; position: absolute; border: 0;" allowfullscreen scrolling="no" allow="accelerometer *; clipboard-write *; encrypted-media *; gyroscope *; picture-in-picture *; web-share *;"></iframe></div>',
    summary:
      "Vue.jsを使ったポートフォリオサイト制作の全過程とその学びについて紹介します。",
    tags: [
      createTag("Vue.js"),
      createTag("Web開発"),
      createTag("ポートフォリオ"),
    ],
    category: ["deva"],
    color: "#6A11CB",
    thumbnail: {
      url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    publishedAt: "2025-04-15T09:00:00.000Z",
    revisedAt: "2025-04-15T09:00:10.000Z",
  },
  {
    id: "post2",
    title: "JavaScript非同期処理の理解を深める",
    content:
      "<h1>テスト１</h1><p>test</p><h2>テスト2</h2><p>test</p><h3>テスト3</h3><p>test</p><h4>テスト4</h4><p>test</p><h5>テスト5</h5><p>test</p>",
    summary: "JavaScriptの非同期処理の仕組みを基礎から応用まで徹底解説します。",
    tags: [
      createTag("JavaScript"),
      createTag("非同期処理"),
      createTag("Promise"),
    ],
    category: ["tech"],
    color: "#2575FC",
    thumbnail: {
      url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    publishedAt: "2025-04-10T15:30:00.000Z",
    revisedAt: "2025-04-11T19:45:00.000Z",
  },
  {
    id: "post3",
    title: "microCMSではじめるヘッドレスCMS入門",
    content:
      "<p>近年注目を集めているヘッドレスCMSの中でも使いやすいmicroCMSを使って、ブログサイトを構築する方法を解説します。APIの設定から、フロントエンドとの連携、デプロイまでの流れを初心者にもわかりやすく説明していきます。</p><h2>ヘッドレスCMSとは</h2><p>従来のCMSとヘッドレスCMSの違いや、ヘッドレスCMSのメリット・デメリットについて解説します。コンテンツ管理と表示の分離による柔軟性の向上について詳しく説明します。</p><h2>microCMSの特徴</h2><p>日本製のヘッドレスCMSであるmicroCMSの特徴や利点について解説します。使いやすい管理画面や充実したAPIの機能について紹介します。</p><h2>APIの設定方法</h2><p>microCMSのAPIの設定方法やAPI利用のベストプラクティスについて解説します。APIキーの管理方法やセキュリティ対策についても触れていきます。</p><h2>フロントエンドとの連携</h2><p>Vue.jsやNext.jsなどのフロントエンドフレームワークとmicroCMSを連携する方法を解説します。効率的なデータ取得方法や表示の最適化テクニックを紹介します。</p><h2>デプロイと運用</h2><p>microCMSを使ったサイトのデプロイ方法や運用のコツについて解説します。また、実際に運用する際のTipsについても紹介します。</p>",
    summary: "microCMSを使ったヘッドレスCMSの導入方法と活用方法を紹介します。",
    tags: [createTag("microCMS"), createTag("ヘッドレスCMS"), createTag("API")],
    category: ["tech"],
    color: "#FDA085",
    thumbnail: {
      url: "https://images.unsplash.com/photo-1600267175161-cfaa711b4a81?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    publishedAt: "2025-04-05T11:15:00.000Z",
    revisedAt: "2025-04-08T16:45:00.000Z",
  },
  {
    id: "post4",
    title: "CSSアニメーションでサイトに動きをつける",
    content:
      "<p>単調なデザインのWebサイトに動きを加えることで、ユーザー体験を向上させる方法を紹介します。CSSのみを使ったアニメーション実装方法から、ライブラリを活用した実装方法まで、様々なテクニックを解説します。</p><h2>CSSアニメーションの基本</h2><p>transitionプロパティやanimationプロパティなど、CSSアニメーションの基本的な概念と使い方を解説します。簡単な例を交えながら、初心者にもわかりやすく説明します。</p><h2>keyframesを使った複雑なアニメーション</h2><p>@keyframesルールを使って、より複雑で自由度の高いアニメーションを作成する方法を解説します。複数のプロパティを同時に変化させる方法や、タイミングの調整方法などを紹介します。</p><h2>ユーザーインタラクションとの連携</h2><p>ホバーやクリックなどのユーザーインタラクションに応じて、アニメーションを発生させる方法を解説します。擬似クラスを使った実装方法や、JavaScriptとの連携方法を紹介します。</p><h2>パフォーマンスを考慮した実装</h2><p>アニメーションのパフォーマンスを最適化するためのテクニックを解説します。transform、opacityなどのプロパティの選択や、will-changeプロパティの使用方法について触れていきます。</p><h2>モバイルでのアニメーション対応</h2><p>モバイルデバイスでのアニメーション表示における注意点や、レスポンシブ対応の方法を解説します。また、パフォーマンスを考慮した実装のコツについても触れていきます。</p>",
    summary:
      "CSSアニメーションの基本から応用テクニックまでを実例とともに解説します。",
    tags: [createTag("CSS"), createTag("アニメーション"), createTag("Web制作")],
    category: ["dev"],
    color: "#5D26C1",
    thumbnail: {
      url: "https://images.unsplash.com/photo-1559028012-481c04fa702d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    publishedAt: "2025-03-28T13:45:00.000Z",
    revisedAt: "2025-03-31T09:15:00.000Z",
  },
  {
    id: "post5",
    title: "最近読んだ技術書5選",
    content:
      "<p>最近読んだ技術書の中から特におすすめの5冊を紹介します。各書籍の概要や特徴、どんな人におすすめかなどを詳しく解説しています。</p><h2>1. 「リーダブルコード」</h2><p>読みやすいコードの書き方について解説された本書は、プログラミングの基本中の基本とも言える一冊です。命名規則やコメントの書き方など、具体的な例を挙げながら説明されており、初心者から上級者まで参考になる内容です。</p><h2>2. 「達人プログラマー」</h2><p>プログラマーとしての心構えや習慣、テクニックなどが幅広く紹介されている本書は、技術的なスキルだけでなく、考え方やアプローチ方法までカバーしています。長く活躍するプログラマーになるためのヒントが満載です。</p><h2>3. 「JavaScript: The Good Parts」</h2><p>JavaScriptの良い部分に焦点を当てた本書は、言語の奥深さと落とし穴を理解するのに役立ちます。特に言語設計の背景や、効果的な使い方についての解説が秀逸です。</p><h2>4. 「Clean Architecture」</h2><p>ソフトウェアの設計に関する原則や概念を解説した本書は、持続可能で拡張性のあるシステム設計の方法を学ぶことができます。実例を交えながら説明されており、実践的な内容となっています。</p><h2>5. 「プログラミングElixir」</h2><p>関数型プログラミング言語Elixirの入門書です。関数型プログラミングの考え方や並行処理の基本など、新しいパラダイムを学ぶのに最適な一冊です。実例も豊富で、徐々にステップアップしながら学ぶことができます。</p><h2>おわりに</h2><p>技術書は単なる知識の習得だけでなく、考え方や視野を広げてくれる素晴らしいツールです。ぜひ自分の興味や目標に合わせて、積極的に読んでみてください。</p>",
    summary: "技術力向上に役立つおすすめの技術書5冊とその学びを紹介します。",
    tags: [createTag("書評"), createTag("技術書"), createTag("学習")],
    category: ["life"],
    color: "#00CDAC",
    thumbnail: {
      url: "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    publishedAt: "2025-03-20T10:00:00.000Z",
    revisedAt: "2025-03-22T15:30:00.000Z",
  },
  {
    id: "post6",
    title: "リモートワークで生産性を上げる5つの方法",
    content:
      "<p>リモートワークが普及する中、自宅での作業効率を上げるためのコツを5つ紹介します。環境構築から習慣づけ、集中力を高めるテクニックまで、実践的なアドバイスをまとめています。</p><h2>1. 専用の作業スペースを作る</h2><p>自宅での作業専用のスペースを確保することで、仕事モードに切り替えやすくなります。できるだけ静かで、集中できる場所を選び、必要な道具や機器を揃えましょう。また、人間工学に基づいた椅子や机の高さなど、長時間作業しても疲れにくい環境を整えることが重要です。</p><h2>2. 時間管理のテクニックを活用する</h2><p>ポモドーロテクニックなど、時間管理の手法を取り入れると効率的に作業できます。25分集中して作業し、5分休憩するというサイクルを繰り返すことで、集中力を維持しつつ、疲労を防ぐことができます。また、タスク管理ツールを使って、日々の作業を可視化することも効果的です。</p><h2>3. コミュニケーションのルールを決める</h2><p>チームでのリモートワークでは、コミュニケーションのルールを明確にすることが重要です。どのツールを使い、どのようなタイミングで連絡するかなど、あらかじめ決めておくと混乱を防げます。また、定期的なビデオ会議やチャットでの雑談タイムを設けることで、チームの一体感を保つことができます。</p><h2>4. 健康管理を意識する</h2><p>自宅で仕事をしていると、つい長時間座りっぱなしになりがちです。定期的に立ち上がって軽く体を動かしたり、目を休ませたりする時間を意識的に作りましょう。また、適切な食事や睡眠、適度な運動も集中力や生産性を維持するために欠かせません。</p><h2>5. オン・オフを切り替える</h2><p>リモートワークでは仕事とプライベートの境界が曖昧になりがちです。決まった時間に仕事を始め、終える習慣をつけることで、メリハリのある生活を送ることができます。仕事が終わったら、作業スペースから離れて別の活動をすることで、リフレッシュできます。</p><h2>まとめ</h2><p>リモートワークは自由度が高い反面、自己管理が求められる働き方です。これらのコツを参考に、自分に合った方法を見つけ、効率的かつ健康的に仕事を進めていきましょう。</p>",
    summary:
      "自宅でのリモートワークを効率的に進めるためのコツと実践方法を紹介します。",
    tags: [
      createTag("リモートワーク"),
      createTag("生産性"),
      createTag("習慣化"),
    ],
    category: ["life"],
    color: "#4776E6",
    thumbnail: {
      url: "https://images.unsplash.com/photo-1583089892943-e02e5b5573ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    publishedAt: "2025-03-15T14:20:00.000Z",
    revisedAt: "2025-03-18T11:30:00.000Z",
  },
  {
    id: "post7",
    title: "GitHubを活用したチーム開発のススメ",
    content:
      "<p>GitHubを使ったチーム開発の効率化について解説します。ブランチ戦略、プルリクエストのレビュー方法、イシュー管理など、実践的なワークフローを紹介します。</p><h2>効果的なブランチ戦略</h2><p>GitHubでのチーム開発では、適切なブランチ戦略が重要です。Git Flowやプルリクエスト駆動開発など、代表的なブランチ管理パターンについて解説します。また、プロジェクトの規模や要件に応じた選択肢についても触れていきます。</p><h2>プルリクエストとコードレビュー</h2><p>プルリクエストを使った効果的なコードレビューの進め方を解説します。レビューのポイントや、コメントの書き方、フィードバックの伝え方など、チームの成長につながるレビュープロセスについて詳しく説明します。</p><h2>イシュー管理とプロジェクト管理</h2><p>GitHubのイシュー機能やプロジェクトボードを使った効果的なタスク管理の方法を紹介します。ラベルやマイルストーンの活用方法や、イシューとプルリクエストの連携テクニックを解説します。</p><h2>GitHub Actionsによる自動化</h2><p>GitHub Actionsを使ったCI/CDの構築方法について解説します。テスト自動化やビルド、デプロイの自動化など、開発フローを効率化するためのテクニックを紹介します。また、GitHub Actionsの基本的な書き方や、実用的なワークフロー例も提供します。</p><h2>チームコミュニケーションの最適化</h2><p>GitHub上でのコミュニケーションを効率化するためのコツを紹介します。コミットメッセージの書き方やイシューの文書化、ディスカッションの活用方法など、チーム全体の生産性を向上させるテクニックを解説します。</p><h2>まとめ</h2><p>GitHubはただのバージョン管理ツールではなく、チーム開発の中心となるプラットフォームです。これらの方法を活用することで、より効率的で楽しい開発環境を実現できるでしょう。</p>",
    summary:
      "GitHubを活用したチーム開発の実践的なワークフローとツールの使い方を解説します。",
    tags: [createTag("GitHub"), createTag("チーム開発"), createTag("Git")],
    category: ["dev"],
    color: "#8E2DE2",
    thumbnail: {
      url: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    publishedAt: "2025-03-10T09:30:00.000Z",
    revisedAt: "2025-03-13T15:45:00.000Z",
  },
  {
    id: "post8",
    title: "私の愛用するカメラと写真撮影のコツ",
    content:
      "<p>趣味で始めた写真撮影について、使用しているカメラや機材、撮影テクニックを紹介します。初心者向けのカメラ選びのポイントや、屋内/屋外での撮影のコツなど、実践的なアドバイスをまとめています。</p><h2>私の愛用機材</h2><p>現在使用しているカメラボディはSONY α7IIIで、主に使用しているレンズはSONY FE 24-70mm F2.8 GMとSIGMA 35mm F1.4 DG DNです。機動性と画質のバランスを重視して選びました。その他、三脚や各種フィルター、バッグなども含めた機材構成について紹介します。</p><h2>初心者におすすめのカメラ選び</h2><p>カメラ選びに悩む初心者の方へ、予算や目的に応じたおすすめのカメラと選び方のポイントを紹介します。一眼レフとミラーレスの違いや、各メーカーの特徴、レンズの選び方なども解説します。</p><h2>屋外撮影のテクニック</h2><p>風景や街並み、ポートレートなど、屋外での撮影テクニックを紹介します。自然光の活用方法や、時間帯による光の変化、構図の工夫など、実際の撮影例を交えながら解説します。</p><h2>屋内撮影のコツ</h2><p>室内での撮影時に気をつけるべきポイントや、人工光源の扱い方、室内ポートレートのライティングテクニックなどを紹介します。また、低照度環境での撮影テクニックについても触れていきます。</p><h2>写真編集の基本</h2><p>撮影後の写真編集について、使用しているソフトウェアや基本的な編集フローを紹介します。露出やホワイトバランスの調整、色補正、トリミングなど、基本的な編集テクニックを解説します。</p><h2>写真を楽しむためのヒント</h2><p>写真撮影を長く楽しむためのモチベーション維持法や、自分の作品を共有する方法、写真コミュニティへの参加方法などを紹介します。カメラは道具であり、大切なのは撮影する楽しさを見つけることだということをお伝えします。</p>",
    summary:
      "写真撮影の趣味で使っているカメラと機材、そして撮影のコツを紹介します。",
    tags: [createTag("カメラ"), createTag("写真"), createTag("趣味")],
    category: ["hobby"],
    color: "#4A00E0",
    thumbnail: {
      url: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    publishedAt: "2025-03-05T16:45:00.000Z",
    revisedAt: "2025-03-08T10:20:00.000Z",
  },
  {
    id: "post9",
    title: "プログラミング学習に役立つYouTubeチャンネル10選",
    content:
      "<p>プログラミング学習に役立つYouTubeチャンネルを10個紹介します。各チャンネルの特徴や対象者レベル、扱っている技術スタックなどを詳しく解説しています。</p><h2>1. Traversy Media</h2><p>Brad Traversyが運営するチャンネルで、Webやモバイルアプリケーション開発に関する幅広いチュートリアルを提供しています。初心者から中級者向けの内容が多く、プロジェクトベースの学習に適しています。</p><h2>2. The Net Ninja</h2><p>主にWebフロントエンド開発に特化したチュートリアルを提供しているチャンネルです。HTML、CSS、JavaScript、各種フレームワークまで、ステップバイステップで丁寧に解説しています。</p><h2>3. Academind</h2><p>Maximilian Schwarzmüllerが運営するチャンネルで、React、Angular、Vue、Node.jsなど様々なフレームワークやツールの使い方を解説しています。実際のプロジェクト開発を通じて学べる内容が多いです。</p><h2>4. Programming with Mosh</h2><p>Mosh Hamedaniが運営するチャンネルで、プログラミングの基礎から実践的なアプリケーション開発まで幅広くカバーしています。初心者にも分かりやすい説明が特徴です。</p><h2>5. Fireship</h2><p>最新のWeb技術やツールについて、短い動画で要点をまとめて解説しているチャンネルです。新しい技術をサクッと知りたい中級者以上の開発者におすすめです。</p><h2>6. Corey Schafer</h2><p>Pythonに特化したチュートリアルを提供しているチャンネルです。基礎から応用まで、体系的に学べる内容になっています。データ分析やWeb開発など、Pythonの多様な用途についても解説しています。</p><h2>7. The Coding Train</h2><p>Daniel Shiffmanが運営するチャンネルで、プログラミングを楽しく学べる内容が特徴です。クリエイティブコーディングやアルゴリズムの可視化など、ユニークなアプローチで解説しています。</p><h2>8. freeCodeCamp</h2><p>プログラミング学習プラットフォームfreeCodeCampの公式チャンネルで、様々な言語やツールに関する長編チュートリアルを提供しています。初心者から上級者まで、様々なレベルに対応した内容が揃っています。</p><h2>9. Computerphile</h2><p>コンピュータサイエンスの基礎知識やアルゴリズム、セキュリティなどについて解説しているチャンネルです。プログラミングだけでなく、コンピュータに関する広い知識を得たい方におすすめです。</p><h2>10. Dev Ed</h2><p>WebデザインとWeb開発の両方をカバーしているチャンネルで、エンジニアだけでなくデザイナーにも役立つ内容となっています。特にUIやアニメーションに関する解説が充実しています。</p><h2>効果的な学習方法</h2><p>YouTubeでプログラミングを学ぶ際のコツとして、単に動画を見るだけでなく、実際にコードを書いて試すことが重要です。また、複数のチャンネルを組み合わせて学ぶことで、多角的な理解が深まります。</p>",
    summary:
      "プログラミング学習に最適なYouTubeチャンネルとその活用法を紹介します。",
    tags: [
      createTag("学習リソース"),
      createTag("YouTube"),
      createTag("プログラミング"),
    ],
    category: ["tech"],
    color: "#3498db",
    thumbnail: {
      url: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    publishedAt: "2025-02-28T12:10:00.000Z",
    revisedAt: "2025-03-02T14:25:00.000Z",
  },
  {
    id: "post10",
    title: "自作キーボードを組み立てた話",
    content:
      "<p>趣味で自作キーボードを組み立てた経験を紹介します。パーツの選び方から組み立て手順、カスタマイズ方法まで詳しく解説しています。</p><h2>自作キーボードを始めたきっかけ</h2><p>長時間のタイピング作業で肩や手首の疲労を感じていたことがきっかけで、人間工学に基づいたキーボードに興味を持ちました。市販品も検討しましたが、自分の手に完全にフィットするものを求めて自作に挑戦することにしました。</p><h2>使用したパーツと選び方</h2><p>今回使用したのは、Corne Cherryというキットをベースに、Gateron Silent Redスイッチ、OSAプロファイルのキーキャップを組み合わせました。パーツの選び方として、打鍵感、耐久性、見た目のバランスを重視しました。また、初心者でも組み立てやすいキットを選ぶことがポイントです。</p><h2>組み立て手順と注意点</h2><p>はんだ付けから組み立てまでの手順を詳しく解説します。特に気をつけるべきはダイオードの向きと、スイッチのはんだ付けの際の熱の加減です。初心者がよくやってしまう失敗とその対処法についても紹介します。</p><h2>ファームウェアのカスタマイズ</h2><p>QMK Firmwareを使ったキーマップの設定方法を解説します。レイヤー機能を活用して、コンパクトなキーボードでも通常のキーボードと同等以上の機能性を持たせる方法を紹介します。</p><h2>使用感と得られた効果</h2><p>完成した自作キーボードの使用感や、肩や手首の疲労軽減効果について報告します。タイピングスピードの変化や、プログラミング作業における効率の変化などにも触れています。</p><h2>次回のカスタマイズ計画</h2><p>現在のキーボードで改善したい点や、次に作りたいキーボードのプランについて紹介します。特にワイヤレス化や、より洗練されたケースデザインなど、今後のカスタマイズ予定についても触れていきます。</p>",
    summary: "自作キーボードの組み立て方と、その過程で学んだことを紹介します。",
    tags: [
      createTag("自作キーボード"),
      createTag("DIY"),
      createTag("ガジェット"),
    ],
    category: ["hobby"],
    color: "#e67e22",
    thumbnail: {
      url: "https://images.unsplash.com/photo-1595225476328-2f63dd9499c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    publishedAt: "2025-02-20T08:30:00.000Z",
    revisedAt: "2025-02-23T16:15:00.000Z",
  },
  {
    id: "post11",
    title: "Next.jsでJamstackサイト構築入門",
    content:
      "<p>Next.jsを使ったJamstackアーキテクチャによるWebサイト構築方法を解説します。静的サイト生成のメリットから、CMSとの連携、デプロイまでの流れを初心者にもわかりやすく説明していきます。</p><h2>Jamstackとは</h2><p>Jamstackとは、JavaScript、API、Markupの略で、フロントエンドを事前にビルドしておき、APIと組み合わせて動的な要素を取り込む構成のWebサイトアーキテクチャです。従来のサーバーサイドレンダリングとの違いや、Jamstackのメリット（高速性、セキュリティ、スケーラビリティなど）について解説します。</p><h2>Next.jsの基本と特徴</h2><p>React.jsをベースにした人気のフレームワークであるNext.jsの基本的な機能と特徴について説明します。特に静的サイト生成（SSG）と、サーバーサイドレンダリング（SSR）の違い、およびNext.jsでどのように実装するかについて詳しく解説します。</p><h2>静的サイト生成の実装</h2><p>Next.jsを使った静的サイト生成の基本的な実装方法を紹介します。getStaticPropsやgetStaticPathsの使い方、ページ生成のタイミングなど、具体的なコード例を交えて説明します。</p><h2>ヘッドレスCMSとの連携</h2><p>ContentfulやmicroCMSなどのヘッドレスCMSとNext.jsを連携させる方法を解説します。APIを使ったデータ取得、プレビュー機能の実装、更新時の再ビルドの設定など、実践的なテクニックを紹介します。</p><h2>パフォーマンス最適化</h2><p>Jamstackサイトのさらなるパフォーマンス向上のためのテクニックを紹介します。画像最適化、遅延読み込み、ページの分割など、Next.jsの機能を活用した最適化方法を解説します。</p><h2>Vercelへのデプロイと運用</h2><p>Next.jsの開発元であるVercelへのデプロイ方法と、運用におけるポイントを解説します。GitHubとの連携、環境変数の設定、カスタムドメインの設定方法などを紹介します。また、その他のホスティングサービスとの比較も行います。</p>",
    summary:
      "Next.jsとJamstackを使った高速で安全なWebサイト構築方法を解説します。",
    tags: [createTag("Next.js"), createTag("Jamstack"), createTag("SSG")],
    category: ["tech"],
    color: "#27ae60",
    thumbnail: {
      url: "https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    publishedAt: "2025-02-15T13:00:00.000Z",
    revisedAt: "2025-02-18T09:45:00.000Z",
  },
  {
    id: "post12",
    title: "プログラミングを始めて1年で学んだこと",
    content:
      "<p>プログラミングを始めて1年間で学んだことや経験、成長した点などを振り返ります。挫折しかけた時の乗り越え方や、効率的な学習方法、モチベーション維持のコツなどを共有します。</p><h2>プログラミングを始めたきっかけ</h2><p>Web制作の仕事をしていく中で、より複雑な機能実装を求められるようになり、JavaScriptやPHPなどのプログラミングを本格的に学ぶ必要性を感じたのがきっかけです。最初はオンライン講座やチュートリアルを中心に、独学で勉強を始めました。</p><h2>最初の挫折と乗り越え方</h2><p>基本的な文法や簡単な機能実装までは順調に進みましたが、オブジェクト指向プログラミングや非同期処理などの概念に触れた時に大きな壁を感じました。この時期に挫折しそうになりましたが、同じように学習している仲間とのコミュニティを見つけ、一緒に学ぶことで乗り越えることができました。</p><h2>効率的だった学習方法</h2><p>1年間の学習を通じて、特に効果的だった学習方法を紹介します。理論だけでなく実際にコードを書くこと、小さなプロジェクトを完成させること、他の人のコードを読むことなど、実践的なアプローチの重要性を解説します。</p><h2>習得したスキルと作ったもの</h2><p>この1年で習得したプログラミング言語やフレームワーク、ツールなどを紹介します。また、実際に作成したWebアプリケーションやサイトについても、機能や工夫した点を交えて紹介します。</p><h2>プログラミング学習で変わった考え方</h2><p>プログラミングを学ぶことで、論理的思考力や問題解決能力が向上したと感じています。また、分からないことを調べる力や、効率を重視する考え方など、日常生活にも影響を与えた変化について共有します。</p><h2>今後の目標と挑戦したいこと</h2><p>2年目以降に取り組みたい技術やプロジェクト、キャリアの方向性などについて紹介します。特にフロントエンドフレームワークの深い理解やバックエンド技術の習得、モバイルアプリ開発への挑戦などを目標にしています。</p>",
    summary:
      "プログラミング学習1年目の振り返りと、その過程で得た気づきを共有します。",
    tags: [
      createTag("学習記録"),
      createTag("プログラミング"),
      createTag("振り返り"),
    ],
    category: ["life"],
    color: "#9b59b6",
    thumbnail: {
      url: "https://images.unsplash.com/photo-1484417894907-623942c8ee29?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    publishedAt: "2025-02-10T10:45:00.000Z",
    revisedAt: "2025-02-14T17:20:00.000Z",
  },
  {
    id: "post13",
    title: "オープンソースプロジェクトへの参加方法",
    content:
      "<p>オープンソースプロジェクトへの参加方法と、貢献することで得られるメリットについて解説します。初めてのPull Requestの出し方から、コミュニティでのコミュニケーション方法まで、初心者が知っておくべきポイントを詳しく説明します。</p><h2>オープンソース貢献のメリット</h2><p>オープンソースプロジェクトに貢献することで得られる様々なメリットについて解説します。技術力の向上はもちろん、コードレビューの経験、英語でのコミュニケーション力、ネットワーキング、キャリアへの好影響など、多方面でのメリットを紹介します。</p><h2>貢献できるプロジェクトの見つけ方</h2><p>自分のスキルや興味に合ったプロジェクトを見つける方法を紹介します。GitHub Exploreの活用、「good first issue」タグの活用、関連コミュニティやフォーラムへの参加など、具体的な探し方とおすすめのプロジェクトを紹介します。</p><h2>最初のコントリビューションまでの流れ</h2><p>初めてのコントリビューションを行うまでの一般的な流れを解説します。リポジトリのフォーク、クローン、ブランチの作成、修正の実装、プルリクエストの送信まで、基本的なGitの操作も含めてステップバイステップで説明します。</p><h2>効果的なプルリクエストの出し方</h2><p>プロジェクトのメンテナに採用されやすいプルリクエストの出し方について解説します。コーディング規約の遵守、適切なコミットメッセージの書き方、十分なテストの実施、わかりやすいプルリクエストの説明の書き方など、重要なポイントを紹介します。</p><h2>コミュニティでのコミュニケーション方法</h2><p>オープンソースコミュニティでの効果的なコミュニケーション方法について解説します。イシューの立て方、質問の仕方、フィードバックへの対応、他のコントリビューターとの協力など、円滑なコミュニケーションのコツを紹介します。</p><h2>継続的に貢献していくためのヒント</h2><p>一度きりではなく、継続的にオープンソースプロジェクトに貢献していくためのヒントを紹介します。メンテナとの良好な関係構築、定期的な参加、専門性の確立など、長期的な貢献のコツを解説します。また、おすすめの参加しやすいプロジェクトも紹介します。</p>",
    summary:
      "オープンソースプロジェクトへの参加手順と初心者が知っておくべきポイントを解説します。",
    tags: [
      createTag("オープンソース"),
      createTag("GitHub"),
      createTag("コミュニティ"),
    ],
    category: ["dev"],
    color: "#3498db",
    thumbnail: {
      url: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    publishedAt: "2025-02-05T11:30:00.000Z",
    revisedAt: "2025-02-09T13:50:00.000Z",
  },
  {
    id: "post14",
    title: "音楽制作ソフトの比較と選び方",
    content:
      "<p>趣味の音楽制作で使えるDAWソフトの比較と選び方について解説します。Ableton Live、Logic Pro、FL Studioなど人気ソフトの特徴や向いているジャンル、価格などを徹底比較しています。</p><h2>DAWソフトの基本と種類</h2><p>DAW（Digital Audio Workstation）とは、音楽制作のためのソフトウェアで、録音、編集、ミキシング、マスタリングなど、音楽制作のあらゆる工程を一つのソフトで行うことができます。主要なDAWソフトの種類や、それぞれの特徴について概要を説明します。</p><h2>Ableton Live</h2><p>電子音楽制作に強みを持つDAWソフトで、直感的なインターフェースとユニークなセッションビューが特徴です。特にライブパフォーマンスやループベースの音楽制作に向いています。価格やエディション、推奨スペック、主な特徴や弱点などを詳しく解説します。</p><h2>Logic Pro</h2><p>Apple製のDAWソフトで、Mac専用となりますが、コストパフォーマンスが高く、様々なジャンルの音楽制作に適しています。内蔵音源やエフェクトの質が高いことも特徴です。価格やエディション、推奨スペック、主な特徴や弱点などを詳しく解説します。</p><h2>FL Studio</h2><p>直感的なドラムシーケンサーから始まったDAWソフトで、特に電子音楽やヒップホップなどのジャンルで人気があります。無料アップデートが永続的に提供される点も大きな魅力です。価格やエディション、推奨スペック、主な特徴や弱点などを詳しく解説します。</p><h2>無料・低コストで始められるオプション</h2><p>予算を抑えて音楽制作を始めたい方向けに、無料や低コストで利用できるDAWソフトや、体験版の活用方法を紹介します。GarageBand、LMMS、Cakewalk by BandLabなど、初心者でも使いやすいソフトを中心に解説します。</p><h2>自分に合ったDAWの選び方</h2><p>自分の制作したい音楽のジャンル、予算、PCのスペック、音楽知識レベルなどを考慮して、最適なDAWソフトを選ぶためのポイントを解説します。また、実際に使い始める前にチェックしておくべき点や、学習リソースについても紹介します。</p>",
    summary:
      "音楽制作ソフト（DAW）の特徴比較と、目的別の選び方ガイドを提供します。",
    tags: [createTag("音楽制作"), createTag("DAW"), createTag("趣味")],
    category: ["hobby"],
    color: "#e74c3c",
    thumbnail: {
      url: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    publishedAt: "2025-01-28T09:15:00.000Z",
    revisedAt: "2025-01-31T14:40:00.000Z",
  },
  {
    id: "post15",
    title: "初めての海外旅行計画の立て方",
    content:
      "<p>初めての海外旅行を計画する際のポイントやコツを紹介します。航空券の予約から宿の選び方、持ち物リスト、現地での注意点まで、旅行を成功させるためのノウハウを詳しく解説しています。</p><h2>渡航先の選び方と時期</h2><p>初めての海外旅行におすすめの国や都市、また訪問するベストシーズンについて解説します。言語や治安、物価、気候などを考慮した選び方のポイントを紹介します。また、オフシーズンの利点やハイシーズンの注意点についても触れていきます。</p><h2>航空券の予約のコツ</h2><p>お得な航空券を探す方法や、予約時に注意すべきポイントを解説します。比較サイトの使い方や、予約のタイミング、直行便と乗り継ぎの選び方、航空会社の選定基準などを紹介します。また、マイレージプログラムの活用方法についても触れていきます。</p><h2>宿泊施設の選び方</h2><p>ホテル、ホステル、Airbnbなど、様々な宿泊オプションの特徴と、自分の旅行スタイルに合った選び方を解説します。予約サイトの利用方法や、実際の口コミのチェックポイント、立地の重要性、予算の配分方法などを紹介します。</p><h2>旅行の持ち物と準備</h2><p>海外旅行の必須持ち物リストや、渡航前の準備事項についてまとめています。パスポートやビザ、保険、通貨両替、Wi-Fi環境の確保方法など、出発前に必ず済ませておくべきことを解説します。また、スーツケースのパッキングのコツについても紹介します。</p><h2>現地での移動手段と観光プラン</h2><p>現地での移動手段の選び方や、効率的な観光プランの立て方を解説します。公共交通機関の利用方法、レンタカーの注意点、観光スポットの回り方、現地ツアーの活用法などを紹介します。また、Google Mapsなどのアプリの活用方法についても触れていきます。</p><h2>安全に旅行するためのポイント</h2><p>海外旅行中のトラブル回避と安全確保のためのポイントを解説します。貴重品の管理方法、詐欺やスリの対策、緊急時の連絡先、旅行保険の活用法などを紹介します。また、食事や水に関する注意点についても触れていきます。</p><h2>予算を抑えるコツ</h2><p>海外旅行の予算を効果的に抑えつつ、充実した旅行にするためのコツを紹介します。シーズンオフでの旅行計画、現地での食事の工夫、フリーウォーキングツアーの活用、交通パスの利用など、様々な節約テクニックを解説します。</p>",
    summary:
      "海外旅行を初めて計画する人向けの実践的なガイドと役立つコツを紹介します。",
    tags: [createTag("旅行"), createTag("海外"), createTag("計画")],
    category: ["other"],
    color: "#1abc9c",
    thumbnail: {
      url: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    publishedAt: "2025-01-20T14:00:00.000Z",
    revisedAt: "2025-01-24T10:30:00.000Z",
  },
];

// 前の記事データ
const postsData2 = {
  id: "post1",
  title: "Vue.jsでポートフォリオサイトを作成した話",
  content:
    '<h2 id="had7ce3f1cb">見出し2</h2><p style="text-align: start">日本語のテキストはこのように表示されます。</p><p style="text-align: start">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p><h3 id="h594976e74f">見出し3</h3><p style="text-align: start">日本語のテキストはこのように表示されます。</p><p style="text-align: start">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p><h4 id="h88e8c523a3">見出し4</h4><p style="text-align: start">文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル</p><h5 id="h169558c650">見出し5</h5><p style="text-align: start">文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル</p><h2 style="text-align: start" id="h6548903b5d"><strong>太字</strong></h2><p style="text-align: start">日本語のテキストは<strong>このように</strong>表示されます。</p><h2 style="text-align: start" id="h7e0b65841d"><strong>斜体</strong></h2><p style="text-align: start">日本語のテキストは<em>このように</em>表示されます。</p><h2 style="text-align: start" id="hf531356f88"><strong>下線</strong></h2><p style="text-align: start">日本語のテキストは<u>このように</u>表示されます。</p><h2 style="text-align: start" id="hdd1fc8dfe3"><strong>打ち消し線</strong></h2><p style="text-align: start">日本語のテキストは<s>このように</s>表示されます。</p><p style="text-align: start"></p><p style="text-align: start"><code>インラインコード</code></p><p style="text-align: start">寄テキストせ左</p><p style="text-align: center">テキスト寄せ中央</p><p style="text-align: right">テキスト寄せ右</p><h2 style="text-align: start" id="hcf2b66e679"><strong>コード</strong></h2><p style="text-align: start">日本語のテキストは<code>このように</code>表示されます。</p><h2 style="text-align: start" id="hbfbcb364fd"><strong>区切り線</strong></h2><hr><h2 style="text-align: start" id="hdf0456f9a2"><strong>引用</strong></h2><blockquote><p style="text-align: start">日本語のテキストはこのように表示されます。</p><p style="text-align: start">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p></blockquote><h2 style="text-align: start" id="h5c7cf48e04"><strong>コードブロック</strong></h2><div data-filename="test.js"><pre><code class="language-javascript">const taskInput = document.getElementById(&quot;taskInput&quot;);　// tesafdadasfaaaaaaaaaaaaaafffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff\nconst taskList = document.getElementById(&quot;taskList&quot;);\n\nfunction addTask() {\n  const taskText = taskInput.value.trim();\n  if (taskText === &quot;&quot;) {\n    alert(&quot;タスクを入力してください。&quot;);\n    return;\n  }\n\n  const li = document.createElement(&quot;li&quot;);\n  li.textContent = taskText;\n\n  const deleteBtn = document.createElement(&quot;span&quot;);\n  deleteBtn.textContent = &quot;削除&quot;;\n  deleteBtn.className = &quot;delete-btn&quot;;\n  deleteBtn.onclick = () =&gt; li.remove();\n\n  li.appendChild(deleteBtn);\n  taskList.appendChild(li);\n\n  taskInput.value = &quot;&quot;;\n\n  const result = users.filter(u =&gt; u.isActive &amp;&amp; u.score &gt; 70 &amp;&amp; u.department !== &apos;HR&apos; &amp;&amp; u.region === &apos;APAC&apos; &amp;&amp; u.tags.includes(&apos;priority&apos;) &amp;&amp; u.tags.includes(&apos;remote&apos;) &amp;&amp; u.joinedAt &lt; &apos;2023-01-01&apos; &amp;&amp; u.projects.length &gt; 3 &amp;&amp; u.phone.startsWith(&apos;+81&apos;)).map(u =&gt; ({ id: u.id, name: `${u.firstName} ${u.lastName}`, email: u.email.toLowerCase(), score: u.score, role: u.role, dept: u.department, region: u.region, phone: u.phone, joinedAt: new Date(u.joinedAt).toISOString(), manager: u.manager?.name ?? &apos;N/A&apos;, projectNames: u.projects.map(p =&gt; p.name).join(&apos;, &apos;) })).sort((a, b) =&gt; b.score - a.score || a.name.localeCompare(b.name)).slice(0, 100).reduce((acc, cur) =&gt; acc + (cur.score * (cur.role === &apos;manager&apos; ? 1.5 : cur.role === &apos;staff&apos; ? 1.1 : 1)), 0);\n\n}</code></pre></div><h2 style="text-align: start" id="h361fd99869"><strong>テーブル</strong></h2><h3 style="text-align: start" id="h8f9b0b2801"><strong>最初の列がヘッダー</strong></h3><table><tbody><tr><th colspan="1" rowspan="1"><p style="text-align: unset"><strong>ライブラリ</strong></p></th><th colspan="1" rowspan="1"><p style="text-align: unset"><strong>Svelte</strong></p></th><th colspan="1" rowspan="1"><p style="text-align: unset"><strong>React</strong></p></th><th colspan="1" rowspan="1"><p style="text-align: unset"><strong>Vue</strong></p></th><th colspan="1" rowspan="1"><p style="text-align: unset"><strong>Angular</strong></p></th></tr><tr><th colspan="1" rowspan="1"><p style="text-align: unset"><strong>フレームワーク</strong></p></th><td colspan="1" rowspan="1"><p style="text-align: unset">SvelteKit</p></td><td colspan="1" rowspan="1"><p style="text-align: unset">Next.js</p></td><td colspan="1" rowspan="1"><p style="text-align: unset">Nuxt.js</p></td><td colspan="1" rowspan="1"><p style="text-align: unset"></p></td></tr><tr><th colspan="1" rowspan="1"><p style="text-align: unset"><strong>フォーム</strong></p></th><td colspan="1" rowspan="1"><p style="text-align: unset">Superforms</p></td><td colspan="1" rowspan="1"><p style="text-align: unset">React Hook Form</p></td><td colspan="1" rowspan="1"><p style="text-align: unset">FormKit</p></td><td colspan="1" rowspan="1"><p style="text-align: unset">Formly</p></td></tr></tbody></table><p><br>testです</p><h3 style="text-align: start" id="h4f12deeab3"><strong>初の列が非ヘッダー</strong></h3><table><tbody><tr><th colspan="1" rowspan="1"><p style="text-align: unset"><strong>Svelte</strong></p></th><th colspan="1" rowspan="1"><p style="text-align: unset"><strong>React</strong></p></th><th colspan="1" rowspan="1"><p style="text-align: unset"><strong>Vue</strong></p></th><th colspan="1" rowspan="1"><p style="text-align: unset"><strong>Angular</strong></p></th></tr><tr><td colspan="1" rowspan="1"><p style="text-align: unset">SvelteKit</p></td><td colspan="1" rowspan="1"><p style="text-align: unset">Next.js</p></td><td colspan="1" rowspan="1"><p style="text-align: unset">Nuxt.js</p></td><td colspan="1" rowspan="1"><p style="text-align: unset"></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: unset">Superforms</p></td><td colspan="1" rowspan="1"><p style="text-align: unset">React Hook Form</p></td><td colspan="1" rowspan="1"><p style="text-align: unset">FormKit</p></td><td colspan="1" rowspan="1"><p style="text-align: unset">Formly</p></td></tr></tbody></table><h2 style="text-align: start" id="h4334dcd5e5"><strong>リスト</strong></h2><ul><li>Svelte</li><li>SvelteKit</li><li>Superforms</li></ul><h2 style="text-align: start" id="h8baf1c3620"><strong>番号付きリスト</strong></h2><ol><li>Svelte</li><li>SvelteKit</li><li>Superforms</li></ol><h2 style="text-align: start" id="he4ba96ecb5"><strong>リンク</strong></h2><p style="text-align: start"><a href="https://kit.svelte.dev/" target="_blank" rel="noopener noreferrer nofollow"><u>SvelteKitのホームページ</u></a></p><h2 style="text-align: start" id="h7b3c950f25"><strong>画像</strong></h2><figure><img src="https://images.microcms-assets.io/assets/44ba6b35d3e64e87a847af3e575fd7b2/9f5a28c5b6fa408480eb6ef89afb87e8/blog-template.png" alt="" width="1200" height="630"></figure><h2 style="text-align: start" id="ha6836ab6e0"><strong>埋め込み</strong></h2><div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;"><iframe src="https://www.youtube.com/embed/O0Tqm9ifxf0?rel=0" style="top: 0; left: 0; width: 100%; height: 100%; position: absolute; border: 0;" allowfullscreen scrolling="no" allow="accelerometer *; clipboard-write *; encrypted-media *; gyroscope *; picture-in-picture *; web-share *;"></iframe></div>',
  summary:
    "Vue.jsを使ったポートフォリオサイト制作の全過程とその学びについて紹介します。",
  tags: [
    createTag("Vue.js"),
    createTag("Web開発"),
    createTag("ポートフォリオ"),
  ],
  category: ["deva"],
  color: "#6A11CB",
  thumbnail: {
    url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  publishedAt: "2025-04-15T09:00:00.000Z",
  revisedAt: "2025-04-15T09:00:10.000Z",
};

// 前の記事データ
const postsData3 = [
  {
    id: "post1",
    title: "Vue.jsでポートフォリオサイトを作成した話",
    content:
      '<h2 id="had7ce3f1cb">見出し2</h2><p style="text-align: start">日本語のテキストはこのように表示されます。</p><p style="text-align: start">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p><h3 id="h594976e74f">見出し3</h3><p style="text-align: start">日本語のテキストはこのように表示されます。</p><p style="text-align: start">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p><h4 id="h88e8c523a3">見出し4</h4><p style="text-align: start">文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル</p><h5 id="h169558c650">見出し5</h5><p style="text-align: start">文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル</p><h2 style="text-align: start" id="h6548903b5d"><strong>太字</strong></h2><p style="text-align: start">日本語のテキストは<strong>このように</strong>表示されます。</p><h2 style="text-align: start" id="h7e0b65841d"><strong>斜体</strong></h2><p style="text-align: start">日本語のテキストは<em>このように</em>表示されます。</p><h2 style="text-align: start" id="hf531356f88"><strong>下線</strong></h2><p style="text-align: start">日本語のテキストは<u>このように</u>表示されます。</p><h2 style="text-align: start" id="hdd1fc8dfe3"><strong>打ち消し線</strong></h2><p style="text-align: start">日本語のテキストは<s>このように</s>表示されます。</p><p style="text-align: start"></p><p style="text-align: start"><code>インラインコード</code></p><p style="text-align: start">寄テキストせ左</p><p style="text-align: center">テキスト寄せ中央</p><p style="text-align: right">テキスト寄せ右</p><h2 style="text-align: start" id="hcf2b66e679"><strong>コード</strong></h2><p style="text-align: start">日本語のテキストは<code>このように</code>表示されます。</p><h2 style="text-align: start" id="hbfbcb364fd"><strong>区切り線</strong></h2><hr><h2 style="text-align: start" id="hdf0456f9a2"><strong>引用</strong></h2><blockquote><p style="text-align: start">日本語のテキストはこのように表示されます。</p><p style="text-align: start">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p></blockquote><h2 style="text-align: start" id="h5c7cf48e04"><strong>コードブロック</strong></h2><div data-filename="test.js"><pre><code class="language-javascript">const taskInput = document.getElementById(&quot;taskInput&quot;);　// tesafdadasfaaaaaaaaaaaaaafffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff\nconst taskList = document.getElementById(&quot;taskList&quot;);\n\nfunction addTask() {\n  const taskText = taskInput.value.trim();\n  if (taskText === &quot;&quot;) {\n    alert(&quot;タスクを入力してください。&quot;);\n    return;\n  }\n\n  const li = document.createElement(&quot;li&quot;);\n  li.textContent = taskText;\n\n  const deleteBtn = document.createElement(&quot;span&quot;);\n  deleteBtn.textContent = &quot;削除&quot;;\n  deleteBtn.className = &quot;delete-btn&quot;;\n  deleteBtn.onclick = () =&gt; li.remove();\n\n  li.appendChild(deleteBtn);\n  taskList.appendChild(li);\n\n  taskInput.value = &quot;&quot;;\n\n  const result = users.filter(u =&gt; u.isActive &amp;&amp; u.score &gt; 70 &amp;&amp; u.department !== &apos;HR&apos; &amp;&amp; u.region === &apos;APAC&apos; &amp;&amp; u.tags.includes(&apos;priority&apos;) &amp;&amp; u.tags.includes(&apos;remote&apos;) &amp;&amp; u.joinedAt &lt; &apos;2023-01-01&apos; &amp;&amp; u.projects.length &gt; 3 &amp;&amp; u.phone.startsWith(&apos;+81&apos;)).map(u =&gt; ({ id: u.id, name: `${u.firstName} ${u.lastName}`, email: u.email.toLowerCase(), score: u.score, role: u.role, dept: u.department, region: u.region, phone: u.phone, joinedAt: new Date(u.joinedAt).toISOString(), manager: u.manager?.name ?? &apos;N/A&apos;, projectNames: u.projects.map(p =&gt; p.name).join(&apos;, &apos;) })).sort((a, b) =&gt; b.score - a.score || a.name.localeCompare(b.name)).slice(0, 100).reduce((acc, cur) =&gt; acc + (cur.score * (cur.role === &apos;manager&apos; ? 1.5 : cur.role === &apos;staff&apos; ? 1.1 : 1)), 0);\n\n}</code></pre></div><h2 style="text-align: start" id="h361fd99869"><strong>テーブル</strong></h2><h3 style="text-align: start" id="h8f9b0b2801"><strong>最初の列がヘッダー</strong></h3><table><tbody><tr><th colspan="1" rowspan="1"><p style="text-align: unset"><strong>ライブラリ</strong></p></th><th colspan="1" rowspan="1"><p style="text-align: unset"><strong>Svelte</strong></p></th><th colspan="1" rowspan="1"><p style="text-align: unset"><strong>React</strong></p></th><th colspan="1" rowspan="1"><p style="text-align: unset"><strong>Vue</strong></p></th><th colspan="1" rowspan="1"><p style="text-align: unset"><strong>Angular</strong></p></th></tr><tr><th colspan="1" rowspan="1"><p style="text-align: unset"><strong>フレームワーク</strong></p></th><td colspan="1" rowspan="1"><p style="text-align: unset">SvelteKit</p></td><td colspan="1" rowspan="1"><p style="text-align: unset">Next.js</p></td><td colspan="1" rowspan="1"><p style="text-align: unset">Nuxt.js</p></td><td colspan="1" rowspan="1"><p style="text-align: unset"></p></td></tr><tr><th colspan="1" rowspan="1"><p style="text-align: unset"><strong>フォーム</strong></p></th><td colspan="1" rowspan="1"><p style="text-align: unset">Superforms</p></td><td colspan="1" rowspan="1"><p style="text-align: unset">React Hook Form</p></td><td colspan="1" rowspan="1"><p style="text-align: unset">FormKit</p></td><td colspan="1" rowspan="1"><p style="text-align: unset">Formly</p></td></tr></tbody></table><p><br>testです</p><h3 style="text-align: start" id="h4f12deeab3"><strong>初の列が非ヘッダー</strong></h3><table><tbody><tr><th colspan="1" rowspan="1"><p style="text-align: unset"><strong>Svelte</strong></p></th><th colspan="1" rowspan="1"><p style="text-align: unset"><strong>React</strong></p></th><th colspan="1" rowspan="1"><p style="text-align: unset"><strong>Vue</strong></p></th><th colspan="1" rowspan="1"><p style="text-align: unset"><strong>Angular</strong></p></th></tr><tr><td colspan="1" rowspan="1"><p style="text-align: unset">SvelteKit</p></td><td colspan="1" rowspan="1"><p style="text-align: unset">Next.js</p></td><td colspan="1" rowspan="1"><p style="text-align: unset">Nuxt.js</p></td><td colspan="1" rowspan="1"><p style="text-align: unset"></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: unset">Superforms</p></td><td colspan="1" rowspan="1"><p style="text-align: unset">React Hook Form</p></td><td colspan="1" rowspan="1"><p style="text-align: unset">FormKit</p></td><td colspan="1" rowspan="1"><p style="text-align: unset">Formly</p></td></tr></tbody></table><h2 style="text-align: start" id="h4334dcd5e5"><strong>リスト</strong></h2><ul><li>Svelte</li><li>SvelteKit</li><li>Superforms</li></ul><h2 style="text-align: start" id="h8baf1c3620"><strong>番号付きリスト</strong></h2><ol><li>Svelte</li><li>SvelteKit</li><li>Superforms</li></ol><h2 style="text-align: start" id="he4ba96ecb5"><strong>リンク</strong></h2><p style="text-align: start"><a href="https://kit.svelte.dev/" target="_blank" rel="noopener noreferrer nofollow"><u>SvelteKitのホームページ</u></a></p><h2 style="text-align: start" id="h7b3c950f25"><strong>画像</strong></h2><figure><img src="https://images.microcms-assets.io/assets/44ba6b35d3e64e87a847af3e575fd7b2/9f5a28c5b6fa408480eb6ef89afb87e8/blog-template.png" alt="" width="1200" height="630"></figure><h2 style="text-align: start" id="ha6836ab6e0"><strong>埋め込み</strong></h2><div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;"><iframe src="https://www.youtube.com/embed/O0Tqm9ifxf0?rel=0" style="top: 0; left: 0; width: 100%; height: 100%; position: absolute; border: 0;" allowfullscreen scrolling="no" allow="accelerometer *; clipboard-write *; encrypted-media *; gyroscope *; picture-in-picture *; web-share *;"></iframe></div>',
    summary:
      "Vue.jsを使ったポートフォリオサイト制作の全過程とその学びについて紹介します。",
    tags: [
      createTag("Vue.js"),
      createTag("Web開発"),
      createTag("ポートフォリオ"),
    ],
    category: ["deva"],
    color: "#6A11CB",
    thumbnail: {
      url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    publishedAt: "2025-04-15T09:00:00.000Z",
    revisedAt: "2025-04-15T09:00:10.000Z",
  },
];

// 次の記事データ
const postsData5 = [
  {
    id: "post2",
    title: "JavaScript非同期処理の理解を深める",
    content:
      "<h1>テスト１</h1><p>test</p><h2>テスト2</h2><p>test</p><h3>テスト3</h3><p>test</p><h4>テスト4</h4><p>test</p><h5>テスト5</h5><p>test</p>",
    summary: "JavaScriptの非同期処理の仕組みを基礎から応用まで徹底解説します。",
    tags: [
      createTag("JavaScript"),
      createTag("非同期処理"),
      createTag("Promise"),
    ],
    category: ["tech"],
    color: "#2575FC",
    thumbnail: {
      url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    publishedAt: "2025-04-10T15:30:00.000Z",
    revisedAt: "2025-04-11T19:45:00.000Z",
  },
];

// ブログ記事詳細の関連記事データ
const postsData4 = [
  {
    id: "post16",
    title: "React Hooksの基本と応用パターン",
    content:
      "<p>React Hooksの基本的な使い方と、実際のプロジェクトで役立つ応用パターンを解説します。useState、useEffect、useContextなどの基本的なHooksから、カスタムHooksの作成方法まで詳しく説明します。</p><h2>Hooksの基本概念</h2><p>React Hooksとは何か、なぜ導入されたのか、従来のクラスコンポーネントとの違いなど、基本的な概念について解説します。Hooksのルールや制約についても触れ、正しい使い方の基礎を固めます。</p><h2>useState - 状態管理の基本</h2><p>最も基本的なHookであるuseStateの使い方を解説します。単純な値の管理から、オブジェクトや配列の状態管理、複数の状態の扱い方、状態更新のパターンなど、実践的な例を交えて説明します。</p><h2>useEffect - 副作用の管理</h2><p>コンポーネントの副作用を管理するuseEffectの使い方を解説します。マウント・アンマウント時の処理、依存配列の正しい設定方法、クリーンアップ関数の重要性、非同期処理の扱い方など、よくあるパターンと注意点を紹介します。</p><h2>その他の標準Hooks</h2><p>useContext、useReducer、useCallback、useMemoなど、その他の標準Hooksの使い方を解説します。それぞれのユースケースや、適切な使用シーンについても触れていきます。</p><h2>カスタムHooksの作成</h2><p>独自のカスタムHooksを作成する方法と、それによるコード再利用のメリットを解説します。フォーム管理、APIデータ取得、ウィンドウサイズの監視など、実用的なカスタムHooksの例を紹介します。</p><h2>Hooksを使った設計パターン</h2><p>Hooksを活用した効果的なコンポーネント設計パターンを紹介します。関心の分離、ロジックの抽象化、コンポーネント間の状態共有など、大規模アプリケーションでも保守性の高いコードを書くためのテクニックを解説します。</p><h2>パフォーマンス最適化</h2><p>Hooksを使ったパフォーマンス最適化の方法を解説します。不要な再レンダリングの防止、メモ化の適切な使用、コンポーネントの分割など、アプリケーションの応答性を向上させるテクニックを紹介します。</p>",
    summary:
      "React Hooksの基本から実践的な応用パターンまでを詳しく解説します。",
    tags: [createTag("React"), createTag("JavaScript"), createTag("Hooks")],
    category: ["tech"],
    color: "#0984e3",
    thumbnail: {
      url: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    publishedAt: "2025-01-15T11:20:00.000Z",
    revisedAt: "2025-01-18T09:45:00.000Z",
  },
  {
    id: "post17",
    title: "家庭菜園でハーブを育てる基本ガイド",
    content:
      "<p>初心者でも簡単に始められる家庭菜園でのハーブ栽培について解説します。ベランダや窓際でも育てられる人気のハーブの種類や、栽培のコツ、収穫後の活用法まで詳しく紹介します。</p><h2>初心者に育てやすいハーブ</h2><p>ミント、バジル、ローズマリーなど、初心者でも育てやすいハーブの種類とその特徴を紹介します。それぞれのハーブの育てやすさ、必要な環境、成長のスピードなどを比較し、自分の環境に合ったハーブを選ぶためのガイドを提供します。</p><h2>栽培環境の整え方</h2><p>ハーブ栽培に適した土、鉢、日当たり、水やりの頻度など、基本的な栽培環境の整え方を解説します。ベランダ、窓際、室内など、様々な環境での栽培方法や、季節ごとの注意点についても触れていきます。</p><h2>種まきから収穫まで</h2><p>種からの育て方、苗からの育て方、それぞれのメリットと手順を解説します。発芽の条件、植え替えのタイミング、剪定の方法、収穫の目安など、ハーブの成長段階に合わせたケア方法を詳しく説明します。</p><h2>一般的な問題と対策</h2><p>ハーブ栽培でよく起こる問題（害虫、病気、成長不良など）とその対策方法を紹介します。化学薬品を使わない自然な対処法や、予防のためのポイントについても解説します。</p><h2>ハーブの保存と活用法</h2><p>収穫したハーブの保存方法（乾燥、冷凍、オイル漬けなど）と、料理やお茶、ハーブバスなどでの活用法を紹介します。季節ごとのおすすめレシピや、ハーブの組み合わせによる相乗効果についても解説します。</p><h2>一年を通したハーブガーデン</h2><p>春夏秋冬、季節ごとに育てるのに適したハーブと、年間を通したハーブガーデンの楽しみ方を紹介します。多年草と一年草の組み合わせ方や、ローテーション栽培のコツなども解説し、一年中ハーブを楽しめるガーデニング計画を提案します。</p>",
    summary:
      "初心者でも失敗しないハーブ栽培の基本と、収穫後の活用方法を紹介します。",
    tags: [
      createTag("ガーデニング"),
      createTag("ハーブ"),
      createTag("家庭菜園"),
    ],
    category: ["hobby"],
    color: "#6ab04c",
    thumbnail: {
      url: "https://images.unsplash.com/photo-1599394022918-6c2776530abb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    publishedAt: "2025-01-10T10:10:00.000Z",
    revisedAt: "2025-01-13T16:30:00.000Z",
  },
  {
    id: "post18",
    title: "TypeScriptで型安全なWebアプリケーション開発",
    content:
      "<p>JavaScriptに型システムを導入するTypeScriptを使って、より安全で保守性の高いWebアプリケーションを開発する方法を解説します。基本的な型定義から応用的なテクニックまで、実践的な例を交えて説明します。</p><h2>TypeScriptの基本</h2><p>TypeScriptとは何か、JavaScriptとの違い、導入によるメリットなど、基本的な概念を解説します。開発環境のセットアップ方法や、トランスパイルの仕組みについても説明します。</p><h2>基本的な型定義</h2><p>プリミティブ型、配列、オブジェクト、関数の型定義など、TypeScriptの基本的な型システムについて解説します。型注釈の書き方や型推論の仕組み、any型の使用を避けるテクニックなども紹介します。</p><h2>インターフェースと型エイリアス</h2><p>オブジェクトの構造を定義するためのインターフェースと型エイリアスの使い方、それぞれの違いと使い分けについて解説します。拡張、実装、交差型、ユニオン型など、より高度な型の合成方法についても説明します。</p><h2>ジェネリクス</h2><p>型の再利用性を高めるジェネリクスの概念と使い方を解説します。関数、クラス、インターフェースでのジェネリクスの活用例や、制約の付け方、デフォルト型パラメータの設定方法などを紹介します。</p><h2>高度な型テクニック</h2><p>条件付き型、マップ型、ユーティリティ型など、TypeScriptのより高度な型機能を解説します。これらを活用して、柔軟かつ堅牢な型定義を行う方法を実例を交えて説明します。</p><h2>実践的なアプリケーション開発</h2><p>React、Vue、Expressなどのフレームワークと組み合わせた実践的なTypeScriptの使い方を解説します。各フレームワーク特有の型定義や、状態管理、APIとの連携における型安全性の確保方法を紹介します。</p><h2>テストと型チェック</h2><p>TypeScriptプロジェクトのテスト方法や、CI/CDパイプラインへの統合、型チェックの厳格度の設定など、品質保証のためのプラクティスを解説します。また、型定義ファイル（d.ts）の作成と活用方法についても触れていきます。</p>",
    summary:
      "TypeScriptを使った型安全なWebアプリケーション開発の基本から応用までを解説します。",
    tags: [
      createTag("TypeScript"),
      createTag("Web開発"),
      createTag("型システム"),
    ],
    category: ["dev"],
    color: "#0070f3",
    thumbnail: {
      url: "https://images.unsplash.com/photo-1591267990532-e5bdb1b0ceb8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    publishedAt: "2025-01-05T15:30:00.000Z",
    revisedAt: "2025-01-08T12:15:00.000Z",
  },
  {
    id: "post1",
    title: "Vue.jsでポートフォリオサイトを作成した話",
    content:
      '<h2 id="had7ce3f1cb">見出し2</h2><p style="text-align: start">日本語のテキストはこのように表示されます。</p><p style="text-align: start">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p><h3 id="h594976e74f">見出し3</h3><p style="text-align: start">日本語のテキストはこのように表示されます。</p><p style="text-align: start">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p><h4 id="h88e8c523a3">見出し4</h4><p style="text-align: start">文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル</p><h5 id="h169558c650">見出し5</h5><p style="text-align: start">文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル文章サンプル</p><h2 style="text-align: start" id="h6548903b5d"><strong>太字</strong></h2><p style="text-align: start">日本語のテキストは<strong>このように</strong>表示されます。</p><h2 style="text-align: start" id="h7e0b65841d"><strong>斜体</strong></h2><p style="text-align: start">日本語のテキストは<em>このように</em>表示されます。</p><h2 style="text-align: start" id="hf531356f88"><strong>下線</strong></h2><p style="text-align: start">日本語のテキストは<u>このように</u>表示されます。</p><h2 style="text-align: start" id="hdd1fc8dfe3"><strong>打ち消し線</strong></h2><p style="text-align: start">日本語のテキストは<s>このように</s>表示されます。</p><p style="text-align: start"></p><p style="text-align: start"><code>インラインコード</code></p><p style="text-align: start">寄テキストせ左</p><p style="text-align: center">テキスト寄せ中央</p><p style="text-align: right">テキスト寄せ右</p><h2 style="text-align: start" id="hcf2b66e679"><strong>コード</strong></h2><p style="text-align: start">日本語のテキストは<code>このように</code>表示されます。</p><h2 style="text-align: start" id="hbfbcb364fd"><strong>区切り線</strong></h2><hr><h2 style="text-align: start" id="hdf0456f9a2"><strong>引用</strong></h2><blockquote><p style="text-align: start">日本語のテキストはこのように表示されます。</p><p style="text-align: start">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p></blockquote><h2 style="text-align: start" id="h5c7cf48e04"><strong>コードブロック</strong></h2><div data-filename="test.js"><pre><code class="language-javascript">const taskInput = document.getElementById(&quot;taskInput&quot;);　// tesafdadasfaaaaaaaaaaaaaafffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff\nconst taskList = document.getElementById(&quot;taskList&quot;);\n\nfunction addTask() {\n  const taskText = taskInput.value.trim();\n  if (taskText === &quot;&quot;) {\n    alert(&quot;タスクを入力してください。&quot;);\n    return;\n  }\n\n  const li = document.createElement(&quot;li&quot;);\n  li.textContent = taskText;\n\n  const deleteBtn = document.createElement(&quot;span&quot;);\n  deleteBtn.textContent = &quot;削除&quot;;\n  deleteBtn.className = &quot;delete-btn&quot;;\n  deleteBtn.onclick = () =&gt; li.remove();\n\n  li.appendChild(deleteBtn);\n  taskList.appendChild(li);\n\n  taskInput.value = &quot;&quot;;\n\n  const result = users.filter(u =&gt; u.isActive &amp;&amp; u.score &gt; 70 &amp;&amp; u.department !== &apos;HR&apos; &amp;&amp; u.region === &apos;APAC&apos; &amp;&amp; u.tags.includes(&apos;priority&apos;) &amp;&amp; u.tags.includes(&apos;remote&apos;) &amp;&amp; u.joinedAt &lt; &apos;2023-01-01&apos; &amp;&amp; u.projects.length &gt; 3 &amp;&amp; u.phone.startsWith(&apos;+81&apos;)).map(u =&gt; ({ id: u.id, name: `${u.firstName} ${u.lastName}`, email: u.email.toLowerCase(), score: u.score, role: u.role, dept: u.department, region: u.region, phone: u.phone, joinedAt: new Date(u.joinedAt).toISOString(), manager: u.manager?.name ?? &apos;N/A&apos;, projectNames: u.projects.map(p =&gt; p.name).join(&apos;, &apos;) })).sort((a, b) =&gt; b.score - a.score || a.name.localeCompare(b.name)).slice(0, 100).reduce((acc, cur) =&gt; acc + (cur.score * (cur.role === &apos;manager&apos; ? 1.5 : cur.role === &apos;staff&apos; ? 1.1 : 1)), 0);\n\n}</code></pre></div><h2 style="text-align: start" id="h361fd99869"><strong>テーブル</strong></h2><h3 style="text-align: start" id="h8f9b0b2801"><strong>最初の列がヘッダー</strong></h3><table><tbody><tr><th colspan="1" rowspan="1"><p style="text-align: unset"><strong>ライブラリ</strong></p></th><th colspan="1" rowspan="1"><p style="text-align: unset"><strong>Svelte</strong></p></th><th colspan="1" rowspan="1"><p style="text-align: unset"><strong>React</strong></p></th><th colspan="1" rowspan="1"><p style="text-align: unset"><strong>Vue</strong></p></th><th colspan="1" rowspan="1"><p style="text-align: unset"><strong>Angular</strong></p></th></tr><tr><th colspan="1" rowspan="1"><p style="text-align: unset"><strong>フレームワーク</strong></p></th><td colspan="1" rowspan="1"><p style="text-align: unset">SvelteKit</p></td><td colspan="1" rowspan="1"><p style="text-align: unset">Next.js</p></td><td colspan="1" rowspan="1"><p style="text-align: unset">Nuxt.js</p></td><td colspan="1" rowspan="1"><p style="text-align: unset"></p></td></tr><tr><th colspan="1" rowspan="1"><p style="text-align: unset"><strong>フォーム</strong></p></th><td colspan="1" rowspan="1"><p style="text-align: unset">Superforms</p></td><td colspan="1" rowspan="1"><p style="text-align: unset">React Hook Form</p></td><td colspan="1" rowspan="1"><p style="text-align: unset">FormKit</p></td><td colspan="1" rowspan="1"><p style="text-align: unset">Formly</p></td></tr></tbody></table><p><br>testです</p><h3 style="text-align: start" id="h4f12deeab3"><strong>初の列が非ヘッダー</strong></h3><table><tbody><tr><th colspan="1" rowspan="1"><p style="text-align: unset"><strong>Svelte</strong></p></th><th colspan="1" rowspan="1"><p style="text-align: unset"><strong>React</strong></p></th><th colspan="1" rowspan="1"><p style="text-align: unset"><strong>Vue</strong></p></th><th colspan="1" rowspan="1"><p style="text-align: unset"><strong>Angular</strong></p></th></tr><tr><td colspan="1" rowspan="1"><p style="text-align: unset">SvelteKit</p></td><td colspan="1" rowspan="1"><p style="text-align: unset">Next.js</p></td><td colspan="1" rowspan="1"><p style="text-align: unset">Nuxt.js</p></td><td colspan="1" rowspan="1"><p style="text-align: unset"></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: unset">Superforms</p></td><td colspan="1" rowspan="1"><p style="text-align: unset">React Hook Form</p></td><td colspan="1" rowspan="1"><p style="text-align: unset">FormKit</p></td><td colspan="1" rowspan="1"><p style="text-align: unset">Formly</p></td></tr></tbody></table><h2 style="text-align: start" id="h4334dcd5e5"><strong>リスト</strong></h2><ul><li>Svelte</li><li>SvelteKit</li><li>Superforms</li></ul><h2 style="text-align: start" id="h8baf1c3620"><strong>番号付きリスト</strong></h2><ol><li>Svelte</li><li>SvelteKit</li><li>Superforms</li></ol><h2 style="text-align: start" id="he4ba96ecb5"><strong>リンク</strong></h2><p style="text-align: start"><a href="https://kit.svelte.dev/" target="_blank" rel="noopener noreferrer nofollow"><u>SvelteKitのホームページ</u></a></p><h2 style="text-align: start" id="h7b3c950f25"><strong>画像</strong></h2><figure><img src="https://images.microcms-assets.io/assets/44ba6b35d3e64e87a847af3e575fd7b2/9f5a28c5b6fa408480eb6ef89afb87e8/blog-template.png" alt="" width="1200" height="630"></figure><h2 style="text-align: start" id="ha6836ab6e0"><strong>埋め込み</strong></h2><div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;"><iframe src="https://www.youtube.com/embed/O0Tqm9ifxf0?rel=0" style="top: 0; left: 0; width: 100%; height: 100%; position: absolute; border: 0;" allowfullscreen scrolling="no" allow="accelerometer *; clipboard-write *; encrypted-media *; gyroscope *; picture-in-picture *; web-share *;"></iframe></div>',
    summary:
      "Vue.jsを使ったポートフォリオサイト制作の全過程とその学びについて紹介します。",
    tags: [
      createTag("Vue.js"),
      createTag("Web開発"),
      createTag("ポートフォリオ"),
    ],
    category: ["deva"],
    color: "#6A11CB",
    thumbnail: {
      url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    publishedAt: "2025-04-15T09:00:00.000Z",
    revisedAt: "2025-04-15T09:00:10.000Z",
  },
  {
    id: "post2",
    title: "JavaScript非同期処理の理解を深める",
    content:
      "<h1>テスト１</h1><p>test</p><h2>テスト2</h2><p>test</p><h3>テスト3</h3><p>test</p><h4>テスト4</h4><p>test</p><h5>テスト5</h5><p>test</p>",
    summary: "JavaScriptの非同期処理の仕組みを基礎から応用まで徹底解説します。",
    tags: [
      createTag("JavaScript"),
      createTag("非同期処理"),
      createTag("Promise"),
    ],
    category: ["tech"],
    color: "#2575FC",
    thumbnail: {
      url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    publishedAt: "2025-04-10T15:30:00.000Z",
    revisedAt: "2025-04-11T19:45:00.000Z",
  },
  {
    id: "post3",
    title: "microCMSではじめるヘッドレスCMS入門",
    content:
      "<p>近年注目を集めているヘッドレスCMSの中でも使いやすいmicroCMSを使って、ブログサイトを構築する方法を解説します。APIの設定から、フロントエンドとの連携、デプロイまでの流れを初心者にもわかりやすく説明していきます。</p><h2>ヘッドレスCMSとは</h2><p>従来のCMSとヘッドレスCMSの違いや、ヘッドレスCMSのメリット・デメリットについて解説します。コンテンツ管理と表示の分離による柔軟性の向上について詳しく説明します。</p><h2>microCMSの特徴</h2><p>日本製のヘッドレスCMSであるmicroCMSの特徴や利点について解説します。使いやすい管理画面や充実したAPIの機能について紹介します。</p><h2>APIの設定方法</h2><p>microCMSのAPIの設定方法やAPI利用のベストプラクティスについて解説します。APIキーの管理方法やセキュリティ対策についても触れていきます。</p><h2>フロントエンドとの連携</h2><p>Vue.jsやNext.jsなどのフロントエンドフレームワークとmicroCMSを連携する方法を解説します。効率的なデータ取得方法や表示の最適化テクニックを紹介します。</p><h2>デプロイと運用</h2><p>microCMSを使ったサイトのデプロイ方法や運用のコツについて解説します。また、実際に運用する際のTipsについても紹介します。</p>",
    summary: "microCMSを使ったヘッドレスCMSの導入方法と活用方法を紹介します。",
    tags: [createTag("microCMS"), createTag("ヘッドレスCMS"), createTag("API")],
    category: ["tech"],
    color: "#FDA085",
    thumbnail: {
      url: "https://images.unsplash.com/photo-1600267175161-cfaa711b4a81?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    publishedAt: "2025-04-05T11:15:00.000Z",
    revisedAt: "2025-04-08T16:45:00.000Z",
  },
  {
    id: "post4",
    title: "CSSアニメーションでサイトに動きをつける",
    content:
      "<p>単調なデザインのWebサイトに動きを加えることで、ユーザー体験を向上させる方法を紹介します。CSSのみを使ったアニメーション実装方法から、ライブラリを活用した実装方法まで、様々なテクニックを解説します。</p><h2>CSSアニメーションの基本</h2><p>transitionプロパティやanimationプロパティなど、CSSアニメーションの基本的な概念と使い方を解説します。簡単な例を交えながら、初心者にもわかりやすく説明します。</p><h2>keyframesを使った複雑なアニメーション</h2><p>@keyframesルールを使って、より複雑で自由度の高いアニメーションを作成する方法を解説します。複数のプロパティを同時に変化させる方法や、タイミングの調整方法などを紹介します。</p><h2>ユーザーインタラクションとの連携</h2><p>ホバーやクリックなどのユーザーインタラクションに応じて、アニメーションを発生させる方法を解説します。擬似クラスを使った実装方法や、JavaScriptとの連携方法を紹介します。</p><h2>パフォーマンスを考慮した実装</h2><p>アニメーションのパフォーマンスを最適化するためのテクニックを解説します。transform、opacityなどのプロパティの選択や、will-changeプロパティの使用方法について触れていきます。</p><h2>モバイルでのアニメーション対応</h2><p>モバイルデバイスでのアニメーション表示における注意点や、レスポンシブ対応の方法を解説します。また、パフォーマンスを考慮した実装のコツについても触れていきます。</p>",
    summary:
      "CSSアニメーションの基本から応用テクニックまでを実例とともに解説します。",
    tags: [createTag("CSS"), createTag("アニメーション"), createTag("Web制作")],
    category: ["dev"],
    color: "#5D26C1",
    thumbnail: {
      url: "https://images.unsplash.com/photo-1559028012-481c04fa702d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    publishedAt: "2025-03-28T13:45:00.000Z",
    revisedAt: "2025-03-31T09:15:00.000Z",
  },
  {
    id: "post5",
    title: "最近読んだ技術書5選",
    content:
      "<p>最近読んだ技術書の中から特におすすめの5冊を紹介します。各書籍の概要や特徴、どんな人におすすめかなどを詳しく解説しています。</p><h2>1. 「リーダブルコード」</h2><p>読みやすいコードの書き方について解説された本書は、プログラミングの基本中の基本とも言える一冊です。命名規則やコメントの書き方など、具体的な例を挙げながら説明されており、初心者から上級者まで参考になる内容です。</p><h2>2. 「達人プログラマー」</h2><p>プログラマーとしての心構えや習慣、テクニックなどが幅広く紹介されている本書は、技術的なスキルだけでなく、考え方やアプローチ方法までカバーしています。長く活躍するプログラマーになるためのヒントが満載です。</p><h2>3. 「JavaScript: The Good Parts」</h2><p>JavaScriptの良い部分に焦点を当てた本書は、言語の奥深さと落とし穴を理解するのに役立ちます。特に言語設計の背景や、効果的な使い方についての解説が秀逸です。</p><h2>4. 「Clean Architecture」</h2><p>ソフトウェアの設計に関する原則や概念を解説した本書は、持続可能で拡張性のあるシステム設計の方法を学ぶことができます。実例を交えながら説明されており、実践的な内容となっています。</p><h2>5. 「プログラミングElixir」</h2><p>関数型プログラミング言語Elixirの入門書です。関数型プログラミングの考え方や並行処理の基本など、新しいパラダイムを学ぶのに最適な一冊です。実例も豊富で、徐々にステップアップしながら学ぶことができます。</p><h2>おわりに</h2><p>技術書は単なる知識の習得だけでなく、考え方や視野を広げてくれる素晴らしいツールです。ぜひ自分の興味や目標に合わせて、積極的に読んでみてください。</p>",
    summary: "技術力向上に役立つおすすめの技術書5冊とその学びを紹介します。",
    tags: [createTag("書評"), createTag("技術書"), createTag("学習")],
    category: ["life"],
    color: "#00CDAC",
    thumbnail: {
      url: "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    publishedAt: "2025-03-20T10:00:00.000Z",
    revisedAt: "2025-03-22T15:30:00.000Z",
  },
  {
    id: "post6",
    title: "リモートワークで生産性を上げる5つの方法",
    content:
      "<p>リモートワークが普及する中、自宅での作業効率を上げるためのコツを5つ紹介します。環境構築から習慣づけ、集中力を高めるテクニックまで、実践的なアドバイスをまとめています。</p><h2>1. 専用の作業スペースを作る</h2><p>自宅での作業専用のスペースを確保することで、仕事モードに切り替えやすくなります。できるだけ静かで、集中できる場所を選び、必要な道具や機器を揃えましょう。また、人間工学に基づいた椅子や机の高さなど、長時間作業しても疲れにくい環境を整えることが重要です。</p><h2>2. 時間管理のテクニックを活用する</h2><p>ポモドーロテクニックなど、時間管理の手法を取り入れると効率的に作業できます。25分集中して作業し、5分休憩するというサイクルを繰り返すことで、集中力を維持しつつ、疲労を防ぐことができます。また、タスク管理ツールを使って、日々の作業を可視化することも効果的です。</p><h2>3. コミュニケーションのルールを決める</h2><p>チームでのリモートワークでは、コミュニケーションのルールを明確にすることが重要です。どのツールを使い、どのようなタイミングで連絡するかなど、あらかじめ決めておくと混乱を防げます。また、定期的なビデオ会議やチャットでの雑談タイムを設けることで、チームの一体感を保つことができます。</p><h2>4. 健康管理を意識する</h2><p>自宅で仕事をしていると、つい長時間座りっぱなしになりがちです。定期的に立ち上がって軽く体を動かしたり、目を休ませたりする時間を意識的に作りましょう。また、適切な食事や睡眠、適度な運動も集中力や生産性を維持するために欠かせません。</p><h2>5. オン・オフを切り替える</h2><p>リモートワークでは仕事とプライベートの境界が曖昧になりがちです。決まった時間に仕事を始め、終える習慣をつけることで、メリハリのある生活を送ることができます。仕事が終わったら、作業スペースから離れて別の活動をすることで、リフレッシュできます。</p><h2>まとめ</h2><p>リモートワークは自由度が高い反面、自己管理が求められる働き方です。これらのコツを参考に、自分に合った方法を見つけ、効率的かつ健康的に仕事を進めていきましょう。</p>",
    summary:
      "自宅でのリモートワークを効率的に進めるためのコツと実践方法を紹介します。",
    tags: [
      createTag("リモートワーク"),
      createTag("生産性"),
      createTag("習慣化"),
    ],
    category: ["life"],
    color: "#4776E6",
    thumbnail: {
      url: "https://images.unsplash.com/photo-1583089892943-e02e5b5573ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    publishedAt: "2025-03-15T14:20:00.000Z",
    revisedAt: "2025-03-18T11:30:00.000Z",
  },
  {
    id: "post7",
    title: "GitHubを活用したチーム開発のススメ",
    content:
      "<p>GitHubを使ったチーム開発の効率化について解説します。ブランチ戦略、プルリクエストのレビュー方法、イシュー管理など、実践的なワークフローを紹介します。</p><h2>効果的なブランチ戦略</h2><p>GitHubでのチーム開発では、適切なブランチ戦略が重要です。Git Flowやプルリクエスト駆動開発など、代表的なブランチ管理パターンについて解説します。また、プロジェクトの規模や要件に応じた選択肢についても触れていきます。</p><h2>プルリクエストとコードレビュー</h2><p>プルリクエストを使った効果的なコードレビューの進め方を解説します。レビューのポイントや、コメントの書き方、フィードバックの伝え方など、チームの成長につながるレビュープロセスについて詳しく説明します。</p><h2>イシュー管理とプロジェクト管理</h2><p>GitHubのイシュー機能やプロジェクトボードを使った効果的なタスク管理の方法を紹介します。ラベルやマイルストーンの活用方法や、イシューとプルリクエストの連携テクニックを解説します。</p><h2>GitHub Actionsによる自動化</h2><p>GitHub Actionsを使ったCI/CDの構築方法について解説します。テスト自動化やビルド、デプロイの自動化など、開発フローを効率化するためのテクニックを紹介します。また、GitHub Actionsの基本的な書き方や、実用的なワークフロー例も提供します。</p><h2>チームコミュニケーションの最適化</h2><p>GitHub上でのコミュニケーションを効率化するためのコツを紹介します。コミットメッセージの書き方やイシューの文書化、ディスカッションの活用方法など、チーム全体の生産性を向上させるテクニックを解説します。</p><h2>まとめ</h2><p>GitHubはただのバージョン管理ツールではなく、チーム開発の中心となるプラットフォームです。これらの方法を活用することで、より効率的で楽しい開発環境を実現できるでしょう。</p>",
    summary:
      "GitHubを活用したチーム開発の実践的なワークフローとツールの使い方を解説します。",
    tags: [createTag("GitHub"), createTag("チーム開発"), createTag("Git")],
    category: ["dev"],
    color: "#8E2DE2",
    thumbnail: {
      url: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    publishedAt: "2025-03-10T09:30:00.000Z",
    revisedAt: "2025-03-13T15:45:00.000Z",
  },
];

const validateApiKey = (config) => {
  // ヘッダーからAPI Keyを取得
  const apiKey = config.headers["x-api-key"] || config.headers["X-API-Key"];

  // API Keyが無効な場合
  if (!apiKey || apiKey !== VALID_API_KEY) {
    return [401, { message: "無効なAPIキーです。認証に失敗しました。" }];
  }

  // API Keyが有効な場合はnullを返す（処理を続行）
  return null;
};

// ブログ記事を取得するGETリクエスト（ページネーション・フィルタリング・検索・前の記事・次の記事・関連記事）
mock.onGet("/blog/posts").reply((config) => {
  // API Keyを検証
  const authError = validateApiKey(config);
  if (authError) {
    return authError;
  }

  console.log("=== Mock API デバッグ ===");
  console.log("リクエスト:", config);
  console.log("リクエストURL:", config.url);
  console.log("リクエストヘッダー:", config.headers);

  // クエリパラメータを解析
  const offset = parseInt(config.params.offset) || 0;
  const limit = parseInt(config.params.limit) || 9;
  const orders = config.params.orders || "";
  const filters = config.params.filters || "";

  console.log("パラメータ詳細:");
  console.log("- params:", config.params);
  console.log("- offset:", offset);
  console.log("- limit:", limit);
  console.log("- orders:", orders);
  console.log("- filters:", filters);

  // ページ番号を計算（offsetとlimitから算出）
  const page = Math.floor(offset / limit) + 1;

  console.log(
    `[Mock API] ブログ記事一覧リクエスト - offset:${offset}, limit:${limit}, ページ:${page}, orders:${orders}, filters:${filters}`
  );

  // 前の記事を取得するAPIリクエスト判定
  if (filters && filters.includes("publishedAt[less_than]")) {
    console.log("🔍 前の記事リクエストを検出");
    console.log(
      `[Mock API] 前の記事リクエスト - フィルター条件: ${filters}, orders: ${orders}, limit: ${limit}`
    );

    // 実際のフィルター処理をシミュレート
    const publishedAtMatch = filters.match(/publishedAt\[less_than\](.+)/);
    if (publishedAtMatch) {
      const targetDate = publishedAtMatch[1];
      console.log("対象日時:", targetDate);

      // 前の記事データを返却
      console.log("前の記事データを返却:", postsData3.length, "件");
      return [
        200,
        {
          contents: postsData3,
          totalCount: postsData3.length,
          offset: offset,
          limit: limit,
        },
      ];
    }
  }

  // 次の記事を取得するAPIリクエスト判定
  if (filters && filters.includes("publishedAt[greater_than]")) {
    console.log("🔍 次の記事リクエストを検出");
    console.log(
      `[Mock API] 次の記事リクエスト - フィルター条件: ${filters}, orders: ${orders}, limit: ${limit}`
    );

    // 実際のフィルター処理をシミュレート
    const publishedAtMatch = filters.match(/publishedAt\[greater_than\](.+)/);
    if (publishedAtMatch) {
      const targetDate = publishedAtMatch[1];
      console.log("対象日時:", targetDate);

      // 次の記事データを返却
      console.log("次の記事データを返却:", postsData4.length, "件");
      return [
        200,
        {
          contents: postsData4,
          totalCount: postsData4.length,
          offset: offset,
          limit: limit,
        },
      ];
    }
  }

  // 関連記事を取得するAPIリクエスト判定
  if (
    filters &&
    filters.includes("category[contains]") &&
    orders === "-publishedAt" &&
    limit === 10
  ) {
    console.log("🔍 関連記事リクエストを検出");
    console.log(
      `[Mock API] 関連記事リクエスト - フィルター条件: ${filters}, orders: ${orders}, limit: ${limit}`
    );
    return [
      200,
      {
        contents: postsData5,
        totalCount: postsData5.length,
        offset: offset,
        limit: limit,
      },
    ];
  }

  // 以下、既存のフィルタリング・ソート・ページネーション処理...
  let filteredPosts = postsData1;

  // ソート処理
  if (orders) {
    if (orders === "-publishedAt") {
      filteredPosts.sort(
        (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
      );
      console.log(`[Mock API] 公開日時の降順でソート`);
    } else if (orders === "publishedAt") {
      filteredPosts.sort(
        (a, b) => new Date(a.publishedAt) - new Date(b.publishedAt)
      );
      console.log(`[Mock API] 公開日時の昇順でソート`);
    }
  }

  // ページネーション処理
  const startIndex = offset;
  const endIndex = startIndex + limit;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredPosts.length / limit);
  const totalItems = filteredPosts.length;

  console.log(
    `[Mock API] ページネーション: ${paginatedPosts.length}件返却（${
      startIndex + 1
    }〜${Math.min(
      endIndex,
      totalItems
    )}件目）, 全${totalPages}ページ中${page}ページ目`
  );

  // microCMSのレスポンス形式に合わせて返却
  return [
    200,
    {
      contents: paginatedPosts.map((post) => ({
        ...post,
      })),
      totalCount: totalItems,
      offset: offset,
      limit: limit,
    },
  ];
});

// ブログ記事の詳細を取得するGETリクエスト
mock
  .onGet(new RegExp(`${process.env.VUE_APP_MICROCMS_URL}/[^/]+$`))
  .reply((config) => {
    // API Keyを検証
    const authError = validateApiKey(config);
    if (authError) {
      return authError;
    }

    // URLから記事IDを抽出
    const postId = config.url.split("/").pop();
    console.log(`[Mock API] ブログ記事詳細リクエスト - ID:${postId}`);

    return [200, postsData2];
  });

export default mock;
