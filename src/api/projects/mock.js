import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { validateApiKey } from "@/api/utils/auth";

// モックインスタンスの作成（APIレスポンスの遅延を設定）
const mock = new MockAdapter(axios, { delayResponse: 2000 });

// カテゴリーデータ
const categoriesData = [
  { id: "all", name: "すべて" },
  { id: "web", name: "Webアプリ" },
  { id: "ui", name: "UIデザイン" },
  { id: "animation", name: "アニメーション" },
  { id: "mobile", name: "モバイルアプリ" },
];

// プロジェクトデータ
const projectsData = [
  {
    id: "project1",
    title: "Cosmic Dashboard",
    description:
      "インタラクティブなデータ可視化ダッシュボード。スペースデータのAPIを使用して宇宙に関する情報を表示します。",
    tags: ["Vue.js", "D3.js", "API"],
    category: "web",
    color: "#6A11CB",
    thumbnailPath: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    liveLink: "",
    codeLink: "",
  },
  {
    id: "project2",
    title: "Galaxy Explorer",
    description:
      "3D空間内で銀河を探索できるインタラクティブなWebアプリケーション。",
    tags: ["Three.js", "WebGL", "Animation"],
    category: "animation",
    color: "#2575FC",
    thumbnailPath: "/img/projects/galaxy-explorer.jpg",
    liveLink: "",
    codeLink: "",
  },
  {
    id: "project3",
    title: "Stellar Blog",
    description:
      "宇宙と技術に関するブログプラットフォーム。MarkdownとVue.jsを使用しています。",
    tags: ["Vue.js", "Markdown", "CMS"],
    category: "web",
    color: "#FDA085",
    thumbnailPath: "/img/projects/stellar-blog.jpg",
    liveLink: "",
    codeLink: "",
  },
  {
    id: "project4",
    title: "Nebula UI Kit",
    description: "宇宙をテーマにしたモダンなUIコンポーネントライブラリ。",
    tags: ["CSS", "Design System", "Components"],
    category: "ui",
    color: "#5D26C1",
    thumbnailPath: "/img/projects/nebula-ui.jpg",
    liveLink: "",
    codeLink: "",
  },
  {
    id: "project5",
    title: "Orbit Animation",
    description: "惑星の軌道をシミュレートするアニメーションライブラリ。",
    tags: ["GSAP", "Canvas", "Physics"],
    category: "animation",
    color: "#00CDAC",
    thumbnailPath: "/img/projects/orbit-animation.jpg",
    liveLink: "",
    codeLink: "",
  },
  {
    id: "project6",
    title: "Space Weather App",
    description: "太陽活動や宇宙天気を追跡するウェブアプリケーション。",
    tags: ["Vue.js", "API", "Real-time"],
    category: "web",
    color: "#4776E6",
    thumbnailPath: "/img/projects/space-weather.jpg",
    liveLink: "",
    codeLink: "",
  },
  {
    id: "project7",
    title: "Constellation Visualizer",
    description: "星座を学べるインタラクティブな可視化ツール。",
    tags: ["JavaScript", "SVG", "Astronomy"],
    category: "animation",
    color: "#8E2DE2",
    thumbnailPath: "/img/projects/constellation.jpg",
    liveLink: "",
    codeLink: "",
  },
  {
    id: "project8",
    title: "Dark Matter Calculator",
    description: "宇宙の暗黒物質に関する計算と可視化ツール。",
    tags: ["Vue.js", "Physics", "Math"],
    category: "web",
    color: "#4A00E0",
    thumbnailPath: "/img/projects/dark-matter.jpg",
    liveLink: "",
    codeLink: "",
  },
  {
    id: "project9",
    title: "Stargazer UI",
    description: "星空観測用のモバイルアプリのUIデザイン。",
    tags: ["UI/UX", "Mobile", "Design"],
    category: "ui",
    color: "#3498db",
    thumbnailPath: "/img/projects/stargazer.jpg",
    liveLink: "",
    codeLink: "",
  },
  {
    id: "project10",
    title: "Astro Navigator",
    description:
      "天体観測のためのモバイルアプリ。現在地から見える星座を特定します。",
    tags: ["React Native", "GPS", "Augmented Reality"],
    category: "mobile",
    color: "#2ecc71",
    thumbnailPath: "/img/projects/astro-navigator.jpg",
    liveLink: "",
    codeLink: "",
  },
  {
    id: "project11",
    title: "Cosmic Calendar",
    description: "宇宙イベントやミッションのカレンダーアプリ。",
    tags: ["Vue.js", "Calendar API", "Notifications"],
    category: "web",
    color: "#e74c3c",
    thumbnailPath: "/img/projects/cosmic-calendar.jpg",
    liveLink: "",
    codeLink: "",
  },
  {
    id: "project12",
    title: "SpaceX Tracker",
    description: "SpaceXのロケット打ち上げや着陸を追跡するウェブアプリ。",
    tags: ["React", "SpaceX API", "Maps"],
    category: "web",
    color: "#9b59b6",
    thumbnailPath: "/img/projects/spacex-tracker.jpg",
    liveLink: "",
    codeLink: "",
  },
];

const projectsData2 = [
  {
    id: "project1",
    title: "Cosmic Dashboard",
    description:
      "インタラクティブなデータ可視化ダッシュボード。スペースデータのAPIを使用して宇宙に関する情報を表示します。",
    fullDescription:
      "Cosmic Dashboardは、NASAのOpenDataプラットフォームと連携し、リアルタイムで宇宙関連のデータを取得・可視化するWebアプリケーションです。\n\n当プロジェクトでは、APIからの大量データを効率的に処理し、直感的なインターフェースで表示することに注力しました。\n\n特に、惑星の軌道や宇宙ステーションの位置情報など、複雑なデータセットをわかりやすくビジュアライズする技術を実装しています。",
    features: [
      "リアルタイムのスペースデータ可視化",
      "インタラクティブな3D宇宙マップ",
      "カスタマイズ可能なダッシュボード",
      "複数APIからのデータ統合",
      "レスポンシブデザインによるマルチデバイス対応",
    ],
    tags: ["Vue.js", "D3.js", "API"],
    category: "web",
    color: "#6A11CB",
    thumbnailPath: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    liveLink: "",
    codeLink: "",
  },
  {
    id: "project2",
    title: "Galaxy Explorer",
    description:
      "3D空間内で銀河を探索できるインタラクティブなWebアプリケーション。",
    fullDescription:
      "Galaxy Explorerは、実際の天文学データに基づいた3D銀河モデルを提供するWebアプリケーションです。\n\nユーザーは銀河系内を自由に移動しながら、恒星や惑星系、星雲などの天体を詳細に観察することができます。\n\n本プロジェクトでは、Three.jsを用いた高度な3Dレンダリング技術と、大規模な天文データの効率的な処理メカニズムを実装しました。",
    features: [
      "リアルな3D宇宙環境の再現",
      "自由な視点移動と探索機能",
      "天体データの詳細表示",
      "天体現象の物理シミュレーション",
      "VR対応モード",
    ],
    tags: ["Three.js", "WebGL", "Animation"],
    category: "animation",
    color: "#2575FC",
    thumbnailPath: "/img/projects/galaxy-explorer.jpg",
    liveLink: "",
    codeLink: "",
  },
  {
    id: "project3",
    title: "Stellar Blog",
    description:
      "宇宙と技術に関するブログプラットフォーム。MarkdownとVue.jsを使用しています。",
    fullDescription:
      "Stellar Blogは、宇宙科学と最新テクノロジーの交差点に焦点を当てたブログプラットフォームです。\n\n記事はMarkdown形式で作成・管理され、Vueコンポーネントによる動的なコンテンツ表示を実現しています。\n\n当プロジェクトでは、高速なページロード、SEO最適化、そして読みやすいタイポグラフィに特にこだわりました。",
    features: [
      "Markdownベースの記事管理システム",
      "カテゴリとタグによる記事整理",
      "コードスニペットのシンタックスハイライト",
      "ダークモード対応",
      "レスポンシブデザイン",
    ],
    tags: ["Vue.js", "Markdown", "CMS"],
    category: "web",
    color: "#FDA085",
    thumbnailPath: "/img/projects/stellar-blog.jpg",
    liveLink: "",
    codeLink: "",
  },
  {
    id: "project4",
    title: "Nebula UI Kit",
    description: "宇宙をテーマにしたモダンなUIコンポーネントライブラリ。",
    fullDescription:
      "Nebula UI Kitは、宇宙をテーマにした視覚的に魅力的なUIコンポーネントライブラリです。\n\n星や銀河、惑星などの要素からインスピレーションを得たデザインシステムを構築し、Webアプリケーション開発者向けの再利用可能なコンポーネント集を提供しています。\n\nアクセシビリティと使いやすさを重視し、すべてのコンポーネントは厳格なテストとドキュメント化が行われています。",
    features: [
      "50以上のカスタマイズ可能なUIコンポーネント",
      "宇宙をテーマにしたカラーパレット",
      "アニメーション効果ライブラリ",
      "ダークモード対応",
      "アクセシビリティ準拠のデザイン",
    ],
    tags: ["CSS", "Design System", "Components"],
    category: "ui",
    color: "#5D26C1",
    thumbnailPath: "/img/projects/nebula-ui.jpg",
    liveLink: "",
    codeLink: "",
  },
  {
    id: "project5",
    title: "Orbit Animation",
    description: "惑星の軌道をシミュレートするアニメーションライブラリ。",
    fullDescription:
      "Orbit Animationは、太陽系の惑星運動を正確にシミュレートするためのJavaScriptライブラリです。\n\nケプラーの法則に基づいた数学モデルを実装し、実際の天文学データを用いて惑星の軌道、自転、公転周期を忠実に再現しています。\n\n本ライブラリは、教育目的のアプリケーションや科学的可視化プロジェクトでの利用を想定して開発されました。",
    features: [
      "物理的に正確な惑星軌道計算",
      "カスタマイズ可能な時間スケール",
      "衛星や小惑星の追加機能",
      "イベントベースのアニメーション制御",
      "低リソース消費の最適化設計",
    ],
    tags: ["GSAP", "Canvas", "Physics"],
    category: "animation",
    color: "#00CDAC",
    thumbnailPath: "/img/projects/orbit-animation.jpg",
    liveLink: "",
    codeLink: "",
  },
  {
    id: "project6",
    title: "Space Weather App",
    description: "太陽活動や宇宙天気を追跡するウェブアプリケーション。",
    fullDescription:
      "Space Weather Appは、太陽フレアや磁気嵐、オーロラ活動など、宇宙天気現象をリアルタイムで追跡・予測するWebアプリケーションです。\n\nNOAAやESAなどの宇宙機関が提供するAPIを活用して、最新の太陽活動データと地球への影響を視覚化しています。\n\n特に、複雑な宇宙天気データを一般ユーザーにも理解しやすい形で提示することに注力しました。",
    features: [
      "リアルタイム太陽活動モニタリング",
      "オーロラ発生予測と地図表示",
      "太陽フレア警報システム",
      "衛星への影響リスク評価",
      "過去データの統計分析ツール",
    ],
    tags: ["Vue.js", "API", "Real-time"],
    category: "web",
    color: "#4776E6",
    thumbnailPath: "/img/projects/space-weather.jpg",
    liveLink: "",
    codeLink: "",
  },
  {
    id: "project7",
    title: "Constellation Visualizer",
    description: "星座を学べるインタラクティブな可視化ツール。",
    fullDescription:
      "Constellation Visualizerは、88の公式星座すべてを学習できるインタラクティブな教育ツールです。\n\n各星座の歴史、神話、科学的特徴を詳細に解説し、季節ごとの見え方や位置関係も視覚的に理解できるよう設計されています。\n\n本プロジェクトでは、天文学的に正確なデータと魅力的なビジュアルデザインの両立を目指しました。",
    features: [
      "全88星座の詳細情報と可視化",
      "星座にまつわる神話の解説",
      "季節や位置による星座表示の切り替え",
      "星の明るさと距離の正確な表現",
      "カスタム星座の作成と共有機能",
    ],
    tags: ["JavaScript", "SVG", "Astronomy"],
    category: "animation",
    color: "#8E2DE2",
    thumbnailPath: "/img/projects/constellation.jpg",
    liveLink: "",
    codeLink: "",
  },
  {
    id: "project8",
    title: "Dark Matter Calculator",
    description: "宇宙の暗黒物質に関する計算と可視化ツール。",
    fullDescription:
      "Dark Matter Calculatorは、銀河の回転曲線や宇宙大規模構造における暗黒物質の影響を計算・可視化するための専門的ツールです。\n\n現代宇宙物理学のモデルに基づき、暗黒物質の分布と重力効果をシミュレートします。\n\n研究者や宇宙物理学に興味を持つ学生のために、複雑な物理現象を直感的に理解できるインターフェースを提供しています。",
    features: [
      "銀河回転曲線のシミュレーション",
      "暗黒物質ハローモデルの計算機能",
      "異なる暗黒物質理論の比較ツール",
      "大規模構造形成の可視化",
      "教育用解説モード",
    ],
    tags: ["Vue.js", "Physics", "Math"],
    category: "web",
    color: "#4A00E0",
    thumbnailPath: "/img/projects/dark-matter.jpg",
    liveLink: "",
    codeLink: "",
  },
  {
    id: "project9",
    title: "Stargazer UI",
    description: "星空観測用のモバイルアプリのUIデザイン。",
    fullDescription:
      "Stargazer UIは、天体観測愛好家向けのモバイルアプリケーション用に設計されたUIデザインプロジェクトです。\n\n夜間の使用を想定した目に優しいダークインターフェース、星座や天体の直感的な検索機能、観測計画の管理ツールなど、実用的な機能を備えています。\n\nユーザーテストを繰り返し行い、初心者から上級者まで様々な天体観測家のニーズに応えるデザインを追求しました。",
    features: [
      "夜間観測に最適化された低光量UI",
      "ARを活用した星座ファインダー",
      "パーソナライズされた観測リマインダー",
      "天体写真撮影ガイド機能",
      "観測地のライトポリューション地図",
    ],
    tags: ["UI/UX", "Mobile", "Design"],
    category: "ui",
    color: "#3498db",
    thumbnailPath: "/img/projects/stargazer.jpg",
    liveLink: "",
    codeLink: "",
  },
  {
    id: "project10",
    title: "Astro Navigator",
    description:
      "天体観測のためのモバイルアプリ。現在地から見える星座を特定します。",
    fullDescription:
      "Astro Navigatorは、GPS位置情報と拡張現実技術を活用して、ユーザーの現在地から見える星座や天体を特定するモバイルアプリケーションです。\n\nスマートフォンのカメラを空に向けるだけで、画面上に星座の名前や境界線を表示し、天体観測の初心者でも簡単に星空を理解できるよう設計されています。\n\n月や惑星の位置も正確に表示し、さらに天文現象のアラート機能も搭載しています。",
    features: [
      "GPSと加速度センサーを用いた高精度な位置認識",
      "ARによる星座のリアルタイム表示",
      "天体情報のインタラクティブな表示",
      "天文イベントのアラート機能",
      "オフラインモードでの利用可能性",
    ],
    tags: ["React Native", "GPS", "Augmented Reality"],
    category: "mobile",
    color: "#2ecc71",
    thumbnailPath: "/img/projects/astro-navigator.jpg",
    liveLink: "",
    codeLink: "",
  },
  {
    id: "project11",
    title: "Cosmic Calendar",
    description: "宇宙イベントやミッションのカレンダーアプリ。",
    fullDescription:
      "Cosmic Calendarは、宇宙関連の重要なイベント、ミッション、天文現象をまとめたインタラクティブなカレンダーアプリケーションです。\n\nNASA、ESA、JAXAなど主要宇宙機関の打ち上げスケジュールや、流星群、月食、日食などの観測可能な天文現象を自動的に収集・整理しています。\n\nユーザーは興味のあるイベントに登録し、通知を受け取ることができます。また、位置情報に基づいて観測可能な現象のみをフィルタリングする機能も実装しています。",
    features: [
      "宇宙ミッションの包括的なスケジュール",
      "パーソナライズされた天文イベント通知",
      "位置ベースの観測可能性フィルター",
      "天体観測のベストタイム計算",
      "イベント共有機能",
    ],
    tags: ["Vue.js", "Calendar API", "Notifications"],
    category: "web",
    color: "#e74c3c",
    thumbnailPath: "/img/projects/cosmic-calendar.jpg",
    liveLink: "",
    codeLink: "",
  },
  {
    id: "project12",
    title: "SpaceX Tracker",
    description: "SpaceXのロケット打ち上げや着陸を追跡するウェブアプリ。",
    fullDescription:
      "SpaceX Trackerは、SpaceXの過去・現在・将来のミッションをリアルタイムで追跡するWebアプリケーションです。\n\nSpaceX公式APIを使用して、ロケット打ち上げのカウントダウン、軌道情報、着陸船の位置など、詳細なミッションデータをビジュアライズします。\n\nFalcon 9の再利用統計や、Starshipの開発進捗など、SpaceXのイノベーションを包括的に追跡し、宇宙開発に興味を持つ一般ユーザーにも理解しやすい形で提供しています。",
    features: [
      "リアルタイムのミッションカウントダウン",
      "打ち上げと着陸の位置をマップ表示",
      "過去のミッション結果アーカイブ",
      "ロケット再利用の統計分析",
      "ライブストリーミング統合",
    ],
    tags: ["React", "SpaceX API", "Maps"],
    category: "web",
    color: "#9b59b6",
    thumbnailPath: "/img/projects/spacex-tracker.jpg",
    liveLink: "",
    codeLink: "",
  },
];

// カテゴリー一覧を取得するGETリクエスト
mock.onGet("/projects/categories").reply((config) => {
  // API Keyを検証
  const authError = validateApiKey(config);
  if (authError) {
    return authError;
  }

  console.log("[Mock API] カテゴリー一覧を取得しました");

  // 認証成功の場合、データを返す
  return [200, { categories: categoriesData }];
});

// プロジェクト一覧を取得するGETリクエスト（ページネーション・フィルタリング対応）
mock.onGet("/projects").reply((config) => {
  // API Keyを検証
  const authError = validateApiKey(config);
  if (authError) {
    return authError;
  }

  // クエリパラメータを解析
  const params = new URLSearchParams(config.url.split("?")[1]);
  const offset = parseInt(params.get("offset")) || 0;  // offsetパラメータに変更
  const limit = parseInt(params.get("limit")) || 6;    // limitパラメータに変更
  const category = params.get("category") || "all";

  // offsetからページ番号を計算
  const page = Math.floor(offset / limit) + 1;

  console.log(
    `[Mock API] プロジェクト一覧リクエスト - offset:${offset}, limit:${limit}, ページ:${page}, カテゴリー:${category}`
  );

  // カテゴリーでフィルタリング
  let filteredProjects = projectsData;
  if (category !== "all") {
    filteredProjects = projectsData.filter(
      (project) => project.category === category
    );
    console.log(
      `[Mock API] カテゴリー"${category}"でフィルタリング: ${filteredProjects.length}件`
    );
  } else {
    console.log(`[Mock API] すべてのカテゴリー: ${filteredProjects.length}件`);
  }

  // ページネーション処理
  const startIndex = offset;
  const endIndex = startIndex + limit;
  const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

  // 合計ページ数を計算
  const totalPages = Math.ceil(filteredProjects.length / limit);
  const totalItems = filteredProjects.length;

  console.log(
    `[Mock API] ページネーション: ${paginatedProjects.length}件返却（${
      startIndex + 1
    }〜${Math.min(
      endIndex,
      totalItems
    )}件目）, 全${totalPages}ページ中${page}ページ目`
  );

  // 認証成功の場合、データを返す
  return [
    200,
    {
      projects: paginatedProjects,
      pagination: {
        page: offset,        // offsetをそのまま返す（Projects.vueが期待する形式）
        perPage: limit,      // limitをperPageとして返す
        totalPages,          // 正しく計算された総ページ数
        totalItems,          // 全アイテム数
      },
    },
  ];
});

// 特定のプロジェクト詳細と関連プロジェクトを取得するGETリクエスト
mock.onGet(/\/api\/projects\/detail\/(.+)/).reply((config) => {
  // API Keyを検証
  const authError = validateApiKey(config);
  if (authError) {
    return authError;
  }

  // URLからプロジェクトIDを抽出
  const projectId = config.url.split("/").pop();

  console.log(`[Mock API] プロジェクト詳細リクエスト - ID:${projectId}`);

  // プロジェクトを検索
  const project = projectsData2.find((p) => p.id === projectId);

  if (project) {
    // 関連プロジェクトを取得（同じカテゴリーの他のプロジェクト、最大5件）
    const relatedProjects = projectsData2
      .filter((p) => p.id !== projectId && p.category === project.category)
      .slice(0, 5); // 最大5件まで表示

    console.log(
      `[Mock API] プロジェクト "${project.title}" の詳細と関連プロジェクト(${relatedProjects.length}件)を返却`
    );

    return [
      200,
      {
        project: project,
        relatedProjects: relatedProjects,
      },
    ];
  } else {
    console.log(`[Mock API] プロジェクト ID:${projectId} は見つかりません`);
    return [404, { message: "プロジェクトが見つかりません。" }];
  }
});

export default mock;
