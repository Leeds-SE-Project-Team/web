import { authPwdLogin } from "@/apis/auth";
import { getCollectionByUser, getTourCollection } from "@/apis/collection";
import { getAllCreatedGroupsByUser, getAllGroups, getAllJoinedGroupsByUser } from "@/apis/group";
import { getAllGroupCollection } from "@/apis/groupCollection";
import { getTourById } from "@/apis/tour";
import { getTourHighlights } from "@/apis/tour/highlight";
import { getTourSpots } from "@/apis/tour/spot";
import { checkUserExist, getUserByEmail, type QueryUserForm } from "@/apis/user";
import pinia, { useAuthStore } from "@/stores";
import { mount } from "@vue/test-utils";
import { MD5 } from "crypto-js";
import { setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";

beforeEach(()=>{
    setActivePinia(pinia)
})

describe('Data Function Test', ()=>{
    it('Login success',async ()=>{
        const result = await authPwdLogin({email:'aft@test.com',password: MD5('147852').toString()});
        useAuthStore().refreshAccessToken(result.data!)
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
    it('Get Collection', async()=>{
        const result = await getTourCollection()
        expect(result.success).equal(true)
        expect(result.message).equal('Get all tour collections')
    })
    it('Get User Collection', async()=>{
        const result = await getCollectionByUser()
        expect(result.success).equal(true)
        expect(result.data).instanceof(Array)
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
    it('Get Groups', async()=>{
        const result = await getAllGroups()
        expect(result.success).equal(true)
        expect(result.data).instanceof(Array)
    })
    it('Get Joined Group', async()=>{
        const result = await getAllJoinedGroupsByUser()
        expect(result.success).equal(true)
    })
    it('Get Created Group', async()=>{
        const result = await getAllCreatedGroupsByUser()
        expect(result.success).equal(true)
        expect(result.data).instanceof(Array)
    })
    it('Get All Group Collection',async()=>{
        const result = await getAllGroupCollection()
        expect(result.success).equal(true)
        expect(result.data).instanceof(Array)
    })
})