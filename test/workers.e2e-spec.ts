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
import { eq } from 'drizzle-orm';
import { faker } from '@faker-js/faker';

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
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
      };

      return request(app.getHttpServer())
        .post('/workers')
        .send(worker)
        .expect(201)
        .expect(async (response) => {
          expect(response.body.id).toBeDefined();
          const workerId = response.body.id;

          const record = await db.query.WorkersTable.findFirst({
            where: eq(schema.WorkersTable.id, workerId),
          });
          expect(record).toMatchObject({
            ...worker,
            id: workerId,
            isActive: true,
          });
        });
    });

    // TODO handle error in api
    it('should fail to create a Worker', () => {
      const worker = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
      };

      return request(app.getHttpServer())
        .post('/workers')
        .send(worker)
        .expect(500);
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
      const worker: CreateWorkerDto = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
      };

      await db.insert(schema.WorkersTable).values(worker);

      return request(app.getHttpServer())
        .get('/workers')
        .expect(200)
        .expect((response) => {
          expect(response.body.data).toMatchObject([
            {
              ...worker,
              isActive: true,
            },
          ]);
          expect(response.body.total).toBe(1);
        });
    });

    it('should get worker by id', async () => {
      const worker: CreateWorkerDto = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
      };

      const created = await db
        .insert(schema.WorkersTable)
        .values(worker)
        .returning({ id: schema.WorkersTable.id });

      const id = created[0].id;

      return request(app.getHttpServer())
        .get(`/workers/${id}`)
        .expect(200)
        .expect((response) => {
          expect(response.body).toMatchObject({
            ...worker,
            id,
            isActive: true,
          });
        });
    });

    it('should fail to get worker by id', () => {
      const id = faker.string.uuid();

      return request(app.getHttpServer()).get(`/workers/${id}`).expect(404);
    });
  });

  describe('PATCH', () => {
    it('should update a worker', async () => {
      const worker: CreateWorkerDto = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
      };

      const created = await db
        .insert(schema.WorkersTable)
        .values(worker)
        .returning({ id: schema.WorkersTable.id });

      const id = created[0].id;

      const updatedEmail = faker.internet.email();

      return await request(app.getHttpServer())
        .patch(`/workers/${id}`)
        .send({ ...worker, email: updatedEmail })
        .expect(200)
        .expect(async (_) => {
          const records = await db
            .select({ email: schema.WorkersTable.email })
            .from(schema.WorkersTable)
            .where(eq(schema.WorkersTable.id, id));

          expect(records.length).toBe(1);

          const recordEmail = records[0].email;
          expect(recordEmail).toBe(updatedEmail);
        });
    });
  });

  describe('DELETE', () => {
    it('should delete a worker', async () => {
      const worker: CreateWorkerDto = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
      };

      const created = await db
        .insert(schema.WorkersTable)
        .values(worker)
        .returning({ id: schema.WorkersTable.id });

      const id = created[0].id;

      return request(app.getHttpServer()).delete(`/workers/${id}`).expect(204);
    });

    it('should fail to delete a worker', () => {
      const id = faker.string.uuid();

      return request(app.getHttpServer()).delete(`/workers/${id}`).expect(404);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
