import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { validateApiKey } from '@/api/utils/auth';

// モックインスタンスの作成（APIレスポンスの遅延を設定）
const mock = new MockAdapter(axios, { delayResponse: 1500 });

// テスト用のAPIキー
export const VALID_API_KEY = "test-api-key-contact-abc";

// お問い合わせ用のバリデーション関数
const validateContactData = (data) => {
  const errors = [];

  // 必須フィールドのチェック
//   data.name = ''
  if (!data.name || data.name.trim() === '') {
      errors.push('お名前は必須項目です。');
  }

//   data.email = ''
  if (!data.email || data.email.trim() === '') {
      errors.push('メールアドレスは必須項目です。');
    } else {
        // メールアドレスの形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push('メールアドレスの形式が正しくありません。');
    }
}

//   data.subject = ''
  if (!data.subject || data.subject.trim() === '') {
      errors.push('件名は必須項目です。');
  } else if (data.subject.length > 80) {
      errors.push('件名は80文字以内で入力してください。');
  }

//   data.message = ''
  if (!data.message || data.message.trim() === '') {
    errors.push('メッセージは必須項目です。');
  }

  return errors;
};

// お問い合わせ送信用のPOSTリクエスト
mock.onPost(/\/api\/contact/).reply((config) => {
  console.log("=== Contact Mock API デバッグ ===");
  console.log("リクエスト:", config);
  console.log("リクエストURL:", config.url);
  console.log("リクエストヘッダー:", config.headers);
  console.log("リクエストパラメータ:", config.params);

  // API Keyの検証（開発環境では緩い検証）
  const authError = validateApiKey(config);
  if (authError) {
    return authError;
  }

  // リクエストデータをパース
  let requestParams;
  try {

    requestParams = config.params || {};

    // バリデーション実行
    const validationErrors = validateContactData(requestParams);
    console.log('バリデーション結果:', validationErrors);

    if (validationErrors.length > 0) {
      console.log('バリデーションエラー:', validationErrors);
      return [400, {
        status: 'error',
        error: 'VALIDATION_ERROR',
        message: '入力内容に問題があります。',
        errors: validationErrors
      }];
    }

    // 成功率の設定（デバッグ用：90%成功、10%失敗）
    const isSuccess = Math.random() < 0.9;

    if (isSuccess) {
      // 成功レスポンス
      console.log('[Mock API] お問い合わせ送信成功');

      // 送信されたデータを含めた成功レスポンス
      return [200, {'status': 'success'}];
    } else {
      // 失敗レスポンス（サーバーエラーのシミュレーション）
      console.log('[Mock API] お問い合わせ送信失敗（サーバーエラー）');

      return [500, {
        status: 'error',
        error: 'INTERNAL_SERVER_ERROR',
        message: 'サーバー内部エラーが発生しました。しばらく時間をおいて再度お試しください。'
      }];
    }
  } catch (error) {
    console.error('リクエストデータのパースに失敗:', error);
    return [400, {
      status: 'error',
      error: 'BAD_REQUEST',
      message: 'リクエストデータが無効です。'
    }];
  }
});

export default mock;
