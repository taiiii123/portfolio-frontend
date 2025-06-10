import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { validateApiKey } from "@/api/utils/auth";

// モックインスタンスの作成（遅延を設定）
const mock = new MockAdapter(axios, { delayResponse: 5000 });

// おすすめプロジェクトデータ
const featuredProjectsData = [
  {
    id: "project1",
    title: "Cosmic Dashboard",
    description:
      "インタラクティブなデータ可視化ダッシュボード。スペースデータのAPIを使用して宇宙に関する情報を表示します。",
    tags: ["Vue.js", "D3.js", "API"],
    color: "#6A11CB",
    thumbnailPath: require(`@/assets/images/stars-fallback.png`),
    liveLink: "",
    codeLink: "#",
  },
  {
    id: "project2",
    title: "Galaxy Explorer",
    description:
      "3D空間内で銀河を探索できるインタラクティブなWebアプリケーション。",
    tags: ["Three.js", "WebGL", "Animation"],
    color: "#2575FC",
    thumbnailPath: "https://mysuki.jp/wp-content/uploads/2016/07/universe.jpg",
    liveLink: "#",
    codeLink: "",
  },
  {
    id: "project3",
    title: "Stellar Blog",
    description:
      "宇宙と技術に関するブログプラットフォーム。MarkdownとVue.jsを使用しています。",
    tags: ["Vue.js", "Markdown", "CMS"],
    color: "#FDA085",
    thumbnailPath: "",
    liveLink: "#",
    codeLink: "#",
  },
];

// おすすめプロジェクトを取得するGETリクエスト
mock.onGet("/api/projects/featured").reply((config) => {
  // API Keyを検証
  const authError = validateApiKey(config);
  if (authError) {
    return authError;
  }

  // 認証成功の場合、データを返す
  return [200, { featuredProjects: featuredProjectsData }];
});

export default mock;
