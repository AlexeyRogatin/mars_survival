import { clearAllKeys, upKey, leftKey, rightKey, downKey, mouse, Key, mouseX, qKey } from "./controls";
import {
    ctx, canvas, imgPlayer, imgNone, imgWheel1, imgWheel2, imgWheel3, imgWheel4, imgWheel5, imgWheel6, imgCamera,
    imgEarth1, imgEarth2, imgEarth3, imgEarth4, imgEarth5, imgGeyser, imgMountain, imgIron1, imgIron2, imgIron3, imgIron4,
    imgIron5, Layer, DrawQueueItem, DrawQueueType, renderItem, imgIronItem, imgAbyss, imgArrow, imgCrafts, imgArrow1,
    imgMelter, imgIronIngot, imgAurit1, imgAurit2, imgAurit3, imgAurit4, imgAurit5, imgAuritIngot, imgAuritItem,
    imgCrystal1, imgCrystal2, imgCrystal3, imgCrystal4, imgCrystal5, imgCrystalItem, imgSplitter, backCtx, backBuffer, imgToolkit,
    imgSunBatteryAdd, imgSunBatteryItem, imgSunBattery, imgSilicon1, imgSilicon2, imgSilicon3, imgSilicon4, imgSilicon5, imgSiliconItem,
    imgVolcano, imgMagmaBall, imgStorage, imgGoldenCamera, imgExtraSlotItem, imgAlert, imgShockProofBody
} from "./drawing";

enum GameObjectType {
    NONE,
    PLAYER,
    MAGMA_BALL,
    METEORITE,
}

enum TileType {
    NONE,
    EARTH_1,
    EARTH_2,
    EARTH_3,
    EARTH_4,
    EARTH_5,
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
}

let TILE = {
    width: 200,
    height: 200,
    firstX: 0,
    firstY: 0,
    chunkSizeX: 8,
    chunkSizeY: 8,
    chunkCountX: 20,
    chunkCountY: 20,
}

class InventorySlot {
    item: Item = Item.NONE;
    count: number = 0;
}

class Tile {
    baseLayer: TileType;
    upperLayer: TileType;
    x: number;
    y: number;
    width: number;
    height: number;
    specialTimer: number;
    toughness: number;
    firstToughness: number;
    inventory: InventorySlot[];
}

const map: Tile[] = [];

function getIndexFromCoords(x: number, y: number) {
    let result = y * TILE.chunkSizeX * TILE.chunkCountX + x;
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

let chunkPrototypes = [
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
        'SC #   #',
        'A       ',
        ' @     #',
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
]

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
    EXTRA_SLOT,
    SHOCKPROOF_BODY,
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
    description1: string;
    description2: string;
    description3: string;
}

let recipes: Recipe[] = [
    {
        result: Item.MELTER,
        parts: [{ item: Item.IRON, count: 20, sprite: imgIronItem },],
        sprite: imgMelter,
        name: 'Плавильня',
        description1: 'Бегать с железом - это одно,',
        description2: 'а с железными слитками - другое.',
        description3: 'Можно поставить только на лаву',
    },
    {
        result: Item.SPLITTER,
        parts: [{ item: Item.IRON_INGOT, count: 5, sprite: imgIronIngot }, { item: Item.CRYSTAL, count: 10, sprite: imgCrystalItem }],
        sprite: imgSplitter,
        name: 'Расщепитель',
        description1: 'Если сломать кристалл пополам,',
        description2: 'много энергии не выделится.',
        description3: 'Нужно что-то посерьёзнее',
    },
    {
        result: Item.STORAGE,
        parts: [{ item: Item.IRON_INGOT, count: 20, sprite: imgIronIngot }],
        sprite: imgStorage,
        name: 'Хранилище',
        description1: 'Это сундук из Майнкрафта,',
        description2: 'ни больше, ни меньше.',
        description3: 'Хватит вопросов!',
    },
    {
        result: Item.TOOLKIT,
        parts: [{ item: Item.IRON_INGOT, count: 5, sprite: imgIronIngot }],
        sprite: imgToolkit,
        name: 'Ремнабор',
        description1: 'Все травмы можно залатать,',
        description2: 'если они не душевные.',
        description3: 'Восполняет жизни (расходник)',
    },
    {
        result: Item.EXTRA_SLOT,
        parts: [{ item: Item.IRON_INGOT, count: 40, sprite: imgIronIngot }],
        sprite: imgExtraSlotItem,
        name: 'Допслот',
        description1: 'Как же замечательно иметь ещё',
        description2: 'чуть-чуть места под рукой! Сюда',
        description3: 'можно положить немного счастья.',
    },
    {
        result: Item.SUN_BATERY,
        parts: [{ item: Item.SILIKON, count: 15, sprite: imgSiliconItem }, { item: Item.CRYSTAL, count: 30, sprite: imgCrystalItem }],
        sprite: imgSunBatteryItem,
        name: 'Сол панель ур.1',
        description1: 'Без батарей, как без рук!',
        description2: 'Позволяет получать энергию днём;',
        description3: 'уменьшает запас энергии в 2 раза...',
    },
    {
        result: Item.GOLDEN_CAMERA,
        parts: [{ item: Item.AURIT_INGOT, count: 40, sprite: imgAuritIngot }],
        sprite: imgGoldenCamera,
        name: 'Зоркая камера',
        description1: 'Действительно ауритовая вещь!',
        description2: 'Позволяет видеть опасности,',
        description3: 'если хорошо приглядеться.',
    },
    {
        result: Item.SHOCKPROOF_BODY,
        parts: [{ item: Item.SILIKON, count: 30, sprite: imgSiliconItem },
        { item: Item.AURIT_INGOT, count: 30, sprite: imgAuritIngot }],
        sprite: imgShockProofBody,
        name: 'Крепкое тело',
        description1: 'Красивый ауритовый корпус говорит',
        description2: 'о непрочности, но слой силикона',
        description3: 'говорит обратное. Больше жизней',
    },
];

let slotCount = 5;
let inventory: InventorySlot[] = [];
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

addItem(Item.IRON_INGOT, 20);
addItem(Item.IRON, 20);
addItem(Item.AURIT, 20);
addItem(Item.AURIT_INGOT, 20);
addItem(Item.SILIKON, 20);

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
        if (slot && slot.count >= part.count) {
            canCraft = true;
            break;
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

let drawQueue: DrawQueueItem[] = [];

export function drawSprite(x: number, y: number, sprite: any, angle: number, width: number = 0, height: number = 0, layer = Layer.TILE) {
    if (x > camera.x - camera.width * 0.5 - width / 2 &&
        x < camera.x + camera.width * 0.5 + width / 2 &&
        y > camera.y - camera.height * 0.5 - height / 2 &&
        y < camera.y + camera.height * 0.5 + height / 2) {
        drawQueue.push({ x, y, sprite, angle, width, height, layer, type: DrawQueueType.IMAGE });
    }
}

export function drawRect(
    x: number, y: number, width: number, height: number, angle: number, color: string, outlineOnly: boolean, layer = Layer.TILE
) {
    if (x > camera.x - camera.width * 0.5 - width / 2 &&
        x < camera.x + camera.width * 0.5 + width / 2 &&
        y > camera.y - camera.height * 0.5 - height / 2 &&
        y < camera.y + camera.height * 0.5 + height / 2) {
        drawQueue.push({ x, y, width, height, color, angle, layer, outlineOnly, type: DrawQueueType.RECT });
    }
}

export function drawCircle(x: number, y: number, radius: number, color: string, outlineOnly: boolean, layer = Layer.TILE) {
    if (x > camera.x - camera.width * 0.5 - radius &&
        x < camera.x + camera.width * 0.5 + radius &&
        y > camera.y - camera.height * 0.5 - radius &&
        y < camera.y + camera.height * 0.5 + radius) {
        drawQueue.push({ x, y, radius, color, layer, outlineOnly, type: DrawQueueType.CIRCLE });
    }
}

export function drawText(x: number, y: number, color: string, text: string, textSize: number, layer = Layer.UI) {
    if (x > camera.x - camera.width * 0.5 - textSize / 2 &&
        x < camera.x + camera.width * 0.5 + textSize / 2 &&
        y > camera.y - camera.height * 0.5 - textSize / 2 &&
        y < camera.y + camera.height * 0.5 + textSize / 2) {
        drawQueue.push({ x, y, color, text, layer, type: DrawQueueType.TEXT, textSize });
    }
}

let alpha = 0;

const MORNING_LENGTH = 6000;
const DAY_LENGTH = 6000;
const AFTERNOON_LENGTH = 6000;
const NIGHT_LENGTH = 6000;

const ONE_DAY = MORNING_LENGTH + DAY_LENGTH + AFTERNOON_LENGTH + NIGHT_LENGTH;

export function drawLight(x: number, y: number, radius: number) {

    const MORNING_TIME = NIGHT_LENGTH + AFTERNOON_LENGTH + DAY_LENGTH + MORNING_LENGTH;
    const DAY_TIME = NIGHT_LENGTH + AFTERNOON_LENGTH + DAY_LENGTH;
    const AFTERNOON_TIME = NIGHT_LENGTH + AFTERNOON_LENGTH;
    const NIGHT_TIME = NIGHT_LENGTH;


    if (timers[dayTimer] <= MORNING_TIME && timers[dayTimer] > DAY_TIME) {
        alpha = 1 - (MORNING_TIME - timers[dayTimer]) / (MORNING_TIME - DAY_TIME);
    } else if (timers[dayTimer] <= DAY_TIME && timers[dayTimer] > AFTERNOON_TIME) {
        if (globalPlayer.sunBateryLvl) {
            timers[globalPlayer.energy] += 0.005;
            if (timers[globalPlayer.energy] > globalPlayer.maxEnergy) {
                timers[globalPlayer.energy] = globalPlayer.maxEnergy;
            }
        }
        alpha = 0;
    } else if (timers[dayTimer] <= AFTERNOON_TIME && timers[dayTimer] > NIGHT_TIME) {
        alpha = (AFTERNOON_TIME - timers[dayTimer]) / (AFTERNOON_TIME - NIGHT_TIME);
    } else if (timers[dayTimer] <= NIGHT_TIME) {
        alpha = 1;
    }
    if (x > camera.x - camera.width * 0.5 - radius &&
        x < camera.x + camera.width * 0.5 + radius &&
        y > camera.y - camera.height * 0.5 - radius &&
        y < camera.y + camera.height * 0.5 + radius) {
        backCtx.globalCompositeOperation = 'destination-out';

        let X = x - camera.x + camera.width / 2;
        let Y = y - camera.y + camera.height / 2;

        var gradient = backCtx.createRadialGradient(X, Y, 0, X, Y, radius);

        let alpha = 0.25;

        gradient.addColorStop(0, `white`);
        gradient.addColorStop(1, 'transparent');

        backCtx.fillStyle = gradient;
        backCtx.fillRect(X - radius, Y - radius, 2 * radius, 2 * radius);
    }
}

let camera = {
    x: TILE.firstX - TILE.width / 2 + canvas.width / 2,
    y: TILE.firstY - TILE.height / 2 + canvas.height / 2,
    width: canvas.width,
    height: canvas.height,
    angle: 0,
}

let timers: number[] = [];

let gameObjects: GameObject[] = [];

class GameObject {
    type: GameObjectType = GameObjectType.NONE;
    x: number;
    y: number;
    firstX: number;
    firstY: number;
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
    cameraLvl: number;

    stuckable: boolean;

    lifeTime: number;

    angleZ: number;
}

function addGameObject(type: GameObjectType, x: number, y: number) {
    let gameObject: GameObject = {
        type: type,

        x: x,
        y: y,
        firstX: x,
        firstY: y,

        width: 100,
        height: 100,
        angle: 0,
        color: 'grey',

        exists: true,

        speed: 0,
        speedX: 0,
        speedY: 0,
        speedLimit: 3,
        speedBackReduction: 0.5,
        friction: 0.95,
        accel: 0,
        accelConst: 0.04,
        rotationSpeed: 0.08,

        goForward: false,
        goBackward: false,
        goLeft: false,
        goRight: false,

        sprite: imgNone,

        leftWeel: 1,
        rightWeel: 1,

        hitpoints: 0,
        maxHitpoints: 0,

        energy: 0,
        maxEnergy: 0,

        unhitableTimer: 0,
        doNotDraw: false,

        sunBateryLvl: 0,
        cameraLvl: 0,

        stuckable: false,

        lifeTime: 0,

        angleZ: randomFloat(0.25 * Math.PI, 0.5 * Math.PI),
    }

    if (gameObject.type === GameObjectType.PLAYER) {
        gameObject.sprite = imgPlayer;
        gameObject.hitpoints = 100;
        gameObject.maxHitpoints = 100;
        gameObject.energy = addTimer(25000);
        gameObject.maxEnergy = 25000;
        gameObject.stuckable = true;
        gameObject.unhitableTimer = addTimer(0);
    }

    if (gameObject.type === GameObjectType.MAGMA_BALL) {
        gameObject.sprite = imgMagmaBall;
        gameObject.angle = randomFloat(0, Math.PI * 2);
        gameObject.speedLimit = 5;
        gameObject.unhitableTimer = addTimer(0);
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

function controlPlayer(gameObject: GameObject) {
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

        const wallLeft = other.x * TILE.width - other.width / 2;
        const wallRight = other.x * TILE.width + other.width / 2;
        const wallTop = other.y * TILE.height - other.height / 2;
        const wallBottom = other.y * TILE.height + other.height / 2;

        const playerLeft = gameObject.x - gameObject.width / 2;
        const playerRight = gameObject.x + gameObject.width / 2;
        const playerTop = gameObject.y - gameObject.height / 2;
        const playerBottom = gameObject.y + gameObject.height / 2;

        if (gameObject.stuckable && (other.baseLayer === TileType.MOUNTAIN || other.baseLayer === TileType.VOLCANO ||
            other.upperLayer === TileType.MELTER || other.upperLayer === TileType.SPLITTER ||
            other.upperLayer === TileType.SUN_BATERY || other.upperLayer === TileType.STORAGE)) {

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
    const result = Math.atan2(y2 - y1, x2 - x1) + Math.PI;
    return result;
}

let particles: particle[] = []

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
        speedX,
        speedY,
        accelX,
        accelY,
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

function drawParticles() {
    for (let particleIndex = 0; particleIndex < particles.length; particleIndex++) {
        let particle = particles[particleIndex];
        drawCircle(particle.x, particle.y, particle.radius, particle.color, false, Layer.PARTICLES);
        particle.radius -= particle.sizeDecrease;
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        particle.speedX += particle.accelX;
        particle.speedY += particle.accelY;


        if (particle.radius <= 0) {
            removeParticle(particleIndex);
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
    if (particles[particleIndex].color === 'black') {
        addItem(Item.SILIKON, 1);
    }
    particles[particleIndex] = lastParticle;
    particles.pop();
}

for (let chunkY = 0; chunkY < TILE.chunkCountY; chunkY++) {
    for (let chunkX = 0; chunkX < TILE.chunkCountX; chunkX++) {
        let protoIndex = randomInt(0, chunkPrototypes.length - 1);
        let proto = chunkPrototypes[protoIndex];
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
                    baseLayer: downTileType, upperLayer: upTileType, x, y, specialTimer: null, toughness: null,
                    firstToughness: null, inventory: [], width: TILE.width, height: TILE.height
                };
                if (char === '0') {
                    downTileType = TileType.NONE;
                } else if (char === ' ') {
                    let chance = randomInt(1, 10);
                    if (chance >= 1 && chance <= 6) {
                        downTileType = TileType.EARTH_1;
                    }
                    if (chance === 7) {
                        downTileType = TileType.EARTH_2;
                    }
                    if (chance === 8) {
                        downTileType = TileType.EARTH_3;
                    }
                    if (chance === 9) {
                        downTileType = TileType.EARTH_4;
                    }
                    if (chance === 10) {
                        downTileType = TileType.EARTH_5;
                    }
                } else if (char === '#') {
                    downTileType = TileType.MOUNTAIN;
                    upTileType = TileType.MOUNTAIN;
                } else if (char === '@') {
                    downTileType = TileType.GEYSER;
                    map[index].specialTimer = addTimer(randomInt(500, 1400));
                } else if (char === '*') {
                    downTileType = TileType.VOLCANO;
                    map[index].width = TILE.width * 3;
                    map[index].height = TILE.height * 3;
                    map[index].specialTimer = addTimer(randomInt(50, 500));
                } else if (char === '!') {
                    downTileType = TileType.LAVA;
                } else if (char === 'F') {
                    downTileType = TileType.EARTH_1;
                    upTileType = TileType.IRON;
                    map[index].toughness = 999;
                    map[index].firstToughness = 999;
                } else if (char === 'A') {
                    downTileType = TileType.EARTH_1;
                    upTileType = TileType.AURIT;
                    map[index].toughness = 999;
                    map[index].firstToughness = 999;
                } else if (char === 'C') {
                    downTileType = TileType.EARTH_1;
                    upTileType = TileType.CRYSTAL;
                    map[index].toughness = 999;
                    map[index].firstToughness = 999;
                } else if (char = 'S') {
                    downTileType = TileType.EARTH_1;
                    upTileType = TileType.SILIKON;
                    map[index].toughness = 999;
                    map[index].firstToughness = 999;
                }
                map[index].baseLayer = downTileType;
                map[index].upperLayer = upTileType;
            }
        }
    }
}

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

let globalPlayer = addGameObject(GameObjectType.PLAYER, 0, 0);

function moveToTile(mouseTile: Tile) {
    let [x, y] = tilesToPixels(mouseTile.x, mouseTile.y);
    let angle = angleBetweenPoints(x, y, globalPlayer.x, globalPlayer.y);
    if (globalPlayer.angle > angle) {
        while (globalPlayer.angle + Math.PI * 2 < angle || globalPlayer.angle - Math.PI * 1 >= angle) {
            angle += Math.PI * 2;
        }
    }
    if (globalPlayer.angle < angle) {
        while (globalPlayer.angle + Math.PI * 2 < angle || globalPlayer.angle - Math.PI * 1 >= angle) {
            angle -= Math.PI * 2;
        }
    }

    if (globalPlayer.angle + globalPlayer.rotationSpeed > angle && globalPlayer.angle < angle) {
        globalPlayer.angle = angle;
    } else if (globalPlayer.angle - globalPlayer.rotationSpeed < angle && globalPlayer.angle > angle) {
        globalPlayer.angle = angle;
    } else if (globalPlayer.angle > angle) {
        globalPlayer.goLeft = true;
    } else if (globalPlayer.angle < angle) {
        globalPlayer.goRight = true;
    }
    if (!(globalPlayer.x > x - (TILE.width / 2 + 51) &&
        globalPlayer.x < x + (TILE.width / 2 + 51) &&
        globalPlayer.y > y - (TILE.height / 2 + 51) &&
        globalPlayer.y < y + (TILE.height / 2 + 51))
    ) {
        globalPlayer.goForward = true;
    }
}

let craftMode = false;
let firstRecipeIndex = 0;
let mainSlot = 0;
let controlledStorage: Tile = null;

let dayTimer = addTimer(ONE_DAY);

const VOLCANO_RADIUS = TILE.width * TILE.chunkSizeX * 1.5;
const MAGMA_BALL_SPEED = 35;
const VOLCANO_HEIGHT = 100;
const GRAVITATION = 0.5;
// const CAMERA_HEIGHT = 500;

const MAX_RANGE = MAGMA_BALL_SPEED * MAGMA_BALL_SPEED / GRAVITATION;

const STORAGE_SLOT_COUNT = 10;

function updateTile(tileType: TileType, tile: Tile) {
    let sprite = imgNone;
    switch (tileType) {
        case TileType.GEYSER: {
            sprite = imgGeyser;
            if (tile.upperLayer === TileType.NONE) {
                if (
                    tile.x * TILE.width > camera.x - camera.width / 2 - tile.width / 2
                    && tile.x * TILE.width < camera.x + camera.width / 2 + tile.width / 2
                    && tile.y * TILE.height > camera.y - camera.height / 2 - tile.height / 2
                    && tile.y * TILE.height < camera.y + camera.height / 2 + tile.height / 2
                ) {
                    if (globalPlayer.cameraLvl === 1 && timers[tile.specialTimer] < 200 && timers[tile.specialTimer] > 150) {
                        drawSprite(tile.x * tile.width, tile.y * tile.height, imgAlert, 0, tile.width, tile.height, Layer.ON_TILE);
                    }
                    if (timers[tile.specialTimer] <= 0) {
                        timers[tile.specialTimer] = randomInt(500, 2000);
                    }
                    if (timers[tile.specialTimer] <= 150) {
                        burstParticles({
                            x: tile.x * TILE.width,
                            y: tile.y * TILE.height,
                            color: 'red',
                            speed: 5,
                            size: 40,
                            decrease: 0.8,
                            accel: -0.05,
                            count: 1,
                        });
                    }
                }
            }
        } break;
        case TileType.EARTH_1: {
            sprite = imgEarth1
        } break;
        case TileType.EARTH_2: {
            sprite = imgEarth2
        } break;
        case TileType.EARTH_3: {
            sprite = imgEarth3
        } break;
        case TileType.EARTH_4: {
            sprite = imgEarth4
        } break;
        case TileType.EARTH_5: {
            sprite = imgEarth5
        } break;
        case TileType.LAVA: {
            drawLight(tile.x * TILE.width, tile.y * TILE.height, 200);
            sprite = imgAbyss;
            const wallLeft = tile.x * TILE.width - TILE.width / 2;
            const wallRight = tile.x * TILE.width + TILE.width / 2;
            const wallTop = tile.y * TILE.height - TILE.height / 2;
            const wallBottom = tile.y * TILE.height + TILE.height / 2;
            if (
                globalPlayer.x - globalPlayer.width / 4 < wallRight &&
                globalPlayer.x - globalPlayer.width / 4 > wallLeft &&
                globalPlayer.y - globalPlayer.height / 4 > wallTop &&
                globalPlayer.y - globalPlayer.height / 4 < wallBottom &&
                globalPlayer.x + globalPlayer.width / 4 < wallRight &&
                globalPlayer.x + globalPlayer.width / 4 > wallLeft &&
                globalPlayer.y - globalPlayer.height / 4 > wallTop &&
                globalPlayer.y - globalPlayer.height / 4 < wallBottom &&
                globalPlayer.x - globalPlayer.width / 4 < wallRight &&
                globalPlayer.x - globalPlayer.width / 4 > wallLeft &&
                globalPlayer.y + globalPlayer.height / 4 > wallTop &&
                globalPlayer.y + globalPlayer.height / 4 < wallBottom &&
                globalPlayer.x + globalPlayer.width / 4 < wallRight &&
                globalPlayer.x + globalPlayer.width / 4 > wallLeft &&
                globalPlayer.y + globalPlayer.height / 4 > wallTop &&
                globalPlayer.y + globalPlayer.height / 4 < wallBottom
            ) {
                globalPlayer.exists = false;
            }
        } break;
        case TileType.MELTER: {
            drawLight(tile.x * TILE.width, tile.y * TILE.height, 150);
            sprite = imgMelter;
            if (timers[tile.specialTimer] > 0) {
                drawText(tile.x * TILE.width - 10, tile.y * TILE.height, 'blue', `${Math.round(timers[tile.specialTimer] / 60)}`, 30, Layer.UI);
            }
            if (!mouse.isDown) {
                tile.toughness = tile.firstToughness;
            }
        } break;
        case TileType.SPLITTER: {
            sprite = imgSplitter;
            if (!mouse.isDown) {
                tile.toughness = tile.firstToughness;
            }
        } break;
        case TileType.SUN_BATERY: {
            sprite = imgSunBattery;
        } break;
        case TileType.IRON: {
            if (tile.toughness <= tile.firstToughness && tile.toughness > tile.firstToughness / 5 * 4) {
                sprite = imgIron1;
            }
            if (tile.toughness <= tile.firstToughness / 5 * 4 && tile.toughness > tile.firstToughness / 5 * 3) {
                sprite = imgIron2;
            }
            if (tile.toughness <= tile.firstToughness / 5 * 3 && tile.toughness > tile.firstToughness / 5 * 2) {
                sprite = imgIron3;
            }
            if (tile.toughness <= tile.firstToughness / 5 * 2 && tile.toughness > tile.firstToughness / 5 * 1) {
                sprite = imgIron4;
            }
            if (tile.toughness <= tile.firstToughness / 5 * 1 && tile.toughness > 0) {
                sprite = imgIron5;
            }
        } break;
        case TileType.AURIT: {
            if (tile.toughness <= tile.firstToughness && tile.toughness > tile.firstToughness / 5 * 4) {
                sprite = imgAurit1;
            }
            if (tile.toughness <= tile.firstToughness / 5 * 4 && tile.toughness > tile.firstToughness / 5 * 3) {
                sprite = imgAurit2;
            }
            if (tile.toughness <= tile.firstToughness / 5 * 3 && tile.toughness > tile.firstToughness / 5 * 2) {
                sprite = imgAurit3;
            }
            if (tile.toughness <= tile.firstToughness / 5 * 2 && tile.toughness > tile.firstToughness / 5 * 1) {
                sprite = imgAurit4;
            }
            if (tile.toughness <= tile.firstToughness / 5 * 1 && tile.toughness > 0) {
                sprite = imgAurit5;
            }
        } break;
        case TileType.CRYSTAL: {
            if (tile.toughness <= tile.firstToughness && tile.toughness > tile.firstToughness / 5 * 4) {
                sprite = imgCrystal1;
            }
            if (tile.toughness <= tile.firstToughness / 5 * 4 && tile.toughness > tile.firstToughness / 5 * 3) {
                sprite = imgCrystal2;
            }
            if (tile.toughness <= tile.firstToughness / 5 * 3 && tile.toughness > tile.firstToughness / 5 * 2) {
                sprite = imgCrystal3;
            }
            if (tile.toughness <= tile.firstToughness / 5 * 2 && tile.toughness > tile.firstToughness / 5 * 1) {
                sprite = imgCrystal4;
            }
            if (tile.toughness <= tile.firstToughness / 5 * 1 && tile.toughness > 0) {
                sprite = imgCrystal5;
            }
        } break;
        case TileType.SILIKON: {
            if (tile.toughness <= tile.firstToughness && tile.toughness > tile.firstToughness / 5 * 4) {
                sprite = imgSilicon1;
            }
            if (tile.toughness <= tile.firstToughness / 5 * 4 && tile.toughness > tile.firstToughness / 5 * 3) {
                sprite = imgSilicon2;
            }
            if (tile.toughness <= tile.firstToughness / 5 * 3 && tile.toughness > tile.firstToughness / 5 * 2) {
                sprite = imgSilicon3;
            }
            if (tile.toughness <= tile.firstToughness / 5 * 2 && tile.toughness > tile.firstToughness / 5 * 1) {
                sprite = imgSilicon4;
            }
            if (tile.toughness <= tile.firstToughness / 5 * 1 && tile.toughness > 0) {
                sprite = imgSilicon5;
            }
        } break;
        case TileType.MOUNTAIN: {
            sprite = imgMountain;
        } break;
        case TileType.VOLCANO: {
            sprite = imgVolcano;
            if (
                distanceBetweenPoints(camera.x, camera.y, tile.x * TILE.width, tile.y * TILE.width) < VOLCANO_RADIUS
            ) {
                if (timers[tile.specialTimer] === 0) {
                    addGameObject(GameObjectType.MAGMA_BALL, tile.x * TILE.width, tile.y * TILE.height);
                    timers[tile.specialTimer] = randomInt(50, 500);
                }
            }
        } break;
        case TileType.STORAGE: {
            sprite = imgStorage;
            if (!mouse.isDown) {
                tile.toughness = tile.firstToughness;
            }
        } break;
    }

    let [spriteX, spriteY] = tilesToPixels(tile.x, tile.y);
    drawSprite(spriteX, spriteY, sprite, 0, tile.width, tile.height, Layer.TILE);
}

function updateTileMap() {
    for (let y = 0; y < TILE.chunkCountY * TILE.chunkSizeY; y++) {
        for (let x = 0; x < TILE.chunkCountX * TILE.chunkSizeX; x++) {
            let tile = map[getIndexFromCoords(x, y)];
            updateTile(tile.baseLayer, tile);
            updateTile(tile.upperLayer, tile);
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

    //прорисовка
    if (!gameObject.doNotDraw) {
        if (gameObject.sprite) {
            if (gameObject.type === GameObjectType.MAGMA_BALL) {
                drawSprite(gameObject.x, gameObject.y, gameObject.sprite, gameObject.angle + Math.PI / 180 * gameObject.lifeTime, gameObject.width, gameObject.height, Layer.PLAYER);
            } else
                drawSprite(gameObject.x, gameObject.y, gameObject.sprite, gameObject.angle, gameObject.width, gameObject.height, Layer.PLAYER);
        } else {
            drawRect(gameObject.x, gameObject.y, gameObject.width, gameObject.height, -gameObject.angle, gameObject.color, false);
        }
    }

    if (gameObject.type === GameObjectType.PLAYER) {
        //считывание кнопок
        controlPlayer(gameObject);

        //рисование света вокруг
        drawLight(gameObject.x, gameObject.y, 250);

        //границы мира
        if (gameObject.x - camera.width / 2 >= TILE.firstX - TILE.width / 2 &&
            gameObject.x + camera.width / 2 <= TILE.firstX - TILE.width / 2 + TILE.width * TILE.chunkSizeX * TILE.chunkCountX) {
            camera.x = gameObject.x;
        }
        if (gameObject.y - camera.height / 2 >= TILE.firstY - TILE.height / 2 &&
            gameObject.y + camera.height / 2 <= TILE.firstY - TILE.height / 2 + TILE.height * TILE.chunkSizeY * TILE.chunkCountY) {
            camera.y = gameObject.y;
        }

        if (gameObject.x + gameObject.speedX <= TILE.firstX - TILE.width / 2) {
            gameObject.x += (TILE.firstX - TILE.width / 2) - (gameObject.x + gameObject.speedX);
        }

        if (gameObject.x + gameObject.speedX >= TILE.firstX - TILE.width / 2 + TILE.width * TILE.chunkSizeX * TILE.chunkCountX) {
            gameObject.x -= (gameObject.x + gameObject.speedX) - (TILE.firstX - TILE.width / 2 + TILE.width * TILE.chunkSizeX * TILE.chunkCountX);
        }

        if (gameObject.y + gameObject.speedY <= TILE.firstY - TILE.height / 2) {
            gameObject.y += (TILE.firstY - TILE.height / 2) - (gameObject.y + gameObject.speedY);
        }

        if (gameObject.y + gameObject.speedY > TILE.firstY - TILE.height / 2 + TILE.height * TILE.chunkSizeY * TILE.chunkCountY) {
            gameObject.y -= (gameObject.y + gameObject.speedY) - (TILE.firstY - TILE.height / 2 + TILE.height * TILE.chunkSizeY * TILE.chunkCountY);
        }

        //итемы
        for (let slotIndex = 0; slotIndex < slotCount; slotIndex++) {
            drawRect(camera.x - slotCount * 40 / 2 + slotIndex * 50, camera.y + camera.height / 2 - 50, 50, 50, 0, 'grey', true, Layer.UI);
        }

        //стрелочка крафтов
        drawSprite(camera.x - camera.width / 2 + 10, camera.y - camera.height / 4, imgArrow, 0, 30, 50, Layer.UI);

        //жизнь
        const STRIPE_WIDTH = 200;
        const STRIPE_HEIGHT = 50;

        let width = gameObject.hitpoints / gameObject.maxHitpoints * STRIPE_WIDTH;

        drawRect(
            camera.x - camera.width / 2 + width / 2 + 50, camera.y - camera.height / 2 + 50, width, STRIPE_HEIGHT, 0, 'green', false, Layer.UI
        );

        //энергия
        width = timers[gameObject.energy] / gameObject.maxEnergy * STRIPE_WIDTH;

        drawRect(
            camera.x - camera.width / 2 + width / 2 + 300, camera.y - camera.height / 2 + 50, width, STRIPE_HEIGHT, 0, 'blue', false, Layer.UI
        );

        //время
        let hour = ONE_DAY / (24 + 37 / 60);

        let minute = hour / 60;

        drawText(
            camera.x + camera.width / 2 - 100, camera.y - camera.height / 2 + 50, 'blue',
            `${Math.floor((ONE_DAY - timers[dayTimer]) / hour)} : ${Math.floor((ONE_DAY - timers[dayTimer]) / minute) % 60}`, 25, Layer.UI
        );

        //координаты

        drawText(
            camera.x + camera.width / 2 - 100, camera.y - camera.height / 2 + 100, 'blue',
            `x: ${Math.round((gameObject.x) / TILE.width)}`, 25, Layer.UI
        );
        drawText(
            camera.x + camera.width / 2 - 100, camera.y - camera.height / 2 + 130, 'blue',
            `y: ${Math.round((gameObject.y) / TILE.height)}`, 25, Layer.UI
        );

        //выброс

        if (qKey.wentDown) {
            inventory[mainSlot] = { item: Item.NONE, count: 0 };
        }

        if (isInventoryFullForItem(Item.NONE)) {
            drawText(camera.x + camera.width / 8, camera.y + camera.height / 2 - 40, 'green', 'Нажмите на Q, чтобы выбросить вещь', 25, Layer.UI);
        }

        //время крафта
        if (mouse.wentDown && mouse.worldX > camera.x - camera.width / 2 - 10 &&
            mouse.worldX < camera.x - camera.width / 2 + 25 &&
            mouse.worldY > camera.y - camera.height / 4 - 25 &&
            mouse.worldY < camera.y - camera.height / 4 + 25
        ) {
            craftMode = !craftMode;
        }

        if (craftMode && mouse.wentDown && mouse.worldX > camera.x - camera.width / 2 + 130 &&
            mouse.worldX < camera.x - camera.width / 2 + 170 &&
            mouse.worldY > camera.y - camera.height / 4 + 2 &&
            mouse.worldY < camera.y - camera.height / 4 + 30 &&
            recipes[firstRecipeIndex - 1]) {
            firstRecipeIndex--;
        }
        if (craftMode && mouse.wentDown && mouse.worldX > camera.x - camera.width / 2 + 130 &&
            mouse.worldX < camera.x - camera.width / 2 + 170 &&
            mouse.worldY > camera.y - camera.height / 4 + 422 &&
            mouse.worldY < camera.y - camera.height / 4 + 450 &&
            recipes[firstRecipeIndex + 3]) {
            firstRecipeIndex++;
        }

        //рисование предметов в инвентаре

        for (let itemIndex = 0; itemIndex <= inventory.length; itemIndex++) {
            if (inventory[itemIndex]) {
                let x = camera.x - slotCount * 20;
                let y = camera.y + camera.height / 2 - 50;
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

                if (itemIndex === mainSlot) {
                    drawRect(x + 50 * itemIndex, y, 50, 50, 0, 'green', true, Layer.UI);
                }

                drawSprite(x + 50 * itemIndex, y, sprite, 0, 40, 40, Layer.UI);
                if (inventory[itemIndex].count !== 0) {
                    drawText(x - 5 + 50 * itemIndex, y - 34, 'green', `${inventory[itemIndex].count}`, 25, Layer.UI);
                }
            }
        }

        //главный слот

        for (let slotIndex = 0; slotIndex < slotCount; slotIndex++) {
            let slotX = camera.x - slotCount * 40 / 2 + slotIndex * 50;
            let slotY = camera.y + camera.height / 2 - 50;
            if (
                mouse.wentDown &&
                mouse.worldX > slotX - 20 &&
                mouse.worldX < slotX + 20 &&
                mouse.worldY > slotY - 20 &&
                mouse.worldY < slotY + 20
            ) {
                mainSlot = slotIndex;
                if (controlledStorage && !isStoraggeFullForItem(inventory[mainSlot].item, controlledStorage)) {
                    addItemToStorage(inventory[mainSlot].item, inventory[mainSlot].count, controlledStorage);
                    removeItem(inventory[mainSlot].item, inventory[mainSlot].count);
                }
            }
        }

        //если нажать на плавильню

        if (
            mouseTile && mouse.wentDown && mouseTile.upperLayer === TileType.MELTER &&
            distanceBetweenPoints(gameObject.x, gameObject.y, mouseTile.x * TILE.width, mouseTile.y * TILE.height) <=
            TILE.width + gameObject.width
        ) {
            if (mouseTile.inventory[0].item === Item.NONE && inventory[mainSlot] &&
                (inventory[mainSlot].item === Item.IRON || inventory[mainSlot].item === Item.AURIT)) {
                mouseTile.inventory[0].item = inventory[mainSlot].item;
                mouseTile.inventory[0].count = inventory[mainSlot].count;
                removeItem(inventory[mainSlot].item, inventory[mainSlot].count);
                mouseTile.specialTimer = addTimer(mouseTile.inventory[0].count * 2 * 60);
            }
            if (timers[mouseTile.specialTimer] <= 0) {
                if (mouseTile.inventory[0].item === Item.IRON) {
                    addItem(Item.IRON_INGOT, mouseTile.inventory[0].count);
                }
                if (mouseTile.inventory[0].item === Item.AURIT) {
                    addItem(Item.AURIT_INGOT, mouseTile.inventory[0].count);
                }
                mouseTile.inventory[0].item = Item.NONE;
                timers[mouseTile.specialTimer] = null;
            }
        }

        //если нажать на расщепитель

        if (mouseTile && mouse.wentDown && mouseTile.upperLayer === TileType.SPLITTER &&
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
        } else if (mouseTile && mouse.wentDown && mouseTile.upperLayer === TileType.STORAGE &&
            distanceBetweenPoints(gameObject.x, gameObject.y, mouseTile.x * TILE.width, mouseTile.y * TILE.width)
            <= TILE.width + gameObject.width && !controlledStorage) {
            controlledStorage = mouseTile;
        }

        //если открыто хранилище

        if (controlledStorage) {
            for (let slotIndex = 0; slotIndex < STORAGE_SLOT_COUNT; slotIndex++) {
                let x;
                let y;
                if (slotIndex <= Math.round(STORAGE_SLOT_COUNT / 2 - 1)) {
                    x = camera.x + camera.width / 2 - 50 * STORAGE_SLOT_COUNT / 2 - 20 + slotIndex * 50;
                    y = camera.y;
                } else {
                    x = camera.x + camera.width / 2 - 50 * STORAGE_SLOT_COUNT / 2 - 20 + slotIndex * 50 - 50 * STORAGE_SLOT_COUNT / 2;
                    y = camera.y + 100;
                }
                drawRect(x, y, 50, 50, 0, 'grey', true, Layer.UI);
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
                drawSprite(x, y, sprite, 0, 40, 40, Layer.UI);
                if (controlledStorage.inventory[slotIndex].count !== 0) {
                    drawText(x, y - 50, 'green', `${controlledStorage.inventory[slotIndex].count}`, 25, Layer.UI);
                }

                if (
                    mouse.wentDown &&
                    mouse.worldX > x - 20 &&
                    mouse.worldX < x + 20 &&
                    mouse.worldY > y - 20 &&
                    mouse.worldY < y + 20
                ) {
                    if (controlledStorage.inventory[slotIndex].item !== Item.NONE && !isInventoryFullForItem(controlledStorage.inventory[slotIndex].item)) {
                        addItem(controlledStorage.inventory[slotIndex].item, controlledStorage.inventory[slotIndex].count);
                        removeItemFromStorage(controlledStorage.inventory[slotIndex].item, controlledStorage.inventory[slotIndex].count, controlledStorage);
                    }
                }
            }
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
                    if (gameObject.cameraLvl === 0) {
                        gameObject.cameraLvl = 1;
                        removeItem(Item.GOLDEN_CAMERA, 1);
                    }
                } else if (inventory[mainSlot].item === Item.EXTRA_SLOT) {
                    if (slotCount === 5) {
                        slotCount++;
                        inventory[slotCount - 1] = { item: Item.NONE, count: 0 }
                        removeItem(Item.EXTRA_SLOT, 1);
                    }
                } else if (inventory[mainSlot].item === Item.SHOCKPROOF_BODY) {
                    if (gameObject.sprite !== imgShockProofBody) {
                        gameObject.hitpoints = 150;
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

        if (mouseTile && mouse.wentDown && !mouseTile.upperLayer &&
            distanceBetweenPoints(gameObject.x, gameObject.y, mouseTile.x * TILE.width, mouseTile.y * TILE.height)
            <= TILE.width + gameObject.width + 50 &&
            !(craftMode &&
                mouse.worldX >= camera.x - camera.width / 2 &&
                mouse.worldX <= camera.x - camera.width / 2 + 300 &&
                mouse.worldY >= camera.y - camera.height / 4 + 25 + 133 * 3 &&
                mouse.worldY <= camera.y - camera.height / 4 + 133 + 25 + 133 * 3
            ) &&
            !(mouse.worldX >= camera.x - 145 &&
                mouse.worldX <= camera.x + 145 &&
                mouse.worldY >= camera.y + camera.height / 2 - 70 &&
                mouse.worldY <= camera.y + camera.height / 2 - 30
            )
        ) {
            if (!(gameObject.x >= mouseTile.x * TILE.width - TILE.width / 2 - gameObject.width / 2 &&
                gameObject.x <= mouseTile.x * TILE.width + TILE.width / 2 + gameObject.width / 2 &&
                gameObject.y >= mouseTile.y * TILE.height - TILE.height / 2 - gameObject.height / 2 &&
                gameObject.y <= mouseTile.y * TILE.height + TILE.height / 2 + gameObject.height / 2)) {
                if (inventory[mainSlot] && inventory[mainSlot].item === Item.MELTER && mouseTile.baseLayer === TileType.LAVA) {
                    mouseTile.upperLayer = TileType.MELTER;
                    mouseTile.toughness = 200;
                    mouseTile.firstToughness = 200;
                    mouseTile.specialTimer = addTimer(0);
                    mouseTile.inventory[0] = { item: Item.NONE, count: 0 };
                    removeItem(Item.MELTER, 1);
                }
                if (
                    inventory[mainSlot] && inventory[mainSlot].item === Item.SPLITTER &&
                    !(mouseTile.baseLayer === TileType.LAVA || mouseTile.baseLayer === TileType.MOUNTAIN || mouseTile.baseLayer === TileType.NONE)
                ) {
                    mouseTile.upperLayer = TileType.SPLITTER;
                    mouseTile.toughness = 200;
                    mouseTile.firstToughness = 200;
                    removeItem(Item.SPLITTER, 1);
                }
                if (inventory[mainSlot] && inventory[mainSlot].item === Item.SUN_BATERY &&
                    !(mouseTile.baseLayer === TileType.LAVA || mouseTile.baseLayer === TileType.MOUNTAIN || mouseTile.baseLayer === TileType.NONE)) {
                    mouseTile.upperLayer = TileType.SUN_BATERY;
                    mouseTile.toughness = 200;
                    mouseTile.firstToughness = 200;
                    removeItem(Item.SUN_BATERY, 1);
                }
                if (
                    inventory[mainSlot] && inventory[mainSlot].item === Item.STORAGE &&
                    !(mouseTile.baseLayer === TileType.LAVA || mouseTile.baseLayer === TileType.MOUNTAIN || mouseTile.baseLayer === TileType.NONE)
                ) {
                    mouseTile.upperLayer = TileType.STORAGE;
                    mouseTile.toughness = 200;
                    mouseTile.firstToughness = 200;
                    for (let i = 0; i < STORAGE_SLOT_COUNT; i++) {
                        mouseTile.inventory[i] = { item: Item.NONE, count: 0 };
                    }
                    removeItem(Item.STORAGE, 1);
                }
            }
        }

        if (craftMode) {
            //табличка
            drawSprite(camera.x - camera.width / 2 + 150, camera.y - camera.height / 4 + 200 + 25, imgCrafts, 0, 300, 400, Layer.UI);
            //стрелочки
            drawSprite(camera.x - camera.width / 2 + 150, camera.y - camera.height / 4 + 15, imgArrow1, 0, 40, 26, Layer.UI);
            drawSprite(camera.x - camera.width / 2 + 150, camera.y - camera.height / 4 + 435, imgArrow1, 1 * Math.PI, 40, 26, Layer.UI);
            //спрайты предметов
            for (let itemIndex = 0; itemIndex < 3; itemIndex++) {
                drawSprite(camera.x - camera.width / 2 + 60, camera.y - camera.height / 4 + 90 + 133 * itemIndex,
                    recipes[firstRecipeIndex + itemIndex].sprite, 0, 70, 70, Layer.UI);

                drawText(camera.x - camera.width / 2 + 100, camera.y - camera.height / 4 + 50 + 133 * itemIndex,
                    'black', recipes[firstRecipeIndex + itemIndex].name, 25, Layer.UI);

                //их составляющие
                for (let partIndex = 0; partIndex < recipes[firstRecipeIndex + itemIndex].parts.length; partIndex++) {
                    let row = 0;
                    if (partIndex > 2) {
                        row = 1;
                    }
                    drawSprite(
                        camera.x - camera.width / 2 + 130 + 50 * partIndex - 150 * row,
                        camera.y - camera.height / 4 + 90 + 133 * itemIndex + 50 * row,
                        recipes[firstRecipeIndex + itemIndex].parts[partIndex].sprite, 0, 30, 30, Layer.UI
                    );
                    drawText(
                        camera.x - camera.width / 2 + 120 + 50 * partIndex - 150 * row,
                        camera.y - camera.height / 4 + 70 + 133 * itemIndex + 50 * row,
                        'black', `${recipes[firstRecipeIndex + itemIndex].parts[partIndex].count}`, 15, Layer.UI
                    );
                }

                //крафт

                if (
                    mouse.worldX >= camera.x - camera.width / 2 &&
                    mouse.worldX <= camera.x - camera.width / 2 + 300 &&
                    mouse.worldY >= camera.y - camera.height / 4 + 25 + 133 * itemIndex &&
                    mouse.worldY <= camera.y - camera.height / 4 + 133 + 25 + 133 * itemIndex
                ) {
                    drawText(
                        camera.x + camera.width / 2 - 425, camera.y - 50, 'green',
                        recipes[firstRecipeIndex + itemIndex].description1, 25, Layer.UI
                    );
                    drawText(
                        camera.x + camera.width / 2 - 425, camera.y, 'green',
                        recipes[firstRecipeIndex + itemIndex].description2, 25, Layer.UI
                    );
                    drawText(
                        camera.x + camera.width / 2 - 425, camera.y + 50, 'green',
                        recipes[firstRecipeIndex + itemIndex].description3, 25, Layer.UI
                    );
                    if (mouse.wentDown) {
                        craftRecipe(recipes[firstRecipeIndex + itemIndex]);
                    }
                }
            }
        }

        //частицы и столковения с ними
        for (let particleIndex = 0; particleIndex < particles.length; particleIndex++) {
            let particle = particles[particleIndex];
            if ((particle.color === 'grey' || particle.color === 'yellow' || particle.color === 'lightcoral' || particle.color === 'black') &&
                particle.radius < 15) {
                let particleAngle = angleBetweenPoints(gameObject.x, gameObject.y, particle.x, particle.y);
                let particleSpeed = rotateVector(6, 0, particleAngle);
                particle.accelX = 0;
                particle.accelY = 0;
                particle.x += particleSpeed[0] - particle.speedX;
                particle.y -= particleSpeed[1] + particle.speedY;
                if (distanceBetweenPoints(particle.x, particle.y, gameObject.x, gameObject.y) <= 5) {
                    removeParticle(particleIndex);
                }
            }
            drawLight(particle.x + particle.radius, particle.y + particle.radius, particle.radius * 4);

            if (gameObject.width / 2 + particle.radius >= distanceBetweenPoints(gameObject.x, gameObject.y, particle.x, particle.y) &&
                timers[gameObject.unhitableTimer] <= 0) {
                if (particle.color === 'red') {
                    gameObject.hitpoints -= 50;
                    timers[gameObject.unhitableTimer] = 180;
                }
            }
        }

        //управление мышкой

        if (mouse.isDown && mouseTile) {
            moveToTile(mouseTile);
        }

        //собираем предметы

        if (mouseTile && mouse.isDown && mouseTile.toughness) {
            if (gameObject.goForward === false && gameObject.goBackward === false &&
                gameObject.goLeft === false && gameObject.goRight === false) {
                let isThereAnItem = false;
                for (let slotIndex = 0; slotIndex < mouseTile.inventory.length; slotIndex++) {
                    if (mouseTile.inventory[slotIndex].item !== Item.NONE) {
                        isThereAnItem = true;
                    }
                }
                if (!isThereAnItem) {
                    if (mouseTile.upperLayer === TileType.IRON && !isInventoryFullForItem(Item.IRON)) {
                        mouseTile.toughness--;
                    }
                    if (mouseTile.upperLayer === TileType.AURIT && !isInventoryFullForItem(Item.AURIT)) {
                        mouseTile.toughness--;
                    }
                    if (mouseTile.upperLayer === TileType.CRYSTAL && !isInventoryFullForItem(Item.CRYSTAL)) {
                        mouseTile.toughness--;
                    }
                    if (mouseTile.upperLayer === TileType.SILIKON && !isInventoryFullForItem(Item.SILIKON)) {
                        mouseTile.toughness--;
                    }
                    if (mouseTile.upperLayer === TileType.MELTER && !isInventoryFullForItem(Item.MELTER)) {
                        mouseTile.toughness--;
                    }
                    if (mouseTile.upperLayer === TileType.SPLITTER && !isInventoryFullForItem(Item.SPLITTER)) {
                        mouseTile.toughness--;
                    }
                    if (mouseTile.upperLayer === TileType.SUN_BATERY && !isInventoryFullForItem(Item.SUN_BATERY)) {
                        mouseTile.toughness--;
                    }
                    if (mouseTile.upperLayer === TileType.STORAGE && !isInventoryFullForItem(Item.STORAGE)) {
                        mouseTile.toughness--;
                    }
                }
                if ((mouseTile.toughness % 200 === 0 || mouseTile.toughness === 0)) {
                    let color = null;
                    if (mouseTile.upperLayer === TileType.IRON) {
                        color = 'grey';
                    }
                    if (mouseTile.upperLayer === TileType.AURIT) {
                        color = 'yellow';
                    }
                    if (mouseTile.upperLayer === TileType.CRYSTAL) {
                        color = 'lightcoral';
                    }
                    if (mouseTile.upperLayer === TileType.SILIKON) {
                        color = 'black';
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
                if (mouseTile.upperLayer === TileType.MELTER) {
                    addItem(Item.MELTER, 1);
                }
                if (mouseTile.upperLayer === TileType.SPLITTER) {
                    addItem(Item.SPLITTER, 1);
                }
                if (mouseTile.upperLayer === TileType.SUN_BATERY) {
                    addItem(Item.SUN_BATERY, 1);
                }
                if (mouseTile.upperLayer === TileType.STORAGE) {
                    addItem(Item.STORAGE, 1);
                    if (mouseTile === controlledStorage) {
                        controlledStorage = null;
                    }
                }
                mouseTile.upperLayer = TileType.NONE;
            }

            let stripeWidth = 300;
            let width = stripeWidth * (mouseTile.toughness / mouseTile.firstToughness);
            drawRect(camera.x + width / 2 - 150, camera.y + camera.height / 4, width, 50, 0, 'green', false, Layer.UI);
        }

        //прорисовка частей игрока

        if (!gameObject.doNotDraw && gameObject.sunBateryLvl === 1) {
            drawSprite(gameObject.x, gameObject.y, imgSunBatteryAdd, gameObject.angle, gameObject.width, gameObject.height, Layer.PLAYER);
        }

        let angle = angleBetweenPoints(mouse.worldX, mouse.worldY, gameObject.x, gameObject.y);

        let cameraSprite = imgNone;

        if (gameObject.cameraLvl === 0) {
            cameraSprite = imgCamera;
        }
        if (gameObject.cameraLvl === 1) {
            cameraSprite = imgGoldenCamera;
        }

        if (!gameObject.doNotDraw) {
            drawSprite(gameObject.x, gameObject.y, cameraSprite, angle, 30, 30, Layer.PLAYER);
        }

        let [wheel1X, wheel1Y] = rotateVector(46, 40, -gameObject.angle);
        let [wheel2X, wheel2Y] = rotateVector(9, 45, -gameObject.angle);
        let [wheel3X, wheel3Y] = rotateVector(-48, 45, -gameObject.angle);
        let [wheel4X, wheel4Y] = rotateVector(46, -40, -gameObject.angle);
        let [wheel5X, wheel5Y] = rotateVector(9, -45, -gameObject.angle);
        let [wheel6X, wheel6Y] = rotateVector(-48, -45, -gameObject.angle);

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

        if (gameObject.leftWeel > 6) {
            gameObject.leftWeel = 1;
        }
        if (gameObject.rightWeel > 6) {
            gameObject.rightWeel = 1;
        }
        if (gameObject.leftWeel < 1) {
            gameObject.leftWeel = 6;
        }
        if (gameObject.rightWeel < 1) {
            gameObject.rightWeel = 6;
        }

        if (!gameObject.doNotDraw) {
            if (gameObject.leftWeel === 1) {
                drawSprite(gameObject.x + wheel1X, gameObject.y + wheel1Y, imgWheel1, gameObject.angle, 25, 12, Layer.PLAYER);
                drawSprite(gameObject.x + wheel2X, gameObject.y + wheel2Y, imgWheel1, gameObject.angle, 25, 12, Layer.PLAYER);
                drawSprite(gameObject.x + wheel3X, gameObject.y + wheel3Y, imgWheel1, gameObject.angle, 25, 12, Layer.PLAYER);
            }
            if (gameObject.leftWeel === 2) {
                drawSprite(gameObject.x + wheel1X, gameObject.y + wheel1Y, imgWheel2, gameObject.angle, 25, 12, Layer.PLAYER);
                drawSprite(gameObject.x + wheel2X, gameObject.y + wheel2Y, imgWheel2, gameObject.angle, 25, 12, Layer.PLAYER);
                drawSprite(gameObject.x + wheel3X, gameObject.y + wheel3Y, imgWheel2, gameObject.angle, 25, 12, Layer.PLAYER);
            }
            if (gameObject.leftWeel === 3) {
                drawSprite(gameObject.x + wheel1X, gameObject.y + wheel1Y, imgWheel3, gameObject.angle, 25, 12, Layer.PLAYER);
                drawSprite(gameObject.x + wheel2X, gameObject.y + wheel2Y, imgWheel3, gameObject.angle, 25, 12, Layer.PLAYER);
                drawSprite(gameObject.x + wheel3X, gameObject.y + wheel3Y, imgWheel3, gameObject.angle, 25, 12, Layer.PLAYER);
            }
            if (gameObject.leftWeel === 4) {
                drawSprite(gameObject.x + wheel1X, gameObject.y + wheel1Y, imgWheel4, gameObject.angle, 25, 12, Layer.PLAYER);
                drawSprite(gameObject.x + wheel2X, gameObject.y + wheel2Y, imgWheel4, gameObject.angle, 25, 12, Layer.PLAYER);
                drawSprite(gameObject.x + wheel3X, gameObject.y + wheel3Y, imgWheel4, gameObject.angle, 25, 12, Layer.PLAYER);
            }
            if (gameObject.leftWeel === 5) {
                drawSprite(gameObject.x + wheel1X, gameObject.y + wheel1Y, imgWheel5, gameObject.angle, 25, 12, Layer.PLAYER);
                drawSprite(gameObject.x + wheel2X, gameObject.y + wheel2Y, imgWheel5, gameObject.angle, 25, 12, Layer.PLAYER);
                drawSprite(gameObject.x + wheel3X, gameObject.y + wheel3Y, imgWheel5, gameObject.angle, 25, 12, Layer.PLAYER);
            }
            if (gameObject.leftWeel === 6) {
                drawSprite(gameObject.x + wheel1X, gameObject.y + wheel1Y, imgWheel6, gameObject.angle, 25, 12, Layer.PLAYER);
                drawSprite(gameObject.x + wheel2X, gameObject.y + wheel2Y, imgWheel6, gameObject.angle, 25, 12, Layer.PLAYER);
                drawSprite(gameObject.x + wheel3X, gameObject.y + wheel3Y, imgWheel6, gameObject.angle, 25, 12, Layer.PLAYER);
            }

            if (gameObject.rightWeel === 1) {
                drawSprite(gameObject.x + wheel4X, gameObject.y + wheel4Y, imgWheel1, gameObject.angle, 25, 12, Layer.PLAYER);
                drawSprite(gameObject.x + wheel5X, gameObject.y + wheel5Y, imgWheel1, gameObject.angle, 25, 12, Layer.PLAYER);
                drawSprite(gameObject.x + wheel6X, gameObject.y + wheel6Y, imgWheel1, gameObject.angle, 25, 12, Layer.PLAYER);
            }
            if (gameObject.rightWeel === 2) {
                drawSprite(gameObject.x + wheel4X, gameObject.y + wheel4Y, imgWheel2, gameObject.angle, 25, 12, Layer.PLAYER);
                drawSprite(gameObject.x + wheel5X, gameObject.y + wheel5Y, imgWheel2, gameObject.angle, 25, 12, Layer.PLAYER);
                drawSprite(gameObject.x + wheel6X, gameObject.y + wheel6Y, imgWheel2, gameObject.angle, 25, 12, Layer.PLAYER);
            }
            if (gameObject.rightWeel === 3) {
                drawSprite(gameObject.x + wheel4X, gameObject.y + wheel4Y, imgWheel3, gameObject.angle, 25, 12, Layer.PLAYER);
                drawSprite(gameObject.x + wheel5X, gameObject.y + wheel5Y, imgWheel3, gameObject.angle, 25, 12, Layer.PLAYER);
                drawSprite(gameObject.x + wheel6X, gameObject.y + wheel6Y, imgWheel3, gameObject.angle, 25, 12, Layer.PLAYER);
            }
            if (gameObject.rightWeel === 4) {
                drawSprite(gameObject.x + wheel4X, gameObject.y + wheel4Y, imgWheel4, gameObject.angle, 25, 12, Layer.PLAYER);
                drawSprite(gameObject.x + wheel5X, gameObject.y + wheel5Y, imgWheel4, gameObject.angle, 25, 12, Layer.PLAYER);
                drawSprite(gameObject.x + wheel6X, gameObject.y + wheel6Y, imgWheel4, gameObject.angle, 25, 12, Layer.PLAYER);
            }
            if (gameObject.rightWeel === 5) {
                drawSprite(gameObject.x + wheel4X, gameObject.y + wheel4Y, imgWheel5, gameObject.angle, 25, 12, Layer.PLAYER);
                drawSprite(gameObject.x + wheel5X, gameObject.y + wheel5Y, imgWheel5, gameObject.angle, 25, 12, Layer.PLAYER);
                drawSprite(gameObject.x + wheel6X, gameObject.y + wheel6Y, imgWheel5, gameObject.angle, 25, 12, Layer.PLAYER);
            }
            if (gameObject.rightWeel === 6) {
                drawSprite(gameObject.x + wheel4X, gameObject.y + wheel4Y, imgWheel6, gameObject.angle, 25, 12, Layer.PLAYER);
                drawSprite(gameObject.x + wheel5X, gameObject.y + wheel5Y, imgWheel6, gameObject.angle, 25, 12, Layer.PLAYER);
                drawSprite(gameObject.x + wheel6X, gameObject.y + wheel6Y, imgWheel6, gameObject.angle, 25, 12, Layer.PLAYER);
            }
        }

        //двигаем игрока
        moveGameObject(gameObject);
    }

    if (gameObject.type === GameObjectType.MAGMA_BALL) {
        gameObject.x += gameObject.speedX;
        gameObject.y += gameObject.speedY;

        gameObject.lifeTime++;

        let speedZ = MAGMA_BALL_SPEED * Math.sin(gameObject.angleZ)

        let speedXY = MAGMA_BALL_SPEED * Math.cos(gameObject.angleZ);

        let speedVector = rotateVector(speedXY, 0, gameObject.angle);

        gameObject.speedX = speedVector[0];
        gameObject.speedY = speedVector[1];

        let height = VOLCANO_HEIGHT + speedZ * gameObject.lifeTime - GRAVITATION / 2 * gameObject.lifeTime * gameObject.lifeTime;

        let range = MAGMA_BALL_SPEED * MAGMA_BALL_SPEED * Math.sin(2 * gameObject.angleZ) / GRAVITATION;

        let rangeProjections = rotateVector(range, 0, gameObject.angle);

        if (globalPlayer.cameraLvl === 1) {
            drawCircle(gameObject.firstX + rangeProjections[0], gameObject.firstY + rangeProjections[1], 50, 'red', true, Layer.ON_TILE);
            drawSprite(gameObject.firstX + rangeProjections[0], gameObject.firstY + rangeProjections[1], imgAlert, 0, 90, 90, Layer.ON_TILE);
        }

        drawLight(gameObject.x, gameObject.y, gameObject.width * 1.2);
        gameObject.width = 100 + height;
        gameObject.height = 100 + height;

        if (height <= 0) {
            gameObject.exists = false;
            burstParticles({ x: gameObject.x, y: gameObject.y, color: 'red', speed: 5, size: 45, count: 15, decrease: 0.35, accel: 0 });
            let x = Math.round(gameObject.x / TILE.width);
            let y = Math.round(gameObject.y / TILE.height);
            let tileIndex = getIndexFromCoords(x, y);
            let chance = randomInt(1, 2);
            if (map[tileIndex]) {
                if (map[tileIndex].upperLayer !== TileType.NONE) {
                    if (chance === 1 && map[tileIndex].upperLayer !== TileType.VOLCANO) {
                        map[tileIndex].upperLayer = TileType.NONE;
                    }
                } else {
                    if (chance === 1 && map[tileIndex].baseLayer !== TileType.NONE && map[tileIndex].baseLayer !== TileType.GEYSER
                        && map[tileIndex].baseLayer !== TileType.VOLCANO) {
                        map[tileIndex].baseLayer = TileType.LAVA;
                    }
                }
            }
        }
    }

    //смерть
    if ((gameObject.hitpoints <= 0 || timers[gameObject.energy] <= 0) && gameObject.type === GameObjectType.PLAYER) {
        gameObject.exists = false;
    }
}


function loop() {
    drawQueue = [];

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();

    ctx.rotate(-camera.angle);
    ctx.translate(-camera.x + camera.width / 2, -camera.y + camera.height / 2);

    [mouse.worldX, mouse.worldY] = screenToWorld(mouse.x, mouse.y);

    backCtx.save();

    backCtx.clearRect(0, 0, canvas.width, canvas.height);

    backCtx.fillStyle = `rgba(0,0,0,${alpha})`;

    backCtx.fillRect(0, 0, canvas.width, canvas.height);

    updateTileMap();

    for (let gameObjectIndex = 0; gameObjectIndex < gameObjects.length; gameObjectIndex++) {
        let gameObject = gameObjects[gameObjectIndex];
        if (gameObject.exists) {
            updateGameObject(gameObject);
        }
    }

    drawParticles();

    if (timers[dayTimer] === 0) {
        timers[dayTimer] = ONE_DAY;
    }

    drawSprite(camera.x, camera.y, backBuffer, 0, canvas.width, canvas.height, Layer.FORGROUND);

    drawQueue.sort((a, b) => b.layer - a.layer);
    for (let itemIndex = 0; itemIndex < drawQueue.length; itemIndex++) {
        const item = drawQueue[itemIndex];
        renderItem(item);
    }

    backCtx.restore();

    ctx.restore();

    updateTimers();
    clearAllKeys();
    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);