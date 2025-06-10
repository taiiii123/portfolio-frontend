import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { validateApiKey } from '@/api/utils/auth';

// モックインスタンスの作成（APIレスポンスの遅延を設定）
const mock = new MockAdapter(axios, { delayResponse: 5000 });

// 全てのタイムラインアイテムを取得するGETリクエスト
mock.onPost('/api/access').reply((config) => {
  // API Keyを検証
  const authError = validateApiKey(config);
  if (authError) {
    return authError;
  }

  console.log("[Access API] アクセス成功");

  // 認証成功の場合、データを返す
  return [200, {
    "message": "Access logged successfully"
  }];
});

export default mock;
