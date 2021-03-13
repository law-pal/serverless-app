import { CreateSignedURLRequest } from '../requests/CreateSignedUrl';
import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';

const XrayAWS = AWSXRay.captureAWS(AWS);

export default class TodoStore {
  constructor(
    private readonly s3 = new XrayAWS.S3({ signatureVersion: 'v4' }),
    private readonly storeTodos = process.env.S3_BUCKET
  ) { }

  getBucketName() {
    return this.storeTodos;
  }

  getPresignedUploadURL(createSignedUrlRequest: CreateSignedURLRequest) {
    return this.s3.getSignedUrl('putObject', createSignedUrlRequest);
  }
}