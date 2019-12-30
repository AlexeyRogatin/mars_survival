import { Key } from "./controls";


export const canvas = document.getElementById("canvas") as HTMLCanvasElement;
export const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;


export const backBuffer = document.createElement('canvas');
export const backCtx = backBuffer.getContext('2d');
backBuffer.width = canvas.width;
backBuffer.height = canvas.height;


let resourcesLoadedCount = 0;
let resourcesWaitingForLoadCount = 0;
export let canBeginGame = false;


export enum Layer {
    UI,
    FORGROUND,
    PARTICLES,
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
}

export class DrawQueueItem {
    x: number;
    y: number;
    layer: Layer = Layer.TILE;
    type: DrawQueueType = DrawQueueType.NONE;
    width?: number = 0;
    height?: number = 0;
    angle?: number = 0;
    color?: string = 'white';
    sprite?: HTMLImageElement = null;
    radius?: number = 0;
    text?: string = '';
    textSize?: number = 60;
    outlineOnly?: boolean = false;
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
export let imgEarth2 = loadImage('../sprites/earth2.png');
export let imgEarth3 = loadImage('../sprites/earth3.png');
export let imgEarth4 = loadImage('../sprites/earth4.png');
export let imgEarth5 = loadImage('../sprites/earth5.png');
export let imgGeyser = loadImage('../sprites/geyser.png');
export let imgMountain = loadImage('../sprites/mountain.png');
export let imgAbyss = loadImage('../sprites/abyss.png');
export let imgIron1 = loadImage('../sprites/iron1.png');
export let imgIron2 = loadImage('../sprites/iron2.png');
export let imgIron3 = loadImage('../sprites/iron3.png');
export let imgIron4 = loadImage('../sprites/iron4.png');
export let imgIron5 = loadImage('../sprites/iron5.png');
export let imgItems = loadImage('../sprites/items.png');
export let imgIronItem = loadImage('../sprites/ironItem.png');
export let imgArrow = loadImage('../sprites/arrow.png');
export let imgCrafts = loadImage('../sprites/crafts.png');
export let imgArrow1 = loadImage('../sprites/arrow1.png');
export let imgMelter = loadImage('../sprites/melter.png');
export let imgMainSlot = loadImage('../sprites/mainSlot.png');
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
export let imgVolcano = imgMountain;
export let imgMagmaBall = loadImage('../sprites/magmaBall.png');
export let imgStorage = loadImage('../sprites/imgStorage.png');

export function renderItem(item: DrawQueueItem) {
    switch (item.type) {
        case DrawQueueType.IMAGE: {
            ctx.save();
            ctx.translate(item.x, item.y);

            ctx.rotate(item.angle);
            let compWidth = item.width || item.sprite.width;
            let compHeight = item.height || item.sprite.height;
            ctx.drawImage(item.sprite, -compWidth / 2, -compHeight / 2, compWidth, compHeight);
            ctx.restore();
        } break;

        case DrawQueueType.RECT: {
            ctx.save();
            ctx.translate(item.x, item.y);
            ctx.rotate(-item.angle);

            if (item.outlineOnly) {
                ctx.strokeStyle = item.color;
                ctx.strokeRect(-item.width / 2, -item.height / 2, item.width, item.height);
            } else {
                ctx.fillStyle = item.color;
                ctx.fillRect(-item.width / 2, -item.height / 2, item.width, item.height);
            }
            ctx.restore();
        } break;

        case DrawQueueType.CIRCLE: {
            ctx.beginPath();
            ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);

            if (item.outlineOnly) {
                ctx.strokeStyle = item.color;
                ctx.stroke();
            } else {
                ctx.fillStyle = item.color;
                ctx.fill();
            }
        } break;

        case DrawQueueType.TEXT: {
            ctx.save();
            ctx.fillStyle = item.color;
            ctx.font = `${item.textSize}px Arial`;
            ctx.textBaseline = 'middle';
            // ctx.textAlign = 'left';
            ctx.fillText(item.text, item.x, item.y);
            ctx.restore();
        } break;

        default: console.assert(false);
    }
}