import { Revenue } from './definitions';

export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-US',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const generateYAxis = (revenue: Revenue[]) => {
  // Calculate what labels we need to display on the y-axis
  // based on highest record and in 1000s
  const yAxisLabels = [];
  const highestRecord = Math.max(...revenue.map((month) => month.revenue));
  const topLabel = Math.ceil(highestRecord / 1000) * 1000;

  for (let i = topLabel; i >= 0; i -= 1000) {
    yAxisLabels.push(`$${i / 1000}K`);
  }

  return { yAxisLabels, topLabel };
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // 만약 totalPages가 7개 이하 이면 
  // 모든 페이지를 보여준다.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // 만약 totalPages가 7개 이상이고, currentPage가 3 이하이면 
  // 처음 3개는 보여주고 나머지는 ... 마지막과 바로전은 보여준다.
  // 예시 totalPage : 8 currentPage : 3
  // 1 2 3 ... 7 8 
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  // 만약 currentPage가 마지막 3개 중에 하나라면
  // 처음 2개는 보여주고 나머지는 ... 마지막 3개를 보여준다.
  //예시 totalpage : 8 currentPage : 6
  // 1 2 ... 6 7 8
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // 모든 조건이 아닌 중간부분이면 맨처음, 마지막 1개 현재 페이지와 바로 앞 뒤 번호를 보여준다.
  //예시 totalpage : 8 currentPage : 5
  // 1 ... 4 5 6 ... 8
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};
