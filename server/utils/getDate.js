const now = new Date();

export const formattedDate = now.toLocaleString('en-US', {
  weekday: 'short',    // Mon
  month: 'short',       // Aug
  day: '2-digit',      // 12
  year: 'numeric',     // 2024
  hour: '2-digit',     // 12
  minute: '2-digit',   // 34
  second: '2-digit',
  timeZone: 'Asia/Karachi',// 56
  hour12: true      // Use 24-hour format
}).replace(',', '');

export const arraysAreDifferent = (arr1, arr2) => {

  arr1 = Array.isArray(arr1) ? [...arr1] : [];
  arr2 = Array.isArray(arr2) ? [...arr2] : [];

  if (arr1.length !== arr2.length) return true;
  return arr1.some((item, index) => {

    const item1 = item?.toString() || null;
    const item2 = arr2[index]?.toString() || null;
    return item1 !== item2;
  });
};