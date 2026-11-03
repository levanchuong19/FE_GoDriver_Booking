import { toast } from "react-toastify";
import { getErrorMessage } from "./apiData";

const toastedErrors = new WeakSet<object>();
let deferredBatch: unknown[] = [];
let deferredTimer: ReturnType<typeof setTimeout> | null = null;

function markToasted(error: unknown) {
  if (error && typeof error === "object") {
    toastedErrors.add(error);
  }
}

/** Đánh dấu lỗi đã xử lý (vd. overview gộp toast) để interceptor không toast lại. */
export function suppressErrorToast(error: unknown) {
  markToasted(error);
}

function wasToasted(error: unknown) {
  return Boolean(
    error && typeof error === "object" && toastedErrors.has(error)
  );
}

/**
 * Toast lỗi màu đỏ. Dùng cho mọi lỗi trên dashboard.
 * Truyền Error/axios error hoặc chuỗi. Tránh toast trùng khi interceptor + page cùng bắt.
 */
export function notifyError(
  errorOrMessage: unknown,
  fallback = "Đã xảy ra lỗi"
) {
  if (wasToasted(errorOrMessage)) return;

  const msg =
    typeof errorOrMessage === "string"
      ? errorOrMessage
      : getErrorMessage(errorOrMessage, fallback);

  markToasted(errorOrMessage);

  toast.error(msg || fallback, {
    toastId: `err-${msg || fallback}`,
    autoClose: 5000,
    theme: "colored",
  });
}

/**
 * Toast từ axios interceptor: đợi page catch (sync) toast trước;
 * nếu nhiều API lỗi song song mà page không bắt → gộp 1 toast.
 */
export function notifyErrorDeferred(
  error: unknown,
  fallback = "Đã xảy ra lỗi"
) {
  deferredBatch.push(error);
  if (deferredTimer) return;

  deferredTimer = setTimeout(() => {
    const batch = deferredBatch;
    deferredBatch = [];
    deferredTimer = null;

    const fresh = batch.filter((item) => !wasToasted(item));
    if (!fresh.length) return;

    if (fresh.length === 1) {
      notifyError(fresh[0], fallback);
      return;
    }

    fresh.forEach(markToasted);
    toast.error(
      `Có ${fresh.length} lỗi khi tải dữ liệu. Vui lòng thử lại.`,
      {
        toastId: "err-batch",
        autoClose: 6000,
        theme: "colored",
      }
    );
  }, 120);
}

export function notifySuccess(message: string) {
  toast.success(message, {
    toastId: `ok-${message}`,
    autoClose: 3000,
    theme: "colored",
  });
}

export function notifyWarning(message: string) {
  toast.warning(message, {
    toastId: `warn-${message}`,
    autoClose: 4000,
    theme: "colored",
  });
}
