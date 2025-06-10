<template>
  <div class="pagination">
    <!-- 最初ページへのボタン -->
    <button
      class="pagination-btn first"
      @click="goToFirstPage"
      :disabled="currentPage === 1"
    >
      <span>«</span> <span class="btn-text">最初</span>
    </button>

    <!-- 前ページへのボタン -->
    <button
      class="pagination-btn prev"
      @click="goToPrevPage"
      :disabled="currentPage === 1"
    >
      <span>←</span> <span class="btn-text">前へ</span>
    </button>

    <div class="pagination-numbers">
      <!-- ページ番号ボタン -->
      <template v-for="(page, index) in displayedPages" :key="page">
        <!-- 省略記号（...）の表示 -->
        <span v-if="page === 'ellipsis'" class="pagination-ellipsis" :key="`ellipsis-${index}`">...</span>
        <button
          v-else
          class="pagination-number"
          :class="{ active: currentPage === page }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </template>
    </div>

    <!-- 次ページへのボタン -->
    <button
      class="pagination-btn next"
      @click="goToNextPage"
      :disabled="currentPage === totalPages"
    >
      <span class="btn-text">次へ</span> <span>→</span>
    </button>

    <!-- 最後ページへのボタン -->
    <button
      class="pagination-btn last"
      @click="goToLastPage"
      :disabled="currentPage === totalPages"
    >
      <span class="btn-text">最後</span> <span>»</span>
    </button>
  </div>
</template>

<script>
export default {
  name: "BlogPagination",
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
  },
  computed: {
    displayedPages() {
      // 表示するページ番号を計算
      const pages = [];
      const maxDisplayedPages = 5; // 中央に表示するページ番号の最大数（省略記号と最終ページを除く）

      if (this.totalPages <= maxDisplayedPages + 2) {
        // 全ページ数が表示可能最大数以下の場合、全ページ番号を表示
        for (let i = 1; i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else {
        // 常に最初のページを表示
        pages.push(1);

        // 現在のページの周辺を表示
        const siblingsCount = Math.floor(maxDisplayedPages / 2);
        let start = Math.max(2, this.currentPage - siblingsCount);
        let end = Math.min(this.totalPages - 1, this.currentPage + siblingsCount);

        // 左側の省略記号が必要かどうか
        if (start > 2) {
          pages.push('ellipsis');
        }

        // 中央のページ番号を追加
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }

        // 右側の省略記号が必要かどうか
        if (end < this.totalPages - 1) {
          pages.push('ellipsis');
        }

        // 常に最後のページを表示（最後のページが既に含まれていない場合）
        if (end < this.totalPages) {
          pages.push(this.totalPages);
        }
      }

      return pages;
    },
  },
  methods: {
    goToPage(page) {
      if (page !== this.currentPage) {
        this.$emit("page-change", page);
      }
    },
    goToPrevPage() {
      if (this.currentPage > 1) {
        this.$emit("page-change", this.currentPage - 1);
      }
    },
    goToNextPage() {
      if (this.currentPage < this.totalPages) {
        this.$emit("page-change", this.currentPage + 1);
      }
    },
    // 最初ページへ移動するメソッド
    goToFirstPage() {
      if (this.currentPage !== 1) {
        this.$emit("page-change", 1);
      }
    },
    // 最後ページへ移動するメソッド
    goToLastPage() {
      if (this.currentPage !== this.totalPages) {
        this.$emit("page-change", this.totalPages);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables";

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: $spacing-xl;
  margin-bottom: $spacing-lg;
  gap: $spacing-md;
}

.pagination-btn {
  display: flex;
  align-items: center;
  padding: $spacing-sm $spacing-md;
  background: rgba(20, 20, 35, 0.7);
  color: rgba(180, 180, 255, 0.8);
  border-radius: 6px;
  font-size: $font-size-sm;
  transition: all 0.3s ease;
  border: 1px solid rgba(120, 120, 255, 0.3);
  cursor: pointer;
  font-weight: 500;
  letter-spacing: 0.5px;
  position: relative;
  box-shadow: 0 0 8px rgba(100, 100, 255, 0.15);
  overflow: hidden;

  &:hover:not(:disabled) {
    color: $color-text-light;
    border: 1px solid rgba(140, 140, 255, 0.5);
    text-shadow: 0 0 5px rgba(180, 180, 255, 0.5);
    transform: translateY(-2px);
    background-size: 400% 400%;
    background-image: linear-gradient(
      90deg,
      $color-accent-1 0%,
      $color-accent-2 30%,
      $color-accent-1 70%,
      $color-accent-2 100%
    );
    animation: gradientFlow 20s ease-in-out infinite;
    box-shadow: 0 0 15px rgba(100, 100, 255, 0.5),
      0 0 30px rgba($color-accent-1, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  span {
    margin: 0 $spacing-xs;
  }
}

.pagination-numbers {
  display: flex;
  gap: $spacing-sm;
}

.pagination-number {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(20, 20, 35, 0.7);
  color: rgba(180, 180, 255, 0.8);
  border-radius: 50%;
  font-size: $font-size-sm;
  transition: all 0.3s ease;
  border: 1px solid rgba(120, 120, 255, 0.3);
  cursor: pointer;
  position: relative;
  box-shadow: 0 0 8px rgba(100, 100, 255, 0.15);

  &:hover:not(.active) {
    color: rgba(210, 210, 255, 1);
    border-color: rgba(140, 140, 255, 0.5);
    box-shadow: 0 0 12px rgba(120, 120, 255, 0.3);
    text-shadow: 0 0 5px rgba(180, 180, 255, 0.5);
    transform: translateY(-2px);
  }

  &.active {
    color: $color-text-light;
    border: 1px solid rgba(140, 200, 255, 0.6);
    text-shadow: 0 0 8px rgba(200, 220, 255, 0.8);
    background-size: 400% 400%;
    background-image: linear-gradient(
      90deg,
      $color-accent-1 0%,
      $color-accent-2 30%,
      $color-accent-1 70%,
      $color-accent-2 100%
    );
    animation: gradientFlow 20s ease-in-out infinite;
    box-shadow: 0 0 10px rgba(100, 150, 255, 0.5),
      0 0 20px rgba($color-accent-2, 0.3),
      inset 0 0 10px rgba(100, 150, 255, 0.3);
    font-weight: 600;
  }
}

.pagination-ellipsis {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(180, 180, 255, 0.8);
  font-size: $font-size-md;
  font-weight: bold;
}

@keyframes gradientFlow {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@media (max-width: $breakpoint-md) {
  .pagination {
    flex-wrap: wrap;
    gap: $spacing-sm;
  }

  .pagination-numbers {
    order: 1;
    width: 100%;
    justify-content: center;
    margin: $spacing-sm 0;
  }

  .pagination-btn {
    min-width: 44px;
    justify-content: center;
  }
}

@media (max-width: $breakpoint-sm) {
  .pagination {
    margin-top: $spacing-md;
  }

  .pagination-btn {
    padding: $spacing-sm;
    min-width: 48px;
    min-height: 48px;
    font-size: $font-size-sm;
  }

  .btn-text {
    display: none;
  }

  .pagination-number {
    width: 40px;
    height: 40px;
    font-size: $font-size-sm;
  }

  .pagination-ellipsis {
    width: 40px;
    height: 40px;
  }
}
</style>
