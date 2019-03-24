import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from "@angular/core";
import * as THREE from 'three';
import * as Stats from 'stats-js';
import { GUI } from 'dat.gui';
import { Chapter2GuiControls } from "../../models/chapter-2-gui.controls";

@Component({
    selector: 'app-chapter-2',
    templateUrl: './chapter-2.component.html',
    styleUrls: ['./chapter-2.component.scss'],
})
export class Chapter2Component implements AfterViewInit, OnDestroy {
    private readonly scene: THREE.Scene;
    private readonly camera: THREE.PerspectiveCamera;
    private readonly renderer: THREE.WebGLRenderer;
    private readonly planeGeometry: THREE.PlaneGeometry;
    private readonly plane: THREE.Mesh;
    private readonly ambientLight: THREE.AmbientLight;
    private readonly spotLight: THREE.SpotLight;

    private stats: StatsStatic;
    private gui: GUI;

    @ViewChild('webGLRenderOutput') private webGLRenderOutput: ElementRef;
    @ViewChild('statsOutput') private statsOutput: ElementRef;

    private controls: Chapter2GuiControls = {
        rotationSpeed: 0.02,
        numberOfObjects: 0,
    };

    constructor () {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(0xEEEEEE);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
        const planeMaterial: THREE.MeshLambertMaterial = new THREE.MeshLambertMaterial({
            color: 0xffffff,
        });
        this.plane = new THREE.Mesh(this.planeGeometry, planeMaterial);
        this.plane.rotation.x = -0.5 * Math.PI;
        this.plane.position.x = 0;
        this.plane.position.y = 0;
        this.plane.position.z = 0;
        this.plane.receiveShadow = true;

        this.camera.position.x = -30;
        this.camera.position.y = 40;
        this.camera.position.z = 30;
        this.camera.lookAt(this.scene.position);

        this.ambientLight = new THREE.AmbientLight(0x0c0c0c);

        this.spotLight = new THREE.SpotLight(0xffffff);
        this.spotLight.position.set(-40, 60, -10);
        this.spotLight.castShadow = true;

        // this.scene.fog = new THREE.Fog(0xffffff, 0.015, 100);
        this.scene.fog = new THREE.FogExp2(0xffffff, 0.01);

        this.scene.overrideMaterial = new THREE.MeshLambertMaterial({
            color: 0xeeeeee,
        });

        this.scene.add(this.camera);
        this.scene.add(this.plane);
        this.scene.add(this.ambientLight);
        this.scene.add(this.spotLight);
    }

    private static initStats (container: HTMLElement): StatsStatic {
        const stats: StatsStatic = new Stats();
        stats.setMode(0);
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        
        container.appendChild(stats.domElement);
        
        return stats;
    }

    public ngAfterViewInit (): void {
        this.webGLRenderOutput.nativeElement.appendChild(this.renderer.domElement);
        this.stats = Chapter2Component.initStats(this.statsOutput.nativeElement);
        
        this.gui = new GUI();
        this.gui.add(this.controls, 'rotationSpeed', 0, 0.5);
        this.gui.add(this.controls, 'numberOfObjects').listen();
        this.gui.add(this, 'addCube');
        this.gui.add(this, 'removeCube');
        this.gui.add(this, 'outputObjects');
    
        this.renderScene();
    }

    private renderScene (): void {
        // rotate the cubes around their axes
        this.scene.traverse((object: THREE.Object3D) => {
            if (object instanceof THREE.Mesh && object !== this.plane) {
                object.rotation.x += this.controls.rotationSpeed;
                object.rotation.y += this.controls.rotationSpeed;
                object.rotation.z += this.controls.rotationSpeed;
            }
        });
    
        this.renderer.render(this.scene, this.camera);
        this.stats.update();
        
        requestAnimationFrame(this.renderScene.bind(this));
    }

    protected addCube () : void {
        const cubeSize: number = Math.ceil((Math.random() * 3));
        const cubeGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(
            cubeSize, cubeSize, cubeSize,
        );
        const cubeMaterial: THREE.MeshLambertMaterial = new THREE.MeshLambertMaterial({
            color: Math.random() * 0xffffff,
        });
        const cube: THREE.Mesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.castShadow = true;
        cube.name = `cube-${this.scene.children.length}`;

        // position the cube randomly in the scene
        cube.position.x = -30 + Math.round((Math.random() * this.planeGeometry.parameters.width));
        cube.position.y = Math.round((Math.random() * 5));
        cube.position.z = -20 + Math.round((Math.random() * this.planeGeometry.parameters.height));

        this.scene.add(cube);
        this.controls.numberOfObjects = this.scene.children.length;
    }

    protected outputObjects () : void {
        console.log(this.scene.children);
    }

    protected removeCube () : void {
        const allChildren: THREE.Object3D[] = this.scene.children;
        const lastObject = allChildren[allChildren.length - 1];
        if (lastObject instanceof THREE.Mesh) {
            this.scene.remove(lastObject);
            this.controls.numberOfObjects = this.scene.children.length;
        }
    }

    public ngOnDestroy () : void {
        this.gui.destroy();
    }
}
