export interface ErrorResponse {
  status: number;
  statusText: string;
}

export const toErrorReponse = (res: Response): ErrorResponse => {
  return {
    status: res.status,
    statusText: res.statusText,
  };
};

export const mapUntil = <T, S>(
  arr: T[],
  callback: (value: T, index: number, array: T[]) => S,
  condFn: (value: T, index: number, array: T[]) => boolean
) => {
  const result: S[] = [];
  for (let i = 0; i < arr.length; ++i) {
    result.push(callback(arr[i], i, arr));
    if (condFn(arr[i], i, arr)) break;
  }
  return result;
};
