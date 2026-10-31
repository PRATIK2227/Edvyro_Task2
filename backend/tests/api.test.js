import {describe,it,expect} from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
describe('API HTTP contract',()=>{
 it('returns API metadata',async()=>{const r=await request(app).get('/');expect(r.status).toBe(200);expect(r.body.name).toBe('CareerConnect API');});
 it('returns a health response',async()=>{const r=await request(app).get('/api/v1/health');expect(r.status).toBe(200);expect(r.body.status).toBe('ok');});
 it('returns a consistent 404 for unknown paths',async()=>{const r=await request(app).get('/unknown');expect(r.status).toBe(404);expect(r.body.error.code).toBe('ROUTE_NOT_FOUND');});
 it('requires auth for private routes',async()=>{const r=await request(app).get('/api/v1/auth/me');expect(r.status).toBe(401);});
});
