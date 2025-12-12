import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { validateApiKey } from '@/api/utils/auth';

// モックインスタンスの作成（APIレスポンスの遅延を設定）
const mock = new MockAdapter(axios, { delayResponse: 5000 });

// タイムラインデータ
const timelineData = [
  {
    id: 1,
    date: "2025",
    title: "成長と探求",
    text: "3Dアニメーション、WebGLなどの最新技術を取り入れたプロジェクトに挑戦しています。パフォーマンス最適化とアクセシビリティに焦点を当てたウェブ開発を目指しています。",
  },
  {
    id: 2,
    date: "2021",
    title: "チーム開発",
    text: "中規模のウェブアプリケーション開発チームに参加し、コラボレーションスキルとGit、CI/CDパイプラインなどの開発プロセスを学びました。",
  },
  {
    id: 3,
    date: "2020",
    title: "フリーランスの始まり",
    text: "フリーランスのWeb開発者として初めての仕事を受注。クライアントと直接協力して、要件を満たすウェブサイトを構築する経験を積みました。",
  },
  {
    id: 4,
    date: "2019",
    title: "フロントエンドフレームワーク",
    text: "Vue.jsとReactを学び始め、モダンなフロントエンド開発の可能性を発見しました。いくつかの小規模プロジェクトをフレームワークを使って開発し、スキルを向上させました。",
  },
  {
    id: 5,
    date: "2018",
    title: "Webの世界へ",
    text: "HTML、CSS、JavaScriptの基礎を学び、Webの世界への旅を始めました。初めての個人プロジェクトを完成させ、Webサイト制作の魅力に引き込まれました。",
  }
];


// 全てのタイムラインアイテムを取得するGETリクエスト
mock.onGet('/timeline').reply((config) => {
  // API Keyを検証
  const authError = validateApiKey(config);
  if (authError) {
    return authError;
  }

  // 認証成功の場合、データを返す
  return [200, { timeline: timelineData }];
});

export default mock;
