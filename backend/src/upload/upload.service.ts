// upload.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import cloudinary from '../config/cloudinay.config';

@Injectable()
export class UploadService {
  async uploadFileBuffer(
    fileBuffer: Buffer,
    filename: string,
    options?: { folder?: string; resource_type?: 'image' | 'raw' },
  ): Promise<{ url: string }> {

     //  remove extension
  const nameWithoutExt = filename.split('.').slice(0, -1).join('.') || filename;

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: options?.folder || 'uploads',
          resource_type: options?.resource_type || 'image',
          public_id: `${Date.now()}-${nameWithoutExt}`,

          fetch_format: 'auto',
          quality: 'auto',
        },
        (error, result) => {
          if (error) return reject(new BadRequestException('Upload failed'));
          if (!result || !result.secure_url)
            return reject(
              new BadRequestException('No URL returned from Cloudinary'),
            );

          resolve({ url: result.secure_url });
        },
      );

      uploadStream.end(fileBuffer); // send the buffer to Cloudinary
    });
  }
}
