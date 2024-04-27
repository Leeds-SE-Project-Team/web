<script lang="ts">
export default {
  name: 'personalProfile'
}
</script>

<template>
    <div id="personal-profile">
        <div class="profile-head">
            <img src="https://file.wmzspace.space/user/default/avatar/avatar.jpg" alt="">
        </div>
        <div class="name">
            George Xiang
        </div>
        <div class="profile-des">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Maiores qui eaque deserunt totam eveniet labore.
        </div>

        
        <div class="profile-detail">
            <a-divider />
            <div class="detail">
                <div>
                    <icon-pen-fill />
                    <div>MAIL</div>
                </div>
                
                <div>
                    <icon-to-right />
                    <div>60 KG</div>
                </div>
                <div>
                    <icon-to-top />
                    <div>180 CM</div>
                </div>
                <div>
                    <icon-star />
                    <div>23</div>
                </div>
                <div>
                    <icon-thumb-up />
                    <div>12</div>
                </div>
            </div>
            <a-divider />
        </div>
    </div>
</template>

<style lang="scss">
#personal-profile {
    margin-top: 40px;
    padding-top: 20px;
    padding-bottom: 20px;
    background-color: #fff;
    position: relative;
    .profile-head{
        width: 80px;
        height: 80px;
        margin-left: calc(50% - 40px);
        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 2px solid #bebebc;
        }
    }

    .name {
        padding-top: 20px;
        width: 100%;
        text-align: center;
        color: #3b3b3b;
        font-size: 20px;
    }

    .profile-des{
        width: 100%;
        padding: 20px 20% 0 20%;
        text-align: center;
        color: #585858;
    }

    .profile-detail {
        padding: 0 10%;
        .detail {
            display: flex;
            justify-content: space-around;
        }
        .detail > div {
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 16px;
        }
    }
}
</style>

