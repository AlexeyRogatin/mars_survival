import { clearAllKeys, upKey, leftKey, rightKey, downKey, mouse, qKey, rKey, escKey, key1, key2, key3, key4, key5, key6 } from "./controls";
import {
    ctx, canvas, imgPlayer, imgNone, imgWheel1, imgWheel2, imgWheel3, imgWheel4, imgWheel5, imgWheel6, imgCamera,
    imgEarth1, imgEarth2, imgEarth3, imgGeyser, imgMountain, imgIron1, imgIron2, imgIron3, imgIron4,
    imgIron5, Layer, DrawQueueItem, DrawQueueType, renderItem, imgIronItem, imgLava1, imgLava2, imgArrow, imgCrafts, imgArrow1,
    imgMelter, imgIronIngot, imgAurit1, imgAurit2, imgAurit3, imgAurit4, imgAurit5, imgAuritIngot, imgAuritItem,
    imgCrystal1, imgCrystal2, imgCrystal3, imgCrystal4, imgCrystal5, imgCrystalItem, imgSplitter, backCtx, backBuffer, imgToolkit,
    imgSunBatteryAdd, imgSunBatteryItem, imgSunBattery, imgSilicon1, imgSilicon2, imgSilicon3, imgSilicon4, imgSilicon5, imgSiliconItem,
    imgVolcano, imgMagmaBall, imgStorage, imgGoldenCamera, imgExtraSlotItem, imgAlert, imgShockProofBody, imgMeteorite, imgIgneous,
    imgIgneousItem, imgIgneousIngot, imgMeteoriteStuff, imgBoss, imgArrow2, imgManipulator, imgMechanicalHand, imgEnergy, imgHp, imgBossReadyToAttack,
    imgBossAttack, imgBossAttack1, imgBossReadyToAttack1, imgLazer, imgLazer1, camera, handleResize, imgEdge4, imgEdge3, imgEdge2_1, imgEdge2_3,
    imgEdge2_2, imgEdge1, imgSide1, imgMenu, canBeginGame, playSound, sndMining, sndGeyser, sndVolcanoBoom, sndBoom, imgTime, imgDesk, sndParadox, sndDysonSphere, imgBossHp, imgKnowledgeOfBallistics, imgShakingDetector,
} from "./resources";

class InventorySlot {
    item: Item = Item.NONE;
    count: number = 0;
    cooldown: number = addTimer(0);
}

class TileLayer {
    type: TileType;
    variant: number;
}

class Tile {
    baseLayer: TileLayer;
    upperLayer: TileLayer;
    x: number;
    y: number;
    width: number;
    height: number;
    collisionWidth: number;
    collisionHeight: number;
    specialTimer: number;
    toughness: number;
    firstToughness: number;
    oreCount: number;
    inventory: InventorySlot[];
    sound: HTMLAudioElement;
}

class RecipePart {
    item: Item;
    count: number;
    sprite: HTMLImageElement;
}

class Recipe {
    parts: RecipePart[];
    result: Item;
    sprite: HTMLImageElement;
    name: string;
    description: string;
}


class GameObject {
    type: GameObjectType = GameObjectType.NONE;
    x: number;
    y: number;
    firstX: number;
    firstY: number;
    neededX: number;
    neededY: number;

    width: number;
    height: number;
    angle: number;
    color: string;

    exists: Boolean;

    speed: number;
    speedX: number;
    speedY: number;
    speedLimit: number;
    speedBackReduction: number;

    friction: number;

    accel: number;
    accelConst: number;

    rotationSpeed: number;

    goForward: boolean;
    goRight: boolean;
    goLeft: boolean;
    goBackward: boolean;

    sprite: HTMLImageElement;

    leftWeel: number;
    rightWeel: number;

    hitpoints: number;
    maxHitpoints: number;

    energy: number;
    maxEnergy: number;

    unhitableTimer: number;
    doNotDraw: boolean;

    sunBateryLvl: number;
    luckyCamera: boolean;
    knowledgeOfBallistics: boolean;
    shakingDetector: boolean;

    stuckable: boolean;

    lifeTime: number;

    angleZ: number;

    summoned: boolean;

    dontMoveWithCamera: boolean;

    specialTimer: number;

    attack: number;
}

class particle {
    x: number;
    y: number;
    color: string;
    radius: number;
    speedX: number;
    speedY: number;
    accelX: number;
    accelY: number;
    sizeDecrease: number;
}

class Text {
    text: string;
    x: number;
    y: number;
    z: number;
    width: number;
    height: number;
    color: string;
    size: number;
    mouseOn: boolean;
    exists: boolean;
}

enum GameObjectType {
    NONE,
    PLAYER,
    MAGMA_BALL,
    LAVA_BALL,
    METEORITE,
    BOSS,
    MANIPULATOR,
}

enum GameState {
    MENU,
    GAME,
}

enum TileType {
    NONE,
    EARTH,
    MOUNTAIN,
    GEYSER,
    VOLCANO,
    LAVA,
    IRON,
    AURIT,
    CRYSTAL,
    MELTER,
    SPLITTER,
    SUN_BATERY,
    SILIKON,
    STORAGE,
    IGNEOUS,
}

enum Item {
    NONE,
    IRON,
    MELTER,
    SPLITTER,
    IRON_INGOT,
    AURIT,
    AURIT_INGOT,
    CRYSTAL,
    TOOLKIT,
    SUN_BATERY,
    SILIKON,
    STORAGE,
    GOLDEN_CAMERA,
    KNOWLEDGE_OF_BALLISTICS,
    SHAKING_DETECTOR,
    EXTRA_SLOT,
    SHOCKPROOF_BODY,
    IGNEOUS,
    IGNEOUS_INGOT,
    METEORITE_STUFF,
}

enum Event {
    NONE,
    METEORITE_RAIN,
}

const TILE = {
    width: 200,
    height: 200,
    firstX: 0,
    firstY: 0,
    chunkSizeX: 8,
    chunkSizeY: 8,
    chunkCountX: 16,
    chunkCountY: 16,
}

const MORNING_LENGTH = 4000;
const DAY_LENGTH = 4000;
const AFTERNOON_LENGTH = 4000;
const NIGHT_LENGTH = 4000;

const ONE_DAY = MORNING_LENGTH + DAY_LENGTH + AFTERNOON_LENGTH + NIGHT_LENGTH;

const EVENT_LENGTH = 1800;
const VOLCANO_RADIUS = TILE.width * TILE.chunkSizeX * 1.5;
const GRAVITATION = 0.5;
const CAMERA_HEIGHT = 1325;
const MAGMA_BALL_SPEED = 35;
const METEORITE_SPEED = 35;
const LAVA_BALL_SPEED = 15;

const METEOR_STUFF_COOLDOWN = 250;

const MAX_RANGE = MAGMA_BALL_SPEED * MAGMA_BALL_SPEED / GRAVITATION;

const STORAGE_SLOT_COUNT = 10;

const STRIPE_WIDTH = 200;
const STRIPE_HEIGHT = 50;

const CHUNK_PROTOTYPES = [
    [
        '  @!  ##',
        ' @!@   #',
        '@!@!   #',
        '@!!@   #',
        '!@!   # ',
        '@!@  #  ',
        '!@! #   ',
        '@!@ #   ',
    ],
    [
        'F! @  ##',
        '       #',
        'SC # ! #',
        'A    !  ',
        ' @   ! #',
        '   #@@!!',
        '       #',
        ' #    ##',
    ],
    [
        '    ####',
        '   #   #',
        '  !!@@##',
        '        ',
        '  !@#   ',
        '       #',
        '   ##   ',
        ' #######',
    ],
    [
        ' @@@  @@',
        '@@@   @@',
        '@@@@  @@',
        '@@C@ @@@',
        '@@@@ @@@',
        '@@@   @@',
        '@@!! !!@',
        '@@@FFF@@',
    ],
    [
        '    @   ',
        '@    #  ',
        '   !@!!#',
        '    #   ',
        '@     # ',
        '     000',
        ' #   0*0',
        '@    000',
    ],
    [
        ' #      ',
        ' # !!   ',
        '  !!!!  ',
        ' !!!!! #',
        '  !!! ##',
        '  !!!! #',
        '   !!   ',
        '@     # ',
    ],
]

const RECIPES: Recipe[] = [
    {
        result: Item.MELTER,
        parts: [{ item: Item.IRON, count: 20, sprite: imgIronItem },],
        sprite: imgMelter,
        name: 'Плавильня',
        description: 'Бегать с железом - это одно, а с железными слитками - другое. Можно поставить только на лаву',
    },
    {
        result: Item.SPLITTER,
        parts: [{ item: Item.IRON_INGOT, count: 5, sprite: imgIronIngot }, { item: Item.CRYSTAL, count: 10, sprite: imgCrystalItem }],
        sprite: imgSplitter,
        name: 'Расщепитель',
        description: 'Если сломать кристалл пополам, много энергии не выделится. Нужно что-то посерьёзнее',
    },
    {
        result: Item.STORAGE,
        parts: [{ item: Item.IRON_INGOT, count: 20, sprite: imgIronIngot }],
        sprite: imgStorage,
        name: 'Хранилище',
        description: 'Это сундук из Майнкрафта, ни больше, ни меньше. Хватит вопросов!',
    },
    {
        result: Item.TOOLKIT,
        parts: [{ item: Item.IRON_INGOT, count: 5, sprite: imgIronIngot }],
        sprite: imgToolkit,
        name: 'Ремнабор',
        description: 'Все травмы можно залатать, если они не душевные. Восполняет жизни (расходник)',
    },
    {
        result: Item.EXTRA_SLOT,
        parts: [{ item: Item.IRON_INGOT, count: 40, sprite: imgIronIngot }],
        sprite: imgExtraSlotItem,
        name: 'Допслот',
        description: 'Как же замечательно иметь ещё чуть-чуть места под рукой! Сюда можно положить немного счастья.',
    },
    {
        result: Item.SUN_BATERY,
        parts: [{ item: Item.SILIKON, count: 15, sprite: imgSiliconItem }, { item: Item.CRYSTAL, count: 30, sprite: imgCrystalItem }],
        sprite: imgSunBatteryItem,
        name: 'Сол панель ур.1',
        description: 'Без батарей, как без рук! Позволяет получать энергию днём; уменьшает запас энергии в 2 раза...',
    },
    {
        result: Item.GOLDEN_CAMERA,
        parts: [{ item: Item.AURIT_INGOT, count: 15, sprite: imgAuritIngot }],
        sprite: imgGoldenCamera,
        name: 'Зоркая камера',
        description: 'Действительно ауритовая вещь! Позволяет видеть врагов издалека. Выводит на экран жизни врагов и их местонахождение',
    },
    {
        result: Item.KNOWLEDGE_OF_BALLISTICS,
        parts: [{ item: Item.SILIKON, count: 60, sprite: imgSiliconItem }],
        sprite: imgKnowledgeOfBallistics,
        name: 'Знание баллистики',
        description: 'С помощью силикона получилось починить книгу. Катапульты так похожи на вулканы...',
    },
    {
        result: Item.SHAKING_DETECTOR,
        parts: [{ item: Item.IRON_INGOT, count: 30, sprite: imgIronIngot }],
        sprite: imgShakingDetector,
        name: 'Детектор тряски',
        description: 'Настроен различать самые мелкие колебания, даже колебания от гейзеров.',
    },
    {
        result: Item.SHOCKPROOF_BODY,
        parts: [{ item: Item.SILIKON, count: 30, sprite: imgSiliconItem },
        { item: Item.AURIT_INGOT, count: 30, sprite: imgAuritIngot }],
        sprite: imgShockProofBody,
        name: 'Крепкое тело',
        description: 'Красивый ауритовый корпус говорит о непрочности, но слой силикона говорит обратное. Больше жизней',
    },
    {
        result: Item.METEORITE_STUFF,
        parts: [{ item: Item.IGNEOUS_INGOT, count: 20, sprite: imgIgneousIngot }],
        sprite: imgMeteoriteStuff,
        name: 'Метеопосох',
        description: 'Эта вещь может вызвать метеорит, который упадёт на выбранную область. Хорошо бабахнуло',
    },
];

const GAME_LENGTH = ONE_DAY * 3;

let timers: number[] = [];

let map: Tile[] = [];

let slotCount = 5;
let inventory: InventorySlot[] = [];

let drawQueue: DrawQueueItem[] = [];

let alpha = 0;

let gameObjects: GameObject[] = [];

let particles: particle[] = [];

let globalPlayer = addGameObject(GameObjectType.PLAYER, 0, 0);

let screenShakes: screenShake[] = [{ strength: 0, duration: addTimer(0) }];

let craftMode = false;
let firstRecipeIndex = 0;
let mainSlot = 0;
let controlledStorage: Tile = null;

let dayTimer = addTimer(ONE_DAY);
let gameTimer = addTimer(GAME_LENGTH);

let event = Event.NONE;


let timeBetweenEvents = GAME_LENGTH / 4;
let eventEnd = GAME_LENGTH;

let hpShakeTimer = addTimer(0);

let globalBoss: GameObject = null;

let recentShake: screenShake = { strength: 0, duration: addTimer(0) };

let gameState = GameState.MENU;

let menuTexts: Text[] = [];

handleResize();

function restate() {
    gameObjects = [];
    particles = [];
    map = [];
    timers = [];
    menuTexts = [];

    slotCount = 5;
    for (let itemIndex = 0; itemIndex < inventory.length; itemIndex++) {
        inventory[itemIndex] = { item: Item.NONE, count: 0, cooldown: 0 };
    }

    craftMode = false;
    firstRecipeIndex = 0;
    mainSlot = 0;
    controlledStorage = null;

    screenShakes = [{ strength: 0, duration: addTimer(0) }];

    dayTimer = addTimer(ONE_DAY);
    gameTimer = addTimer(GAME_LENGTH);

    event = Event.NONE;

    timeBetweenEvents = GAME_LENGTH / 4;
    eventEnd = GAME_LENGTH;

    hpShakeTimer = addTimer(0);

    globalBoss = null;

    recentShake = { strength: 0, duration: addTimer(0) };

    globalPlayer = addGameObject(GameObjectType.PLAYER, 0, 0);
}

function getIndexFromCoords(x: number, y: number) {
    let result = y * TILE.chunkSizeX * TILE.chunkCountX + x;
    if (x > TILE.chunkCountX * TILE.chunkSizeX || y > TILE.chunkCountY * TILE.chunkSizeY || x < 0 || y < 0) {
        result = -100;
    }
    return (result);
}

function getTileUnderMouse() {
    let [x, y] = pixelsToTiles(mouse.worldX, mouse.worldY);
    let tile = map[getIndexFromCoords(x, y)];
    return (tile);
}

function tilesToPixels(x: number, y: number) {
    let result = [x * TILE.width, y * TILE.height];
    return result;
}

function pixelsToTiles(x: number, y: number) {
    let result = [Math.round(x / TILE.width), Math.round(y / TILE.height)];
    return result;
}

for (let i = 0; i < slotCount; i++) {
    inventory.push(new InventorySlot());
}


function addItem(item: Item, count: number) {
    let resultSlot = getInventorySlotWithItem(item);
    if (!resultSlot) {
        for (let slotIndex = 0; slotIndex < inventory.length; slotIndex++) {
            let slot = inventory[slotIndex];
            if (slot.item === Item.NONE) {
                resultSlot = slot;
                break;
            }
        }
    }

    resultSlot.item = item;
    resultSlot.count += count;
}

function addItemToStorage(item: Item, count: number, tile: Tile) {
    let resultSlot = getStorageSlotWithItem(item, tile);
    if (!resultSlot) {
        for (let slotIndex = 0; slotIndex < STORAGE_SLOT_COUNT; slotIndex++) {
            let slot = tile.inventory[slotIndex];
            if (slot.item === Item.NONE) {
                resultSlot = slot;
                break;
            }
        }
    }

    resultSlot.item = item;
    resultSlot.count += count;
}

function removeItem(item: Item, count: number) {
    let slot = getInventorySlotWithItem(item);
    console.assert(slot.count >= count, 'В инвентаре слишком мало этого предмета');
    slot.count -= count;
    if (slot.count === 0) {
        slot.item = Item.NONE;
    }
}

function removeItemFromStorage(item: Item, count: number, tile: Tile) {
    let slot = getStorageSlotWithItem(item, tile);
    console.assert(slot.count >= count, 'В храгилище слишком мало этого предмета');
    slot.count -= count;
    if (slot.count === 0) {
        slot.item = Item.NONE;
    }
}

function getInventorySlotIndexWithItem(item: Item) {
    let result: number = -1;
    for (let slotIndex = 0; slotIndex < inventory.length; slotIndex++) {
        let slot = inventory[slotIndex];
        if (slot.item === item) {
            result = slotIndex;
            break;
        }
    }
    return result;
}

function getInventorySlotWithItem(item: Item) {
    let index = getInventorySlotIndexWithItem(item);
    let result = null;
    if (index >= 0) {
        result = inventory[index];
    }
    return result;
}

function getStorageSlotIndexWithItem(item: Item, tile: Tile) {
    let result: number = -1;
    for (let slotIndex = 0; slotIndex < STORAGE_SLOT_COUNT; slotIndex++) {
        let slot = tile.inventory[slotIndex];
        if (slot.item === item) {
            result = slotIndex;
            break;
        }
    }
    return result;
}

function getStorageSlotWithItem(item: Item, tile: Tile) {
    let index = getStorageSlotIndexWithItem(item, tile);
    let result = null;
    if (index >= 0) {
        result = tile.inventory[index];
    }
    return result;
}

function isInventoryFullForItem(result: Item) {
    let inventoryFull = true;
    for (let inventoryIndex = 0; inventoryIndex < slotCount; inventoryIndex++) {
        if (inventory[inventoryIndex].item === Item.NONE || inventory[inventoryIndex].item === result) {
            inventoryFull = false;
        }
    }
    return (inventoryFull);
}

function isStoraggeFullForItem(result: Item, tile: Tile) {
    let inventoryFull = true;
    for (let inventoryIndex = 0; inventoryIndex < STORAGE_SLOT_COUNT; inventoryIndex++) {
        if (tile.inventory[inventoryIndex].item === Item.NONE || tile.inventory[inventoryIndex].item === result) {
            inventoryFull = false;
        }
    }
    return (inventoryFull);
}

function craftRecipe(recipe: Recipe) {
    let canCraft = !isInventoryFullForItem(recipe.result);
    for (let partIndex = 0; partIndex < recipe.parts.length; partIndex++) {
        let part = recipe.parts[partIndex];
        let slot = getInventorySlotWithItem(part.item);
        if (!(slot && slot.count >= part.count)) {
            canCraft = false;
            break;
        }
        if (slot && slot.count === part.count) {
            canCraft = true;
        }
    }

    if (canCraft) {
        for (let partIndex = 0; partIndex < recipe.parts.length; partIndex++) {
            let part = recipe.parts[partIndex];
            removeItem(part.item, part.count);
        }
        addItem(recipe.result, 1);
    }
}

export function drawSprite(x: number, y: number, sprite: any, angle: number, width: number = 0, height: number = 0, fromThePoint: boolean = false, z: number = Layer.TILE) {
    let mainSide = width;
    if (height > width) {
        mainSide = height;
    }
    if (!fromThePoint) {
        if (x > camera.x - camera.width * 0.5 - mainSide / 2 &&
            x < camera.x + camera.width * 0.5 + mainSide / 2 &&
            y > camera.y - camera.height * 0.5 - mainSide / 2 &&
            y < camera.y + camera.height * 0.5 + mainSide / 2) {
            drawQueue.push({ x, y, sprite, angle, width, height, fromThePoint, z, type: DrawQueueType.IMAGE });
        }
    } else {
        if (x > camera.x - camera.width * 0.5 - mainSide * 4 &&
            x < camera.x + camera.width * 0.5 + mainSide * 4 &&
            y > camera.y - camera.height * 0.5 - mainSide * 4 &&
            y < camera.y + camera.height * 0.5 + mainSide * 4) {
            drawQueue.push({ x, y, sprite, angle, width, height, fromThePoint, z, type: DrawQueueType.IMAGE });
        }
    }
}

export function drawRect(
    x: number, y: number, width: number, height: number, angle: number, color: string, outlineOnly: number, z = Layer.TILE
) {
    if (x > camera.x - camera.width * 0.5 - width / 2 &&
        x < camera.x + camera.width * 0.5 + width / 2 &&
        y > camera.y - camera.height * 0.5 - height / 2 &&
        y < camera.y + camera.height * 0.5 + height / 2) {
        drawQueue.push({ x, y, width, height, color: [color], angle, z, outlineOnly, type: DrawQueueType.RECT });
    }
}

export function drawCircle(x: number, y: number, radius: number, color: string, outlineOnly: number, z = Layer.TILE) {
    if (x > camera.x - camera.width * 0.5 - radius &&
        x < camera.x + camera.width * 0.5 + radius &&
        y > camera.y - camera.height * 0.5 - radius &&
        y < camera.y + camera.height * 0.5 + radius) {
        drawQueue.push({ x, y, radius, color: [color], z, outlineOnly, type: DrawQueueType.CIRCLE });
    }
}

export function drawText(x: number, y: number, width: number, intervalsBettweenLines: number, color: string, text: string, textSize: number, textAlign: CanvasTextAlign, z = Layer.UI) {
    if (x > camera.x - camera.width * 0.5 - textSize / 2 &&
        x < camera.x + camera.width * 0.5 + textSize / 2 &&
        y > camera.y - camera.height * 0.5 - textSize / 2 &&
        y < camera.y + camera.height * 0.5 + textSize / 2) {
        if (width > 0 && ctx.measureText(text).width > width) {
            let textNumber = -1;
            let words = text.split(' ');
            let wordNumber = 0;
            while (wordNumber < words.length) {
                textNumber++;
                let textSample: string = '';
                while (ctx.measureText(textSample).width + ctx.measureText(words[wordNumber]).width < width && words[wordNumber] && words[wordNumber] !== '/') {
                    textSample += words[wordNumber] + ' ';
                    wordNumber++;
                }
                if (words[wordNumber] === '/') {
                    wordNumber++;
                }
                drawQueue.push({ x, y: y + textNumber * intervalsBettweenLines, color: [color], text: textSample, z, type: DrawQueueType.TEXT, textSize, textAlign });
            }
        } else {
            drawQueue.push({ x, y, color: [color], text, z, type: DrawQueueType.TEXT, textSize, textAlign });
        }
    }
}

export function drawLinearGradient(x: number, y: number, width: number, height: number, color: string[], stop: number[], z: number) {
    if (x > camera.x - camera.width * 0.5 - width / 2 &&
        x < camera.x + camera.width * 0.5 + width / 2 &&
        y > camera.y - camera.height * 0.5 - height / 2 &&
        y < camera.y + camera.height * 0.5 + height / 2) {
        drawQueue.push({ x, y, width, height, color, stop, z, type: DrawQueueType.LINEAR_GRADIENT });
    }
}

const MORNING_TIME = NIGHT_LENGTH + AFTERNOON_LENGTH + DAY_LENGTH + MORNING_LENGTH;
const DAY_TIME = NIGHT_LENGTH + AFTERNOON_LENGTH + DAY_LENGTH;
const AFTERNOON_TIME = NIGHT_LENGTH + AFTERNOON_LENGTH;
const NIGHT_TIME = NIGHT_LENGTH;

export function drawLight(x: number, y: number, radius: number) {
    alpha = 0;

    if (timers[dayTimer] <= MORNING_TIME && timers[dayTimer] > DAY_TIME) {
        alpha = 1 - (MORNING_TIME - timers[dayTimer]) / (MORNING_TIME - DAY_TIME);
    } else if (timers[dayTimer] <= DAY_TIME && timers[dayTimer] > AFTERNOON_TIME) {
        alpha = 0;
    } else if (timers[dayTimer] <= AFTERNOON_TIME && timers[dayTimer] > NIGHT_TIME) {
        alpha = (AFTERNOON_TIME - timers[dayTimer]) / (AFTERNOON_TIME - NIGHT_TIME);
    } else if (timers[dayTimer] <= NIGHT_TIME) {
        alpha = 1;
    }

    const DECREASE_TIME = 360;
    const RADIUS_DECREASE = 30;

    if (timers[dayTimer] % DECREASE_TIME < DECREASE_TIME / 2) {
        radius = radius + (timers[dayTimer] % DECREASE_TIME) / DECREASE_TIME * RADIUS_DECREASE;
    } else {
        radius = radius + (DECREASE_TIME / 2 - timers[dayTimer] % (DECREASE_TIME / 2)) / DECREASE_TIME * RADIUS_DECREASE;
    }

    if (x > camera.x - camera.width * 0.5 - radius &&
        x < camera.x + camera.width * 0.5 + radius &&
        y > camera.y - camera.height * 0.5 - radius &&
        y < camera.y + camera.height * 0.5 + radius) {
        backCtx.globalCompositeOperation = 'destination-out';

        let X = x - camera.x + camera.width / 2;
        let Y = y - camera.y + camera.height / 2;

        var gradient = backCtx.createRadialGradient(X, Y, 0, X, Y, radius);

        gradient.addColorStop(0, `white`);
        gradient.addColorStop(1, 'transparent');

        backCtx.fillStyle = gradient;
        backCtx.fillRect(X - radius, Y - radius, 2 * radius, 2 * radius);
    }
}

function addGameObject(type: GameObjectType, x: number, y: number) {
    let gameObject: GameObject = {
        type: type,

        x: x,
        y: y,
        firstX: x,
        firstY: y,
        neededX: null,
        neededY: null,

        width: 100,
        height: 100,
        angle: 0,
        color: 'grey',

        exists: true,

        speed: 0,
        speedX: 0,
        speedY: 0,
        speedLimit: 4,
        speedBackReduction: 0.4,
        friction: 0.95,
        accel: 0,
        accelConst: 0.04,
        rotationSpeed: 0.05,

        goForward: false,
        goBackward: false,
        goLeft: false,
        goRight: false,

        sprite: imgNone,

        leftWeel: 0,
        rightWeel: 0,

        hitpoints: 0,
        maxHitpoints: 0,

        energy: 0,
        maxEnergy: 0,

        unhitableTimer: addTimer(0),
        doNotDraw: false,

        sunBateryLvl: 0,
        luckyCamera: false,
        shakingDetector: false,
        knowledgeOfBallistics: false,

        stuckable: false,

        lifeTime: 0,

        angleZ: 0,

        summoned: false,

        dontMoveWithCamera: false,

        specialTimer: null,

        attack: null,
    }

    if (gameObject.type === GameObjectType.PLAYER) {
        gameObject.sprite = imgPlayer;
        gameObject.hitpoints = 100;
        gameObject.maxHitpoints = 100;
        gameObject.energy = addTimer(10800);
        gameObject.maxEnergy = 10800;
        gameObject.stuckable = true;
    }

    if (gameObject.type === GameObjectType.MAGMA_BALL) {
        gameObject.sprite = imgMagmaBall;
        gameObject.angle = randomFloat(0, Math.PI * 2);
        gameObject.angleZ = randomFloat(0.25 * Math.PI, 0.5 * Math.PI);
    }

    if (gameObject.type === GameObjectType.METEORITE) {
        gameObject.sprite = imgMeteorite;
        gameObject.angle = randomFloat(0, Math.PI * 2);
        gameObject.angleZ = -randomFloat(0.25 * Math.PI, 0.5 * Math.PI);
        gameObject.width = 100 + CAMERA_HEIGHT;
        gameObject.height = 100 + CAMERA_HEIGHT;
    }

    if (gameObject.type === GameObjectType.LAVA_BALL) {
        gameObject.sprite = imgMagmaBall;
        gameObject.angle = randomFloat(0, Math.PI * 2);
        gameObject.angleZ = randomFloat(0, 0.25 * Math.PI);
    }

    if (gameObject.type === GameObjectType.BOSS) {
        gameObject.sprite = imgBoss;
        gameObject.width = 800;
        gameObject.height = 600;
        gameObject.speedLimit = 10;
        gameObject.rotationSpeed = 0.2;
        gameObject.accelConst = 0.05;
        gameObject.hitpoints = 5000;
        gameObject.maxHitpoints = 5000;
        gameObject.specialTimer = addTimer(100);
    }

    if (gameObject.type === GameObjectType.MANIPULATOR) {
        gameObject.firstX = gameObject.x - globalBoss.x;
        gameObject.firstY = gameObject.y - globalBoss.y;
        gameObject.sprite = imgMechanicalHand;
        gameObject.width = 200;
        gameObject.height = 200;
        gameObject.speedLimit = globalBoss.speedLimit * 2;
    }

    if (gameObject.type === GameObjectType.NONE) {
        gameObject.exists = false;
    }

    let freeIndex = gameObjects.length;
    for (let gameObjectIndex = 0; gameObjectIndex < gameObjects.length; gameObjectIndex++) {
        const gameObject = gameObjects[gameObjectIndex];

        if (!gameObject.exists) {
            freeIndex = gameObjectIndex;
            break;
        }
    }
    gameObjects[freeIndex] = gameObject;

    return gameObject;
}

function summonMeteorite(x: number, y: number) {
    let meteorite = addGameObject(GameObjectType.METEORITE, x, y);
    meteorite.summoned = true;
    meteorite.angleZ = -Math.PI * 0.5;
}

function controlGameObject(gameObject: GameObject) {
    if (upKey.isDown) {
        gameObject.goForward = true;
    }

    if (downKey.isDown) {
        gameObject.goBackward = true;
    }

    if (rightKey.isDown) {
        gameObject.goRight = true;
    }

    if (leftKey.isDown) {
        gameObject.goLeft = true;
    }
}

function moveGameObject(gameObject: GameObject) {
    gameObject.accel = 0;
    if (gameObject.goForward) {
        gameObject.accel = gameObject.accelConst;
    } else if (gameObject.goBackward) {
        gameObject.accel = -gameObject.accelConst;
    } else {
        gameObject.speed *= gameObject.friction;
    }

    if (gameObject.goLeft) {
        gameObject.angle -= gameObject.rotationSpeed;
    }
    if (gameObject.goRight) {
        gameObject.angle += gameObject.rotationSpeed;
    }
    gameObject.speed += gameObject.accel;
    if (gameObject.speed > gameObject.speedLimit) {
        gameObject.speed = gameObject.speedLimit;
    }
    if (gameObject.speed < -0.75 * gameObject.speedLimit) {
        gameObject.speed = -0.75 * gameObject.speedLimit;
    }
    gameObject.speedX = gameObject.speed * Math.cos(gameObject.angle);
    gameObject.speedY = gameObject.speed * Math.sin(gameObject.angle);

    for (let tileIndex = 0; tileIndex < map.length; tileIndex++) {
        const other = map[tileIndex];

        const wallLeft = other.x * TILE.width - other.collisionWidth / 2;
        const wallRight = other.x * TILE.width + other.collisionWidth / 2;
        const wallTop = other.y * TILE.height - other.collisionHeight / 2;
        const wallBottom = other.y * TILE.height + other.collisionHeight / 2;

        const playerLeft = gameObject.x - gameObject.width / 2;
        const playerRight = gameObject.x + gameObject.width / 2;
        const playerTop = gameObject.y - gameObject.height / 2;
        const playerBottom = gameObject.y + gameObject.height / 2;

        if (gameObject.stuckable && (other.upperLayer.type === TileType.MOUNTAIN || other.baseLayer.type === TileType.VOLCANO ||
            other.upperLayer.type === TileType.MELTER || other.upperLayer.type === TileType.SPLITTER ||
            other.upperLayer.type === TileType.SUN_BATERY || other.upperLayer.type === TileType.STORAGE)) {

            if (gameObject.speedX !== 0) {
                let side: number;
                let wallSide: number;
                if (gameObject.speedX > 0) {
                    side = playerRight;
                    wallSide = wallLeft;
                } else {
                    side = playerLeft;
                    wallSide = wallRight;
                }

                if (
                    !(playerRight + gameObject.speedX <= wallLeft ||
                        playerLeft + gameObject.speedX >= wallRight ||
                        playerTop >= wallBottom ||
                        playerBottom <= wallTop)
                ) {
                    gameObject.speedX = 0;
                    gameObject.x -= side - wallSide;
                }
            }

            if (gameObject.speedY !== 0) {
                let side: number;
                let wallSide: number;
                if (gameObject.speedY > 0) {
                    side = playerBottom;
                    wallSide = wallTop;
                } else {
                    side = playerTop;
                    wallSide = wallBottom;
                }

                if (
                    !(playerRight <= wallLeft ||
                        playerLeft >= wallRight ||
                        playerTop + gameObject.speedY >= wallBottom ||
                        playerBottom + gameObject.speedY <= wallTop)
                ) {
                    gameObject.speedY = 0;
                    gameObject.y -= side - wallSide;
                }
            }
        }
        globalPlayer.goForward = false;
        globalPlayer.goBackward = false;
        globalPlayer.goLeft = false;
        globalPlayer.goRight = false;
    }


    gameObject.x += gameObject.speedX;
    gameObject.y += gameObject.speedY;
}

function randomFloat(firstNumber: number, lastNumber: number) {
    let randomFloat: number = firstNumber + (lastNumber - firstNumber) * Math.random();
    return (randomFloat)
}

function randomInt(firstNumber: number, lastNumber: number) {
    let randomInt = Math.round(randomFloat(firstNumber, lastNumber));
    return (randomInt);
}

function addTimer(timerLength: number) {
    let timerIndex = timers.length;
    timers.push(timerLength);
    return timerIndex;
}

function updateTimers() {
    for (let timerIndex = 0; timerIndex < timers.length; timerIndex++) {
        if (timers[timerIndex] > 0) {
            timers[timerIndex]--;
        }
    }
}

function rotateVector(x: number, y: number, angle: number) {
    let sin = Math.sin(angle);
    let cos = Math.cos(angle);
    let resultX = x * cos - y * sin;
    let resultY = -y * cos - x * sin;
    return [
        resultX,
        resultY,
    ];
}

function angleBetweenPoints(x1: number, y1: number, x2: number, y2: number) {
    const result = normalizeAngle(Math.atan2(y2 - y1, x2 - x1));
    return result;
}

function addParticle(x: number, y: number, color: string, speed: number, size: number, decrease: number, accel: number) {
    let randomAngle = randomFloat(0, Math.PI * 2);
    let randomSpeed = randomFloat(Math.abs(speed - 0.5), speed + 0.5);
    let [speedX, speedY] = rotateVector(randomSpeed, 0, randomAngle);
    let randomRadius = randomInt(size - 3, size + 3);
    let [accelX, accelY] = rotateVector(accel, 0, randomAngle);
    let randomSizeDecrease = randomFloat(Math.abs(decrease - 0.15), decrease + 0.15);

    let particle = {
        x: x,
        y: y,
        color: color,
        radius: randomRadius,
        speedX: speedX,
        speedY: speedY,
        accelX: accelX,
        accelY: accelY,
        sizeDecrease: randomSizeDecrease,
    };

    particles.push(particle);
}

type ParticleParams = {
    x: number;
    y: number;
    color: string;
    speed: number;
    size: number;
    decrease: number;
    accel: number;
    count: number;
}

function burstParticles({ x, y, color, speed, size, count, decrease, accel }: ParticleParams) {
    for (let particleIndex = 0; particleIndex < count; particleIndex++) {
        addParticle(x, y, color, speed, size, decrease, accel);
    }
}

function updateParticles() {
    for (let particleIndex = 0; particleIndex < particles.length; particleIndex++) {
        let particle = particles[particleIndex];

        if (particle.radius <= 0) {
            removeParticle(particleIndex);
        } else {
            drawCircle(particle.x, particle.y, particle.radius, particle.color, 0, Layer.PARTICLES);
            if (particle.color === 'red' || particle.color === `rgb(254,0,0,1)`) {
                drawLight(particle.x, particle.y, particle.radius * 4);
            }
        }

        particle.radius -= particle.sizeDecrease;
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        particle.speedX += particle.accelX;
        particle.speedY += particle.accelY;

        if (
            (particle.color === 'grey' || particle.color === 'yellow' ||
                particle.color === 'lightcoral' || particle.color === 'dimgray' ||
                particle.color === 'sienna') &&
            particle.radius < 15) {
            let particleAngle = angleBetweenPoints(particle.x, particle.y, globalPlayer.x, globalPlayer.y);
            let particleSpeed = rotateVector(6, 0, particleAngle);
            particle.accelX = 0;
            particle.accelY = 0;
            particle.x += particleSpeed[0] - particle.speedX;
            particle.y -= particleSpeed[1] + particle.speedY;
            if (distanceBetweenPoints(particle.x, particle.y, globalPlayer.x, globalPlayer.y) <= 5) {
                removeParticle(particleIndex);
            }
        }

        //частицы и столковения с ними

        if (particle.color === 'red') {
            if (globalPlayer.width / 2 + particle.radius >= distanceBetweenPoints(globalPlayer.x, globalPlayer.y, particle.x, particle.y) &&
                timers[globalPlayer.unhitableTimer] <= 0) {
                globalPlayer.hitpoints -= 25;
                timers[globalPlayer.unhitableTimer] = 180;
            }
        }

    }
}

function removeParticle(particleIndex: number) {
    let lastParticle = particles[particles.length - 1];
    if (particles[particleIndex].color === 'grey') {
        addItem(Item.IRON, 1);
    }
    if (particles[particleIndex].color === 'yellow') {
        addItem(Item.AURIT, 1);
    }
    if (particles[particleIndex].color === 'lightcoral') {
        addItem(Item.CRYSTAL, 1);
    }
    if (particles[particleIndex].color === 'dimgray') {
        addItem(Item.SILIKON, 1);
    }
    if (particles[particleIndex].color === 'sienna') {
        addItem(Item.IGNEOUS, 1);
    }
    particles[particleIndex] = lastParticle;
    particles.pop();
}

function buildMap() {
    for (let chunkY = 0; chunkY < TILE.chunkCountY; chunkY++) {
        for (let chunkX = 0; chunkX < TILE.chunkCountX; chunkX++) {
            let protoIndex = randomInt(0, CHUNK_PROTOTYPES.length - 1);
            let proto = CHUNK_PROTOTYPES[protoIndex];
            console.assert(TILE.chunkSizeY === proto.length);
            console.assert(TILE.chunkSizeX === proto[0].length);

            for (let tileY = 0; tileY < proto.length; tileY++) {
                let line = proto[tileY];
                for (let tileX = 0; tileX < line.length; tileX++) {
                    let char = line[tileX];
                    let downTileType = null;
                    let upTileType = TileType.NONE;
                    let x = (chunkX * TILE.chunkSizeX + tileX);
                    let y = (chunkY * TILE.chunkSizeX + tileY);
                    let index = getIndexFromCoords(x, y);
                    map[index] = {
                        baseLayer: { type: downTileType, variant: 1 }, upperLayer: { type: upTileType, variant: 1 }, x, y, specialTimer: null, toughness: null,
                        firstToughness: null, oreCount: 5, inventory: [], width: TILE.width, height: TILE.height,
                        collisionWidth: TILE.width, collisionHeight: TILE.height, sound: null,
                    };
                    if (char === '0') {
                        downTileType = TileType.NONE;
                    } else if (char === ' ') {
                        let chance = randomInt(1, 8);
                        if (chance >= 1 && chance <= 6) {
                            map[index].baseLayer.variant = 1;
                        }
                        if (chance === 7) {
                            map[index].baseLayer.variant = 2;
                        }
                        if (chance === 8) {
                            map[index].baseLayer.variant = 3;
                        }
                        downTileType = TileType.EARTH;
                    } else if (char === '#') {
                        downTileType = TileType.EARTH;
                        upTileType = TileType.MOUNTAIN;
                    } else if (char === '@') {
                        downTileType = TileType.GEYSER;
                        map[index].specialTimer = addTimer(randomInt(500, 1400));
                    } else if (char === '*') {
                        downTileType = TileType.VOLCANO;
                        map[index].width = TILE.width * 3;
                        map[index].height = TILE.height * 3;
                        map[index].collisionWidth = TILE.width * 2;
                        map[index].collisionHeight = TILE.height * 2;
                        map[index].specialTimer = addTimer(randomInt(50, 500));
                    } else if (char === '!') {
                        downTileType = TileType.LAVA;
                        map[index].baseLayer.variant = randomInt(1, 2);
                    } else if (char === 'F') {
                        downTileType = TileType.EARTH;
                        upTileType = TileType.IRON;
                        map[index].toughness = 999;
                        map[index].firstToughness = 999;
                    } else if (char === 'A') {
                        downTileType = TileType.EARTH;
                        upTileType = TileType.AURIT;
                        map[index].toughness = 999;
                        map[index].firstToughness = 999;
                    } else if (char === 'C') {
                        downTileType = TileType.EARTH;
                        upTileType = TileType.CRYSTAL;
                        map[index].toughness = 999;
                        map[index].firstToughness = 999;
                    } else if (char = 'S') {
                        downTileType = TileType.EARTH;
                        upTileType = TileType.SILIKON;
                        map[index].toughness = 999;
                        map[index].firstToughness = 999;
                    }
                    map[index].baseLayer.type = downTileType;
                    map[index].upperLayer.type = upTileType;
                }
            }
        }
    }
}

buildMap();

export function screenToWorld(x: number, y: number) {
    const result = [
        x + camera.x - camera.width * 0.5,
        y + camera.y - camera.height * 0.5,
    ];
    return result;
}

export function worldToScreen(x: number, y: number) {
    const result = [
        x - camera.x + camera.width * 0.5,
        y - camera.y + camera.height * 0.5,
    ];
    return result;
}

function distanceBetweenPoints(x1: number, y1: number, x2: number, y2: number) {
    let distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    return distance;
}

function moveToTile(mouseTile: Tile, gameObject: GameObject) {
    let [x, y] = tilesToPixels(mouseTile.x, mouseTile.y);
    let angle = angleBetweenPoints(gameObject.x, gameObject.y, x, y);
    if (gameObject.angle > angle) {
        while (gameObject.angle + Math.PI * 2 < angle || gameObject.angle - Math.PI * 1 >= angle) {
            angle += Math.PI * 2;
        }
    }
    if (gameObject.angle < angle) {
        while (gameObject.angle + Math.PI * 2 < angle || gameObject.angle - Math.PI * 1 >= angle) {
            angle -= Math.PI * 2;
        }
    }

    if (gameObject.angle + gameObject.rotationSpeed > angle && gameObject.angle < angle) {
        gameObject.angle = angle;
    } else if (gameObject.angle - gameObject.rotationSpeed < angle && gameObject.angle > angle) {
        gameObject.angle = angle;
    } else if (gameObject.angle > angle) {
        gameObject.goLeft = true;
    } else if (gameObject.angle < angle) {
        gameObject.goRight = true;
    }
    if (!(gameObject.x > x - (TILE.width / 2 + gameObject.width / 2) - 5 &&
        gameObject.x < x + (TILE.width / 2 + gameObject.width / 2) + 5 &&
        gameObject.y > y - (TILE.height / 2 + gameObject.width / 2) - 5 &&
        gameObject.y < y + (TILE.height / 2 + gameObject.width / 2 + 5))
    ) {
        gameObject.goForward = true;
    }
}

function normalizeAngle(angle: number) {
    while (angle < -Math.PI) {
        angle += Math.PI * 2;
    }
    while (angle > Math.PI) {
        angle -= Math.PI * 2;
    }
    return angle;
}

type screenShake = {
    strength: number;
    duration: number;
}

function makeScreenShake(strength: number, duration: number) {
    for (let shakeIndex = 0; shakeIndex < screenShakes.length; shakeIndex++) {
        if (timers[screenShakes[shakeIndex].duration] <= 0 || screenShakes[shakeIndex].strength <= 0) {
            screenShakes[shakeIndex] = { strength: strength, duration: addTimer(duration) };
            break;
        } else if (shakeIndex === screenShakes.length - 1) {
            screenShakes.push({ strength: strength, duration: addTimer(duration) });
            break;
        }
    }
}

function updateTile(tileType: TileType, tile: Tile) {
    let upSprite = imgNone;
    let downSprite = imgNone;
    switch (tileType) {
        case TileType.GEYSER: {
            downSprite = imgGeyser;
            let burstDuration = 250;
            let geyserMinRecharge = 500;
            let geyserMaxRecharge = 1500;
            if (tile.upperLayer.type === TileType.NONE) {
                if (timers[tile.specialTimer] === burstDuration) {
                    tile.sound = playSound(sndGeyser);
                }
                if (tile.sound) {
                    let maxDistance = camera.width * 0.75;
                    let volume;
                    if (distanceBetweenPoints(globalPlayer.x, globalPlayer.y, tile.x * TILE.width, tile.y * TILE.height) <= maxDistance) {
                        volume = 1 - distanceBetweenPoints(globalPlayer.x, globalPlayer.y, tile.x * TILE.width, tile.y * TILE.height) / maxDistance;
                    } else {
                        volume = 0;
                    }

                    tile.sound.volume = volume * 0.5;

                }
                if (
                    tile.x * TILE.width > camera.x - camera.width / 2 - tile.width / 2
                    && tile.x * TILE.width < camera.x + camera.width / 2 + tile.width / 2
                    && tile.y * TILE.height > camera.y - camera.height / 2 - tile.height / 2
                    && tile.y * TILE.height < camera.y + camera.height / 2 + tile.height / 2
                ) {


                    if (globalPlayer.shakingDetector && timers[tile.specialTimer] < burstDuration + 50 && timers[tile.specialTimer] > burstDuration) {
                        drawSprite(tile.x * tile.width, tile.y * tile.height, imgAlert, 0, tile.width, tile.height, false, Layer.UPPER_TILE);
                    }

                    if (timers[tile.specialTimer] <= 0) {
                        timers[tile.specialTimer] = randomInt(geyserMinRecharge, geyserMaxRecharge);
                    }
                    if (timers[tile.specialTimer] > burstDuration && particles.length > 150) {
                        timers[tile.specialTimer]++;
                    }
                    if (timers[tile.specialTimer] <= burstDuration && timers[tile.specialTimer] % 2 === 0) {
                        let color;
                        if (distanceBetweenPoints(globalPlayer.x, globalPlayer.y, tile.x * TILE.width, tile.y * TILE.height) < 100 * globalPlayer.speedLimit) {
                            color = 'red';
                        } else {
                            color = `rgb(254,0,0,1)`;
                        }
                        burstParticles({
                            x: tile.x * TILE.width,
                            y: tile.y * TILE.height,
                            color: color,
                            speed: 5,
                            size: 45,
                            decrease: 1,
                            accel: -0.05,
                            count: 1,
                        });
                    }
                } else {
                    if (timers[tile.specialTimer] > 300) {
                        timers[tile.specialTimer]++;
                    }
                }
            }
        } break;
        case TileType.EARTH: {
            if (tile.baseLayer.variant === 1) {
                downSprite = imgEarth1;
            } else if (tile.baseLayer.variant === 2) {
                downSprite = imgEarth2;
            } else {
                downSprite = imgEarth3;
            }
        } break;
        case TileType.LAVA: {
            drawLight(tile.x * TILE.width, tile.y * TILE.height, TILE.width * 1.2);
            if (tile.baseLayer.variant === 1) {
                downSprite = imgLava1;
            } else {
                downSprite = imgLava2;
            }

            //края лавы
            let rightTile = {
                x: tile.x + 1,
                y: tile.y,
                isLava: false,
            }
            let uprightTile = {
                x: tile.x + 1,
                y: tile.y - 1,
                isLava: false,
            }
            let upTile = {
                x: tile.x,
                y: tile.y - 1,
                isLava: false,
            }
            let upleftTile = {
                x: tile.x - 1,
                y: tile.y - 1,
                isLava: false,
            }
            let leftTile = {
                x: tile.x - 1,
                y: tile.y,
                isLava: false,
            }
            let downleftTile = {
                x: tile.x - 1,
                y: tile.y + 1,
                isLava: false,
            }
            let downTile = {
                x: tile.x,
                y: tile.y + 1,
                isLava: false,
            }
            let downrightTile = {
                x: tile.x + 1,
                y: tile.y + 1,
                isLava: false,
            }

            if (map[getIndexFromCoords(upTile.x, upTile.y)] && map[getIndexFromCoords(upTile.x, upTile.y)].baseLayer.type === TileType.LAVA) {
                upTile.isLava = true;
            }
            if (map[getIndexFromCoords(downTile.x, downTile.y)] && map[getIndexFromCoords(downTile.x, downTile.y)].baseLayer.type === TileType.LAVA) {
                downTile.isLava = true;
            }
            if (map[getIndexFromCoords(leftTile.x, leftTile.y)] && map[getIndexFromCoords(leftTile.x, leftTile.y)].baseLayer.type === TileType.LAVA) {
                leftTile.isLava = true;
            }
            if (map[getIndexFromCoords(rightTile.x, rightTile.y)] && map[getIndexFromCoords(rightTile.x, rightTile.y)].baseLayer.type === TileType.LAVA) {
                rightTile.isLava = true;
            }
            if (map[getIndexFromCoords(downrightTile.x, downrightTile.y)] && map[getIndexFromCoords(downrightTile.x, downrightTile.y)].baseLayer.type === TileType.LAVA) {
                downrightTile.isLava = true;
            }
            if (map[getIndexFromCoords(downleftTile.x, downleftTile.y)] && map[getIndexFromCoords(downleftTile.x, downleftTile.y)].baseLayer.type === TileType.LAVA) {
                downleftTile.isLava = true;
            }
            if (map[getIndexFromCoords(upleftTile.x, upleftTile.y)] && map[getIndexFromCoords(upleftTile.x, upleftTile.y)].baseLayer.type === TileType.LAVA) {
                upleftTile.isLava = true;
            }
            if (map[getIndexFromCoords(uprightTile.x, uprightTile.y)] && map[getIndexFromCoords(uprightTile.x, uprightTile.y)].baseLayer.type === TileType.LAVA) {
                uprightTile.isLava = true;
            }

            //4 стороны
            if (!upTile.isLava && !downTile.isLava && !leftTile.isLava && !rightTile.isLava) {
                drawSprite(tile.x * TILE.width, tile.y * TILE.height, imgEdge4, 0, tile.width, tile.width, false, Layer.ON_TILE);
            }
            //3 стороны
            if (!upTile.isLava && !downTile.isLava && !leftTile.isLava && rightTile.isLava) {
                drawSprite(tile.x * TILE.width, tile.y * TILE.height, imgEdge3, 0, tile.width, tile.width, false, Layer.ON_TILE);
            }
            if (upTile.isLava && !downTile.isLava && !leftTile.isLava && !rightTile.isLava) {
                drawSprite(tile.x * TILE.width, tile.y * TILE.height, imgEdge3, -Math.PI / 2, tile.width, tile.width, false, Layer.ON_TILE);
            }
            if (!upTile.isLava && !downTile.isLava && leftTile.isLava && !rightTile.isLava) {
                drawSprite(tile.x * TILE.width, tile.y * TILE.height, imgEdge3, Math.PI, tile.width, tile.width, false, Layer.ON_TILE);
            }
            if (!upTile.isLava && downTile.isLava && !leftTile.isLava && !rightTile.isLava) {
                drawSprite(tile.x * TILE.width, tile.y * TILE.height, imgEdge3, Math.PI / 2, tile.width, tile.width, false, Layer.ON_TILE);
            }
            //2 стороны
            if (!upTile.isLava && downTile.isLava && !leftTile.isLava && rightTile.isLava) {
                if (downrightTile.isLava) {
                    drawSprite(tile.x * TILE.width, tile.y * TILE.height, imgEdge2_1, 0, tile.width, tile.width, false, Layer.ON_TILE);
                } else {
                    drawSprite(tile.x * TILE.width, tile.y * TILE.height, imgEdge2_3, 0, tile.width, tile.width, false, Layer.ON_TILE);
                }
            }
            if (!upTile.isLava && downTile.isLava && leftTile.isLava && !rightTile.isLava) {
                if (downleftTile.isLava) {
                    drawSprite(tile.x * TILE.width, tile.y * TILE.height, imgEdge2_1, Math.PI / 2, tile.width, tile.width, false, Layer.ON_TILE);
                } else {
                    drawSprite(tile.x * TILE.width, tile.y * TILE.height, imgEdge2_3, Math.PI / 2, tile.width, tile.width, false, Layer.ON_TILE);
                }
            }
            if (upTile.isLava && !downTile.isLava && leftTile.isLava && !rightTile.isLava) {
                if (upleftTile.isLava) {
                    drawSprite(tile.x * TILE.width, tile.y * TILE.height, imgEdge2_1, Math.PI, tile.width, tile.width, false, Layer.ON_TILE);
                } else {
                    drawSprite(tile.x * TILE.width, tile.y * TILE.height, imgEdge2_3, Math.PI, tile.width, tile.width, false, Layer.ON_TILE);
                }
            }
            if (upTile.isLava && !downTile.isLava && !leftTile.isLava && rightTile.isLava) {
                if (uprightTile.isLava) {
                    drawSprite(tile.x * TILE.width, tile.y * TILE.height, imgEdge2_1, Math.PI * 1.5, tile.width, tile.width, false, Layer.ON_TILE);
                } else {
                    drawSprite(tile.x * TILE.width, tile.y * TILE.height, imgEdge2_3, Math.PI * 1.5, tile.width, tile.width, false, Layer.ON_TILE);
                }
            }

            if (upTile.isLava && downTile.isLava && !leftTile.isLava && !rightTile.isLava) {
                drawSprite(tile.x * TILE.width, tile.y * TILE.height, imgEdge2_2, Math.PI / 2, tile.width, tile.width, false, Layer.ON_TILE);
            }
            if (!upTile.isLava && !downTile.isLava && leftTile.isLava && rightTile.isLava) {
                drawSprite(tile.x * TILE.width, tile.y * TILE.height, imgEdge2_2, 0, tile.width, tile.width, false, Layer.ON_TILE);
            }

            //1 сторона
            if (upTile.isLava && downTile.isLava && leftTile.isLava && !rightTile.isLava) {
                drawSprite(tile.x * TILE.width, tile.y * TILE.height, imgEdge1, 0, tile.width, tile.width, false, Layer.ON_TILE);
            }
            if (!upTile.isLava && downTile.isLava && leftTile.isLava && rightTile.isLava) {
                drawSprite(tile.x * TILE.width, tile.y * TILE.height, imgEdge1, -Math.PI / 2, tile.width, tile.width, false, Layer.ON_TILE);
            }
            if (upTile.isLava && downTile.isLava && !leftTile.isLava && rightTile.isLava) {
                drawSprite(tile.x * TILE.width, tile.y * TILE.height, imgEdge1, Math.PI, tile.width, tile.width, false, Layer.ON_TILE);
            }
            if (upTile.isLava && !downTile.isLava && leftTile.isLava && rightTile.isLava) {
                drawSprite(tile.x * TILE.width, tile.y * TILE.height, imgEdge1, Math.PI / 2, tile.width, tile.width, false, Layer.ON_TILE);
            }

            //1 бочок
            if (rightTile.isLava && downTile.isLava &&
                !downrightTile.isLava) {
                drawSprite(tile.x * TILE.width, tile.y * TILE.height, imgSide1, 0, tile.width, tile.width, false, Layer.ON_TILE);
            }
            if (leftTile.isLava && downTile.isLava &&
                !downleftTile.isLava) {
                drawSprite(tile.x * TILE.width, tile.y * TILE.height, imgSide1, Math.PI / 2, tile.width, tile.width, false, Layer.ON_TILE);
            }
            if (leftTile.isLava && upTile.isLava &&
                !upleftTile.isLava) {
                drawSprite(tile.x * TILE.width, tile.y * TILE.height, imgSide1, Math.PI, tile.width, tile.width, false, Layer.ON_TILE);
            }
            if (rightTile.isLava && upTile.isLava &&
                !uprightTile.isLava) {
                drawSprite(tile.x * TILE.width, tile.y * TILE.height, imgSide1, -Math.PI / 2, tile.width, tile.width, false, Layer.ON_TILE);
            }

        } break;
        case TileType.MELTER: {
            drawLight(tile.x * TILE.width, tile.y * TILE.height, TILE.width * 0.75);
            upSprite = imgMelter;
            if (timers[tile.specialTimer] > 0) {
                drawText(tile.x * TILE.width - 10, tile.y * TILE.height, 0, 0, 'blue', `${Math.ceil(timers[tile.specialTimer] / 60)}`, 30, 'left', Layer.UI);
            }
            if (tile.specialTimer && timers[tile.specialTimer] % 120 === 0) {
                tile.inventory[1].count++;
                if (tile.inventory[0].item === Item.IRON) {
                    tile.inventory[1].item = Item.IRON_INGOT;
                }
                if (tile.inventory[0].item === Item.AURIT) {
                    tile.inventory[1].item = Item.AURIT_INGOT;
                }
                if (tile.inventory[0].item === Item.IGNEOUS) {
                    tile.inventory[1].item = Item.IGNEOUS_INGOT;
                }
                tile.inventory[0].count--;
                if (timers[tile.specialTimer] === 0) {
                    tile.specialTimer = null;
                }
            }

            console.log(tile.inventory[0].item, tile.inventory[0].count, tile.inventory[1].item, tile.inventory[1].count)

            if (tile.inventory[0].count <= 0) {
                tile.inventory[0].item = Item.NONE;
            }
            if (tile.inventory[1].count <= 0) {
                tile.inventory[1].item = Item.NONE;
            }

            if (!mouse.isDown) {
                tile.toughness = tile.firstToughness;
            }
        } break;
        case TileType.SPLITTER: {
            upSprite = imgSplitter;
            if (!mouse.isDown) {
                tile.toughness = tile.firstToughness;
            }
        } break;
        case TileType.SUN_BATERY: {
            upSprite = imgSunBattery;
        } break;
        case TileType.IRON: {
            if (tile.toughness <= tile.firstToughness && tile.toughness > tile.firstToughness / 5 * 4) {
                downSprite = imgIron1;
            }
            if (tile.toughness <= tile.firstToughness / 5 * 4 && tile.toughness > tile.firstToughness / 5 * 3) {
                downSprite = imgIron2;
            }
            if (tile.toughness <= tile.firstToughness / 5 * 3 && tile.toughness > tile.firstToughness / 5 * 2) {
                downSprite = imgIron3;
            }
            if (tile.toughness <= tile.firstToughness / 5 * 2 && tile.toughness > tile.firstToughness / 5 * 1) {
                downSprite = imgIron4;
            }
            if (tile.toughness <= tile.firstToughness / 5 * 1 && tile.toughness > 0) {
                downSprite = imgIron5;
            }
        } break;
        case TileType.AURIT: {
            if (tile.toughness <= tile.firstToughness && tile.toughness > tile.firstToughness / 5 * 4) {
                downSprite = imgAurit1;
            }
            if (tile.toughness <= tile.firstToughness / 5 * 4 && tile.toughness > tile.firstToughness / 5 * 3) {
                downSprite = imgAurit2;
            }
            if (tile.toughness <= tile.firstToughness / 5 * 3 && tile.toughness > tile.firstToughness / 5 * 2) {
                downSprite = imgAurit3;
            }
            if (tile.toughness <= tile.firstToughness / 5 * 2 && tile.toughness > tile.firstToughness / 5 * 1) {
                downSprite = imgAurit4;
            }
            if (tile.toughness <= tile.firstToughness / 5 * 1 && tile.toughness > 0) {
                downSprite = imgAurit5;
            }
        } break;
        case TileType.CRYSTAL: {
            if (tile.toughness <= tile.firstToughness && tile.toughness > tile.firstToughness / 5 * 4) {
                downSprite = imgCrystal1;
            }
            if (tile.toughness <= tile.firstToughness / 5 * 4 && tile.toughness > tile.firstToughness / 5 * 3) {
                downSprite = imgCrystal2;
            }
            if (tile.toughness <= tile.firstToughness / 5 * 3 && tile.toughness > tile.firstToughness / 5 * 2) {
                downSprite = imgCrystal3;
            }
            if (tile.toughness <= tile.firstToughness / 5 * 2 && tile.toughness > tile.firstToughness / 5 * 1) {
                downSprite = imgCrystal4;
            }
            if (tile.toughness <= tile.firstToughness / 5 * 1 && tile.toughness > 0) {
                downSprite = imgCrystal5;
            }
        } break;
        case TileType.SILIKON: {
            if (tile.toughness <= tile.firstToughness && tile.toughness > tile.firstToughness / 5 * 4) {
                downSprite = imgSilicon1;
            }
            if (tile.toughness <= tile.firstToughness / 5 * 4 && tile.toughness > tile.firstToughness / 5 * 3) {
                downSprite = imgSilicon2;
            }
            if (tile.toughness <= tile.firstToughness / 5 * 3 && tile.toughness > tile.firstToughness / 5 * 2) {
                downSprite = imgSilicon3;
            }
            if (tile.toughness <= tile.firstToughness / 5 * 2 && tile.toughness > tile.firstToughness / 5 * 1) {
                downSprite = imgSilicon4;
            }
            if (tile.toughness <= tile.firstToughness / 5 * 1 && tile.toughness > 0) {
                downSprite = imgSilicon5;
            }
        } break;
        case TileType.IGNEOUS: {
            downSprite = imgIgneous;
            drawLight(tile.x * TILE.width, tile.y * TILE.height, tile.width * 1.2)
            if (distanceBetweenPoints(globalPlayer.x, globalPlayer.y, tile.x * TILE.width, tile.y * TILE.height) < 100 && timers[globalPlayer.unhitableTimer] <= 0) {
                globalPlayer.hitpoints -= 0.2;
            }
        } break;
        case TileType.MOUNTAIN: {
            upSprite = imgMountain;
        } break;
        case TileType.VOLCANO: {
            downSprite = imgVolcano;
            drawLight(tile.x * TILE.width, tile.y * TILE.height, tile.width * 0.6);
            if (timers[tile.specialTimer] === 40) {
                tile.sound = playSound(sndVolcanoBoom, 1);
            }
            if (
                distanceBetweenPoints(camera.x, camera.y, tile.x * TILE.width, tile.y * TILE.width) < VOLCANO_RADIUS
            ) {
                if (timers[tile.specialTimer] === 0) {
                    addGameObject(GameObjectType.MAGMA_BALL, tile.x * TILE.width, tile.y * TILE.height);
                    timers[tile.specialTimer] = randomInt(60, 240);
                }
                if (tile.sound) {
                    let maxDistance = VOLCANO_RADIUS;
                    let volume;
                    if (distanceBetweenPoints(globalPlayer.x, globalPlayer.y, tile.x * TILE.width, tile.y * TILE.height) <= maxDistance) {
                        volume = 1 - distanceBetweenPoints(globalPlayer.x, globalPlayer.y, tile.x * TILE.width, tile.y * TILE.height) / maxDistance;
                    } else {
                        volume = 0;
                    }

                    tile.sound.volume = volume * 0.75;
                }
            } else {
                timers[tile.specialTimer]++;
            }
        } break;
        case TileType.STORAGE: {
            upSprite = imgStorage;
            if (!mouse.isDown) {
                tile.toughness = tile.firstToughness;
            }
            drawLight(tile.x * tile.width, tile.y * tile.height, tile.width * 1.2);
        } break;
    }

    if (globalBoss && tile.upperLayer.type !== TileType.NONE && distanceBetweenPoints(globalBoss.x, globalBoss.y, tile.x * TILE.width, tile.y * TILE.height) <= globalBoss.height / 2 + tile.width / 2) {
        tile.upperLayer.type = TileType.NONE;
        tile.toughness = 0;
        tile.firstToughness = 0;
        burstParticles({
            x: tile.x * TILE.width,
            y: tile.y * TILE.height,
            color: 'brown',
            speed: 2,
            size: 20,
            count: 20,
            decrease: 0.4,
            accel: 0,
        });
    }

    let [spriteX, spriteY] = tilesToPixels(tile.x, tile.y);
    if (downSprite) {
        drawSprite(spriteX, spriteY, downSprite, 0, tile.width, tile.height, false, Layer.TILE);
    }
    if (upSprite) {
        drawSprite(spriteX, spriteY, upSprite, 0, tile.width, tile.height, false, Layer.UPPER_TILE);
    }
}

function updateTileMap() {
    let firstTile = { x: Math.round((camera.x - VOLCANO_RADIUS) / TILE.width), y: Math.round((camera.y - VOLCANO_RADIUS) / TILE.width) };
    let lastTile = { x: Math.round((camera.x + VOLCANO_RADIUS) / TILE.width), y: Math.round((camera.y + VOLCANO_RADIUS) / TILE.width) };
    for (let y = firstTile.y; y < lastTile.y; y++) {
        for (let x = firstTile.x; x < lastTile.x; x++) {
            let tile = map[getIndexFromCoords(x, y)];
            if (tile) {
                updateTile(tile.baseLayer.type, tile);
                updateTile(tile.upperLayer.type, tile);
            }
        }
    }
}

function updateGameObject(gameObject: GameObject) {
    let mouseTile = getTileUnderMouse();

    //мерцание при ударе

    if (timers[gameObject.unhitableTimer] > 0) {
        gameObject.doNotDraw = !gameObject.doNotDraw;
    }
    if (timers[gameObject.unhitableTimer] === 0) {
        gameObject.doNotDraw = false;
    }

    if (gameObject.type === GameObjectType.PLAYER) {
        //прорисовка
        if (!gameObject.doNotDraw) {
            drawSprite(gameObject.x, gameObject.y, gameObject.sprite, gameObject.angle, gameObject.width, gameObject.height, false, Layer.PLAYER);
        }
        //считывание кнопок
        controlGameObject(gameObject);

        //рисование света вокруг
        drawLight(gameObject.x, gameObject.y, gameObject.width * 2.5);

        //стрелка на босса

        if (
            globalBoss && gameObject.luckyCamera &&
            !(
                globalBoss.x > camera.x - camera.width / 2 &&
                globalBoss.x < camera.x + camera.width / 2 &&
                globalBoss.y > camera.y - camera.height / 2 &&
                globalBoss.y < camera.y + camera.height / 2
            )
        ) {
            let angle = angleBetweenPoints(camera.x, camera.y, globalBoss.x, globalBoss.y);
            drawSprite(camera.x, camera.y, imgArrow2, angle, camera.height, camera.height, false, Layer.UI);
        }

        //стрелочка крафтов
        let buttonAngle = Math.PI;
        if (!craftMode) {
            buttonAngle = 0;
        }
        drawSprite(camera.x - camera.width / 2 + 45 / 2, camera.y - camera.height / 4, imgArrow, buttonAngle, 45, 75, false, Layer.UI);

        //жизнь
        let width = gameObject.hitpoints / gameObject.maxHitpoints * STRIPE_WIDTH;

        if (timers[hpShakeTimer] <= 0) {
            timers[hpShakeTimer] = width / STRIPE_WIDTH * 800;
        }

        if (timers[hpShakeTimer] > width / STRIPE_WIDTH * 800) {
            timers[hpShakeTimer] = width / STRIPE_WIDTH * 800;
        }

        let shakeX = 0;
        let shakeY = 0;

        if (timers[hpShakeTimer] < 50 && timers[hpShakeTimer] !== 0 && width / STRIPE_WIDTH <= 0.5) {
            shakeX = randomInt(-5, 5);
            shakeY = randomInt(-5, 5);
        }

        drawLinearGradient(
            camera.x - camera.width / 2 + width / 2 + 50 + shakeX, camera.y - camera.height / 2 + 50 + shakeY, width, STRIPE_HEIGHT,
            ['red', `rgb(${(1 - width / STRIPE_WIDTH) * 255},${width / STRIPE_WIDTH * 255},0,1)`], [0, 1], Layer.UI
        );

        drawSprite(camera.x - camera.width / 2 + 50 + STRIPE_WIDTH / 2 + shakeX, camera.y - camera.height / 2 + 50 + shakeY, imgHp, 0, STRIPE_WIDTH, STRIPE_HEIGHT, false, Layer.UI);

        //энергия

        width = timers[gameObject.energy] / gameObject.maxEnergy * STRIPE_WIDTH;

        drawLinearGradient(
            camera.x - camera.width / 2 + width / 2 + 300, camera.y - camera.height / 2 + 50, width, STRIPE_HEIGHT,
            ['white', `rgb(${(1 - width / STRIPE_WIDTH) * 255},${(1 - width / STRIPE_WIDTH) * 255},${width / STRIPE_WIDTH * 255 + 255},1)`], [0, 1], Layer.UI
        );

        drawSprite(camera.x - camera.width / 2 + 300 + STRIPE_WIDTH / 2, camera.y - camera.height / 2 + 50, imgEnergy, 0, STRIPE_WIDTH * 1.05, STRIPE_HEIGHT, false, Layer.UI);

        //время
        drawSprite(camera.x + camera.width / 2 - 100, camera.y - camera.height / 2 + 140, imgTime, 0, 150, 200, false, Layer.UI);

        let hour = ONE_DAY / (24 + 37 / 60);

        let minute = hour / 60;

        drawText(
            camera.x + camera.width / 2 - 151, camera.y - camera.height / 2 + 82, 0, 0, 'white',
            `${Math.floor((ONE_DAY - timers[dayTimer]) / hour)} : ${Math.floor((ONE_DAY - timers[dayTimer]) / minute) % 60}`, 35, 'left', Layer.UI
        );

        //координаты
        drawText(
            camera.x + camera.width / 2 - 68, camera.y - camera.height / 2 + 155, 0, 0, 'white',
            `${Math.round((gameObject.x) / TILE.width)}`, 35, 'center', Layer.UI
        );

        drawText(
            camera.x + camera.width / 2 - 68, camera.y - camera.height / 2 + 203, 0, 0, 'white',
            `${Math.round((gameObject.y) / TILE.height)}`, 35, 'center', Layer.UI
        );

        //выброс

        if (qKey.wentDown) {
            inventory[mainSlot] = { item: Item.NONE, count: 0, cooldown: addTimer(0) };
        }

        if (isInventoryFullForItem(Item.NONE)) {
            drawText(camera.x + camera.width / 8, camera.y + camera.height / 2 - 40, 0, 0, 'green', 'Нажмите на Q, чтобы выбросить вещь', 25, 'left', Layer.UI);
        }

        //падение в лаву

        let vector1 = rotateVector(20, 0, gameObject.angle + Math.PI / 4);
        let vector2 = rotateVector(20, 0, gameObject.angle + Math.PI * 3 / 4);
        let vector3 = rotateVector(20, 0, gameObject.angle - Math.PI / 4);
        let vector4 = rotateVector(20, 0, gameObject.angle - Math.PI * 3 / 4);
        let mapTile1 = getIndexFromCoords(Math.round((gameObject.x + vector1[0]) / TILE.width), Math.round((gameObject.y + vector1[1]) / TILE.height));
        let mapTile2 = getIndexFromCoords(Math.round((gameObject.x + vector2[0]) / TILE.width), Math.round((gameObject.y + vector2[1]) / TILE.height));
        let mapTile3 = getIndexFromCoords(Math.round((gameObject.x + vector3[0]) / TILE.width), Math.round((gameObject.y + vector3[1]) / TILE.height));
        let mapTile4 = getIndexFromCoords(Math.round((gameObject.x + vector4[0]) / TILE.width), Math.round((gameObject.y + vector4[1]) / TILE.height));
        if (
            map[mapTile1] && map[mapTile2] && map[mapTile3] && map[mapTile4] && map[mapTile1].baseLayer.type === TileType.LAVA &&
            map[mapTile2].baseLayer.type === TileType.LAVA && map[mapTile3].baseLayer.type === TileType.LAVA &&
            map[mapTile4].baseLayer.type === TileType.LAVA
        ) {
            gameObject.exists = false;
        }

        //солнечная батарея
        if (globalPlayer.sunBateryLvl) {
            if (timers[dayTimer] <= DAY_TIME && timers[dayTimer] > AFTERNOON_TIME) {
                timers[globalPlayer.energy] += 2;
            }
            if ((timers[dayTimer] <= MORNING_TIME && timers[dayTimer] > DAY_TIME) || (timers[dayTimer] <= AFTERNOON_TIME && timers[dayTimer] > NIGHT_TIME)) {
                timers[globalPlayer.energy] += 0.66;
            }
            if (timers[globalPlayer.energy] > globalPlayer.maxEnergy) {
                timers[globalPlayer.energy] = globalPlayer.maxEnergy;
            }
        }

        let canUseItems = true;

        //рисование инвентаря 

        for (let itemIndex = 0; itemIndex <= inventory.length; itemIndex++) {
            if (inventory[itemIndex]) {
                const SLOT_WIDTH = 60;
                const LINE_WIDTH = 5;

                let STRIPE_HEIGHT = 10;
                let STRIPE_WIDTH = 30;

                let x = camera.x - slotCount / 2 * SLOT_WIDTH;
                let y = camera.y + camera.height / 2 - SLOT_WIDTH - STRIPE_HEIGHT;
                let slotX = x + (SLOT_WIDTH + LINE_WIDTH) * itemIndex;
                let sprite = null;
                if (inventory[itemIndex].item === Item.NONE) {
                    sprite = imgNone;
                }
                if (inventory[itemIndex].item === Item.IRON) {
                    sprite = imgIronItem;
                }
                if (inventory[itemIndex].item === Item.MELTER) {
                    sprite = imgMelter;
                }
                if (inventory[itemIndex].item === Item.IRON_INGOT) {
                    sprite = imgIronIngot;
                }
                if (inventory[itemIndex].item === Item.AURIT) {
                    sprite = imgAuritItem;
                }
                if (inventory[itemIndex].item === Item.AURIT_INGOT) {
                    sprite = imgAuritIngot;
                }
                if (inventory[itemIndex].item === Item.CRYSTAL) {
                    sprite = imgCrystalItem;
                }
                if (inventory[itemIndex].item === Item.SPLITTER) {
                    sprite = imgSplitter;
                }
                if (inventory[itemIndex].item === Item.TOOLKIT) {
                    sprite = imgToolkit;
                }
                if (inventory[itemIndex].item === Item.SUN_BATERY) {
                    sprite = imgSunBatteryItem;
                }
                if (inventory[itemIndex].item === Item.SILIKON) {
                    sprite = imgSiliconItem;
                }
                if (inventory[itemIndex].item === Item.STORAGE) {
                    sprite = imgStorage;
                }
                if (inventory[itemIndex].item === Item.GOLDEN_CAMERA) {
                    sprite = imgGoldenCamera;
                }
                if (inventory[itemIndex].item === Item.EXTRA_SLOT) {
                    sprite = imgExtraSlotItem;
                }
                if (inventory[itemIndex].item === Item.SHOCKPROOF_BODY) {
                    sprite = imgShockProofBody;
                }
                if (inventory[itemIndex].item === Item.IGNEOUS) {
                    sprite = imgIgneousItem;
                }
                if (inventory[itemIndex].item === Item.IGNEOUS_INGOT) {
                    sprite = imgIgneousIngot;
                }
                if (inventory[itemIndex].item === Item.METEORITE_STUFF) {
                    sprite = imgMeteoriteStuff;
                }
                if (inventory[itemIndex].item === Item.SHAKING_DETECTOR) {
                    sprite = imgShakingDetector;
                }
                if (inventory[itemIndex].item === Item.KNOWLEDGE_OF_BALLISTICS) {
                    sprite = imgKnowledgeOfBallistics;
                }

                drawRect(slotX, y, SLOT_WIDTH, SLOT_WIDTH, 0, `rgb(00,33,66,1)`, 0, Layer.UI)
                drawRect(slotX, y, SLOT_WIDTH, SLOT_WIDTH, 0, 'black', 5, Layer.UI);
                drawRect(slotX, y, SLOT_WIDTH, SLOT_WIDTH, 0, 'grey', 2, Layer.UI);

                if (itemIndex === mainSlot) {
                    drawRect(slotX, y, SLOT_WIDTH, SLOT_WIDTH, 0, 'green', 5, Layer.UI);
                }

                drawSprite(slotX, y, sprite, 0, SLOT_WIDTH - 10, SLOT_WIDTH - 10, false, Layer.UI);
                if (inventory[itemIndex].count > 1) {
                    drawText(slotX, y - SLOT_WIDTH / 2 - 12, 0, 0, 'green', `${inventory[itemIndex].count}`, 25, 'center', Layer.UI);
                }

                if (
                    mouse.worldX > slotX - SLOT_WIDTH / 2 &&
                    mouse.worldX < slotX + SLOT_WIDTH / 2 &&
                    mouse.worldY > y - SLOT_WIDTH / 2 &&
                    mouse.worldY < y + SLOT_WIDTH / 2
                ) {
                    canUseItems = false;
                    if (mouse.wentDown) {
                        mainSlot = itemIndex;
                        if (controlledStorage && !isStoraggeFullForItem(inventory[mainSlot].item, controlledStorage)) {
                            addItemToStorage(inventory[mainSlot].item, inventory[mainSlot].count, controlledStorage);
                            removeItem(inventory[mainSlot].item, inventory[mainSlot].count);
                        }
                    }
                }

                let keys = [key1, key2, key3, key4, key5, key6];

                if (keys[itemIndex].wentDown) {
                    mainSlot = itemIndex;
                }

                //перезарядка
                if (inventory[itemIndex].item === Item.METEORITE_STUFF) {
                    width = timers[inventory[itemIndex].cooldown] / METEOR_STUFF_COOLDOWN * STRIPE_WIDTH;

                    drawRect(
                        slotX, y + SLOT_WIDTH / 2 + STRIPE_HEIGHT / 2 + 3, width, STRIPE_HEIGHT, 0, 'white', 0, Layer.UI
                    );
                }
            }
        }

        //если открыто хранилище

        if (controlledStorage) {
            for (let slotIndex = 0; slotIndex < STORAGE_SLOT_COUNT; slotIndex++) {
                let x;
                let y;
                const SLOT_WIDTH = 60;
                const LINE_WIDTH = 5;
                if (slotIndex <= Math.round(STORAGE_SLOT_COUNT / 2 - 1)) {
                    x = camera.x + camera.width / 2 - SLOT_WIDTH * STORAGE_SLOT_COUNT / 2 - SLOT_WIDTH / 2 + slotIndex * (LINE_WIDTH + SLOT_WIDTH);
                    y = camera.y;
                } else {
                    x = camera.x + camera.width / 2 - SLOT_WIDTH * STORAGE_SLOT_COUNT / 2 - SLOT_WIDTH / 2 + slotIndex * (LINE_WIDTH + SLOT_WIDTH) - (SLOT_WIDTH + LINE_WIDTH) * STORAGE_SLOT_COUNT / 2;
                    y = camera.y + 100;
                }
                let sprite = null;
                if (controlledStorage.inventory[slotIndex].item === Item.NONE) {
                    sprite = imgNone;
                }
                if (controlledStorage.inventory[slotIndex].item === Item.IRON) {
                    sprite = imgIronItem;
                }
                if (controlledStorage.inventory[slotIndex].item === Item.MELTER) {
                    sprite = imgMelter;
                }
                if (controlledStorage.inventory[slotIndex].item === Item.IRON_INGOT) {
                    sprite = imgIronIngot;
                }
                if (controlledStorage.inventory[slotIndex].item === Item.AURIT) {
                    sprite = imgAuritItem;
                }
                if (controlledStorage.inventory[slotIndex].item === Item.AURIT_INGOT) {
                    sprite = imgAuritIngot;
                }
                if (controlledStorage.inventory[slotIndex].item === Item.CRYSTAL) {
                    sprite = imgCrystalItem;
                }
                if (controlledStorage.inventory[slotIndex].item === Item.SPLITTER) {
                    sprite = imgSplitter;
                }
                if (controlledStorage.inventory[slotIndex].item === Item.TOOLKIT) {
                    sprite = imgToolkit;
                }
                if (controlledStorage.inventory[slotIndex].item === Item.SUN_BATERY) {
                    sprite = imgSunBatteryItem;
                }
                if (controlledStorage.inventory[slotIndex].item === Item.SILIKON) {
                    sprite = imgSiliconItem;
                }
                if (controlledStorage.inventory[slotIndex].item === Item.STORAGE) {
                    sprite = imgStorage;
                }
                if (controlledStorage.inventory[slotIndex].item === Item.GOLDEN_CAMERA) {
                    sprite = imgGoldenCamera;
                }
                if (controlledStorage.inventory[slotIndex].item === Item.EXTRA_SLOT) {
                    sprite = imgExtraSlotItem;
                }
                if (controlledStorage.inventory[slotIndex].item === Item.SHOCKPROOF_BODY) {
                    sprite = imgShockProofBody;
                }
                if (controlledStorage.inventory[slotIndex].item === Item.IGNEOUS) {
                    sprite = imgIgneousItem;
                }
                if (controlledStorage.inventory[slotIndex].item === Item.IGNEOUS_INGOT) {
                    sprite = imgIgneousIngot;
                }
                if (controlledStorage.inventory[slotIndex].item === Item.METEORITE_STUFF) {
                    sprite = imgMeteoriteStuff;
                }
                if (controlledStorage.inventory[slotIndex].item === Item.SHAKING_DETECTOR) {
                    sprite = imgShakingDetector;
                }
                if (controlledStorage.inventory[slotIndex].item === Item.KNOWLEDGE_OF_BALLISTICS) {
                    sprite = imgKnowledgeOfBallistics;
                }

                drawRect(x, y, SLOT_WIDTH, SLOT_WIDTH, 0, `rgb(00,33,66,1)`, 0, Layer.UI)
                drawRect(x, y, SLOT_WIDTH, SLOT_WIDTH, 0, 'black', 5, Layer.UI);
                drawRect(x, y, SLOT_WIDTH, SLOT_WIDTH, 0, 'grey', 2, Layer.UI);

                drawSprite(x, y, sprite, 0, SLOT_WIDTH - 10, SLOT_WIDTH - 10, false, Layer.UI);
                if (controlledStorage.inventory[slotIndex].count !== 0) {
                    drawText(x, y - SLOT_WIDTH, 0, 0, 'green', `${controlledStorage.inventory[slotIndex].count}`, 25, 'center', Layer.UI);
                }

                if (
                    mouse.worldX > x - SLOT_WIDTH / 2 &&
                    mouse.worldX < x + SLOT_WIDTH / 2 &&
                    mouse.worldY > y - SLOT_WIDTH / 2 &&
                    mouse.worldY < y + SLOT_WIDTH / 2
                ) {
                    canUseItems = false;
                    if (mouse.wentDown && controlledStorage.inventory[slotIndex].item !== Item.NONE && !isInventoryFullForItem(controlledStorage.inventory[slotIndex].item)) {
                        addItem(controlledStorage.inventory[slotIndex].item, controlledStorage.inventory[slotIndex].count);
                        removeItemFromStorage(controlledStorage.inventory[slotIndex].item, controlledStorage.inventory[slotIndex].count, controlledStorage);
                    }
                }
            }
        }

        //время крафта
        if (mouse.worldX > camera.x - camera.width / 2 &&
            mouse.worldX < camera.x - camera.width / 2 + 45 &&
            mouse.worldY > camera.y - camera.height / 4 - 37.5 &&
            mouse.worldY < camera.y - camera.height / 4 + 37.5
        ) {
            canUseItems = false;
            if (mouse.wentDown) {
                craftMode = !craftMode;
            }
        }
        if (craftMode) {
            //меняем крафты
            if (mouse.worldX > camera.x - camera.width / 2 + 130 &&
                mouse.worldX < camera.x - camera.width / 2 + 170 &&
                mouse.worldY > camera.y - camera.height / 4 + 9 &&
                mouse.worldY < camera.y - camera.height / 4 + 39 &&
                RECIPES[firstRecipeIndex - 1]) {
                canUseItems = false;
                if (mouse.wentDown) {
                    firstRecipeIndex--;
                }
            }
            if (mouse.worldX > camera.x - camera.width / 2 + 130 &&
                mouse.worldX < camera.x - camera.width / 2 + 170 &&
                mouse.worldY > camera.y - camera.height / 4 + 438 &&
                mouse.worldY < camera.y - camera.height / 4 + 466 &&
                RECIPES[firstRecipeIndex + 3]) {
                canUseItems = false;
                if (mouse.wentDown) {
                    firstRecipeIndex++;
                }
            }
            //табличка
            drawSprite(camera.x - camera.width / 2 + 150, camera.y - camera.height / 4 + 200 + 39, imgCrafts, 0, 450, 533, false, Layer.UI);
            //спрайты предметов
            for (let itemIndex = 0; itemIndex < 3; itemIndex++) {
                drawSprite(camera.x - camera.width / 2 + 60, camera.y - camera.height / 4 + 110 + 133 * itemIndex,
                    RECIPES[firstRecipeIndex + itemIndex].sprite, 0, 70, 70, false, Layer.UI);

                drawText(camera.x - camera.width / 2 + 150, camera.y - camera.height / 4 + 63 + 133 * itemIndex, 0, 0,
                    'white', RECIPES[firstRecipeIndex + itemIndex].name, 25, 'center', Layer.UI);

                //их составляющие
                for (let partIndex = 0; partIndex < RECIPES[firstRecipeIndex + itemIndex].parts.length; partIndex++) {
                    let row = 0;
                    if (partIndex > 2) {
                        row = 1;
                    }
                    drawSprite(
                        camera.x - camera.width / 2 + 130 + 50 * partIndex - 150 * row,
                        camera.y - camera.height / 4 + 106 + 133 * itemIndex + 50 * row,
                        RECIPES[firstRecipeIndex + itemIndex].parts[partIndex].sprite, 0, 30, 30, false, Layer.UI
                    );
                    drawText(
                        camera.x - camera.width / 2 + 133 + 50 * partIndex - 150 * row,
                        camera.y - camera.height / 4 + 86 + 133 * itemIndex + 50 * row, 0, 0,
                        'white', `${RECIPES[firstRecipeIndex + itemIndex].parts[partIndex].count}`, 15, 'center', Layer.UI
                    );
                }

                //крафт

                if (
                    mouse.worldX >= camera.x - camera.width / 2 &&
                    mouse.worldX <= camera.x - camera.width / 2 + 300 &&
                    mouse.worldY >= camera.y - camera.height / 4 + 39 + 133 * itemIndex &&
                    mouse.worldY <= camera.y - camera.height / 4 + 133 + 39 + 133 * itemIndex
                ) {
                    drawRect((camera.x * 2 - camera.width + 300) / 2, camera.y - camera.height / 4 + 105.5 + 133 * itemIndex, 300, 133, 0, 'green', 5, Layer.UI);
                    canUseItems = false;
                    drawSprite(camera.x + camera.width / 2 - 250, camera.y, imgDesk, 0, 500, 220, false, Layer.UI);
                    drawText(
                        camera.x + camera.width / 2 - 475, camera.y - 75, 160, 50, 'white',
                        RECIPES[firstRecipeIndex + itemIndex].description, 28, 'left', Layer.UI
                    );
                    if (mouse.wentDown) {
                        craftRecipe(RECIPES[firstRecipeIndex + itemIndex]);
                    }
                }
                //стрелочки
                drawSprite(camera.x - camera.width / 2 + 150, camera.y - camera.height / 4 + 25, imgArrow1, 0, 40, 26, false, Layer.UI);
                drawSprite(camera.x - camera.width / 2 + 150, camera.y - camera.height / 4 + 453, imgArrow1, 1 * Math.PI, 40, 26, false, Layer.UI);
            }
        }

        if (canUseItems) {
            //если нажать на плавильню

            if (
                mouseTile && mouse.wentDown && mouseTile.upperLayer.type === TileType.MELTER &&
                distanceBetweenPoints(gameObject.x, gameObject.y, mouseTile.x * TILE.width, mouseTile.y * TILE.height) <=
                TILE.width + gameObject.width
            ) {
                if (
                    (mouseTile.inventory[0].item === Item.NONE && inventory[mainSlot] ||
                        mouseTile.inventory[0].item === inventory[mainSlot].item) &&
                    (inventory[mainSlot].item === Item.IRON ||
                        inventory[mainSlot].item === Item.AURIT ||
                        inventory[mainSlot].item === Item.IGNEOUS)
                ) {
                    mouseTile.inventory[0].item = inventory[mainSlot].item;
                    mouseTile.inventory[0].count += inventory[mainSlot].count;
                    removeItem(inventory[mainSlot].item, inventory[mainSlot].count);
                    mouseTile.specialTimer = addTimer(mouseTile.inventory[0].count * 2 * 60);
                }
                if (mouseTile.inventory[1].count > 0) {
                    addItem(mouseTile.inventory[1].item, mouseTile.inventory[1].count);
                    mouseTile.inventory[1].count = 0;
                }
            }

            //если нажать на расщепитель

            if (mouseTile && mouse.wentDown && mouseTile.upperLayer.type === TileType.SPLITTER &&
                distanceBetweenPoints(gameObject.x, gameObject.y, mouseTile.x * TILE.width, mouseTile.y * TILE.width)
                <= TILE.width + gameObject.width) {
                if (inventory[mainSlot] && inventory[mainSlot].item === Item.CRYSTAL) {
                    while (timers[gameObject.energy] <= gameObject.maxEnergy && inventory[mainSlot].count > 0) {
                        timers[gameObject.energy] += 2000;
                        removeItem(inventory[mainSlot].item, 1);
                    }
                    if (timers[gameObject.energy] > gameObject.maxEnergy) {
                        timers[gameObject.energy] = gameObject.maxEnergy;
                    }
                }
            }

            //открываем и закрываем хранилище

            if (
                (controlledStorage
                    &&
                    distanceBetweenPoints(gameObject.x, gameObject.y, controlledStorage.x * TILE.width, controlledStorage.y * TILE.width)
                    > TILE.width + gameObject.width) || (mouseTile && mouseTile && mouse.wentDown && mouseTile === controlledStorage)
            ) {
                controlledStorage = null;
            } else if (mouseTile && mouse.wentDown && mouseTile.upperLayer.type === TileType.STORAGE &&
                distanceBetweenPoints(gameObject.x, gameObject.y, mouseTile.x * TILE.width, mouseTile.y * TILE.width)
                <= TILE.width + gameObject.width && !controlledStorage) {
                controlledStorage = mouseTile;
            }


            //используем предметы
            if (mouse.wentDown && inventory[mainSlot]) {
                if (inventory[mainSlot].item === Item.TOOLKIT &&
                    gameObject.hitpoints !== gameObject.maxHitpoints) {
                    gameObject.hitpoints += 100;
                    if (gameObject.hitpoints > gameObject.maxHitpoints) {
                        gameObject.hitpoints = gameObject.maxHitpoints;
                    }
                    removeItem(inventory[mainSlot].item, 1);
                } else if (inventory[mainSlot].item === Item.METEORITE_STUFF && timers[inventory[mainSlot].cooldown] === 0) {
                    summonMeteorite(mouse.worldX, mouse.worldY);
                    timers[inventory[mainSlot].cooldown] = METEOR_STUFF_COOLDOWN;
                }
                if (
                    mouse.worldX >= gameObject.x - gameObject.width / 2 &&
                    mouse.worldX <= gameObject.x + gameObject.width / 2 &&
                    mouse.worldY >= gameObject.y - gameObject.height / 2 &&
                    mouse.worldY <= gameObject.y + gameObject.height / 2
                ) {
                    if (inventory[mainSlot].item === Item.SUN_BATERY) {
                        if (gameObject.sunBateryLvl === 0) {
                            gameObject.sunBateryLvl = 1;
                            timers[gameObject.energy] *= 0.25;
                            gameObject.maxEnergy *= 0.25;
                            removeItem(Item.SUN_BATERY, 1);
                        }
                    }
                    else if (inventory[mainSlot].item === Item.GOLDEN_CAMERA) {
                        if (!gameObject.luckyCamera) {
                            gameObject.luckyCamera = true;
                            removeItem(Item.GOLDEN_CAMERA, 1);
                        }
                    } else if (inventory[mainSlot].item === Item.SHAKING_DETECTOR) {
                        if (!gameObject.shakingDetector) {
                            gameObject.shakingDetector = true;
                            removeItem(Item.SHAKING_DETECTOR, 1);
                        }
                    } else if (inventory[mainSlot].item === Item.KNOWLEDGE_OF_BALLISTICS) {
                        if (!gameObject.knowledgeOfBallistics) {
                            gameObject.knowledgeOfBallistics = true;
                            removeItem(Item.KNOWLEDGE_OF_BALLISTICS, 1);
                        }
                    } else if (inventory[mainSlot].item === Item.EXTRA_SLOT) {
                        if (slotCount === 5) {
                            slotCount++;
                            inventory[slotCount - 1] = { item: Item.NONE, count: 0, cooldown: addTimer(0) }
                            removeItem(Item.EXTRA_SLOT, 1);
                        }
                    } else if (inventory[mainSlot].item === Item.SHOCKPROOF_BODY) {
                        if (gameObject.sprite !== imgShockProofBody) {
                            gameObject.hitpoints = gameObject.hitpoints / gameObject.maxHitpoints * 150;
                            gameObject.maxHitpoints = 150;
                            gameObject.sprite = imgShockProofBody;
                            removeItem(Item.SHOCKPROOF_BODY, 1);
                        }
                    } else {
                        if (gameObject.sunBateryLvl === 1 && !isInventoryFullForItem(Item.SUN_BATERY)) {
                            gameObject.sunBateryLvl = 0;
                            timers[gameObject.energy] *= 100 / 25;
                            gameObject.maxEnergy *= 100 / 25;
                            addItem(Item.SUN_BATERY, 1);
                        }
                    }
                }
            }

            //ставим предметы

            if (mouseTile && mouse.wentDown && !mouseTile.upperLayer.type &&
                distanceBetweenPoints(gameObject.x, gameObject.y, mouseTile.x * TILE.width, mouseTile.y * TILE.height)
                <= TILE.width + gameObject.width + 50
            ) {
                if (!(gameObject.x >= mouseTile.x * TILE.width - TILE.width / 2 - gameObject.width / 2 &&
                    gameObject.x <= mouseTile.x * TILE.width + TILE.width / 2 + gameObject.width / 2 &&
                    gameObject.y >= mouseTile.y * TILE.height - TILE.height / 2 - gameObject.height / 2 &&
                    gameObject.y <= mouseTile.y * TILE.height + TILE.height / 2 + gameObject.height / 2)) {
                    if (inventory[mainSlot] && inventory[mainSlot].item === Item.MELTER && mouseTile.baseLayer.type === TileType.LAVA) {
                        mouseTile.upperLayer = { type: TileType.MELTER, variant: 1 };
                        mouseTile.toughness = 200;
                        mouseTile.firstToughness = 200;
                        mouseTile.specialTimer = null;
                        for (let i = 0; i < 2; i++) {
                            mouseTile.inventory[i] = { item: Item.NONE, count: 0, cooldown: addTimer(0) };
                        }
                        removeItem(Item.MELTER, 1);
                    }
                    if (
                        inventory[mainSlot] && inventory[mainSlot].item === Item.SPLITTER &&
                        !(mouseTile.baseLayer.type === TileType.LAVA || mouseTile.baseLayer.type === TileType.MOUNTAIN
                            || mouseTile.baseLayer.type === TileType.NONE
                            || (mouseTile.baseLayer.type === TileType.GEYSER && timers[mouseTile.specialTimer] <= 300))
                    ) {
                        mouseTile.upperLayer.type = TileType.SPLITTER;
                        mouseTile.toughness = 200;
                        mouseTile.firstToughness = 200;
                        removeItem(Item.SPLITTER, 1);
                    }
                    if (inventory[mainSlot] && inventory[mainSlot].item === Item.SUN_BATERY &&
                        !(mouseTile.baseLayer.type === TileType.LAVA || mouseTile.baseLayer.type === TileType.MOUNTAIN
                            || mouseTile.baseLayer.type === TileType.NONE
                            || (mouseTile.baseLayer.type === TileType.GEYSER && timers[mouseTile.specialTimer] <= 300))) {
                        mouseTile.upperLayer.type = TileType.SUN_BATERY;
                        mouseTile.toughness = 200;
                        mouseTile.firstToughness = 200;
                        removeItem(Item.SUN_BATERY, 1);
                    }
                    if (
                        inventory[mainSlot] && inventory[mainSlot].item === Item.STORAGE &&
                        !(mouseTile.baseLayer.type === TileType.LAVA || mouseTile.baseLayer.type === TileType.MOUNTAIN
                            || mouseTile.baseLayer.type === TileType.NONE
                            || (mouseTile.baseLayer.type === TileType.GEYSER && timers[mouseTile.specialTimer] <= 300))
                    ) {
                        mouseTile.upperLayer.type = TileType.STORAGE;
                        mouseTile.toughness = 200;
                        mouseTile.firstToughness = 200;
                        for (let i = 0; i < STORAGE_SLOT_COUNT; i++) {
                            mouseTile.inventory[i] = { item: Item.NONE, count: 0, cooldown: addTimer(0) };
                        }
                        removeItem(Item.STORAGE, 1);
                    }
                }
            }

            //собираем предметы

            if (mouseTile && mouse.isDown && mouseTile.toughness) {
                //управление мышкой

                moveToTile(mouseTile, gameObject);

                if (gameObject.goForward === false && gameObject.goBackward === false &&
                    gameObject.goLeft === false && gameObject.goRight === false) {
                    let isThereAnItem = false;
                    for (let slotIndex = 0; slotIndex < mouseTile.inventory.length; slotIndex++) {
                        if (mouseTile.inventory[slotIndex].item !== Item.NONE) {
                            isThereAnItem = true;
                        }
                    }
                    if (!isThereAnItem) {
                        if (mouseTile.toughness % 80 === 0 || mouseTile.toughness === 0) {
                            playSound(sndMining, randomFloat(0.25, 0.8));
                        }

                        if (mouseTile.upperLayer.type === TileType.IRON && !isInventoryFullForItem(Item.IRON)) {
                            mouseTile.toughness--;
                        }
                        if (mouseTile.upperLayer.type === TileType.AURIT && !isInventoryFullForItem(Item.AURIT)) {
                            mouseTile.toughness--;
                        }
                        if (mouseTile.upperLayer.type === TileType.CRYSTAL && !isInventoryFullForItem(Item.CRYSTAL)) {
                            mouseTile.toughness--;
                        }
                        if (mouseTile.upperLayer.type === TileType.SILIKON && !isInventoryFullForItem(Item.SILIKON)) {
                            mouseTile.toughness--;
                        }
                        if (mouseTile.upperLayer.type === TileType.MELTER && !isInventoryFullForItem(Item.MELTER)) {
                            mouseTile.toughness--;
                        }
                        if (mouseTile.upperLayer.type === TileType.SPLITTER && !isInventoryFullForItem(Item.SPLITTER)) {
                            mouseTile.toughness--;
                        }
                        if (mouseTile.upperLayer.type === TileType.SUN_BATERY && !isInventoryFullForItem(Item.SUN_BATERY)) {
                            mouseTile.toughness--;
                        }
                        if (mouseTile.upperLayer.type === TileType.STORAGE && !isInventoryFullForItem(Item.STORAGE)) {
                            mouseTile.toughness--;
                        }
                        if (mouseTile.upperLayer.type === TileType.IGNEOUS && !isInventoryFullForItem(Item.IGNEOUS)) {
                            mouseTile.toughness--;
                        }
                    }
                    if ((mouseTile.toughness % Math.round(mouseTile.firstToughness / mouseTile.oreCount) === 0 || mouseTile.toughness === 0)) {
                        let color = null;
                        if (mouseTile.upperLayer.type === TileType.IRON) {
                            color = 'grey';
                        }
                        if (mouseTile.upperLayer.type === TileType.AURIT) {
                            color = 'yellow';
                        }
                        if (mouseTile.upperLayer.type === TileType.CRYSTAL) {
                            color = 'lightcoral';
                        }
                        if (mouseTile.upperLayer.type === TileType.SILIKON) {
                            color = 'dimgray';
                        }
                        if (mouseTile.upperLayer.type === TileType.IGNEOUS) {
                            color = 'sienna';
                        }
                        if (color !== null) {
                            burstParticles({
                                x: mouse.worldX,
                                y: mouse.worldY,
                                color: color,
                                speed: 1,
                                size: 20,
                                decrease: 0,
                                accel: 0,
                                count: 5,
                            });
                        }
                    }
                }
                if (mouseTile.toughness <= 0) {
                    let x = mouseTile.x;
                    let y = mouseTile.y;
                    if (mouseTile.upperLayer.type === TileType.MELTER) {
                        addItem(Item.MELTER, 1);
                    }
                    if (mouseTile.upperLayer.type === TileType.SPLITTER) {
                        addItem(Item.SPLITTER, 1);
                    }
                    if (mouseTile.upperLayer.type === TileType.SUN_BATERY) {
                        addItem(Item.SUN_BATERY, 1);
                    }
                    if (mouseTile.upperLayer.type === TileType.STORAGE) {
                        addItem(Item.STORAGE, 1);
                        if (mouseTile === controlledStorage) {
                            controlledStorage = null;
                        }
                    }
                    mouseTile.upperLayer.type = TileType.NONE;
                }

                let stripeWidth = 300;
                let width = stripeWidth * (mouseTile.toughness / mouseTile.firstToughness);
                drawRect(camera.x + width / 2 - 150, camera.y + camera.height / 4, width, 50, 0, 'green', 0, Layer.UI);
            }
        }

        //прорисовка частей игрока

        if (!gameObject.doNotDraw && gameObject.sunBateryLvl === 1) {
            drawSprite(gameObject.x, gameObject.y, imgSunBatteryAdd, gameObject.angle, gameObject.width, gameObject.height, false, Layer.PLAYER);
        }

        let angle = angleBetweenPoints(gameObject.x, gameObject.y, mouse.worldX, mouse.worldY);

        let cameraSprite = imgNone;

        if (!gameObject.luckyCamera) {
            cameraSprite = imgCamera;
        }
        if (gameObject.luckyCamera) {
            cameraSprite = imgGoldenCamera;
        }

        if (!gameObject.doNotDraw) {
            drawSprite(gameObject.x, gameObject.y, cameraSprite, angle, 30, 30, false, Layer.PLAYER);
        }


        let staticWheelPositions = [
            [46, 40],
            [9, 45],
            [-48, 45],
            [46, -40],
            [9, -45],
            [-48, -45],
        ];

        let wheelPositions = staticWheelPositions.map(p => rotateVector(p[0], p[1], -gameObject.angle));

        if (gameObject.goForward) {
            gameObject.leftWeel++;
            gameObject.rightWeel++;
        } else {
            if (gameObject.goBackward) {
                gameObject.leftWeel--;
                gameObject.rightWeel--;
            } else {
                if (gameObject.goLeft) {
                    gameObject.rightWeel++;
                    gameObject.leftWeel--;
                }
                if (gameObject.goRight) {
                    gameObject.leftWeel++;
                    gameObject.rightWeel--;
                }
            }
        }

        if (gameObject.leftWeel > 5) {
            gameObject.leftWeel = 0;
        }
        if (gameObject.rightWeel > 5) {
            gameObject.rightWeel = 0;
        }
        if (gameObject.leftWeel < 0) {
            gameObject.leftWeel = 5;
        }
        if (gameObject.rightWeel < 0) {
            gameObject.rightWeel = 5;
        }

        const wheelFrames = [
            imgWheel1,
            imgWheel2,
            imgWheel3,
            imgWheel4,
            imgWheel5,
            imgWheel6,
        ];

        if (!gameObject.doNotDraw) {
            let wheelSprite = wheelFrames[gameObject.leftWeel];
            for (let posIndex = 0; posIndex < 3; posIndex++) {
                drawSprite(gameObject.x + wheelPositions[posIndex][0], gameObject.y + wheelPositions[posIndex][1], wheelSprite, gameObject.angle, 25, 12, false, Layer.PLAYER);
            }

            wheelSprite = wheelFrames[gameObject.rightWeel];
            for (let posIndex = 3; posIndex < 6; posIndex++) {
                drawSprite(gameObject.x + wheelPositions[posIndex][0], gameObject.y + wheelPositions[posIndex][1], wheelSprite, gameObject.angle, 25, 12, false, Layer.PLAYER);
            }
        }

        //двигаем игрока
        moveGameObject(gameObject);

        //границы мира
        if (globalPlayer.x < TILE.firstX - TILE.width / 2) {
            globalPlayer.x = TILE.firstX - TILE.width / 2;
        }
        if (globalPlayer.x > TILE.firstX - TILE.width / 2 + TILE.width * TILE.chunkCountX * TILE.chunkSizeX) {
            globalPlayer.x = TILE.firstX - TILE.width / 2 + TILE.width * TILE.chunkCountX * TILE.chunkSizeX;
        }
        if (globalPlayer.y < TILE.firstY - TILE.height / 2) {
            globalPlayer.y = TILE.firstY - TILE.height / 2;
        }
        if (globalPlayer.y > TILE.firstY - TILE.height / 2 + TILE.height * TILE.chunkCountY * TILE.chunkSizeY) {
            globalPlayer.y = TILE.firstY - TILE.height / 2 + TILE.height * TILE.chunkCountY * TILE.chunkSizeY;
        }
    }


    if (gameObject.type === GameObjectType.MAGMA_BALL) {
        let speedZ = MAGMA_BALL_SPEED * Math.sin(gameObject.angleZ)

        let speedXY = MAGMA_BALL_SPEED * Math.cos(gameObject.angleZ);

        let speedVector = rotateVector(speedXY, 0, gameObject.angle);

        gameObject.speedX = speedVector[0];
        gameObject.speedY = speedVector[1];

        gameObject.x += gameObject.speedX;
        gameObject.y += gameObject.speedY;

        gameObject.lifeTime++;

        let height = Layer.UPPER_TILE + speedZ * gameObject.lifeTime - GRAVITATION / 2 * gameObject.lifeTime * gameObject.lifeTime;

        //прорисовка
        drawSprite(gameObject.x, gameObject.y, gameObject.sprite, gameObject.angle + Math.PI / 180 * gameObject.lifeTime, gameObject.width, gameObject.height, false, height);
        drawLight(gameObject.x, gameObject.y, gameObject.width * 1.2);

        //знание баллистики
        let range = MAGMA_BALL_SPEED * MAGMA_BALL_SPEED * Math.sin(2 * gameObject.angleZ) / GRAVITATION;

        let rangeProjections = rotateVector(range, 0, gameObject.angle);

        if (globalPlayer.knowledgeOfBallistics) {
            drawCircle(gameObject.firstX + rangeProjections[0], gameObject.firstY + rangeProjections[1], 50, 'red', 3, Layer.UPPER_TILE);
            drawSprite(gameObject.firstX + rangeProjections[0], gameObject.firstY + rangeProjections[1], imgAlert, 0, 90, 90, false, Layer.UPPER_TILE);
        }

        //размер
        gameObject.width = (100 + height);
        gameObject.height = (100 + height);

        //взрыв
        if (height < Layer.UPPER_TILE) {
            let x = Math.round(gameObject.x / TILE.width);
            let y = Math.round(gameObject.y / TILE.height);
            let tileIndex = getIndexFromCoords(x, y);
            if (map[tileIndex] && map[tileIndex].upperLayer || height <= 0) {
                gameObject.exists = false;

                let maxDistance = VOLCANO_RADIUS;
                let volume;
                if (distanceBetweenPoints(globalPlayer.x, globalPlayer.y, gameObject.x, gameObject.y) <= maxDistance) {
                    volume = 1 - distanceBetweenPoints(globalPlayer.x, globalPlayer.y, gameObject.x, gameObject.y) / maxDistance;
                } else {
                    volume = 0;
                }
                let strength = volume * 15;
                makeScreenShake(strength, 15);
                playSound(sndBoom, volume * 0.5);

                burstParticles({ x: gameObject.x, y: gameObject.y, color: 'red', speed: 5, size: 45, count: 15, decrease: 0.75, accel: 0 });
                let chance = randomFloat(0, 1);
                if (map[tileIndex]) {
                    if (map[tileIndex].upperLayer.type !== TileType.NONE) {
                        if (chance < 0.25 && map[tileIndex].upperLayer.type !== TileType.VOLCANO) {
                            map[tileIndex].upperLayer.type = TileType.NONE;
                            map[tileIndex].toughness = 0;
                            map[tileIndex].firstToughness = 0;
                        }
                    } else {
                        if (chance < 0.25 && map[tileIndex].baseLayer.type !== TileType.NONE && map[tileIndex].baseLayer.type !== TileType.GEYSER
                            && map[tileIndex].baseLayer.type !== TileType.VOLCANO) {
                            map[tileIndex].baseLayer.type = TileType.LAVA;
                            map[tileIndex].baseLayer.variant = randomInt(1, 2);
                        }
                    }
                }
            }
        }
    }

    if (gameObject.type === GameObjectType.METEORITE) {

        let speedZ = METEORITE_SPEED * Math.sin(gameObject.angleZ);

        gameObject.lifeTime++;

        let height = CAMERA_HEIGHT + speedZ * gameObject.lifeTime - GRAVITATION / 2 * gameObject.lifeTime * gameObject.lifeTime;

        //прорисовка
        drawLight(gameObject.x, gameObject.y, gameObject.width * 1.2);
        drawSprite(gameObject.x, gameObject.y, gameObject.sprite, gameObject.angle + Math.PI / 180 * gameObject.lifeTime, gameObject.width, gameObject.height, false, height);

        gameObject.width = (100 + height);
        gameObject.height = (100 + height);

        if (height < Layer.UPPER_TILE) {
            let x = Math.round(gameObject.x / TILE.width);
            let y = Math.round(gameObject.y / TILE.height);
            let tileIndex = getIndexFromCoords(x, y);
            if (map[tileIndex] && map[tileIndex].upperLayer || height <= 0) {
                gameObject.exists = false;

                let maxDistance = VOLCANO_RADIUS;
                let volume;
                if (distanceBetweenPoints(globalPlayer.x, globalPlayer.y, gameObject.x, gameObject.y) <= maxDistance) {
                    volume = 1 - distanceBetweenPoints(globalPlayer.x, globalPlayer.y, gameObject.x, gameObject.y) / maxDistance;
                } else {
                    volume = 0;
                }
                let strength = volume * 15;
                makeScreenShake(strength, 15);
                playSound(sndBoom, volume * 0.5);

                if (gameObject.summoned) {
                    if (globalBoss && distanceBetweenPoints(globalBoss.x, globalBoss.y, gameObject.x, gameObject.y) <= globalBoss.height / 2 + gameObject.width / 2) {
                        globalBoss.hitpoints -= 100;
                    }
                    if (map[tileIndex].upperLayer) {
                        map[tileIndex].upperLayer.type = TileType.NONE;
                        map[tileIndex].toughness = 0;
                        map[tileIndex].oreCount = 0;
                    }
                    if (map[tileIndex].baseLayer.type === TileType.MOUNTAIN) {
                        map[tileIndex].baseLayer.type = TileType.EARTH;
                        map[tileIndex].baseLayer.variant = 1;
                    }
                } else {
                    burstParticles({ x: gameObject.x, y: gameObject.y, color: 'red', speed: 5, size: 80, count: 15, decrease: 1, accel: 0 });
                    let chance = randomFloat(0, 1);
                    if (chance < 0.25) {
                        if (
                            map[tileIndex] && map[tileIndex].baseLayer.type !== TileType.LAVA && map[tileIndex].baseLayer.type !== TileType.MOUNTAIN &&
                            map[tileIndex].baseLayer.type !== TileType.NONE && map[tileIndex].baseLayer.type !== TileType.VOLCANO
                        ) {
                            map[tileIndex].upperLayer.type = TileType.IGNEOUS;
                            map[tileIndex].toughness = 500;
                            map[tileIndex].firstToughness = 500;
                            map[tileIndex].oreCount = 1;
                        }
                    }
                }
            }
        }
    }

    if (gameObject.type === GameObjectType.LAVA_BALL) {

        let speedZ = LAVA_BALL_SPEED * Math.sin(gameObject.angleZ)

        let speedXY = LAVA_BALL_SPEED * Math.cos(gameObject.angleZ);

        let speedVector = rotateVector(speedXY, 0, gameObject.angle);

        gameObject.speedX = speedVector[0];
        gameObject.speedY = speedVector[1];

        gameObject.x += gameObject.speedX;
        gameObject.y += gameObject.speedY;

        gameObject.lifeTime++;

        let height = Layer.BOSS + speedZ * gameObject.lifeTime - GRAVITATION / 2 * gameObject.lifeTime * gameObject.lifeTime;

        //прорисовка
        drawSprite(gameObject.x, gameObject.y, gameObject.sprite, gameObject.angle + Math.PI / 180 * gameObject.lifeTime, gameObject.width, gameObject.height, false, height);
        drawLight(gameObject.x, gameObject.y, gameObject.width * 1.2);

        let range = LAVA_BALL_SPEED * LAVA_BALL_SPEED * Math.sin(2 * gameObject.angleZ) / GRAVITATION;

        let rangeProjections = rotateVector(range, 0, gameObject.angle);

        if (globalPlayer.knowledgeOfBallistics) {
            drawCircle(gameObject.firstX + rangeProjections[0], gameObject.firstY + rangeProjections[1], 10, 'red', 3, Layer.UPPER_TILE);
            drawSprite(gameObject.firstX + rangeProjections[0], gameObject.firstY + rangeProjections[1], imgAlert, 0, 18, 18, false, Layer.UPPER_TILE);
        }

        gameObject.width = (20 + height);
        gameObject.height = (20 + height);

        if (height < Layer.UPPER_TILE) {
            let x = Math.round(gameObject.x / TILE.width);
            let y = Math.round(gameObject.y / TILE.height);
            let tileIndex = getIndexFromCoords(x, y);
            if (map[tileIndex] && map[tileIndex].upperLayer || height <= 0) {
                gameObject.exists = false;
                let x = Math.round(gameObject.x / TILE.width);
                let y = Math.round(gameObject.y / TILE.height);
                let tileIndex = getIndexFromCoords(x, y);
                if (map[tileIndex] && map[tileIndex].baseLayer.type !== TileType.VOLCANO && map[tileIndex].baseLayer.type !== TileType.NONE) {
                    map[tileIndex].upperLayer.type = TileType.NONE;
                    map[tileIndex].baseLayer.type = TileType.LAVA;
                    map[tileIndex].toughness = 0;
                    map[tileIndex].oreCount = 0;
                }
            }
        }
    }

    if (gameObject.type === GameObjectType.BOSS) {
        //прорисовка
        drawSprite(gameObject.x, gameObject.y, gameObject.sprite, gameObject.angle, gameObject.width, gameObject.height, false, Layer.BOSS);

        if (distanceBetweenPoints(gameObject.x, gameObject.y, globalPlayer.x, globalPlayer.y) <= gameObject.height / 2 + globalPlayer.width / 2 && timers[globalPlayer.unhitableTimer] === 0) {
            globalPlayer.hitpoints -= 25;
            timers[globalPlayer.unhitableTimer] = 150;
            if (gameObject.attack === 0) {
                timers[gameObject.specialTimer] = 40;
            }
        }

        if (globalBoss && globalPlayer.luckyCamera) {
            const STRIPE_WIDTH = 900;
            const STRIPE_HEIGHT = 50;
            let width = gameObject.hitpoints / gameObject.maxHitpoints * STRIPE_WIDTH;

            drawLinearGradient(
                camera.x, camera.y - camera.height / 2 + 50, width, STRIPE_HEIGHT,
                ['red', `rgb(${(1 - width / STRIPE_WIDTH) * 255},0,0,1)`], [0, 1], Layer.UI
            );

            drawSprite(camera.x, camera.y - camera.height / 2 + 50, imgBossHp, 0, STRIPE_WIDTH, STRIPE_HEIGHT, false, Layer.UI);
        }

        if (timers[gameObject.specialTimer] === 0) {
            if (distanceBetweenPoints(globalBoss.x, globalBoss.y, globalPlayer.x, globalPlayer.y) > camera.width * 1.5) {
                gameObject.angle = angleBetweenPoints(gameObject.x, gameObject.y, globalPlayer.x, globalPlayer.y);
                gameObject.attack = 0;
            } else {
                gameObject.attack = randomInt(0, 3);
                if (distanceBetweenPoints(globalBoss.x, globalBoss.y, globalPlayer.x, globalPlayer.y) >= 600 && gameObject.attack === 1) {
                    gameObject.attack = randomInt(2, 3);
                }
            }
            gameObject.goForward = false;
            gameObject.goLeft = false;
            gameObject.goRight = false;
            if (gameObject.attack === 1 || gameObject.attack === 2) {
                timers[gameObject.specialTimer] = 300;
            } else {
                timers[gameObject.specialTimer] = 600;
            }
            gameObject.rotationSpeed = 0.01;
            gameObject.sprite = imgBoss;
        }

        //сближения

        if (gameObject.attack === 0) {
            let angle = angleBetweenPoints(gameObject.x, gameObject.y, globalPlayer.x, globalPlayer.y);
            const diff = normalizeAngle(gameObject.angle - angle);

            if (diff > gameObject.rotationSpeed && !gameObject.goForward) {
                gameObject.goLeft = true;
                gameObject.goRight = false;
            } else if (diff < -gameObject.rotationSpeed && !gameObject.goForward) {
                gameObject.goRight = true;
                gameObject.goLeft = false;
            } else {
                gameObject.goLeft = false;
                gameObject.goRight = false;
                gameObject.goForward = true;
                let vector = rotateVector(gameObject.width / 2, 0, gameObject.angle + Math.PI);
                burstParticles({
                    x: gameObject.x + vector[0],
                    y: gameObject.y - vector[1],
                    color: 'red',
                    speed: 3,
                    size: 35,
                    count: 1,
                    decrease: 0.5,
                    accel: 0,
                })
            }

            if (gameObject.goForward) {
                gameObject.rotationSpeed = 0.0005;
            }
        }

        //близкой дистанции
        if (gameObject.attack === 1) {
            if (timers[gameObject.specialTimer] > 100) {
                if (timers[gameObject.specialTimer] < 300) {
                    for (let i = 0; i < 5; i++) {
                        addGameObject(GameObjectType.LAVA_BALL, gameObject.x, gameObject.y);
                    }
                }
                gameObject.rotationSpeed += 0.0015;
            }
            if (timers[gameObject.specialTimer] < 100) {
                gameObject.rotationSpeed -= 0.003;
            }
            gameObject.goLeft = true;
        }

        //дальней дистанции
        if (gameObject.attack === 2) {
            if (timers[gameObject.specialTimer] > 100) {
                if (timers[gameObject.specialTimer] < 300 && timers[gameObject.specialTimer] % 10 === 0) {
                    addGameObject(GameObjectType.MAGMA_BALL, gameObject.x, gameObject.y);
                }
                gameObject.rotationSpeed += 0.0015;
            }
            if (timers[gameObject.specialTimer] < 100) {
                gameObject.rotationSpeed -= 0.003;
            }
            gameObject.goLeft = true;
        }

        if (gameObject.attack === 3) {
            if (timers[gameObject.specialTimer] >= 500) {
                if (timers[gameObject.specialTimer] % 2 === 0) {
                    gameObject.sprite = imgBossReadyToAttack1;
                } else {
                    gameObject.sprite = imgBossReadyToAttack;
                }
            } else {
                gameObject.rotationSpeed = 0.003;
                let angle = angleBetweenPoints(gameObject.x, gameObject.y, globalPlayer.x, globalPlayer.y);
                const diff = normalizeAngle(gameObject.angle - angle);

                if (diff > gameObject.rotationSpeed && !gameObject.goForward) {
                    gameObject.goLeft = true;
                    gameObject.goRight = false;
                } else if (diff < -gameObject.rotationSpeed && !gameObject.goForward) {
                    gameObject.goRight = true;
                    gameObject.goLeft = false;
                } else {
                    gameObject.goRight = false;
                    gameObject.goLeft = false;
                }

                let lazerLength = camera.width * 1.5;
                let vector = rotateVector(gameObject.width / 3 + lazerLength / 2, 1, -gameObject.angle);
                if (timers[gameObject.specialTimer] % 2 === 0) {
                    gameObject.sprite = imgBossAttack;
                    drawSprite(gameObject.x + vector[0], gameObject.y + vector[1], imgLazer, gameObject.angle, lazerLength, 286 / 796 * gameObject.height, false, Layer.BOSS);
                } else {
                    gameObject.sprite = imgBossAttack1;
                    drawSprite(gameObject.x + vector[0], gameObject.y + vector[1], imgLazer1, gameObject.angle, lazerLength, 286 / 796 * gameObject.height, false, Layer.BOSS);
                }
                let distanceFromPlayer = distanceBetweenPoints(globalPlayer.x, globalPlayer.y, gameObject.x + vector[0], gameObject.y + vector[1]);
                let rotatedDistanceFromPlayer = rotateVector(distanceFromPlayer, 0, angleBetweenPoints(gameObject.x + vector[0], gameObject.y + vector[1], globalPlayer.x, globalPlayer.y) - globalBoss.angle);
                ctx.save();
                ctx.translate(gameObject.x + vector[0], gameObject.y + vector[1]);
                if (-286 / 796 * gameObject.height / 2 < rotatedDistanceFromPlayer[1] && 286 / 796 * gameObject.height / 2 > rotatedDistanceFromPlayer[1]
                    && -lazerLength / 2 < rotatedDistanceFromPlayer[0] && lazerLength / 2 > rotatedDistanceFromPlayer[0]) {
                    globalPlayer.hitpoints -= 0.1;
                }
                ctx.restore();
            }
        }

        moveGameObject(gameObject);
    }

    if (gameObject.type === GameObjectType.MANIPULATOR) {
        if (!globalBoss.exists) {
            gameObject.exists = false;
        }
        //прорисовка
        drawSprite(gameObject.x, gameObject.y, gameObject.sprite, gameObject.angle, gameObject.width, gameObject.height, false, Layer.MANIPULATOR);
        gameObject.angle = globalBoss.angle;
        let angle = angleBetweenPoints(globalBoss.x + gameObject.firstX, globalBoss.y + gameObject.firstY, globalBoss.x, globalBoss.y);
        drawSprite(globalBoss.x, globalBoss.y, imgManipulator, globalBoss.angle + angle, 270, 60, true, Layer.BOSS_LEG);
        let legVector = rotateVector(250, 0, -globalBoss.angle - angle + Math.PI);
        angle = angleBetweenPoints(gameObject.x, gameObject.y, globalBoss.x + legVector[0], globalBoss.y + legVector[1]);
        drawSprite(globalBoss.x + legVector[0], globalBoss.y + legVector[1], imgManipulator, angle, distanceBetweenPoints(globalBoss.x + legVector[0], globalBoss.y + legVector[1], gameObject.x, gameObject.y), 60, true, Layer.BOSS_LEG);

        let legDistance = 140;

        let firstCoordsAngle = Math.PI - angleBetweenPoints(gameObject.firstX, gameObject.firstY, 0, 0);
        let firstCoordsVector = rotateVector(500, 0, -globalBoss.angle + firstCoordsAngle);

        if (distanceBetweenPoints(gameObject.x, gameObject.y, globalBoss.x + firstCoordsVector[0], globalBoss.y + firstCoordsVector[1]) > legDistance) {
            let movementAngle = Math.PI - angleBetweenPoints(gameObject.x, gameObject.y, globalBoss.x + firstCoordsVector[0], globalBoss.y + firstCoordsVector[1]);
            gameObject.neededX = globalBoss.x + firstCoordsVector[0];
            gameObject.neededY = globalBoss.y + firstCoordsVector[1];
            let neededVector = rotateVector(legDistance - 5, 0, movementAngle);
            gameObject.neededX -= neededVector[0];
            gameObject.neededY -= neededVector[1];
            gameObject.neededX -= globalBoss.x;
            gameObject.neededY -= globalBoss.y;
        }

        // drawCircle(globalBoss.x + firstCoordsVector[0], globalBoss.y + firstCoordsVector[1], 20, 'red', false, Layer.UI);
        // drawCircle(globalBoss.x + gameObject.neededX, globalBoss.y + gameObject.neededY, 30, 'green', false, Layer.UI);

        if (gameObject.neededX && gameObject.neededY) {
            let angle = angleBetweenPoints(gameObject.x, gameObject.y, globalBoss.x + gameObject.neededX, globalBoss.y + gameObject.neededY);
            let speed;
            speed = Math.abs(globalBoss.speed) * 2 + globalBoss.rotationSpeed * globalBoss.width * 2;
            let movementVector = rotateVector(speed, 0, angle);
            if ((gameObject.x < globalBoss.x + gameObject.neededX && gameObject.x + movementVector[0] > globalBoss.x + gameObject.neededX) ||
                (gameObject.x > globalBoss.x + gameObject.neededX && gameObject.x + movementVector[0] < globalBoss.x + gameObject.neededX)) {
                gameObject.x = globalBoss.x + gameObject.neededX;
                gameObject.y = globalBoss.y + gameObject.neededY;
                gameObject.neededX = null;
                gameObject.neededY = null;
                let distance = distanceBetweenPoints(gameObject.x, gameObject.y, globalPlayer.x, globalPlayer.y);
                let strength = 1 / distance * camera.width;
                makeScreenShake(strength, 5);
                if (distance < gameObject.width / 2 + globalPlayer.width / 2 && timers[globalPlayer.unhitableTimer] === 0) {
                    globalPlayer.hitpoints -= 20;
                    timers[globalPlayer.unhitableTimer] = 150;
                }
                for (let tileIndex = 0; tileIndex < map.length; tileIndex++) {
                    let tile = map[tileIndex];
                    if (tile.upperLayer.type !== TileType.NONE && distanceBetweenPoints(tile.x * TILE.width, tile.y * TILE.height, gameObject.x, gameObject.y) <= gameObject.width / 2 + tile.width / 2) {
                        tile.upperLayer.type = TileType.NONE;
                        tile.toughness = 0;
                        tile.firstToughness = 0;
                        burstParticles({
                            x: tile.x * TILE.width,
                            y: tile.y * TILE.height,
                            color: 'brown',
                            speed: 2,
                            size: 20,
                            count: 20,
                            decrease: 0.4,
                            accel: 0,
                        });
                    }
                }
            }
            else {
                gameObject.x += movementVector[0];
                gameObject.y -= movementVector[1];
            }
        }
    }

    //смерть
    if ((gameObject.hitpoints <= 0) && (gameObject.type === GameObjectType.PLAYER || gameObject.type === GameObjectType.BOSS)) {
        gameObject.exists = false;
        if (gameObject.type === GameObjectType.BOSS) {
            burstParticles({
                x: gameObject.x,
                y: gameObject.y,
                color: 'red',
                speed: 7,
                size: 40,
                count: 100,
                decrease: 0.2,
                accel: -0.01
            })
        }
    }

    if (timers[gameObject.energy] <= 0 && gameObject.type === GameObjectType.PLAYER) {
        gameObject.exists = false;
    }

    normalizeAngle(gameObject.angle);
}

function addMenuText(x: number, y: number, width: number, height: number, text: string, color: string, size: number, z: number) {
    let clickableText: Text = {
        text: text,
        x: x,
        y: y,
        width: width,
        height: height,
        color: color,
        size: size,
        z: z,
        mouseOn: false,
        exists: true,
    }
    let textIndex = 0;
    while (menuTexts[textIndex] && menuTexts[textIndex].exists === true) {
        textIndex++;
    }
    menuTexts[textIndex] = clickableText;

    return (clickableText);
}

function updateClickableTexts() {
    for (let textIndex = 0; textIndex < menuTexts.length; textIndex++) {
        let text = menuTexts[textIndex];
        if (mouse.worldX > text.x - text.width / 2 &&
            mouse.worldX < text.x + text.width / 2 &&
            mouse.worldY > text.y - text.height / 2 &&
            mouse.worldY < text.y + text.height / 2) {
            text.mouseOn = true;
        }
        drawText(text.x, text.y, 0, 0, text.color, text.text, text.size, 'center', text.z);
    }
}

function resetClicks() {
    for (let textIndex = 0; textIndex < menuTexts.length; textIndex++) {
        menuTexts[textIndex].mouseOn = false;
    }
}

let playText = addMenuText(-camera.width / 2 + 165, -camera.height / 2 + 400, 130, 60, 'играть', 'White', 40, Layer.UI);
let controlsText = addMenuText(-camera.width / 2 + 215, -camera.height / 2 + 470, 130, 60, 'управление', 'White', 40, Layer.UI);

let instructions = false;

let musik: HTMLAudioElement = null;

function loopMenu() {
    camera.x = 0;
    camera.y = 0;

    drawSprite(camera.x, camera.y, imgMenu, 0, camera.width, camera.height, false, Layer.TILE);
    drawText(camera.x, camera.y - camera.height / 2 + 200, 0, 0, 'white', 'MEGA MARS 2D-3D SUPER EPIC SOMEWHAT SURVIVAL', 71, 'center', Layer.ON_TILE);

    updateClickableTexts()

    if (playText.mouseOn && canBeginGame) {
        playText.text = 'ИГРАТЬ';
        if (mouse.wentDown) {
            gameState = GameState.GAME;
            restate();
            buildMap();
            musik = playSound(sndParadox, 0.85, true);
        }
    } else {
        playText.text = 'играть';
    }

    if (controlsText.mouseOn && canBeginGame) {
        controlsText.text = 'УПРАВЛЕНИЕ';
        if (mouse.wentDown) {
            instructions = !instructions;
        }
    } else {
        controlsText.text = 'управление';
    }

    if (instructions) {
        drawText(
            camera.x, camera.y, 150, 80, 'White',
            '1)Перемещаться на WASD / 2)Q-выбросить вещь / 3)R-рестарт / 4)Собирать вещи, нажимая на клетки поля мышкой / Всё, всех люблю, ня, пока',
            60, 'left', Layer.UI
        );
    }

    if (controlsText.mouseOn && canBeginGame) {
        controlsText.text = 'УПРАВЛЕНИЕ';
        if (mouse.wentDown) {

        }
    } else {
        controlsText.text = 'управление';
    }

    resetClicks();
}

function loopGame() {
    updateTileMap();

    //посмертная табличка
    //победа

    if (globalBoss && globalBoss.exists === false) {
        drawText(camera.x, camera.y, 0, 0, 'white', 'Вы - выигрывающий) Спасибо, что поиграли в демо версию, ждите новых обновлений', 45, 'center', Layer.UI);
    } else if (globalPlayer.exists === false) {
        drawText(camera.x, camera.y, 0, 0, 'white', 'Не время сдаваться, вы справитесь. Нажмите на R для меню', 45, 'center', Layer.UI);
    }



    if (timers[gameTimer] < eventEnd - timeBetweenEvents) {
        event = Event.METEORITE_RAIN;
        eventEnd = timers[gameTimer] - EVENT_LENGTH;

        if (eventEnd <= 0) {
            eventEnd = 0;
        }
    }

    if (timers[gameTimer] === eventEnd) {
        event = Event.NONE;
        timeBetweenEvents = randomInt(timeBetweenEvents - timeBetweenEvents / 6, timeBetweenEvents + timeBetweenEvents / 6);
    }

    if (event === Event.METEORITE_RAIN && timers[gameTimer] % 3 === 0) {
        addGameObject(GameObjectType.METEORITE, randomInt(globalPlayer.x - 5000, globalPlayer.x + 5000), randomInt(globalPlayer.y - 5000, globalPlayer.y + 5000));
    }

    for (let gameObjectIndex = 0; gameObjectIndex < gameObjects.length; gameObjectIndex++) {
        let gameObject = gameObjects[gameObjectIndex];
        if (gameObject.exists) {
            updateGameObject(gameObject);
        }
    }

    updateParticles();

    if (timers[dayTimer] === 0) {
        timers[dayTimer] = ONE_DAY;
    }

    if (timers[gameTimer] === 1) {
        if (!globalBoss) {
            let y = camera.y;
            let x = camera.x;
            while (
                distanceBetweenPoints(globalPlayer.x, globalPlayer.y, x, y) <= camera.width * 1.5 ||
                x < - TILE.width / 2 || x > -TILE.width / 2 + TILE.width * TILE.chunkCountX * TILE.chunkSizeX ||
                y < -TILE.height / 2 || y > - TILE.height / 2 + TILE.height * TILE.chunkCountY * TILE.chunkSizeY
            ) {
                x = randomInt(globalPlayer.x - camera.width * 3, globalPlayer.y + camera.width * 3);
                y = randomInt(globalPlayer.y - camera.height * 3, globalPlayer.y + camera.height * 3);
            }
            globalBoss = addGameObject(GameObjectType.BOSS, x, y);

            musik.volume = 0;

            musik = playSound(sndDysonSphere, 0.85, true);

            let distanceFromManipulators = 500;
            let hand1Angle = globalBoss.angle - 0.25 * Math.PI;
            let hand1Vector = rotateVector(distanceFromManipulators, 0, hand1Angle);
            addGameObject(GameObjectType.MANIPULATOR, globalBoss.x + hand1Vector[0], globalBoss.y + hand1Vector[1]);
            let hand2Angle = globalBoss.angle + 0.25 * Math.PI;
            let hand2Vector = rotateVector(distanceFromManipulators, 0, hand2Angle);
            addGameObject(GameObjectType.MANIPULATOR, globalBoss.x + hand2Vector[0], globalBoss.y + hand2Vector[1]);
            let hand3Angle = globalBoss.angle - 0.75 * Math.PI;
            let hand3Vector = rotateVector(distanceFromManipulators, 0, hand3Angle);
            addGameObject(GameObjectType.MANIPULATOR, globalBoss.x + hand3Vector[0], globalBoss.y + hand3Vector[1]);
            let hand4Angle = globalBoss.angle + 0.75 * Math.PI;
            let hand4Vector = rotateVector(distanceFromManipulators, 0, hand4Angle);
            addGameObject(GameObjectType.MANIPULATOR, globalBoss.x + hand4Vector[0], globalBoss.y + hand4Vector[1]);
        }
    }

    drawSprite(camera.x, camera.y, backBuffer, 0, camera.width, camera.height, false, Layer.FORGROUND);

    // let color = backCtx.fillStyle = `rgba(0,0,0,${(1 - timers[globalPlayer.energy] / globalPlayer.maxEnergy) * 0.25})`;
    // drawRect(camera.x, camera.y, camera.width, camera.height, 0, color, false, Layer.FORGROUND);

    if (timers[recentShake.duration] <= 0) {
        recentShake = { strength: 0, duration: addTimer(0) };
    }

    for (let shakeIndex = 0; shakeIndex < screenShakes.length; shakeIndex++) {
        let shake = screenShakes[shakeIndex];
        if (shake.strength > recentShake.strength && timers[shake.duration] > 0) {
            recentShake = shake;
        }
    }

    //камера

    camera.x = globalPlayer.x;
    camera.y = globalPlayer.y;

    // if (globalBoss) {
    //     camera.x = globalBoss.x;
    //     camera.y = globalBoss.y;
    // }

    if (timers[recentShake.duration] > 0 && recentShake.strength > 0) {
        camera.x += randomInt(- recentShake.strength, recentShake.strength);
        camera.y += randomInt(- recentShake.strength, recentShake.strength);
    }

    while (camera.x < TILE.firstX - TILE.width / 2 + camera.width / 2) {
        camera.x = TILE.firstX - TILE.width / 2 + camera.width / 2;
    }
    while (camera.y < TILE.firstY - TILE.height / 2 + camera.height / 2) {
        camera.y = TILE.firstY - TILE.height / 2 + camera.height / 2;
    }
    while (camera.x > TILE.firstX - TILE.width / 2 + TILE.chunkSizeX * TILE.chunkCountX * TILE.width - camera.width / 2) {
        camera.x = TILE.firstX - TILE.width / 2 + TILE.chunkSizeX * TILE.chunkCountX * TILE.width - camera.width / 2;
    }
    while (camera.y > TILE.firstY - TILE.height / 2 + TILE.chunkSizeY * TILE.chunkCountY * TILE.width - camera.height / 2) {
        camera.y = TILE.firstY - TILE.height / 2 + TILE.chunkSizeY * TILE.chunkCountY * TILE.width - camera.height / 2;
    }

    if (rKey.wentDown) {
        gameState = GameState.MENU;

        musik.volume = 0;

        musik = null;

        playText = addMenuText(-camera.width / 2 + 165, -camera.height / 2 + 400, 130, 60, 'играть', 'White', 40, Layer.UI);
        controlsText = addMenuText(-camera.width / 2 + 215, -camera.height / 2 + 470, 130, 60, 'управление', 'White', 40, Layer.UI);
    }
}

function loop() {

    drawQueue = [];

    ctx.save();
    backCtx.save();

    [mouse.worldX, mouse.worldY] = screenToWorld(mouse.x, mouse.y);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    backCtx.clearRect(0, 0, canvas.width, canvas.height);


    backCtx.fillStyle = `rgba(0,0,0,${alpha})`;
    backCtx.fillRect(0, 0, canvas.width, canvas.height);

    const scale = canvas.width / camera.width;
    backCtx.scale(scale, scale);
    ctx.scale(scale, scale);
    ctx.rotate(-camera.angle);

    ctx.translate(-camera.x + camera.width / 2, -camera.y + camera.height / 2);

    if (gameState === GameState.MENU) {
        loopMenu();
    } else if (gameState === GameState.GAME) {
        loopGame();
    }

    updateTimers();

    drawQueue.sort((a, b) => a.z - b.z);
    for (let itemIndex = 0; itemIndex < drawQueue.length; itemIndex++) {
        const item = drawQueue[itemIndex];
        renderItem(item);
    }

    backCtx.restore();
    ctx.restore();

    clearAllKeys();

    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);