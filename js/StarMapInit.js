import * as THREE from 'three';
import { randInt } from '../js/Utils.js';
// 导入 OrthographicCamera
import { OrthographicCamera } from 'three';
import { allplanets,ShowStarInfoWindow } from './main.js';
import{OrbitControls} from 'three/addons/controls/OrbitControls.js';

var maincam=null;
var selectedStar=null;
const lineandstarcolor="#dcdcdc";
const suncolor="#f07818";
const backgroundColor="#36393b";

let controls=null;

function drawStar(scene,position,type){
    const geometry = new THREE.SphereGeometry(1,12,12,0,6.283185307179586,0,3.141592653589793);
    let material;
    switch(type){
        case "sun":
            material = new THREE.MeshBasicMaterial( { color: suncolor } );
            break;
        default:
            material = new THREE.MeshBasicMaterial( { color: lineandstarcolor } );
            break;
        }
    const sphere = new THREE.Mesh( geometry, material );
    sphere.position.set(position.x,position.y,position.z);
    scene.add( sphere );
    return sphere;
}

function drawLine(scene,start,end){
    // 将线的颜色也改为灰色
    const material=new THREE.LineBasicMaterial({color:lineandstarcolor});
    const points=[];
    points.push(start);
    points.push(end);
    const geometry=new THREE.BufferGeometry().setFromPoints(points);
    const line=new THREE.Line(geometry,material);
    scene.add(line);
}
let selectedStarColor=null;
function showStarInfo(star) {
    if (selectedStar != null) {
        selectedStar.material.color.set(selectedStarColor);
    }
    selectedStar = star;
    selectedStarColor = star.material.color.getHex();
    selectedStar.material.color.set(0xffffff);
    maincam.lookAt(selectedStar.position);
    
    controls.target = selectedStar.position;
    
    ShowStarInfoWindow(allplanets.filter(planet=>planet.starmapobj==star)[0]);

}

// 在函数外部定义这些变量，使它们在多次鼠标事件之间保持状态
let rotationAngleX = 0;
let rotationAngleY = 0;
let moveingCamera = false;
function ShowMapTooltip(star,rect){
    star=allplanets.filter(planet=>planet.starmapobj==star)[0];
    // 计算星星的屏幕坐标
    const vector = new THREE.Vector3();
    vector.setFromMatrixPosition(star.starmapobj.matrixWorld);
    vector.project(maincam);

    const screenX = ((vector.x + 1) / 2) * rect.width + rect.left;
    const screenY = ((-vector.y + 1) / 2) * rect.height + rect.top;

    const offsetX = 10; // 水平偏移量
    const offsetY = 10; // 垂直偏移量
    $("#starmaptooltip").empty();
    $("#starmaptooltip").show();
    $("#starmaptooltip").css({
        'left': (screenX + offsetX) + 'px',
        'top': (screenY + offsetY) + 'px',
        'position': 'absolute'
    });
    $("#starmaptooltip").html("<div>" + star.name + "</div><div>(" + star.position.x + "," + star.position.y + "," + star.position.z + ")</div>");
}
function HideMapTooltip(){
    $("#starmaptooltip").hide();
}
function InitStarMap() {
    $("#starmaptooltip").hide();
    const container = document.getElementById("starmap");
    const canvas = document.createElement("canvas");
    const scene = new THREE.Scene();
    
    // 设置场景背景颜色为深蓝色
    scene.background = new THREE.Color(backgroundColor);  

    // 替换透视相机为正交相机
    const aspect = container.clientWidth / container.clientHeight;
    const frustumSize = 200;
    maincam = new OrthographicCamera(
        frustumSize * aspect / -2,
        frustumSize * aspect / 2,
        frustumSize / 2,
        frustumSize / -2,
        0.1,
        1000
    );

    const renderer = new THREE.WebGLRenderer({canvas:canvas});

    controls=new OrbitControls(maincam,renderer.domElement);
    controls.enableDamping=true;
    controls.dampingFactor=0.05;
    controls.screenSpacePanning=false;
    controls.minDistance=100;
    controls.maxDistance=500;
    controls.maxPolarAngle=Math.PI/2;


    renderer.setSize( container.clientWidth, container.clientHeight );
    container.appendChild( renderer.domElement );

    // 创建所有星星
    for(let i=0; i<allplanets.length; i++){
        allplanets[i].starmapobj=drawStar(scene, new THREE.Vector3(allplanets[i].position.x, allplanets[i].position.y, allplanets[i].position.z),allplanets[i].type);
    }
    let a=0;
    let numConnections=0
    // 为每颗星星创建随机连线
    for(let i=0; i<allplanets.length; i++){
        a=randInt(0,100);
        if(a>=60){
            numConnections = randInt(1, 6);  // 随机决定连接0到3颗其他星星
        }else{
            numConnections=0;
        }
        for(let j=0; j<numConnections; j++){
            const otherStarIndex = randInt(0, allplanets.length - 1);
            if(otherStarIndex !== i){  // 确保不会连接到自己
                //计算距离
                let distance=Math.sqrt(Math.pow(allplanets[i].position.x-allplanets[otherStarIndex].position.x,2)+Math.pow(allplanets[i].position.y-allplanets[otherStarIndex].position.y,2)+Math.pow(allplanets[i].position.z-allplanets[otherStarIndex].position.z,2));
                if(distance<90){
                    drawLine(scene, allplanets[i].position, allplanets[otherStarIndex].position);
                    allplanets[i].next=allplanets[otherStarIndex];
                    allplanets[otherStarIndex].last=allplanets[i];
                }
            }
        }
        function setnextsameforce(planet){
            if(planet.next!=null){
                planet.next.belongForce=planet.belongForce;
                setnextsameforce(planet.next);
            }
        }
        for(let _planet of allplanets){
            if(_planet.last==null){
                setnextsameforce(_planet);
            }
        }
    }

    // 调整相机初始位置
    maincam.position.set(0, 0, 200);
    maincam.lookAt(0, 0, 0);

    // 添加鼠标滚轮事件监听器
    container.addEventListener('wheel', function(event) {
        event.preventDefault();

        const zoomSpeed = 0.1;
        const zoomDelta = event.deltaY > 0 ? 1 + zoomSpeed : 1 - zoomSpeed;

        maincam.left *= zoomDelta;
        maincam.right *= zoomDelta;
        maincam.top *= zoomDelta;
        maincam.bottom *= zoomDelta;

        maincam.updateProjectionMatrix();
    });

    $("#starmap").mousedown(function(e){
        moveingCamera = true;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
    }).mousemove(function(e){
        
        // 当鼠标指向某个星星时，星星变大的代码保持不变
        const rect = canvas.getBoundingClientRect();
        const mouse = new THREE.Vector2(
            ((e.clientX - rect.left) / rect.width) * 2 - 1,
            -((e.clientY - rect.top) / rect.height) * 2 + 1
        );
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, maincam);
        
        // 只放大鼠标指向的星星
        const intersects = raycaster.intersectObjects(allplanets.map(planet => planet.starmapobj));
        if(intersects.length > 0){
            intersects[0].object.scale.set(2, 2, 2);
            this.biggerstar=intersects[0].object;
            ShowMapTooltip(this.biggerstar,rect);
        }else{
            if(this.biggerstar!=null){
                this.biggerstar.scale.set(1, 1, 1);
            }
            HideMapTooltip();
        }
        
        renderer.render(scene, maincam);
    }).mouseup(function(e){
        moveingCamera = false;

        // 添加点击星星的逻辑
        const rect = canvas.getBoundingClientRect();
        const mouse = new THREE.Vector2(
            ((e.clientX - rect.left) / rect.width) * 2 - 1,
            -((e.clientY - rect.top) / rect.height) * 2 + 1
        );
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, maincam);
        const intersects = raycaster.intersectObjects(allplanets.map(planet => planet.starmapobj));
        if (intersects.length > 0) {
            const clickedStar = intersects[0].object;
            showStarInfo(clickedStar);
        }
    });

    // 添加这个函数来持续更新场景
    function animate() {
        requestAnimationFrame(animate);

        controls.update();

        renderer.render(scene, maincam);
    }
    animate();
}
var allForces=new Array();
let 势力标签=["帝国","联邦","共和国","联盟","共和国","联盟","共和国","联盟","共和国","联盟"];
//星际势力
class StarForce{
    constructor(name){
        this.name=name+势力标签[randInt(0,势力标签.length-1)];
        this.planets=new Array();
        allForces.push(this);
    }
}
export {InitStarMap,allForces,StarForce};
