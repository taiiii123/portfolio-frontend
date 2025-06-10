import { createApp, h } from "vue";
import SpaceDialog from "@/components/common/SpaceDialog.vue";

// ダイアログを表示するためのグローバルメソッド
const dialogService = {
  // 通常のアラート（確認ボタンのみ）
  alert(options) {
    return this.createDialog({
      ...options,
      type: options.type || "info",
      showCancelButton: false,
      icon: options.icon || this.getDefaultIcon(options.type || "info"),
      iconPath: options.iconPath,
    });
  },

  // 確認ダイアログ（OK/キャンセル）
  confirm(options) {
    return this.createDialog({
      ...options,
      type: options.type || "warning",
      icon: options.icon || this.getDefaultIcon(options.type || "warning"),
      iconPath: options.iconPath,
    });
  },

  // カスタムダイアログ
  dialog(options) {
    return this.createDialog(options);
  },

  // ダイアログを作成するプライベートメソッド
  createDialog(options) {
    return new Promise((resolve) => {
      // マウントポイントとなるdiv要素を作成
      const mountPoint = document.createElement("div");
      document.body.appendChild(mountPoint);

      // デフォルトのオプションをマージ
      const dialogOptions = {
        title: "",
        message: "",
        type: "info",
        showCloseButton: true,
        showConfirmButtons: true,
        showCancelButton: true,
        confirmButtonText: "確認",
        cancelButtonText: "キャンセル",
        closeOnBackdrop: true,
        ...options,
      };

      // ダイアログアプリケーションを作成
      const dialogApp = createApp({
        render() {
          return h(
            SpaceDialog,
            {
              visible: true,
              ...dialogOptions,
              onConfirm: () => {
                destroyDialog();
                resolve(true);
              },
              onCancel: () => {
                destroyDialog();
                resolve(false);
              },
              onClose: () => {
                destroyDialog();
                resolve(false);
              },
            },
            dialogOptions.customContent ? dialogOptions.customContent : null
          );
        },
      });

      // ダイアログをマウント
      dialogApp.mount(mountPoint);

      // ダイアログを破棄する関数
      const destroyDialog = () => {
        dialogApp.unmount();
        document.body.removeChild(mountPoint);
      };
    });
  },

  // タイプに応じたデフォルトのアイコンを取得
  getDefaultIcon(type) {
    switch (type) {
      case "info":
        return "ℹ️";
      case "success":
        return "✅";
      case "warning":
        return "⚠️";
      case "error":
        return "❌";
      default:
        return "";
    }
  },
};

export default dialogService;
