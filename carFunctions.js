function addCar(model, scene) {
    console.log(model);
    scene.add(model);
    model.name='car';
}

function changeCar(oldModel, newModel, scene) {
    scene.remove(oldModel);
    newModel.name='car';
    scene.add(newModel);
};

function modelLoader(url) {
    const loader = new THREE.GLTFLoader();
    return new Promise((resolve, reject) => {
      loader.load(url, data=> resolve(data), null, reject);
    });
}


function loadCars() {
    let pathToModel = [
        './carModels/red.glb',
        './carModels/white.glb',
        './carModels/grey.glb',
        './carModels/black.glb',
        './carModels/blueC.glb',
        './carModels/blueM.glb',
        './carModels/green.glb',
    ];

    return Promise.all(pathToModel.map(path => {
        return modelLoader(path).then((gltf) => {
            let car = gltf.scene.children[0];
            car.scale.set(1000,1000,1000);
            //сдвиг координат
            gltf.scene.position.z+=2;
            gltf.scene.position.x+=2;
            gltf.scene.position.y-=0.5;
            let carName=path.split('/')[2].split('.')[0];
            return [carName, gltf.scene];
        })
    })).then(result => {
        console.log(result);
        return Object.fromEntries(result);
    });
}