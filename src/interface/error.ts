export type TErrorSources ={
    path: string | number | null
    message:string | null
}


export type TGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorSources: TErrorSources[];
};

