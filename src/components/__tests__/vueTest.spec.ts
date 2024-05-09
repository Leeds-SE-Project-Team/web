import pinia from "@/stores";
import LoginView from "@/views/both/login/LoginView.vue";
import { mount } from "@vue/test-utils";
import { setActivePinia } from "pinia";
import { beforeAll, describe, expect, it } from "vitest";

beforeAll(()=>{
    setActivePinia(pinia)
})

describe('Vue Components', ()=>{
    it('vue',async()=>{
        const wrapper = mount(LoginView,{
            props: {
                loginEmail: '12313'
            }
        })
        expect(wrapper.find('a-tag').text()).eq('12313')
    })
})