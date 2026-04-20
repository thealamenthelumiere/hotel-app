import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly endpoint: string;

  constructor(private readonly configService: ConfigService) {
    this.endpoint =
      this.configService.get<string>('S3_ENDPOINT') ??
      'https://storage.yandexcloud.net';
    this.bucket = this.configService.get<string>('S3_BUCKET') ?? '';

    this.s3 = new S3Client({
      endpoint: this.endpoint,
      region: this.configService.get<string>('S3_REGION') ?? 'ru-central1',
      credentials: {
        accessKeyId: this.configService.get<string>('S3_ACCESS_KEY') ?? '',
        secretAccessKey:
          this.configService.get<string>('S3_SECRET_KEY') ?? '',
      },
    });
  }

  async upload(
    key: string,
    buffer: Buffer,
    mimetype: string,
  ): Promise<string> {
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: mimetype,
        ACL: 'public-read' as any,
      }),
    );
    const url = `${this.endpoint}/${this.bucket}/${key}`;
    this.logger.log(`Файл загружен: ${url}`);
    return url;
  }
}
