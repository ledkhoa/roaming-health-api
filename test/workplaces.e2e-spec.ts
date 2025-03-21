import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PGlite } from '@electric-sql/pglite';
import { drizzle, PgliteDatabase } from 'drizzle-orm/pglite';
import * as schema from 'src/drizzle/schema';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { migrate } from 'drizzle-orm/pglite/migrator';
import { eq } from 'drizzle-orm';
import { faker } from '@faker-js/faker';
import { CreateWorkplaceDto } from 'src/workplaces/dto/create-workplace.dto';

describe('Workplaces (e2e)', () => {
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

    await db.delete(schema.WorkplacesTable);
  });

  describe('POST', () => {
    it('should create a workplace', () => {
      const workplace: CreateWorkplaceDto = {
        name: faker.company.name(),
        address1: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state().substring(0, 12),
        zip: faker.location.zipCode('#####'),
        isActive: true,
      };

      return request(app.getHttpServer())
        .post('/workplaces')
        .send(workplace)
        .expect(201)
        .expect(async (response) => {
          expect(response.body.id).toBeDefined();
          const workplaceId = response.body.id;

          const record = await db.query.WorkplacesTable.findFirst({
            where: eq(schema.WorkplacesTable.id, workplaceId),
          });
          expect(record).toMatchObject({
            ...workplace,
            id: workplaceId,
          });
        });
    });

    it('should fail to create a workplace without required property', () => {
      const workplace = {
        name: faker.company.name(),
        city: faker.location.city(),
        state: faker.location.state().substring(0, 12).substring(0, 12),
        zip: faker.location.zipCode('#####'),
        isActive: true,
      };

      return request(app.getHttpServer())
        .post('/workplaces')
        .send(workplace)
        .expect(400)
        .expect((response) => {
          expect(response.body.message).toContain("Required: 'address1'");
        });
    });
  });

  describe('GET', () => {
    it('should return no workplaces', () => {
      return request(app.getHttpServer())
        .get('/workplaces')
        .expect(200)
        .expect({ data: [], total: 0 });
    });

    it('should get all workplaces', async () => {
      const workplace1: CreateWorkplaceDto = {
        name: `1 - ${faker.company.name()}`,
        address1: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state().substring(0, 12),
        zip: faker.location.zipCode('#####'),
        isActive: true,
      };

      const workplace2: CreateWorkplaceDto = {
        name: `2 - ${faker.company.name()}`,
        address1: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state().substring(0, 12),
        zip: faker.location.zipCode('#####'),
        isActive: true,
      };

      await db.insert(schema.WorkplacesTable).values([workplace1, workplace2]);

      return request(app.getHttpServer())
        .get('/workplaces')
        .expect(200)
        .expect((response) => {
          expect(response.body.data).toMatchObject([workplace1, workplace2]);
          expect(response.body.total).toBe(2);
        });
    });

    it('should get workplace by id', async () => {
      const workplace: CreateWorkplaceDto = {
        name: faker.company.name(),
        address1: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state().substring(0, 12),
        zip: faker.location.zipCode('#####'),
        isActive: true,
      };

      const created = await db
        .insert(schema.WorkplacesTable)
        .values(workplace)
        .returning({ id: schema.WorkplacesTable.id });

      const id = created[0].id;

      return request(app.getHttpServer())
        .get(`/workplaces/${id}`)
        .expect(200)
        .expect((response) => {
          expect(response.body).toMatchObject({
            ...workplace,
            id,
          });
        });
    });

    it("should not find workplace if id doesn't exist", () => {
      const id = faker.string.uuid();

      return request(app.getHttpServer()).get(`/workplaces/${id}`).expect(404);
    });

    it('should fail with invalid id', () => {
      const id = 'invalid-uuid';

      return request(app.getHttpServer())
        .get(`/workplaces/${id}`)
        .expect(400)
        .expect((response) => {
          expect(response.body.message).toBe(
            'Validation failed (uuid is expected)',
          );
        });
    });
  });

  describe('PATCH', () => {
    it('should update a workplace', async () => {
      const workplace: CreateWorkplaceDto = {
        name: faker.company.name(),
        address1: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state().substring(0, 12),
        zip: faker.location.zipCode('#####'),
        isActive: true,
      };

      const created = await db
        .insert(schema.WorkplacesTable)
        .values(workplace)
        .returning({ id: schema.WorkplacesTable.id });

      const id = created[0].id;

      const address2 = faker.location.streetAddress();

      return await request(app.getHttpServer())
        .patch(`/workplaces/${id}`)
        .send({ ...workplace, address2 })
        .expect(200)
        .expect(async (_) => {
          const records = await db
            .select({ address2: schema.WorkplacesTable.address2 })
            .from(schema.WorkplacesTable)
            .where(eq(schema.WorkplacesTable.id, id));

          expect(records.length).toBe(1);

          const recordAddress2 = records[0].address2;
          expect(recordAddress2).toBe(address2);
        });
    });

    it('should fail to update a workplace without required property', () => {
      const id = faker.string.uuid();

      const workplace = {
        name: faker.company.name(),
        address1: faker.location.streetAddress(),
        city: faker.location.city(),
        zip: faker.location.zipCode('#####'),
        isActive: true,
      };

      return request(app.getHttpServer())
        .patch(`/workplaces/${id}`)
        .send(workplace)
        .expect(400)
        .expect((response) => {
          expect(response.body.message).toContain("Required: 'state'");
        });
    });

    it('should fail with invalid id', () => {
      const id = 'invalid-uuid';

      const workplace = {
        name: faker.company.name(),
        address1: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state().substring(0, 12),
        zip: faker.location.zipCode('#####'),
        isActive: true,
      };

      return request(app.getHttpServer())
        .patch(`/workplaces/${id}`)
        .send(workplace)
        .expect(400)
        .expect((response) => {
          expect(response.body.message).toBe(
            'Validation failed (uuid is expected)',
          );
        });
    });
  });

  describe('DELETE', () => {
    it('should delete a workplace', async () => {
      const workplace: CreateWorkplaceDto = {
        name: faker.company.name(),
        address1: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state().substring(0, 12),
        zip: faker.location.zipCode('#####'),
        isActive: true,
      };

      const created = await db
        .insert(schema.WorkplacesTable)
        .values(workplace)
        .returning({ id: schema.WorkplacesTable.id });

      const id = created[0].id;

      return request(app.getHttpServer())
        .delete(`/workplaces/${id}`)
        .expect(204);
    });

    it("should fail to delete a workplace if id doesn't exist", () => {
      const id = faker.string.uuid();

      return request(app.getHttpServer())
        .delete(`/workplaces/${id}`)
        .expect(404);
    });

    it('should fail with invalid id', () => {
      const id = 'invalid-uuid';

      return request(app.getHttpServer())
        .delete(`/workplaces/${id}`)
        .expect(400)
        .expect((response) => {
          expect(response.body.message).toBe(
            'Validation failed (uuid is expected)',
          );
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
