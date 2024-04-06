import { authPwdLogin } from "@/apis/auth";
import { getTourCollection, getTourCollectionsByUserId } from "@/apis/collection";
import { getTourById } from "@/apis/tour";
import { getTourHighlights } from "@/apis/tour/highlight";
import { getTourSpots } from "@/apis/tour/spot";
import { checkUserExist, getUserByEmail, type QueryUserForm } from "@/apis/user";
import { createPinia, setActivePinia } from "pinia";
import { beforeAll, describe, expect, it } from "vitest";

beforeAll(()=>{
    setActivePinia(createPinia())
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
    it('Get User by Email success',async ()=>{
        const result = await getUserByEmail('walcraft@test.com')
        expect(result.success).equal(true)
        expect(result.message).equal("GET user succeed with email")
    })
    it('Get Collection By ID fail', async ()=>{
        const result = await getTourCollectionsByUserId(-1);
        expect(result.message).equal('User not found')
        expect(result.success).equal(false)
    })
    it('Get Collection By ID success', async ()=>{
        const result = await getTourCollectionsByUserId(1);
        expect(result.message).equal('Tour Collections found by user successfully!')
        expect(result.success).equal(true)
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