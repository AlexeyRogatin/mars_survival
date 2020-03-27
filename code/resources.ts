import { Key } from "./controls";
export const SCREEN_RATIO = 1920 / 980;


export function handleResize() {
    const rect = canvas.getBoundingClientRect();
    let width = rect.width;
    let height = width / SCREEN_RATIO;
    canvas.width = width;
    canvas.height = height
    backBuffer.width = width;
    backBuffer.height = height;
}

export const canvas = document.getElementById("canvas") as HTMLCanvasElement;
export const ctx = canvas.getContext("2d");

export const backBuffer = document.createElement('canvas');
export const backCtx = backBuffer.getContext('2d');

export let camera = {
    x: 0,
    y: 0,
    width: innerWidth,
    height: innerHeight,
    angle: 0,
}

camera.width = 1920;
camera.height = camera.width / SCREEN_RATIO;

handleResize();
window.addEventListener('resize', handleResize);

export let resourcesLoadedCount: number = 0;
export let resourcesWaitingForLoadCount: number = 0;
export let canBeginGame: boolean = false;


export enum Layer {
    UI,
    BOSS_EYE,
    FORGROUND,
    METEORITE,
    PARTICLES,
    BOSS,
    BOSS_LEG,
    MANIPULATOR,
    UPPER_TILE,
    PLAYER,
    ON_TILE,
    TILE,
    NONE,
}


export enum DrawQueueType {
    NONE,
    IMAGE,
    RECT,
    CIRCLE,
    TEXT,
    LINEAR_GRADIENT,
}

export class DrawQueueItem {
    x: number;
    y: number;
    layer: Layer = Layer.TILE;
    type: DrawQueueType = DrawQueueType.NONE;
    width?: number = 0;
    height?: number = 0;
    angle?: number = 0;
    color?: string[] = ['white', 'black'];
    stop?: number[] = [0, 1];
    sprite?: HTMLImageElement = null;
    radius?: number = 0;
    text?: string = '';
    textSize?: number = 60;
    outlineOnly?: number = 0;
    fromThePoint?: boolean = false;
    drawFromThePoint?: boolean = false;
    textAlign?: CanvasTextAlign;
}


function resourceLoaded(src: string) {
    resourcesLoadedCount++;

    // console.log('loaded', src);
    if (resourcesWaitingForLoadCount === resourcesLoadedCount) {
        canBeginGame = true;
    }
}

export function loadImage(src: string) {
    let img = new Image();
    img.src = src;
    resourcesWaitingForLoadCount++;
    img.onload = () => resourceLoaded(src);

    return img;
}

export function loadSound(src: string) {
    let sound = new Audio();
    sound.src = src;
    resourcesWaitingForLoadCount++;
    sound.oncanplay = () => resourceLoaded(src);
    return sound;
}

let sounds: HTMLAudioElement[] = [];

export function playSound(sound: HTMLAudioElement, volume = 1, loop = false) {
    let newSound = new Audio(sound.src);
    newSound.volume = volume;
    newSound.loop = loop;
    newSound.oncanplay = () => {
        newSound.play();
    };
    return newSound;
}

export let imgPlayer = loadImage('../sprites/player_body.png');
export let imgNone = loadImage('../sprites/none.png');
export let imgWheel1 = loadImage('../sprites/weel1.png');
export let imgWheel2 = loadImage('../sprites/weel2.png');
export let imgWheel3 = loadImage('../sprites/weel3.png');
export let imgWheel4 = loadImage('../sprites/weel4.png');
export let imgWheel5 = loadImage('../sprites/weel5.png');
export let imgWheel6 = loadImage('../sprites/weel6.png');
export let imgCamera = loadImage('../sprites/camera.png');
export let imgEarth1 = loadImage('../sprites/earth1.png');
export let imgEarth2 = loadImage('../sprites/sasha/earth2.png');
export let imgEarth3 = loadImage('../sprites/sasha/earth3.png');
export let imgGeyser = loadImage('../sprites/geyser.png');
export let imgMountain = loadImage('../sprites/sasha/newMountain.png');
export let imgLava1 = loadImage('../sprites/sasha/lava1.jpg');
export let imgLava2 = loadImage('../sprites/sasha/lava2.jpg');
export let imgIron1 = loadImage('../sprites/iron1.png');
export let imgIron2 = loadImage('../sprites/iron2.png');
export let imgIron3 = loadImage('../sprites/iron3.png');
export let imgIron4 = loadImage('../sprites/iron4.png');
export let imgIron5 = loadImage('../sprites/iron5.png');
export let imgIronItem = loadImage('../sprites/ironItem.png');
export let imgArrow = loadImage('../sprites/arrow.png');
export let imgCrafts = loadImage('../sprites/crafts.png');
export let imgArrow1 = loadImage('../sprites/arrow1.png');
export let imgMelter = loadImage('../sprites/melter.png');
export let imgIronIngot = loadImage('../sprites/ironIngotItem.png');
export let imgAurit1 = loadImage('../sprites/gold1.png');
export let imgAurit2 = loadImage('../sprites/gold2.png');
export let imgAurit3 = loadImage('../sprites/gold3.png');
export let imgAurit4 = loadImage('../sprites/gold4.png');
export let imgAurit5 = loadImage('../sprites/gold5.png');
export let imgAuritItem = loadImage('../sprites/goldItem.png');
export let imgAuritIngot = loadImage('../sprites/goldIngotItem.png');
export let imgCrystal1 = loadImage('../sprites/crystal1.png');
export let imgCrystal2 = loadImage('../sprites/crystal2.png');
export let imgCrystal3 = loadImage('../sprites/crystal3.png');
export let imgCrystal4 = loadImage('../sprites/crystal4.png');
export let imgCrystal5 = loadImage('../sprites/crystal5.png');
export let imgCrystalItem = loadImage('../sprites/crystalItem.png');
export let imgSplitter = loadImage('../sprites/splitter.png');
export let imgToolkit = loadImage('../sprites/toolkit.png');
export let imgSunBatteryAdd = loadImage('../sprites/sun_battery.png');
export let imgSunBatteryItem = loadImage('../sprites/sun_batteryItem.png');
export let imgSunBattery = loadImage('../sprites/sunBattery.png');
export let imgSilicon1 = loadImage('../sprites/silicon1.png');
export let imgSilicon2 = loadImage('../sprites/silicon2.png');
export let imgSilicon3 = loadImage('../sprites/silicon3.png');
export let imgSilicon4 = loadImage('../sprites/silicon4.png');
export let imgSilicon5 = loadImage('../sprites/silicon5.png');
export let imgSiliconItem = loadImage('../sprites/siliconItem.png');
export let imgVolcano = loadImage('../sprites/sasha/volcano.png');
export let imgMagmaBall = loadImage('../sprites/magmaBall.png');
export let imgStorage = loadImage('../sprites/storage.png');
export let imgGoldenCamera = loadImage('../sprites/cameraGold.png');
export let imgExtraSlot = loadImage('../sprites/extraSlot.png');
export let imgExtraSlotItem = loadImage('../sprites/extraSlotItem.png');
export let imgAlert = loadImage('../sprites/alert.png');
export let imgShockProofBody = loadImage('../sprites/shockproof_body.png');
export let imgMeteorite = loadImage('../sprites/meteorite.png');
export let imgIgneous = loadImage('../sprites/igneous.png');
export let imgIgneousItem = loadImage('../sprites/igneousItem.png');
export let imgIgneousIngot = loadImage('../sprites/igneousIngot.png');
export let imgMeteoriteStuff = loadImage('../sprites/meteoriteStuff.png');
export let imgBoss = loadImage('../sprites/boss.png');
export let imgArrow2 = loadImage('../sprites/arrow2.png');
export let imgManipulator = loadImage('../sprites/manipulator.png');
export let imgMechanicalHand = loadImage('../sprites/mechanicalHand.png');
export let imgEnergy = loadImage('../sprites/energy.png');
export let imgHp = loadImage('../sprites/hp.png');
export let imgBossReadyToAttack = loadImage('../sprites/bossReadyToAttack.png');
export let imgBossReadyToAttack1 = loadImage('../sprites/bossReadyToAttack1.png');
export let imgBossAttack = loadImage('../sprites/bossAttack.png');
export let imgBossAttack1 = loadImage('../sprites/bossAttack1.png');
export let imgLazer = loadImage('../sprites/lazer.png');
export let imgLazer1 = loadImage('../sprites/lazer1.png');
export let imgEdge1 = loadImage('../sprites/edge1.png');
export let imgEdge2_1 = loadImage('../sprites/edge2_1.png');
export let imgEdge2_2 = loadImage('../sprites/edge2_2.png');
export let imgEdge2_3 = loadImage('../sprites/edge2_3.png');
export let imgEdge3 = loadImage('../sprites/edge3.png');
export let imgEdge4 = loadImage('../sprites/edge4.png');
export let imgSide1 = loadImage('../sprites/side1.png');
export let imgMenu = loadImage('../sprites/menu.jpg');
export let imgTime = loadImage('../sprites/timeAndCoords.png');
export let imgDesk = loadImage('../sprites/desk.png');
export let imgBossHp = loadImage('../sprites/bossHp.png');
export let imgKnowledgeOfBallistics = loadImage('../sprites/knowledgeOfBallistics.png');
export let imgShakingDetector = loadImage('../sprites/shakingDetector.png');

export let sndMining = loadSound('../sounds/mining.mp3');
export let sndGeyser = loadSound('../sounds/geyser.mp3');
export let sndVolcanoBoom = loadSound('../sounds/volcanoBoom.mp3');
export let sndBoom = loadSound('../sounds/boom.mp3');
export let sndParadox = loadSound('../sounds/Petos Paradox.mp3');
export let sndDysonSphere = loadSound('../sounds/Dyson Sphere.mp3');

export function renderItem(item: DrawQueueItem) {
    switch (item.type) {
        case DrawQueueType.IMAGE: {
            ctx.save();

            ctx.translate(item.x, item.y);

            ctx.rotate(item.angle);
            let compWidth = item.width || item.sprite.width;
            let compHeight = item.height || item.sprite.height;
            if (!item.fromThePoint) {
                ctx.drawImage(item.sprite, -compWidth / 2, -compHeight / 2, compWidth, compHeight);
            } else {
                ctx.drawImage(item.sprite, -compWidth, -compHeight / 2, compWidth, compHeight);
            }
            ctx.restore();
        } break;

        case DrawQueueType.RECT: {
            ctx.save();
            ctx.translate(item.x, item.y);
            ctx.rotate(-item.angle);

            if (item.outlineOnly > 0) {
                ctx.strokeStyle = item.color[0];
                ctx.lineWidth = item.outlineOnly;
                ctx.strokeRect(-item.width / 2, -item.height / 2, item.width, item.height);
            } else {
                ctx.fillStyle = item.color[0];
                ctx.fillRect(-item.width / 2, -item.height / 2, item.width, item.height);
            }
            ctx.restore();
        } break;

        case DrawQueueType.CIRCLE: {
            ctx.beginPath();
            ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);

            if (item.outlineOnly > 0) {
                ctx.strokeStyle = item.color[0];
                ctx.lineWidth = item.outlineOnly;
                ctx.stroke();
            } else {
                ctx.fillStyle = item.color[0];
                ctx.fill();
            }
        } break;

        case DrawQueueType.TEXT: {
            ctx.save();
            ctx.fillStyle = item.color[0];
            ctx.font = `${item.textSize}px Arial`;
            ctx.textBaseline = 'middle';
            ctx.textAlign = item.textAlign;
            ctx.fillText(item.text, item.x, item.y);
            ctx.restore();
        } break;

        case DrawQueueType.LINEAR_GRADIENT: {
            ctx.save();
            let x1 = item.x - item.width / 2;
            let x2 = item.x + item.width / 2;
            let y1 = item.y - item.height / 2;
            let y2 = item.y - item.height / 2;
            let gradient = ctx.createLinearGradient(x1, y1, x2, y2);
            for (let colorIndex = 0; colorIndex < item.color.length; colorIndex++) {
                gradient.addColorStop(item.stop[colorIndex], item.color[colorIndex]);
            }

            ctx.fillStyle = gradient;

            ctx.fillRect(x1, y1, item.width, item.height);

            ctx.restore();
        } break;

        default: console.assert(false);
    }
}