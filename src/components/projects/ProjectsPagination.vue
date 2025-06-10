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
  name: "ProjectsPagination",
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
  background: rgba($color-secondary, 0.7);
  color: $color-text-secondary;
  border-radius: 5px;
  font-size: $font-size-sm;
  transition: all $transition-normal ease;
  border: 1px solid rgba($color-accent-2, 0.1);
  cursor: pointer;
  filter: brightness(95%);

  &:hover:not(:disabled) {
    background-size: 400% 400%;
    background-image: linear-gradient(
      90deg,
      $color-accent-2 0%,
      $color-accent-1 25%,
      $color-accent-2 50%,
      $color-accent-1 75%,
      $color-accent-2 100%
    );
    animation: gradientFlow 12s ease-in-out infinite;
    color: $color-text-primary;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  span {
    margin: 0 $spacing-sm;
  }
}

.pagination-numbers {
  display: flex;
  gap: $spacing-sm;
  align-items: center;
}

.pagination-number {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba($color-secondary, 0.7);
  color: $color-text-secondary;
  border-radius: 50%;
  font-size: $font-size-sm;
  transition: all $transition-normal ease;
  border: 1px solid rgba($color-accent-2, 0.1);
  cursor: pointer;

  &:hover:not(.active) {
    background-size: 400% 400%;
    background-image: linear-gradient(
      90deg,
      $color-accent-2 0%,
      $color-accent-1 25%,
      $color-accent-2 50%,
      $color-accent-1 75%,
      $color-accent-2 100%
    );
    animation: gradientFlow 12s ease-in-out infinite;
    color: $color-text-primary;
    transform: translateY(-2px);
  }

  &.active {
    background-size: 400% 400%;
    background-image: linear-gradient(
      90deg,
      $color-accent-2 0%,
      $color-accent-1 25%,
      $color-accent-2 50%,
      $color-accent-1 75%,
      $color-accent-2 100%
    );
    animation: gradientFlow 12s ease-in-out infinite;
    color: $color-text-primary;
    font-weight: 600;
    box-shadow: 0 3px 10px rgba($color-accent-1, 0.3);
  }
}

.pagination-ellipsis {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $color-text-secondary;
  font-size: $font-size-md;
  font-weight: bold;
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
