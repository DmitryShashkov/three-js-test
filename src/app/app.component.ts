import { Component, AfterViewInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import * as THREE from 'three';
import * as Stats from 'stats-js';
import { GUI } from 'dat.gui';
import { GUIControls } from './models/gui.controls';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
    private readonly scene: THREE.Scene;
    private readonly camera: THREE.PerspectiveCamera;
    private readonly renderer: THREE.WebGLRenderer;
    private readonly axes: THREE.AxesHelper;
    private readonly plane: THREE.Mesh;
    private readonly cube: THREE.Mesh;
    private readonly sphere: THREE.Mesh;
    private readonly spotLight: THREE.SpotLight;
    
    private stats: StatsStatic;
    private gui: GUI;
    
    private sphereAnimationStep: number = 0;
    
    @ViewChild('webGLRenderOutput') private webGLRenderOutput: ElementRef;
    @ViewChild('statsOutput') private statsOutput: ElementRef;
    
    private controls: GUIControls = {
        rotationSpeed: 0.02,
        bouncingSpeed: 0.03,
    };
    
    constructor () {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(0xEEEEEE);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        this.axes = new THREE.AxesHelper(20);
    
        const planeGeometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(60, 20, 1, 1);
        const planeMaterial: THREE.MeshLambertMaterial = new THREE.MeshLambertMaterial({
            color: 0xffffff,
        });
        this.plane = new THREE.Mesh(planeGeometry, planeMaterial);
        this.plane.rotation.x = -0.5 * Math.PI;
        this.plane.position.x = 15;
        this.plane.position.y = 0;
        this.plane.position.z = 0;
        this.plane.receiveShadow = true;
    
        const cubeGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(4, 4, 4);
        const cubeMaterial: THREE.MeshLambertMaterial = new THREE.MeshLambertMaterial({
            color: 0xff0000,
        });
        this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        this.cube.position.x = -4;
        this.cube.position.y = 3;
        this.cube.position.z = 0;
        this.cube.castShadow = true;
    
        const sphereGeometry: THREE.SphereGeometry = new THREE.SphereGeometry(4, 20, 20);
        const sphereMaterial: THREE.MeshLambertMaterial = new THREE.MeshLambertMaterial({
            color: 0x7777ff,
        });
        this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.sphere.position.x = 20;
        this.sphere.position.y = 4;
        this.sphere.position.z = 2;
        this.sphere.castShadow = true;
    
        this.spotLight = new THREE.SpotLight( 0xffffff );
        this.spotLight.position.set( -40, 60, -10 );
        this.spotLight.castShadow = true;
    
        this.scene.add(this.axes);
        this.scene.add(this.plane);
        this.scene.add(this.cube);
        this.scene.add(this.sphere);
        this.scene.add(this.spotLight);
    
        this.camera.position.x = -30;
        this.camera.position.y = 40;
        this.camera.position.z = 30;
        this.camera.lookAt(this.scene.position);
    }

    public ngAfterViewInit (): void {
        this.webGLRenderOutput.nativeElement.appendChild(this.renderer.domElement);
        this.stats = AppComponent.initStats(this.statsOutput.nativeElement);
        
        this.gui = new GUI();
        this.gui.add(this.controls, 'rotationSpeed', 0, 0.5);
        this.gui.add(this.controls, 'bouncingSpeed', 0, 0.5);
        
        this.renderScene();
    }
    
    private renderScene (): void {
        this.cube.rotation.x += this.controls.rotationSpeed;
        this.cube.rotation.y += this.controls.rotationSpeed;
        this.cube.rotation.z += this.controls.rotationSpeed;
    
        this.sphereAnimationStep += this.controls.bouncingSpeed;
        this.sphere.position.x = 20 + 10 * Math.cos(this.sphereAnimationStep);
        this.sphere.position.y = 2 +  10 * Math.abs(Math.sin(this.sphereAnimationStep));
        
        this.renderer.render(this.scene, this.camera);
        this.stats.update();
        
        requestAnimationFrame(this.renderScene.bind(this));
    }
    
    private static initStats (container: HTMLElement): StatsStatic {
        const stats: StatsStatic = new Stats();
        stats.setMode(0);
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        
        container.appendChild( stats.domElement );
        
        return stats;
    }
    
    @HostListener('window:resize')
    private onWindowResize (): void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}
