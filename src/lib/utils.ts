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
