import { Test, TestingModule } from '@nestjs/testing';
import { PrivateAwsService } from './private-aws.service';

describe('PrivateAwsService', () => {
  let service: PrivateAwsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrivateAwsService],
    }).compile();

    service = module.get<PrivateAwsService>(PrivateAwsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
