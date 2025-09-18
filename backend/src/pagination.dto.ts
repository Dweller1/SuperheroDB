export class PaginationDto {
  page: number = 1;
  limit: number = 5;
  search?: string;
}

export class PaginationResponseDto<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
