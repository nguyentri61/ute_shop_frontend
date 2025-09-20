export function computeOrderTotal(order) {
  if (typeof order?.total === "number" && !Number.isNaN(order.total))
    return order.total;
  return (order.items || []).reduce((s, it) => {
    const price = it?.product?.discountPrice ?? it?.product?.price ?? 0;
    const qty = Number(it.quantity) || 0;
    return s + price * qty;
  }, 0);
}

export function totalItemsCount(order) {
  return (order.items || []).reduce(
    (s, it) => s + (Number(it.quantity) || 0),
    0
  );
}

export function formatCurrency(amount) {
  if (typeof amount !== "number") return "-";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

export function formatDate(iso) {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
