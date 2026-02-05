import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { createMemoryFileInterceptor } from './upload.interceptor';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('logo')
  @UseInterceptors(
    createMemoryFileInterceptor('file', {
      allowedMimeTypes: /\/(jpg|jpeg|png|gif|webp)$/, // only allow images
    }),
  )
  async uploadLogo(@UploadedFile() file: Express.Multer.File) {
    if (!file || !file.buffer) {
      throw new BadRequestException('No file uploaded');
    }

    return this.uploadService.uploadFileBuffer(file.buffer, file.originalname, {
      folder: 'mobile_files', // Cloudinary folder
      resource_type: 'image',
    });
  }
}
