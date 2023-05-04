// 响应体格式
interface ResponseBodyContent {
  success: boolean;
  status_code: number;
  message: string;
  data: any;
}

// 分页数据格式
interface PaginateData {
  page: number;
  size: number;
}

// 搜索内容数据格式
interface SearchData {
  type: number;
  content: string;
}
