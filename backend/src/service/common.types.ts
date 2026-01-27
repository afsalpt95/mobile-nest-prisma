export class SuccessResponseDto {
  success: boolean;
  message: string;
  statusCode: number;
}

export class successFetchReponseDto {
  success: boolean;
  statusCode: number;
  data: any[];

  pagination?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}


export class SuccessObjectResponseDto {
  success: boolean;
  statusCode: number;
  data: Record<string, any>;
}

