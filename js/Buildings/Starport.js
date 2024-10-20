import { Building } from "../building.js";
import { allbuildings, GetProgress,shpaceshipconstructorinfo } from "../GameManager.js";
import { ProgressBar } from "../progressbar.js";
import { WindowElement } from "../WindowElement.js";
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import{OrbitControls} from 'three/addons/controls/OrbitControls.js';
import { backgroundColor } from "../StarMapInit.js";
import * as THREE from 'three';
class Starport extends Building {
    constructor(){
        super(allbuildings['starports'].length,"星港","建造/停泊星际飞船",1.5);
        this.spaceships=[];
        this.buildedshipcount=0;
        this.buildWindow=new WindowElement("starport_"+this.id,this.name,500,1000,"<div class='btn normal buildship'>建造</div><form><select class='build_ship_list'></select></form><div class='progress'></div><div class='shiplist'></div>");
        for(let scinfo of shpaceshipconstructorinfo){
            $(this.buildWindow.body).children("form").children('.build_ship_list').append("<option value='"+scinfo.id+"'>"+scinfo.name+"</option>");
        }
        $(this.buildWindow.body).children('.buildship').click(()=>{
            this.BuildNewSpaceship();
        })
        this.buildWindow.HideWindow();
    }
    SetSpaceShipModule(dom,gltfpath){
        if($(dom).children().length>0){
            return;
        }
        if(gltfpath==""){
            return;
        }
        const scene=new THREE.Scene();
        scene.background = new THREE.Color("#f3ffeb"); 
        let helper=new THREE.GridHelper(20,10);
        helper.position.set(10,0,10);
        scene.add(helper);
        //scene.add(new THREE.AxesHelper(20));
        const light=new THREE.PointLight(0xffffff,80);
        light.position.set(5,15,0);
        light.castShadow=true;
        //Set up shadow properties for the light
        light.shadow.mapSize.width = 512; // default
        light.shadow.mapSize.height = 512; // default
        light.shadow.camera.near = 0.5; // default
        light.shadow.camera.far = 500 // default
        scene.add(light);
        const ambientLight=new THREE.AmbientLight();
        scene.add(ambientLight);
        const frustumSize = 100;
        const renderer=new THREE.WebGLRenderer();
        renderer.setSize(300,120);
        const camera=new THREE.PerspectiveCamera(30,renderer.getSize().x/renderer.getSize().y,1,1000);
        camera.position.set(15,5,15);
        let tanFOV=Math.tan(((Math.PI/180)*camera.fov/2));
        camera.aspect=renderer.getSize().x/renderer.getSize().y;
        camera.fov=(360/Math.PI)*Math.atan(tanFOV*(renderer.getSize().x/renderer.getSize().y));
        camera.updateProjectionMatrix();

        $(dom).append(renderer.domElement);
        const controls=new OrbitControls(camera,renderer.domElement);
        controls.enableDamping=true;
        controls.dampingFactor=0.05;
        controls.screenSpacePanning=false;
        controls.minDistance=20;
        controls.maxDistance=500;
        controls.maxPolarAngle=Math.PI/2;
        const loader=new GLTFLoader();
        loader.load(gltfpath,function(gltf){
            scene.add(gltf.scene);
            gltf.scene.position.set(10,8,10);
            gltf.scene.scale.set(50, 50, 50);
            controls.target=gltf.scene.position;
        },undefined,function(error){
            console.error(error);
        });
        //window.addEventListener('resize', onWindowResize, false);
        
        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
            render()
        }
        function animate(){
            requestAnimationFrame(animate);
            controls.update();
            render();
        }
        function render(){
            renderer.render(scene,camera);
        }
        animate();
    }
    BuildNewSpaceship(){
        let newship=null;
        for(let scinfo of shpaceshipconstructorinfo){
            if(scinfo.id==$(this.buildWindow.body).children("form").children('.build_ship_list').val()){
                newship=new scinfo.constructor();
                break;
            }
        }
        this.buildprogress=new ProgressBar("buildship_"+GetProgress(),newship.buildtime*1000,()=>{
            $(this.buildWindow.body).children('.shiplist').append("<div class='ship_info' id='shipinfo_btn_"+newship.id+"'>"+newship.name+"</div>");
                $("#shipinfo_btn_"+newship.id).click(()=>{
                    this.SetSpaceShipModule($(newship.shipwindow.body).children('.ship_module'),newship.gltfpath);
                    $(newship.shipwindow.body).children(".inportship_info").html("<p>飞船型号 "+newship.name+"</p><p>基础航速 "+newship.speed+"km/s</p>");
                    newship.ShowInfoWindow();
                });
            $(this.buildprogress.div).remove();
            this.buildprogress=null;
        },$(this.buildWindow.body).children('.progress'),"正在建造飞船");
        this.buildprogress.StartProgress();
    }
}
export { Starport };