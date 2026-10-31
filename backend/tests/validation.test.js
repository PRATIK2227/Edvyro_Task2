import {describe,it,expect} from 'vitest';
import {registerSchema,loginSchema,createInternshipSchema,listSchema} from '../src/validators/schemas.js';
describe('API validation',()=>{
 it('accepts a valid student registration',()=>expect(registerSchema.safeParse({body:{name:'Aarav Student',email:'a@example.com',password:'password123',role:'student'}}).success).toBe(true));
 it('rejects weak passwords',()=>expect(registerSchema.safeParse({body:{name:'Aarav Student',email:'a@example.com',password:'123',role:'student'}}).success).toBe(false));
 it('rejects invalid login email',()=>expect(loginSchema.safeParse({body:{email:'wrong',password:'password123'}}).success).toBe(false));
 it('rejects an invalid work mode',()=>expect(createInternshipSchema.safeParse({body:{title:'Frontend Intern',company:'Acme',category:'Frontend',location:'Remote',workMode:'anywhere',description:'This is a sufficiently long job description for the validation test.',requirements:[],stipend:0,currency:'INR',duration:'3 months'}}).success).toBe(false));
 it('sets safe listing defaults',()=>expect(listSchema.parse({query:{}}).query).toMatchObject({page:1,limit:12,sort:'newest'}));
});
