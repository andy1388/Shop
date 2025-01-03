class ToastService {
  private static container: HTMLDivElement | null = null;

  private static init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  }

  static show(message: string, type: 'success' | 'error' = 'success') {
    this.init();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div class="toast-icon">
        ${type === 'success' ? '✓' : '⚠'}
      </div>
      <div class="toast-message">${message}</div>
    `;

    this.container?.appendChild(toast);

    // 添加進入動畫
    requestAnimationFrame(() => {
      toast.style.animation = 'slideIn 0.3s ease-out forwards';
    });

    // 3秒後開始退出動畫
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-out forwards';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }
}

export default ToastService; 