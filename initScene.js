let scene, camera, renderer;
function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdddddd);

    camera = new THREE.PerspectiveCamera(25,window.innerWidth/window.innerHeight,1,300);
    camera.position.x = 13.5;
    camera.position.y = 1.8;
    camera.position.z = 4.5;  

    const canvas = document.querySelector("#canvas");
    renderer = new THREE.WebGLRenderer({canvas});
    renderer.setSize(canvas.clientWidth,canvas.clientHeight, false);

    //управление мышью
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.minDistance = 7;
    controls.maxDistance = 20;
    controls.minPolarAngle = 0; 
    controls.maxPolarAngle = Math.PI/2; 
    controls.target.set(1.7, 0.7, 0.3);
    controls.update();

    //расстановка освещения
    hemiLight = new THREE.HemisphereLight(0xffffff, 0x080808, 2);
    scene.add(hemiLight);
    light = new THREE.SpotLight(0xffffff,3);
    light.position.set(-5,5,10);
    scene.add( light );
    const spotLight = new THREE.SpotLight( 0xffffff, 2 );
    spotLight.position.set( 2, 7, 2 );

    spotLight.castShadow = true;

    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;
    scene.add(spotLight);

    // const axes = new THREE.AxesHelper(50);
    // axes.position.set(1.7, -0.5, 0.3); 
    // scene.add(axes);

    const loaderTex = new THREE.TextureLoader();
    const texture = loaderTex.load("cover.jpg");
    //тайлинг
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 45,45);
    //построение геометрии-сетки
    const bigFloorGeo = new THREE.CircleGeometry(30, 15);
    const bigFloorMat = new THREE.MeshBasicMaterial({map: texture});
    bigFloorMat.side = THREE.BackSide;
    const bigFloor = new THREE.Mesh(bigFloorGeo, bigFloorMat);
    bigFloor.position.y -=0.55;
    bigFloor.rotation.x += Math.PI/2;
    scene.add(bigFloor);

    //пол черный
  
    const smallFloorGeo = new THREE.CircleGeometry(7, 32);
    const smallFloorMat = new THREE.MeshBasicMaterial({color: 0x080808}); 
    smallFloorMat.side = THREE.BackSide;
    const smallFloor = new THREE.Mesh(smallFloorGeo, smallFloorMat);
    smallFloor.position.y -=0.52;
    smallFloor.position.x +=4;
    smallFloor.rotation.x += Math.PI/2;
    scene.add(smallFloor);

    //подгрузка модели
    let loader = new THREE.GLTFLoader();
    loader.load('./scene9.glb', function(gltf){
        car = gltf.scene.children[0];
        car.scale.set(1000,1000,1000);
        //сдвиг координат
        gltf.scene.position.z+=2;
        gltf.scene.position.x+=2;
        gltf.scene.position.y-=0.5;
        scene.add(gltf.scene);
    });
    
    animate();

    function animate() {
        requestAnimationFrame(animate);
        if (resizeRendererToDisplaySize(renderer)) {
            // обновление соотношения сторон холста в зависимости от сторон окна просмотра
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        // console.log(camera.position);
        light.position.set( 
            camera.position.x + 10,
            camera.position.y + 10,
            camera.position.z + 10,
          );
        renderer.render(scene,camera);
    }
}




// init();