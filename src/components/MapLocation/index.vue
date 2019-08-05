<template>
    <div class="map-page">
        <!-- 通知 -->
            <md-notice-bar
                mode="closable"
                icon="volumn"
                scrollable
                >
                为了确保您的资金安全，请设置支付密码为了确保您的资金安全，请设置支付密码为了确保您的资金安全，请设置支付密码
            </md-notice-bar>
        <div id="map"></div>
        <div class="map-tool">
            <p @click="isPopupShow = true"><svg-icon icon-class="city"/><span>{{mapData.district || '地区'}}</span></p>
            <p><svg-icon icon-class="map"/><span>地图</span></p>
            <p><svg-icon icon-class="loaction"/><span>定位</span></p>
        </div>
        <div class="map-start" style="z-index: 1009;" @click="startRun()">
            {{btnName}}
        </div>
         <md-popup
            v-model="isPopupShow"
            position="top"
            >
            <div class="map-popup">
                <md-field-item solid title="当前地址" content="">
                    <p slot="children">{{mapAddress}}</p>
                </md-field-item>
            </div>
        </md-popup>
        <!-- 开始跑步 -->
        <transition name="fadeStart">
            <div v-if="startShow" class="map-start-page" style="z-index: 1008;" :id="isStartGo? 'startGo':''">
                <div class="map-start-top">
                    <p><span>0.00</span>
                    <span>公里</span></p>
                </div>
                <div class="map-start-detail">
                    <p>
                        <span>{{timerNow}}</span>
                        <span>总计时间</span>
                    </p>
                    <p>
                        <span>0.00</span>
                        <span>总计时间</span>
                    </p>
                    <p>
                        <span>0.00</span>
                        <span>总计时间</span>
                    </p>
                </div>
                <p class="map-start-re" v-if="isStartGo">备注：</p>
                <div class="map-start-remark" v-if="!isStartGo">
                    <md-input-item
                        title="备注"
                        placeholder="备注信息"
                        is-amount
                        :maxlength="5"
                    ></md-input-item>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
import { Toast } from 'mand-mobile'
export default {
    data () {
        return {
            map: null,
            mapAddress: '',
            mapData: {},
            isPopupShow: false,
            // 轨迹
            geolocationData: [
                [113.88739, 22.55313],
                [113.88739, 22.55323],
                [113.88739, 22.55333],
                [113.88744, 22.55323],
                [113.88744, 22.55440],
            ],
            // 开始跑步
            startShow: false,
            // 跑步停止
            isStartGo: false,
            // 时间  时分秒
            timeArr: [0, 0, 0],
            btnName: '开始',
            // 定时器实例
            timerObj: null
        }
    },
    computed: {
        timerNow () {
            let timerTemp = []
            this.timeArr.forEach((item, index) => {
                if(item < 10){
                    timerTemp[index] = `0${item}`
                }else{
                    timerTemp[index] = item
                }
            })
            if(timerTemp[0] === '00'){
                return `${timerTemp[1]}: ${timerTemp[2]}`
            }
            return `${timerTemp[0]}: ${timerTemp[1]}: ${timerTemp[2]}`
        }
    },
    mounted () {
        this.createMap()
    },
    methods: {
        createMap () {
            Toast.loading('加载中...')
            let that = this
            this.map = new AMap.Map('map',{
                zoom: 11,  //设置地图显示的缩放级别
                center: [126.56092959999998, 43.920187299999995],//设置地图中心点坐标
                // layers: [new AMap.TileLayer.Satellite()],  //设置图层,可设置成包含一个或多个图层的数组
                // mapStyle: 'amap://styles/whitesmoke',  //设置地图的显示样式
                viewMode: '2D',  //设置地图模式
                lang:'zh_cn',  //设置地图语言类型
            })
            // 使用插件
            AMap.plugin('AMap.Geolocation',function(){
                let geolocation = new AMap.Geolocation({
                    enableHighAccuracy: true, // 是否使用高精度定位，默认:true
                    timeout: 10000, // 超过10秒后停止定位，默认：5s
                    buttonPosition: 'LT', // 定位按钮的停靠位置
                    buttonOffset: new window.AMap.Pixel(100, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                    zoomToAccuracy: true // 定位成功后是否自动调整地图视野到定位点
                })
                that.map.addControl(geolocation)
                geolocation.getCurrentPosition()
                // 监听定位成功或者失败
                AMap.event.addListener(geolocation, 'complete', 
                    that.localOnComplete
                    // function(data){
                    //     console.log(data.position.getLng())
                    //     console.log(data.position.getLat())
                    // }
                )
                AMap.event.addListener(geolocation,'error',function(data){
                    if(data.info === 'FAILED'){
                        Toast.failed('加载失败')
                    }
                })

            })
            // 地图加载完成
            this.map.on('complete',function(){
                console.log('地图加载成功')
            })
        },
        createTrip () {
            // Toast.loading('加载中...')
            let that = this
            // let buttonDom = document.getElementById('buttonDom')
            this.map = new window.AMap.Map('map', {
                resizeEnable: true, // 是否监控地图容器尺寸变化
                // mapStyle: 'amap://styles/light', // 设置地图的显示样式
                zoom: 11, // 初始化地图层级
                // viewMode: '3D', // 地图模式
                // pitch: 75, // 地图俯仰角度，有效范围 0 度- 83 度
                center: [126.56092959999998, 43.920187299999995] // 初始地图中心点
            })
            this.map.plugin(['AMap.Geolocation', 'AMap.ControlBar'], function () {
                var geolocation = new window.AMap.Geolocation({
                enableHighAccuracy: true, // 是否使用高精度定位，默认:true
                timeout: 10000, // 超过10秒后停止定位，默认：5s
                buttonPosition: 'LT', // 定位按钮的停靠位置
                // buttonDom: buttonDom,
                buttonOffset: new window.AMap.Pixel(100, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                zoomToAccuracy: true // 定位成功后是否自动调整地图视野到定位点
                })
                // 定位插件---------------------------------------------------------
                that.map.addControl(geolocation)
                geolocation.getCurrentPosition(function (status, result) {
                // Toast.hide()
                })
                // geolocation.getLocalCity()
                window.AMap.event.addListener(
                geolocation,
                'complete',
                that.localOnComplete
                ) // 返回定位信息
                window.AMap.event.addListener(geolocation, 'error', that.localOnError) // 返回定位出错信息
                // 罗盘插件---------------------------------------------------------
                that.map.addControl(new window.AMap.ControlBar())
            })
            this.map.on('complete', function () {
                // 地图图块加载完成后触发
                console.log('地图加载完成')
            })
        },
        // 定位u成功
        localOnComplete (e) {
            Toast.succeed('加载完成')
            console.log(e)
            this.mapAddress = e.formattedAddress
            this.mapData = e.addressComponent
            // 绘制轨迹图
            // this.mapPath()
        },
        // 手动定位失败,可以使用ip定位IP定位获取当前城市信息
        getLngLatLocation() {
            let that = this
            AMap.plugin("AMap.CitySearch", function() {
                var citySearch = new AMap.CitySearch();
                citySearch.getLocalCity(function(status, result) {
                if (status === "complete" && result.info === "OK") {
                    // 查询成功，result即为当前所在城市信息
                    console.log(result)
                    that.map.center = [result.bounds.northeast.lng,result.bounds.northeast.lat]
                }
                });
            })
        },
        // 绘制轨迹
        mapPath () {
            let pathArr = this.geolocationData.slice()
            let marker = new AMap.Marker({
                map: this.map,
                position: pathArr[0],
                icon: 'https://webapi.amap.com/images/car.png',
                offset: new window.AMap.Pixel(-26, -13),
                autoRotation: true,
                angle: -90
            })
            // 轨迹线
            let passedPolyline = new AMap.Polyline({
                map: this.map,
                // path: lineArr,
                strokeColor: 'red', // 线颜色
                // strokeOpacity: 1,     //线透明度
                strokeWeight: 6 // 线宽
                // strokeStyle: "solid"  //线样式
            })
            marker.on('moving', function (e) {
                passedPolyline.setPath(e.passedPath)
            })
            this.map.setFitView()
            marker.moveAlong(pathArr, 200)
        },
        // 开始
        startRun () {
            if(this.btnName === '开始'){
                this.startShow = true
                this.btnName = '结束'
                this.timeSwitch()
            }else if(this.btnName === '结束'){
                // this.startShow = false
                this.btnName = '退出'
                // 销毁定时器
                clearInterval(this.timerObj)
                this.isStartGo = true
                // 绘制轨迹
                this.mapPath()
            }else if(this.btnName === '退出'){
                this.$router.push({
                    path: '/trip'
                })
            }
        },
        // 时间开始计数
        timeSwitch() {
            this.timerObj = setInterval(() => {
                if(this.timeArr[2] === 59){
                    this.timeArr[2] = 0
                    this.$set(this.timeArr, 1, this.timeArr[1]+1)
                }
                if(this.timeArr[1] === 59){
                    this.timeArr[1] = 0
                    this.$set(this.timeArr, 0, this.timeArr[0]+1)
                }else{
                    this.$set(this.timeArr, 2, this.timeArr[2]+1)
                }
            }, 1000)
        }
    },
    
}
</script>
<style lang="less" scoped>
// 定义变量
@color: #555;
.map-page{
    width: 100%;
    height: 100%;
    #map{
        // 去掉左下角高德的标志
        height: calc(100% + 100px);
    }
    .map-tool{
        width: 500px;
        height: 70px;
        position: fixed;
        top: 200px;
        z-index: 9999;
        background-color: #fff;
        text-align: center;
        left: calc(50% - 250px);
        // line-height: 70px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: 7px;
        box-shadow: 0 0 10px #b6b4b4;
        p{
            width: 100%;
            text-align: center;
            // flex: 1;
            // position: relative;
            // &:nth-child(1)::after,&:nth-child(2)::after{
            //     content: '';
            //     width: 0;
            //     height: 100px;
            //     position: absolute;
            //     right: 0;
            //     border-left: 1px solid #b6b4b4;
            // }
            span{
                margin-left: 10px;
            }
            &:nth-child(1),&:nth-child(2){
                border-right: 1px solid #b6b4b4;
            }
        }
    }
    .map-start{
        position: fixed;
        z-index: 9999;
        bottom: 200px;
        left: calc(50% - 100px);
        width: 200px;
        height: 200px;
        background-color: #57c595;
        line-height: 200px;
        border-radius: 200px;
        font-size: 35px;
        color: #fff;
        font-weight: bold;
        letter-spacing: 5px;
        box-shadow: 0 10px 30px #b6b4b4;
    }
    .map-popup{
        z-index: 10000;
        min-height: 200px;
        background: #fff
    }
    .map-start-page{
        width: 100%;
        height: 100%;
        // opacity: 0.5;
        position: absolute;
        top: 0;
        z-index: 2008;
        background: hsla(0,0%,100%,.82353);
        .map-start-top{
            height: 40%;
            display: flex;
            align-items: center;
            justify-content: center;
            p{
                // margin-top: 200px;
                font-style: italic;
                font-size: 40px;
                color: @color;
                span:first-child{
                    font-size: 200px;
                    font-weight: bold;
                }
            }
        }
        .map-start-detail{
            display: flex;
            align-items: center;
            justify-content: space-around;
            // flex-direction: column;
            p{
                display: flex;
                flex-direction: column;
                font-size: 25px;
                color: @color;
                span:first-child{
                    font-size: 50px;
                    font-style: italic;
                    font-weight: bold;
                }
            }
        }
        .map-start-remark{
            margin: 100px auto;
        }
    }
}
// 跑步停止
#startGo{
    height: 40%;
    // opacity: 1;
    background: #fff;
    box-shadow: 0 10px 30px #afaeae;
    transition: all .4s;
    .map-start-top{
        margin-top: 50px;
        p{
            font-size: 30px;
            span:first-child{
                font-size: 150px;
            }
        }
    }
    .map-start-re{
        // p{
            font-size: 25px;
            text-align: left;
            margin: 20px;
        // }
    }
}
// 进入过渡的开始状态
.fadeStart-enter{
    transform: translateY(-100%);
}
// 进入过渡的结束状态
.fadeStart-enter-to{
    transform: translateY(0);
}
// 进入过渡生效时的状态
.fadeStart-enter-active{
    transition: all .5s;
}
</style>
<style lang="less">
.amap-geolocation-con{
    display: none !important;
}
.md-notice-bar{
    z-index: 1 !important;
}
</style>



