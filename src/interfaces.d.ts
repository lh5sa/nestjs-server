// 响应体格式
interface ResponseBodyStruct {
  success: boolean;
  msg: string;
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
