import { authPwdLogin } from "@/apis/auth";
import { getTourCollection } from "@/apis/collection";
import { getTourById } from "@/apis/tour";
import { getTourHighlights } from "@/apis/tour/highlight";
import { getTourSpots } from "@/apis/tour/spot";
import { checkUserExist, getUserByEmail, type QueryUserForm } from "@/apis/user";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { createApp } from "vue";

beforeEach(()=>{
    const pinia = createPinia()
    setActivePinia(pinia)
    const app = createApp({});
    app.use(pinia)
})

describe('Data Function Test', ()=>{
    it('Login success',async ()=>{
        const result = await authPwdLogin({email:'walcraft@test.com',password:'123456'});
        expect(result.success).equal(true)
        expect(result.message).equal("login succeed")
    })
    it('Login fail',async ()=>{
        const result = await authPwdLogin({email:'walcraft@test.com',password:'12345'});
        expect(result.message).equal("Incorrect password")
        expect(result.success).equal(false)
    })
    it('Get User by Email fail',async ()=>{
        const result = await getUserByEmail('32')
        expect(result.success).equal(false)
    })
    it('Get User by Email fail',async ()=>{
        const result = await getUserByEmail('walcraft@test.com')
        expect(result.success).equal(false)
        expect(result.message).equal("Invalid token")
    })
    it('Get Collection', async()=>{
        const result = await getTourCollection()
        expect(result.success).equal(true)
        expect(result.message).equal('Get all tour collections')
    })
    it('Get TourHighlights', async ()=>{
        const result = await getTourHighlights()
        expect(result.success).equal(true)
        expect(result.message).equal('Get all tour highlights')
    })
    it('Get Tour Spots', async()=>{
        const result = await getTourSpots()
        expect(result.success).equal(true)
        expect(result.message).equal('Get all tour spots')
    })
    it('Get Tour By ID fail', async()=>{
        const result = await getTourById(-1)
        expect(result.message).equal('Tour not found')
        expect(result.success).equal(false)
    })
    it('Check User', async()=>{
        const form: QueryUserForm = {
            email: 'walcraft@test.com',
        }
        const result = await checkUserExist(form);
        expect(result.message).equal('GET user succeed with email');
        expect(result.success).equal(true)
    })
})