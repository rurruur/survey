import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Template, TemplateStatus } from '../entity/template.entity';
import { TemplateResolver } from './template.resolver';
import { TemplateService } from './template.service';

type MockType<T> = {
  [P in keyof T]?: jest.Mock;
};

describe('TemplateService', () => {
  let service: TemplateService;
  const customerRepositoryMock: MockType<Repository<Template>> = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TemplateService,
        TemplateResolver,
        {
          provide: getRepositoryToken(Template),
          useValue: customerRepositoryMock,
        },
      ],
    }).compile();
    service = module.get<TemplateService>(TemplateService);
  });

  it('[설문지 수정] 설문지가 대기중인 경우 수정 가능', () => {
    const template = Object.assign(new Template(), {
      title: '설문지 제목',
      status: TemplateStatus.WAITING,
    });
    customerRepositoryMock.findOneBy.mockReturnValue(template);

    expect(
      service.updateTemplate({
        id: 1,
        title: '설문지 제목 수정',
      }),
    ).resolves.toMatchObject({
      title: '설문지 제목 수정',
      status: TemplateStatus.WAITING,
    });
  });

  it('[설문지 수정] 진행중인 설문지 수정시 오류 발생', () => {
    const template = Object.assign(new Template(), {
      title: '설문지 제목',
      status: TemplateStatus.IN_PROGRESS,
    });
    customerRepositoryMock.findOneBy.mockReturnValue(template);

    expect(
      service.updateTemplate({
        id: 1,
        title: '설문지 제목 수정',
      }),
    ).rejects.toThrow(`대기중인 설문지만 수정할 수 있습니다. 현재 설문지 상태: ${template.status}`);
  });

  it('[설문지 수정] 완료된 설문지 수정시 오류 발생', () => {
    const template = Object.assign(new Template(), {
      title: '설문지 제목',
      status: TemplateStatus.COMPLETED,
    });
    customerRepositoryMock.findOneBy.mockReturnValue(template);

    expect(
      service.updateTemplate({
        id: 1,
        title: '설문지 제목 수정',
      }),
    ).rejects.toThrow(`대기중인 설문지만 수정할 수 있습니다. 현재 설문지 상태: ${template.status}`);
  });

  it('[설문지 상태 변경] 문항이 하나 이상인 대기중 설문지는 진행중으로 변경 가능', () => {
    const template = Object.assign(new Template(), {
      title: '설문지 제목',
      status: TemplateStatus.WAITING,
      questions: [{ id: 1, title: '질문 제목', description: '질문 설명' }],
    });
    customerRepositoryMock.find.mockReturnValue([template]);

    expect(service.updateTemplateStatus(1, TemplateStatus.IN_PROGRESS)).resolves.toMatchObject({
      title: '설문지 제목',
      status: TemplateStatus.IN_PROGRESS,
      questions: [{ id: 1, title: '질문 제목', description: '질문 설명' }],
    });
  });

  it('[설문지 상태 변경] 문항이 없는 대기중 설문지를 진행중으로 변경시 오류 발생', () => {
    const template = Object.assign(new Template(), {
      title: '설문지 제목',
      status: TemplateStatus.WAITING,
      questions: [],
    });
    customerRepositoryMock.find.mockReturnValue([template]);

    expect(service.updateTemplateStatus(1, TemplateStatus.IN_PROGRESS)).rejects.toThrow('설문지에 질문이 없습니다.');
  });

  it('[설문지 상태 변경] 대기중 설문지를 완료로 변경시 오류 발생', () => {
    const template = Object.assign(new Template(), {
      title: '설문지 제목',
      status: TemplateStatus.WAITING,
      questions: [{ id: 1, title: '질문 제목', description: '질문 설명' }],
    });
    customerRepositoryMock.find.mockReturnValue([template]);

    expect(service.updateTemplateStatus(1, TemplateStatus.COMPLETED)).rejects.toThrow(
      '대기중인 설문지는 완료로 변경할 수 없습니다.',
    );
  });

  it('[설문지 상태 변경] 진행중 설문지는 완료로 변경 가능', () => {
    const template = Object.assign(new Template(), {
      title: '설문지 제목',
      status: TemplateStatus.IN_PROGRESS,
      questions: [{ id: 1, title: '질문 제목', description: '질문 설명' }],
    });
    customerRepositoryMock.find.mockReturnValue([template]);

    expect(service.updateTemplateStatus(1, TemplateStatus.COMPLETED)).resolves.toMatchObject({
      title: '설문지 제목',
      status: TemplateStatus.COMPLETED,
      questions: [{ id: 1, title: '질문 제목', description: '질문 설명' }],
    });
  });

  it('[설문지 상태 변경] 진행중 설문지를 대기중으로 변경시 오류 발생', () => {
    const template = Object.assign(new Template(), {
      title: '설문지 제목',
      status: TemplateStatus.IN_PROGRESS,
      questions: [{ id: 1, title: '질문 제목', description: '질문 설명' }],
    });
    customerRepositoryMock.find.mockReturnValue([template]);

    expect(service.updateTemplateStatus(1, TemplateStatus.WAITING)).rejects.toThrow(
      '진행중인 설문지는 대기중으로 변경할 수 없습니다.',
    );
  });

  it('[설문지 상태 변경] 완료 설문지는 상태 변경시 오류 발생', () => {
    const template = Object.assign(new Template(), {
      title: '설문지 제목',
      status: TemplateStatus.COMPLETED,
      questions: [{ id: 1, title: '질문 제목', description: '질문 설명' }],
    });
    customerRepositoryMock.find.mockReturnValue([template]);

    expect(service.updateTemplateStatus(1, TemplateStatus.IN_PROGRESS)).rejects.toThrow(
      '완료된 설문지는 상태를 변경할 수 없습니다.',
    );
  });

  it('[설문지 삭제] 대기중인 설문지는 삭제 가능', () => {
    const template = Object.assign(new Template(), {
      title: '설문지 제목',
      status: TemplateStatus.WAITING,
    });
    customerRepositoryMock.findOneBy.mockReturnValue(template);

    expect(service.deleteTemplate(1)).resolves.toBeTruthy();
  });

  it('[설문지 삭제] 진행중인 설문지는 삭제시 오류 발생', () => {
    const template = Object.assign(new Template(), {
      title: '설문지 제목',
      status: TemplateStatus.IN_PROGRESS,
    });
    customerRepositoryMock.findOneBy.mockReturnValue(template);

    expect(service.deleteTemplate(1)).rejects.toThrow(
      `대기중인 설문지만 수정할 수 있습니다. 현재 설문지 상태: ${template.status}`,
    );
  });

  it('[설문지 삭제] 완료된 설문지는 삭제시 오류 발생', () => {
    const template = Object.assign(new Template(), {
      title: '설문지 제목',
      status: TemplateStatus.COMPLETED,
    });
    customerRepositoryMock.findOneBy.mockReturnValue(template);

    expect(service.deleteTemplate(1)).rejects.toThrow(
      `대기중인 설문지만 수정할 수 있습니다. 현재 설문지 상태: ${template.status}`,
    );
  });
});
