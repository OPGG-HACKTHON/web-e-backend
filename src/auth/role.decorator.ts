import { SetMetadata } from '@nestjs/common';

export const userRole = (type: string) => SetMetadata('role', type); //meta data 전달
