/**
 * 日本標準時（JST）で現在のタイムスタンプをISO 8601形式で取得します。
 * @returns JSTタイムスタンプ（例: "2024-01-20T03:11:20+09:00"）
 */
export const getJstTimestamp = (): string => {
  const now = new Date();

  // 各部分をJSTタイムゾーンで取得
  const year = now.toLocaleString("en", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
  });
  const month = now.toLocaleString("en", {
    timeZone: "Asia/Tokyo",
    month: "2-digit",
  });
  const day = now.toLocaleString("en", {
    timeZone: "Asia/Tokyo",
    day: "2-digit",
  });
  const hour = now.toLocaleString("en", {
    timeZone: "Asia/Tokyo",
    hour: "2-digit",
    hour12: false,
  });
  const minute = now.toLocaleString("en", {
    timeZone: "Asia/Tokyo",
    minute: "2-digit",
  });
  const second = now.toLocaleString("en", {
    timeZone: "Asia/Tokyo",
    second: "2-digit",
  });

  // ISO 8601形式の文字列に整形
  const timestamp = `${year}-${month}-${day}T${hour}:${minute}:${second}+09:00`;
  return timestamp;
};
