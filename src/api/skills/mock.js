// src/api/skillsMock.js
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { validateApiKey } from '@/api/utils/auth';

// モックインスタンスの作成（APIレスポンスの遅延を設定）
const mock = new MockAdapter(axios, { delayResponse: 5000 });

// スキルデータ
const skillsData = {
  skillCategories: [
    {
      title: "フロントエンド",
      skills: [
        "HTML5 & CSS3",
        "JavaScript",
        "Vue.js",
        "React",
        "SCSS/SASS",
        "TypeScript",
        "Responsive Design"
      ]
    },
    {
      title: "バックエンド",
      skills: [
        "Node.js",
        "Express",
        "Firebase",
        "MongoDB",
        "REST API",
        "GraphQL"
      ]
    },
    {
      title: "AWS",
      skills: [
        "EC2",
        "S3",
        "Lambda",
        "CloudFront",
        "Route 53",
        "DynamoDB"
      ]
    },
    {
      title: "その他",
      skills: [
        "Git/GitHub",
        "Docker",
        "CI/CD",
        "Figma",
        "アニメーション",
        "レスポンシブデザイン"
      ]
    }
  ],
  certifications: [
    {
      name: "基本情報技術者",
      date: "2022年10月",
      organization: "情報処理推進機構（IPA）",
      iconType: "svg",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v5.7c0 4.83-3.4 9.19-7 10.36-3.6-1.17-7-5.53-7-10.36v-5.7l7-3.12z"></path><path d="M9 9v6h6V9H9zm2 2h2v2h-2v-2z"></path></svg>',
      color: "#8A2BE2"
    },
    {
      name: "AWS認定ソリューションアーキテクト",
      date: "2023年9月",
      organization: "アマゾン ウェブ サービス",
      iconType: "svg",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M7.5 3.5l3 5 3-5h2l-4 7 4 7h-2l-3-5-3 5h-2l4-7-4-7z"></path></svg>',
      color: "#FF9900"
    },
    {
      name: "ウェブデザイン技能士",
      date: "2022年12月",
      organization: "厚生労働省",
      iconType: "emoji",
      icon: "👨‍💻",
      color: "#3498DB"
    }
  ]
};

// すべてのスキルデータを一度に取得するエンドポイント
mock.onGet('/api/skills/all').reply((config) => {
  // API Keyを検証
  const authError = validateApiKey(config);
  if (authError) {
    return authError;
  }

  // 認証成功の場合、データを返す
  return [200, skillsData];
});

export default mock;
