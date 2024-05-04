<template>
    <div id="personal-page" class="flex-c">
        <header class="header flex-r" style="position: sticky; top: 0; z-index: 2; background-color: #f5f4ea;">
            <van-icon :size="32" name="arrow-left" @click="back"/>
            <div style="font-size: 1.5rem;">{{ $route.meta.title }}</div>
            <div v-if="route.name==='personal-tour'">
                <van-button
                    plain
                    icon="plus"
                    type="primary"
                    style="height: 32px;"
                    @click="buttonPlus"
                />
            </div>
            <div v-else>
               <van-icon :size="32" name="envelop-o" /> 
            </div>
        </header>
        <RouterView/>
        <van-dialog v-model:show="show" title="标题"
            show-cancel-button :show-confirm-button="false"
        >
            <div class="content flex-r flex-justify-c" style="max-height: 400px; gap:1rem; margin-top: 1rem;" >
                <van-button plain type="primary">From Planner</van-button>
                <van-uploader
                    v-model="GPXFile" reupload
                    style="width: 100px;"
                    :after-read="loadingGpx"
                    :preview-image="false"
                    accept="*"
                >
                    <van-button plain type="primary">From GPX</van-button>
                </van-uploader>
            </div>
        </van-dialog>
    </div>
</template>

<script lang="ts">
export default {
    name: "PersonalIndex"
}
</script>

<script setup lang="ts">
import type { UploaderFileListItem } from 'vant';
import { ref } from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const show = ref(false)
const GPXFile = ref<UploaderFileListItem[]>([])

const back = ()=>{
    router.back();
}
const buttonPlus = ()=>{
    show.value = true;
}
const handleGPX = (theFile: File) => {
    const reader = new FileReader()
    reader.readAsText(theFile)
    reader.onload = () => {
      // 读取gpx文件为DOM
      const paser = new DOMParser()
      const res = paser.parseFromString(reader.result as string, 'text/xml')
      console.log(res)
      const creator = res.getElementsByTagName('gpx').item(0)?.getAttribute('creator')
      const pos = []
      const result = {
        origin: [] as any[],
        destination:[] as any[],
        routes:{
            steps: [{
                path:[] as any[]
            }]
        }
      }
      if(creator==='walcraft'){
        const trkseg = res.getElementsByTagName('trkseg').item(0);
        if(!trkseg){
            return;
        }
        const elements = trkseg.children;
        for(let i=0;i<elements.length;i++){
            const ele = elements.item(i);
            if(!ele){continue;}
            if(ele.tagName==='trkpt'){
                const wpts = ele.getElementsByTagName('wpt')
                for(let j=0;j<wpts.length;j++){
                    if(wpts.item(j)){
                        pos.push(
                            [wpts[j].getAttribute('lon'), wpts[j].getAttribute('lat')]
                        )
                        result.routes.steps[0].path.push(
                            [wpts[j].getAttribute('lon'), wpts[j].getAttribute('lat')]
                        )
                    }
                }
            }else if(ele.tagName==='extensions'){
                const wpts = ele.getElementsByTagName('wpt')
                pos.unshift([
                    wpts[0].getAttribute('lon'), wpts[0].getAttribute('lat')
                ])
                result.origin = [
                    wpts[0].getAttribute('lon'), wpts[0].getAttribute('lat')
                ]
                pos.push([
                    wpts[wpts.length-1].getAttribute('lon'), wpts[wpts.length-1].getAttribute('lat')
                ])
                result.destination = [
                    wpts[wpts.length-1].getAttribute('lon'), wpts[wpts.length-1].getAttribute('lat')
                ]
            }
        }
        console.log(result)
      }else{
        const tracks = res.getElementsByTagName('trkpt')
        const times = res.getElementsByTagName('totalTime')
        const distances = res.getElementsByTagName('totalDistance')
        const time = times.item(0)?.innerHTML
        const distance = distances.item(0)?.innerHTML
        // 摘取经纬度
        for (let i = 0; i < tracks.length; i++) {
            if (tracks.item(i)) {
              pos.push([tracks[i].getAttribute('lon'), tracks.item(i)?.getAttribute('lat')])
              if(i===0){
                result.origin = [tracks[i].getAttribute('lon'), tracks.item(i)?.getAttribute('lat')];
              }else if(i===tracks.length-1){
                result.destination = [tracks[i].getAttribute('lon'), tracks.item(i)?.getAttribute('lat')];
              }else{
                result.routes.steps[0].path.push(
                    [tracks[i].getAttribute('lon'), tracks.item(i)?.getAttribute('lat')]
                )
              }
            }
        }
          console.log(result)
      }
    }
}
const loadingGpx = ()=>{
    if(GPXFile.value.length!==1 || !GPXFile.value[0].file){
        return;
    }
    handleGPX(GPXFile.value[0].file)
}
</script>