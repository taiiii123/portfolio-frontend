// APIキーの検証機能を提供する共通ユーティリティ

// テストAPIキー
export const VALID_API_KEY = 'test-api-key-12345';

/**
 * APIキーを検証するヘルパー関数
 * @param {Object} config - Axiosリクエスト設定オブジェクト
 * @returns {Array|null} - 認証エラー時はエラーレスポンス配列、成功時はnull
 */
export const validateApiKey = (config) => {
  // ヘッダーからAPI Keyを取得
  const apiKey = config.headers['x-api-key'] || config.headers['X-API-Key'];

  // API Keyが無効な場合
  if (!apiKey || apiKey !== VALID_API_KEY) {
    return [401, { message: '無効なAPIキーです。認証に失敗しました。' }];
  }

  // API Keyが有効な場合はnullを返す（処理を続行）
  return null;
};
