import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { BadRequestException } from '@nestjs/common';

export const createMemoryFileInterceptor = (
  fieldName: string,
  options?: { allowedMimeTypes?: RegExp },
) => {
  return FileInterceptor(fieldName, {
    storage: memoryStorage(),

    fileFilter: (req, file, cb) => {
      const allowed = options?.allowedMimeTypes;

      // if regex provided → validate
      if (allowed && !allowed.test(file.mimetype)) {
        return cb(
          new BadRequestException(
            `Invalid file type: ${file.mimetype}`,
          ),
          false,
        );
      }

      cb(null, true);
    },
  });
};
