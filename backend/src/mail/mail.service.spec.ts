import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { MailerService } from '@nestjs-modules/mailer'; // 导入 MailerService 类型

describe('MailService', () => {
  let service: MailService;
  let mockMailerService: Partial<MailerService>; // 创建一个 MailerService 的 mock 对象

  beforeEach(async () => {
    // 初始化 mockMailerService 的 sendMail 方法
    mockMailerService = {
      sendMail: jest.fn().mockResolvedValue(true), // 这里模拟 sendMail 方法总是成功
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        { provide: MailerService, useValue: mockMailerService }, // 使用 mock 对象替代真实的 MailerService
      ],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendAccountConfirmation', () => {
    it('should send mail', async () => {
      const account = {
        username: 'test',
        email: 'test@test.com',
      };

      await service.sendAccountConfirmation(account);

      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        to: 'test@test.com',
        subject: 'Welcome to Nice App! Confirm Your Email',
        template: './template/confirmation',
        context: {
          name: 'test',
          email: 'test@test.com',
        },
      });
    });
  });
});
