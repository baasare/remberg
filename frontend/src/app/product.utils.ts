export function getRequestParams(pageIndex: number, pageSize: number, searchTitle: string,) {
  let params = {} as any;


  if (searchTitle) {
    params[`name`] = searchTitle;
  }

  if (pageIndex) {
    params[`pageIndex`] = pageIndex;
  }

  if (pageSize) {
    params[`pageSize`] = pageSize;
  }

  return params;
}
