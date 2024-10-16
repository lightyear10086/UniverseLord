import * as THREE from 'three';
import { randInt } from '../js/Utils.js';
// 导入 OrthographicCamera
import { OrthographicCamera } from 'three';
import { allplanets } from './main.js';
var maincam=null;
var selectedStar=null;

function drawStar(scene,position){
    const geometry = new THREE.SphereGeometry(1,12,12,0,6.283185307179586,0,3.141592653589793);
    // 将颜色从0xffff00（黄色）改为0x808080（灰色）
    const material = new THREE.MeshBasicMaterial( { color: 0x808080 } );
    const sphere = new THREE.Mesh( geometry, material );
    sphere.position.set(position.x,position.y,position.z);
    scene.add( sphere );
    return sphere;
}

function drawLine(scene,start,end){
    // 将线的颜色也改为灰色
    const material=new THREE.LineBasicMaterial({color:0x808080});
    const points=[];
    points.push(start);
    points.push(end);
    const geometry=new THREE.BufferGeometry().setFromPoints(points);
    const line=new THREE.Line(geometry,material);
    scene.add(line);
}

function showStarInfo(star){
    if(selectedStar!=null){
        selectedStar.material.color.set(0x808080);
    }
    selectedStar=star;
    //高亮点击的星星，颜色变为白色
    selectedStar.material.color.set(0xffffff);
    maincam.lookAt(selectedStar.position);
    for(let _star of allplanets){
        if(_star.starmapobj==star){
            console.log(_star.name);
            break;
        }
    }
}

function InitStarMap() {
    const container = document.getElementById("starmap");
    const canvas = document.createElement("canvas");
    const scene = new THREE.Scene();
    
    // 设置场景背景颜色为深蓝色
    scene.background = new THREE.Color(0x000033);  // 深蓝色

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
    renderer.setSize( container.clientWidth, container.clientHeight );
    container.appendChild( renderer.domElement );

    // 创建所有星星
    for(let i=0; i<allplanets.length; i++){
        allplanets[i].starmapobj=drawStar(scene, new THREE.Vector3(allplanets[i].position.x, allplanets[i].position.y, allplanets[i].position.z));
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
                }
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
        this.moveingCamera = true;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
        
    }).mousemove(function(e){
        if(this.moveingCamera){
            //根据鼠标移动的距离计算出camera的旋转角度
            // const deltaX=e.clientX-this.lastMouseX;
            // const deltaY=e.clientY-this.lastMouseY;
            // maincam.rotation.y+=deltaX*0.002;
            // maincam.rotation.x+=deltaY*0.002;
            // this.lastMouseX=e.clientX;
            // this.lastMouseY=e.clientY;
            if(selectedStar!=null){
                //camera绕着selectedStar旋转
                const deltaX=e.clientX-this.lastMouseX;
                const deltaY=e.clientY-this.lastMouseY;
                
                this.lastMouseX=e.clientX;
                this.lastMouseY=e.clientY;
            }
        }
        //当鼠标指向某个星星时，星星变大
        const rect = canvas.getBoundingClientRect();
        const mouse = new THREE.Vector2(
            ((e.clientX - rect.left) / rect.width) * 2 - 1,
            -((e.clientY - rect.top) / rect.height) * 2 + 1
        );
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, maincam);
        
        // 重置所有星星的大小
        allplanets.forEach(planet => {
            planet.starmapobj.scale.set(1, 1, 1);
        });
        
        // 只放大鼠标指向的星星
        const intersects = raycaster.intersectObjects(allplanets.map(planet => planet.starmapobj));
        if(intersects.length > 0){
            intersects[0].object.scale.set(2, 2, 2);
        }
        
        renderer.render(scene, maincam);
    }).mouseup(function(e){
        this.moveingCamera = false;

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
        renderer.render(scene, maincam);
    }
    animate();
}

export {InitStarMap};
