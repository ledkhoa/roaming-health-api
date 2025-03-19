import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { CreateWorkerDto } from 'src/workers/dto/create-worker.dto';
import { PGlite } from '@electric-sql/pglite';
import { drizzle, PgliteDatabase } from 'drizzle-orm/pglite';
import * as schema from 'src/drizzle/schema';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { migrate } from 'drizzle-orm/pglite/migrator';

describe('Workers (e2e)', () => {
  let app: INestApplication<App>;
  let drizzleMock: DrizzleService;
  let db: PgliteDatabase<typeof schema>;

  beforeAll(async () => {
    const client = new PGlite();
    db = drizzle(client, { schema });
    drizzleMock = {
      client: client as any,
      db: db as any,
    };

    await migrate(db, { migrationsFolder: './src/drizzle/migrations' });
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DrizzleService)
      .useValue(drizzleMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    jest.clearAllMocks();

    await db.delete(schema.WorkersTable);
  });

  describe('POST', () => {
    it('should create a Worker', () => {
      const worker: CreateWorkerDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@email.com',
      };

      return request(app.getHttpServer())
        .post('/workers')
        .send(worker)
        .expect(201)
        .expect((response) => {
          expect(response.body).toMatchObject({ ...worker, isActive: true });
        });
    });
  });

  describe('GET', () => {
    it('should return no workers', () => {
      return request(app.getHttpServer())
        .get('/workers')
        .expect(200)
        .expect({ data: [], total: 0 });
    });

    it('should return 1 worker', async () => {
      await db.insert(schema.WorkersTable).values({
        firstName: 'jayne',
        lastName: 'doe',
        email: 'jaynedoe@email.com',
      });

      return request(app.getHttpServer())
        .get('/workers')
        .expect(200)
        .expect((response) => {
          expect(response.body.data).toMatchObject([
            {
              firstName: 'jayne',
              lastName: 'doe',
              email: 'jaynedoe@email.com',
              isActive: true,
            },
          ]);
          expect(response.body.total).toBe(1);
        });
    });

    // it('should get worker by id', () => {
    //   const id = 'df35af14-f973-4552-9363-4297155418c4';

    //   const result = request(app.getHttpServer()).get(`/workers/${id}`);
    //   return result.expect(200).expect((response) => {
    //     expect(response.body).toEqual({});
    //   });
    // });
  });

  afterAll(async () => {
    await app.close();
  });
});
