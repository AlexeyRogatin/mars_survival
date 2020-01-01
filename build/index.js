System.register("drawing", [], function (exports_1, context_1) {
    "use strict";
    var canvas, ctx, backBuffer, backCtx, resourcesLoadedCount, resourcesWaitingForLoadCount, canBeginGame, Layer, DrawQueueType, DrawQueueItem, imgPlayer, imgNone, imgWheel1, imgWheel2, imgWheel3, imgWheel4, imgWheel5, imgWheel6, imgCamera, imgEarth1, imgEarth2, imgEarth3, imgEarth4, imgEarth5, imgGeyser, imgMountain, imgAbyss, imgIron1, imgIron2, imgIron3, imgIron4, imgIron5, imgItems, imgIronItem, imgArrow, imgCrafts, imgArrow1, imgMelter, imgMainSlot, imgIronIngot, imgAurit1, imgAurit2, imgAurit3, imgAurit4, imgAurit5, imgAuritItem, imgAuritIngot, imgCrystal1, imgCrystal2, imgCrystal3, imgCrystal4, imgCrystal5, imgCrystalItem, imgSplitter, imgToolkit, imgSunBatteryAdd, imgSunBatteryItem, imgSunBattery, imgSilicon1, imgSilicon2, imgSilicon3, imgSilicon4, imgSilicon5, imgSiliconItem, imgVolcano, imgMagmaBall, imgStorage, imgGoldenCamera, imgExtraSlot, imgExtraSlotItem, imgAlert, imgShockProofBody;
    var __moduleName = context_1 && context_1.id;
    function resourceLoaded(src) {
        resourcesLoadedCount++;
        if (resourcesWaitingForLoadCount === resourcesLoadedCount) {
            exports_1("canBeginGame", canBeginGame = true);
        }
    }
    function loadImage(src) {
        var img = new Image();
        img.src = src;
        resourcesWaitingForLoadCount++;
        img.onload = function () { return resourceLoaded(src); };
        return img;
    }
    exports_1("loadImage", loadImage);
    function renderItem(item) {
        switch (item.type) {
            case DrawQueueType.IMAGE:
                {
                    ctx.save();
                    ctx.translate(item.x, item.y);
                    ctx.rotate(item.angle);
                    var compWidth = item.width || item.sprite.width;
                    var compHeight = item.height || item.sprite.height;
                    ctx.drawImage(item.sprite, -compWidth / 2, -compHeight / 2, compWidth, compHeight);
                    ctx.restore();
                }
                break;
            case DrawQueueType.RECT:
                {
                    ctx.save();
                    ctx.translate(item.x, item.y);
                    ctx.rotate(-item.angle);
                    if (item.outlineOnly) {
                        ctx.strokeStyle = item.color;
                        ctx.strokeRect(-item.width / 2, -item.height / 2, item.width, item.height);
                    }
                    else {
                        ctx.fillStyle = item.color;
                        ctx.fillRect(-item.width / 2, -item.height / 2, item.width, item.height);
                    }
                    ctx.restore();
                }
                break;
            case DrawQueueType.CIRCLE:
                {
                    ctx.beginPath();
                    ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
                    if (item.outlineOnly) {
                        ctx.strokeStyle = item.color;
                        ctx.stroke();
                    }
                    else {
                        ctx.fillStyle = item.color;
                        ctx.fill();
                    }
                }
                break;
            case DrawQueueType.TEXT:
                {
                    ctx.save();
                    ctx.fillStyle = item.color;
                    ctx.font = item.textSize + "px Arial";
                    ctx.textBaseline = 'middle';
                    ctx.fillText(item.text, item.x, item.y);
                    ctx.restore();
                }
                break;
            default: console.assert(false);
        }
    }
    exports_1("renderItem", renderItem);
    return {
        setters: [],
        execute: function () {
            exports_1("canvas", canvas = document.getElementById("canvas"));
            exports_1("ctx", ctx = canvas.getContext("2d"));
            canvas.width = innerWidth;
            canvas.height = innerHeight;
            exports_1("backBuffer", backBuffer = document.createElement('canvas'));
            exports_1("backCtx", backCtx = backBuffer.getContext('2d'));
            backBuffer.width = canvas.width;
            backBuffer.height = canvas.height;
            resourcesLoadedCount = 0;
            resourcesWaitingForLoadCount = 0;
            exports_1("canBeginGame", canBeginGame = false);
            (function (Layer) {
                Layer[Layer["UI"] = 0] = "UI";
                Layer[Layer["FORGROUND"] = 1] = "FORGROUND";
                Layer[Layer["PARTICLES"] = 2] = "PARTICLES";
                Layer[Layer["PLAYER"] = 3] = "PLAYER";
                Layer[Layer["ON_TILE"] = 4] = "ON_TILE";
                Layer[Layer["TILE"] = 5] = "TILE";
                Layer[Layer["NONE"] = 6] = "NONE";
            })(Layer || (Layer = {}));
            exports_1("Layer", Layer);
            (function (DrawQueueType) {
                DrawQueueType[DrawQueueType["NONE"] = 0] = "NONE";
                DrawQueueType[DrawQueueType["IMAGE"] = 1] = "IMAGE";
                DrawQueueType[DrawQueueType["RECT"] = 2] = "RECT";
                DrawQueueType[DrawQueueType["CIRCLE"] = 3] = "CIRCLE";
                DrawQueueType[DrawQueueType["TEXT"] = 4] = "TEXT";
            })(DrawQueueType || (DrawQueueType = {}));
            exports_1("DrawQueueType", DrawQueueType);
            DrawQueueItem = (function () {
                function DrawQueueItem() {
                    this.layer = Layer.TILE;
                    this.type = DrawQueueType.NONE;
                    this.width = 0;
                    this.height = 0;
                    this.angle = 0;
                    this.color = 'white';
                    this.sprite = null;
                    this.radius = 0;
                    this.text = '';
                    this.textSize = 60;
                    this.outlineOnly = false;
                }
                return DrawQueueItem;
            }());
            exports_1("DrawQueueItem", DrawQueueItem);
            exports_1("imgPlayer", imgPlayer = loadImage('../sprites/player_body.png'));
            exports_1("imgNone", imgNone = loadImage('../sprites/none.png'));
            exports_1("imgWheel1", imgWheel1 = loadImage('../sprites/weel1.png'));
            exports_1("imgWheel2", imgWheel2 = loadImage('../sprites/weel2.png'));
            exports_1("imgWheel3", imgWheel3 = loadImage('../sprites/weel3.png'));
            exports_1("imgWheel4", imgWheel4 = loadImage('../sprites/weel4.png'));
            exports_1("imgWheel5", imgWheel5 = loadImage('../sprites/weel5.png'));
            exports_1("imgWheel6", imgWheel6 = loadImage('../sprites/weel6.png'));
            exports_1("imgCamera", imgCamera = loadImage('../sprites/camera.png'));
            exports_1("imgEarth1", imgEarth1 = loadImage('../sprites/earth1.png'));
            exports_1("imgEarth2", imgEarth2 = loadImage('../sprites/earth2.png'));
            exports_1("imgEarth3", imgEarth3 = loadImage('../sprites/earth3.png'));
            exports_1("imgEarth4", imgEarth4 = loadImage('../sprites/earth4.png'));
            exports_1("imgEarth5", imgEarth5 = loadImage('../sprites/earth5.png'));
            exports_1("imgGeyser", imgGeyser = loadImage('../sprites/geyser.png'));
            exports_1("imgMountain", imgMountain = loadImage('../sprites/mountain.png'));
            exports_1("imgAbyss", imgAbyss = loadImage('../sprites/abyss.png'));
            exports_1("imgIron1", imgIron1 = loadImage('../sprites/iron1.png'));
            exports_1("imgIron2", imgIron2 = loadImage('../sprites/iron2.png'));
            exports_1("imgIron3", imgIron3 = loadImage('../sprites/iron3.png'));
            exports_1("imgIron4", imgIron4 = loadImage('../sprites/iron4.png'));
            exports_1("imgIron5", imgIron5 = loadImage('../sprites/iron5.png'));
            exports_1("imgItems", imgItems = loadImage('../sprites/items.png'));
            exports_1("imgIronItem", imgIronItem = loadImage('../sprites/ironItem.png'));
            exports_1("imgArrow", imgArrow = loadImage('../sprites/arrow.png'));
            exports_1("imgCrafts", imgCrafts = loadImage('../sprites/crafts.png'));
            exports_1("imgArrow1", imgArrow1 = loadImage('../sprites/arrow1.png'));
            exports_1("imgMelter", imgMelter = loadImage('../sprites/melter.png'));
            exports_1("imgMainSlot", imgMainSlot = loadImage('../sprites/mainSlot.png'));
            exports_1("imgIronIngot", imgIronIngot = loadImage('../sprites/ironIngotItem.png'));
            exports_1("imgAurit1", imgAurit1 = loadImage('../sprites/gold1.png'));
            exports_1("imgAurit2", imgAurit2 = loadImage('../sprites/gold2.png'));
            exports_1("imgAurit3", imgAurit3 = loadImage('../sprites/gold3.png'));
            exports_1("imgAurit4", imgAurit4 = loadImage('../sprites/gold4.png'));
            exports_1("imgAurit5", imgAurit5 = loadImage('../sprites/gold5.png'));
            exports_1("imgAuritItem", imgAuritItem = loadImage('../sprites/goldItem.png'));
            exports_1("imgAuritIngot", imgAuritIngot = loadImage('../sprites/goldIngotItem.png'));
            exports_1("imgCrystal1", imgCrystal1 = loadImage('../sprites/crystal1.png'));
            exports_1("imgCrystal2", imgCrystal2 = loadImage('../sprites/crystal2.png'));
            exports_1("imgCrystal3", imgCrystal3 = loadImage('../sprites/crystal3.png'));
            exports_1("imgCrystal4", imgCrystal4 = loadImage('../sprites/crystal4.png'));
            exports_1("imgCrystal5", imgCrystal5 = loadImage('../sprites/crystal5.png'));
            exports_1("imgCrystalItem", imgCrystalItem = loadImage('../sprites/crystalItem.png'));
            exports_1("imgSplitter", imgSplitter = loadImage('../sprites/splitter.png'));
            exports_1("imgToolkit", imgToolkit = loadImage('../sprites/toolkit.png'));
            exports_1("imgSunBatteryAdd", imgSunBatteryAdd = loadImage('../sprites/sun_battery.png'));
            exports_1("imgSunBatteryItem", imgSunBatteryItem = loadImage('../sprites/sun_batteryItem.png'));
            exports_1("imgSunBattery", imgSunBattery = loadImage('../sprites/sunBattery.png'));
            exports_1("imgSilicon1", imgSilicon1 = loadImage('../sprites/silicon1.png'));
            exports_1("imgSilicon2", imgSilicon2 = loadImage('../sprites/silicon2.png'));
            exports_1("imgSilicon3", imgSilicon3 = loadImage('../sprites/silicon3.png'));
            exports_1("imgSilicon4", imgSilicon4 = loadImage('../sprites/silicon4.png'));
            exports_1("imgSilicon5", imgSilicon5 = loadImage('../sprites/silicon5.png'));
            exports_1("imgSiliconItem", imgSiliconItem = loadImage('../sprites/siliconItem.png'));
            exports_1("imgVolcano", imgVolcano = imgMountain);
            exports_1("imgMagmaBall", imgMagmaBall = loadImage('../sprites/magmaBall.png'));
            exports_1("imgStorage", imgStorage = loadImage('../sprites/storage.png'));
            exports_1("imgGoldenCamera", imgGoldenCamera = loadImage('../sprites/cameraGold.png'));
            exports_1("imgExtraSlot", imgExtraSlot = loadImage('../sprites/extraSlot.png'));
            exports_1("imgExtraSlotItem", imgExtraSlotItem = loadImage('../sprites/extraSlotItem.png'));
            exports_1("imgAlert", imgAlert = loadImage('../sprites/alert.png'));
            exports_1("imgShockProofBody", imgShockProofBody = loadImage('../sprites/shockproof_body.png'));
        }
    };
});
System.register("controls", ["drawing"], function (exports_2, context_2) {
    "use strict";
    var drawing_1, mouseX, mouseY, KeyCode, Key, Mouse, upKey, leftKey, downKey, rightKey, mouse, qKey;
    var __moduleName = context_2 && context_2.id;
    function handleKeyDown(event, keyCode, key) {
        if (keyCode === event.keyCode) {
            if (!key.isDown) {
                key.wentDown = true;
                key.isDown = true;
            }
        }
    }
    function handleKeyUp(event, keyCode, key) {
        if (keyCode === event.keyCode) {
            if (key.isDown) {
                key.wentUp = true;
                key.isDown = false;
            }
        }
    }
    function clearKey(key) {
        key.wentDown = false;
        key.wentUp = false;
    }
    function clearAllKeys() {
        clearKey(leftKey);
        clearKey(downKey);
        clearKey(upKey);
        clearKey(rightKey);
        clearKey(qKey);
        mouse.wentUp = false;
        mouse.wentDown = false;
    }
    exports_2("clearAllKeys", clearAllKeys);
    return {
        setters: [
            function (drawing_1_1) {
                drawing_1 = drawing_1_1;
            }
        ],
        execute: function () {
            exports_2("mouseX", mouseX = 0);
            exports_2("mouseY", mouseY = 0);
            (function (KeyCode) {
                KeyCode[KeyCode["RIGHT"] = 68] = "RIGHT";
                KeyCode[KeyCode["LEFT"] = 65] = "LEFT";
                KeyCode[KeyCode["DOWN"] = 83] = "DOWN";
                KeyCode[KeyCode["UP"] = 87] = "UP";
                KeyCode[KeyCode["Q"] = 81] = "Q";
            })(KeyCode || (KeyCode = {}));
            exports_2("KeyCode", KeyCode);
            Key = (function () {
                function Key() {
                    this.isDown = false;
                    this.wentDown = false;
                    this.wentUp = false;
                }
                return Key;
            }());
            exports_2("Key", Key);
            Mouse = (function () {
                function Mouse() {
                }
                return Mouse;
            }());
            exports_2("Mouse", Mouse);
            exports_2("upKey", upKey = new Key());
            exports_2("leftKey", leftKey = new Key());
            exports_2("downKey", downKey = new Key());
            exports_2("rightKey", rightKey = new Key());
            exports_2("mouse", mouse = new Mouse());
            exports_2("qKey", qKey = new Key());
            window.onkeydown = function onkeydown(event) {
                handleKeyDown(event, KeyCode.UP, upKey);
                handleKeyDown(event, KeyCode.DOWN, downKey);
                handleKeyDown(event, KeyCode.LEFT, leftKey);
                handleKeyDown(event, KeyCode.RIGHT, rightKey);
                handleKeyDown(event, KeyCode.Q, qKey);
            };
            window.onkeyup = function onkeyup(event) {
                handleKeyUp(event, KeyCode.UP, upKey);
                handleKeyUp(event, KeyCode.DOWN, downKey);
                handleKeyUp(event, KeyCode.LEFT, leftKey);
                handleKeyUp(event, KeyCode.RIGHT, rightKey);
                handleKeyUp(event, KeyCode.Q, qKey);
            };
            window.onmousemove = function onmousemove(event) {
                mouse.x = event.clientX - drawing_1.canvas.clientLeft;
                mouse.y = event.clientY - drawing_1.canvas.clientTop;
            };
            window.onmousedown = function onmousedown(event) {
                if (!mouse.isDown) {
                    mouse.isDown = true;
                    mouse.wentDown = true;
                }
            };
            window.onmouseup = function onmouseup(event) {
                if (mouse.isDown) {
                    mouse.isDown = false;
                    mouse.wentUp = true;
                }
            };
        }
    };
});
System.register("index", ["controls", "drawing"], function (exports_3, context_3) {
    "use strict";
    var controls_1, drawing_2, GameObjectType, TileType, TILE, InventorySlot, Tile, map, chunkPrototypes, Item, RecipePart, Recipe, recipes, slotCount, inventory, drawQueue, alpha, MORNING_LENGTH, DAY_LENGTH, AFTERNOON_LENGTH, NIGHT_LENGTH, ONE_DAY, camera, timers, gameObjects, GameObject, particles, particle, globalPlayer, craftMode, firstRecipeIndex, mainSlot, controlledStorage, dayTimer, VOLCANO_RADIUS, MAGMA_BALL_SPEED, VOLCANO_HEIGHT, GRAVITATION, MAX_RANGE, STORAGE_SLOT_COUNT;
    var __moduleName = context_3 && context_3.id;
    function getIndexFromCoords(x, y) {
        var result = y * TILE.chunkSizeX * TILE.chunkCountX + x;
        return (result);
    }
    function getTileUnderMouse() {
        var _a = pixelsToTiles(controls_1.mouse.worldX, controls_1.mouse.worldY), x = _a[0], y = _a[1];
        var tile = map[getIndexFromCoords(x, y)];
        return (tile);
    }
    function tilesToPixels(x, y) {
        var result = [x * TILE.width, y * TILE.height];
        return result;
    }
    function pixelsToTiles(x, y) {
        var result = [Math.round(x / TILE.width), Math.round(y / TILE.height)];
        return result;
    }
    function addItem(item, count) {
        var resultSlot = getInventorySlotWithItem(item);
        if (!resultSlot) {
            for (var slotIndex = 0; slotIndex < inventory.length; slotIndex++) {
                var slot = inventory[slotIndex];
                if (slot.item === Item.NONE) {
                    resultSlot = slot;
                    break;
                }
            }
        }
        resultSlot.item = item;
        resultSlot.count += count;
    }
    function addItemToStorage(item, count, tile) {
        var resultSlot = getStorageSlotWithItem(item, tile);
        if (!resultSlot) {
            for (var slotIndex = 0; slotIndex < STORAGE_SLOT_COUNT; slotIndex++) {
                var slot = tile.inventory[slotIndex];
                if (slot.item === Item.NONE) {
                    resultSlot = slot;
                    break;
                }
            }
        }
        resultSlot.item = item;
        resultSlot.count += count;
    }
    function removeItem(item, count) {
        var slot = getInventorySlotWithItem(item);
        console.assert(slot.count >= count, 'В инвентаре слишком мало этого предмета');
        slot.count -= count;
        if (slot.count === 0) {
            slot.item = Item.NONE;
        }
    }
    function removeItemFromStorage(item, count, tile) {
        var slot = getStorageSlotWithItem(item, tile);
        console.assert(slot.count >= count, 'В храгилище слишком мало этого предмета');
        slot.count -= count;
        if (slot.count === 0) {
            slot.item = Item.NONE;
        }
    }
    function getInventorySlotIndexWithItem(item) {
        var result = -1;
        for (var slotIndex = 0; slotIndex < inventory.length; slotIndex++) {
            var slot = inventory[slotIndex];
            if (slot.item === item) {
                result = slotIndex;
                break;
            }
        }
        return result;
    }
    function getInventorySlotWithItem(item) {
        var index = getInventorySlotIndexWithItem(item);
        var result = null;
        if (index >= 0) {
            result = inventory[index];
        }
        return result;
    }
    function getStorageSlotIndexWithItem(item, tile) {
        var result = -1;
        for (var slotIndex = 0; slotIndex < STORAGE_SLOT_COUNT; slotIndex++) {
            var slot = tile.inventory[slotIndex];
            if (slot.item === item) {
                result = slotIndex;
                break;
            }
        }
        return result;
    }
    function getStorageSlotWithItem(item, tile) {
        var index = getStorageSlotIndexWithItem(item, tile);
        var result = null;
        if (index >= 0) {
            result = tile.inventory[index];
        }
        return result;
    }
    function isInventoryFullForItem(result) {
        var inventoryFull = true;
        for (var inventoryIndex = 0; inventoryIndex < slotCount; inventoryIndex++) {
            if (inventory[inventoryIndex].item === Item.NONE || inventory[inventoryIndex].item === result) {
                inventoryFull = false;
            }
        }
        return (inventoryFull);
    }
    function isStoraggeFullForItem(result, tile) {
        var inventoryFull = true;
        for (var inventoryIndex = 0; inventoryIndex < STORAGE_SLOT_COUNT; inventoryIndex++) {
            if (tile.inventory[inventoryIndex].item === Item.NONE || tile.inventory[inventoryIndex].item === result) {
                inventoryFull = false;
            }
        }
        return (inventoryFull);
    }
    function craftRecipe(recipe) {
        var canCraft = !isInventoryFullForItem(recipe.result);
        for (var partIndex = 0; partIndex < recipe.parts.length; partIndex++) {
            var part = recipe.parts[partIndex];
            var slot = getInventorySlotWithItem(part.item);
            if (!(slot && slot.count >= part.count)) {
                canCraft = false;
                break;
            }
            if (slot && slot.count === part.count) {
                canCraft = true;
            }
        }
        if (canCraft) {
            for (var partIndex = 0; partIndex < recipe.parts.length; partIndex++) {
                var part = recipe.parts[partIndex];
                removeItem(part.item, part.count);
            }
            addItem(recipe.result, 1);
        }
    }
    function drawSprite(x, y, sprite, angle, width, height, layer) {
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        if (layer === void 0) { layer = drawing_2.Layer.TILE; }
        if (x > camera.x - camera.width * 0.5 - width / 2 &&
            x < camera.x + camera.width * 0.5 + width / 2 &&
            y > camera.y - camera.height * 0.5 - height / 2 &&
            y < camera.y + camera.height * 0.5 + height / 2) {
            drawQueue.push({ x: x, y: y, sprite: sprite, angle: angle, width: width, height: height, layer: layer, type: drawing_2.DrawQueueType.IMAGE });
        }
    }
    exports_3("drawSprite", drawSprite);
    function drawRect(x, y, width, height, angle, color, outlineOnly, layer) {
        if (layer === void 0) { layer = drawing_2.Layer.TILE; }
        if (x > camera.x - camera.width * 0.5 - width / 2 &&
            x < camera.x + camera.width * 0.5 + width / 2 &&
            y > camera.y - camera.height * 0.5 - height / 2 &&
            y < camera.y + camera.height * 0.5 + height / 2) {
            drawQueue.push({ x: x, y: y, width: width, height: height, color: color, angle: angle, layer: layer, outlineOnly: outlineOnly, type: drawing_2.DrawQueueType.RECT });
        }
    }
    exports_3("drawRect", drawRect);
    function drawCircle(x, y, radius, color, outlineOnly, layer) {
        if (layer === void 0) { layer = drawing_2.Layer.TILE; }
        if (x > camera.x - camera.width * 0.5 - radius &&
            x < camera.x + camera.width * 0.5 + radius &&
            y > camera.y - camera.height * 0.5 - radius &&
            y < camera.y + camera.height * 0.5 + radius) {
            drawQueue.push({ x: x, y: y, radius: radius, color: color, layer: layer, outlineOnly: outlineOnly, type: drawing_2.DrawQueueType.CIRCLE });
        }
    }
    exports_3("drawCircle", drawCircle);
    function drawText(x, y, color, text, textSize, layer) {
        if (layer === void 0) { layer = drawing_2.Layer.UI; }
        if (x > camera.x - camera.width * 0.5 - textSize / 2 &&
            x < camera.x + camera.width * 0.5 + textSize / 2 &&
            y > camera.y - camera.height * 0.5 - textSize / 2 &&
            y < camera.y + camera.height * 0.5 + textSize / 2) {
            drawQueue.push({ x: x, y: y, color: color, text: text, layer: layer, type: drawing_2.DrawQueueType.TEXT, textSize: textSize });
        }
    }
    exports_3("drawText", drawText);
    function drawLight(x, y, radius) {
        var MORNING_TIME = NIGHT_LENGTH + AFTERNOON_LENGTH + DAY_LENGTH + MORNING_LENGTH;
        var DAY_TIME = NIGHT_LENGTH + AFTERNOON_LENGTH + DAY_LENGTH;
        var AFTERNOON_TIME = NIGHT_LENGTH + AFTERNOON_LENGTH;
        var NIGHT_TIME = NIGHT_LENGTH;
        if (timers[dayTimer] <= MORNING_TIME && timers[dayTimer] > DAY_TIME) {
            alpha = 1 - (MORNING_TIME - timers[dayTimer]) / (MORNING_TIME - DAY_TIME);
        }
        else if (timers[dayTimer] <= DAY_TIME && timers[dayTimer] > AFTERNOON_TIME) {
            if (globalPlayer.sunBateryLvl) {
                timers[globalPlayer.energy] += 0.005;
                if (timers[globalPlayer.energy] > globalPlayer.maxEnergy) {
                    timers[globalPlayer.energy] = globalPlayer.maxEnergy;
                }
            }
            alpha = 0;
        }
        else if (timers[dayTimer] <= AFTERNOON_TIME && timers[dayTimer] > NIGHT_TIME) {
            alpha = (AFTERNOON_TIME - timers[dayTimer]) / (AFTERNOON_TIME - NIGHT_TIME);
        }
        else if (timers[dayTimer] <= NIGHT_TIME) {
            alpha = 1;
        }
        if (x > camera.x - camera.width * 0.5 - radius &&
            x < camera.x + camera.width * 0.5 + radius &&
            y > camera.y - camera.height * 0.5 - radius &&
            y < camera.y + camera.height * 0.5 + radius) {
            drawing_2.backCtx.globalCompositeOperation = 'destination-out';
            var X = x - camera.x + camera.width / 2;
            var Y = y - camera.y + camera.height / 2;
            var gradient = drawing_2.backCtx.createRadialGradient(X, Y, 0, X, Y, radius);
            var alpha_1 = 0.25;
            gradient.addColorStop(0, "white");
            gradient.addColorStop(1, 'transparent');
            drawing_2.backCtx.fillStyle = gradient;
            drawing_2.backCtx.fillRect(X - radius, Y - radius, 2 * radius, 2 * radius);
        }
    }
    exports_3("drawLight", drawLight);
    function addGameObject(type, x, y) {
        var gameObject = {
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
            sprite: drawing_2.imgNone,
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
            angleZ: randomFloat(0.25 * Math.PI, 0.5 * Math.PI)
        };
        if (gameObject.type === GameObjectType.PLAYER) {
            gameObject.sprite = drawing_2.imgPlayer;
            gameObject.hitpoints = 100;
            gameObject.maxHitpoints = 100;
            gameObject.energy = addTimer(25000);
            gameObject.maxEnergy = 25000;
            gameObject.stuckable = true;
            gameObject.unhitableTimer = addTimer(0);
        }
        if (gameObject.type === GameObjectType.MAGMA_BALL) {
            gameObject.sprite = drawing_2.imgMagmaBall;
            gameObject.angle = randomFloat(0, Math.PI * 2);
            gameObject.speedLimit = 5;
            gameObject.unhitableTimer = addTimer(0);
        }
        if (gameObject.type === GameObjectType.NONE) {
            gameObject.exists = false;
        }
        var freeIndex = gameObjects.length;
        for (var gameObjectIndex = 0; gameObjectIndex < gameObjects.length; gameObjectIndex++) {
            var gameObject_1 = gameObjects[gameObjectIndex];
            if (!gameObject_1.exists) {
                freeIndex = gameObjectIndex;
                break;
            }
        }
        gameObjects[freeIndex] = gameObject;
        return gameObject;
    }
    function controlPlayer(gameObject) {
        if (controls_1.upKey.isDown) {
            gameObject.goForward = true;
        }
        if (controls_1.downKey.isDown) {
            gameObject.goBackward = true;
        }
        if (controls_1.rightKey.isDown) {
            gameObject.goRight = true;
        }
        if (controls_1.leftKey.isDown) {
            gameObject.goLeft = true;
        }
    }
    function moveGameObject(gameObject) {
        gameObject.accel = 0;
        if (gameObject.goForward) {
            gameObject.accel = gameObject.accelConst;
        }
        else if (gameObject.goBackward) {
            gameObject.accel = -gameObject.accelConst;
        }
        else {
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
        for (var tileIndex = 0; tileIndex < map.length; tileIndex++) {
            var other = map[tileIndex];
            var wallLeft = other.x * TILE.width - other.width / 2;
            var wallRight = other.x * TILE.width + other.width / 2;
            var wallTop = other.y * TILE.height - other.height / 2;
            var wallBottom = other.y * TILE.height + other.height / 2;
            var playerLeft = gameObject.x - gameObject.width / 2;
            var playerRight = gameObject.x + gameObject.width / 2;
            var playerTop = gameObject.y - gameObject.height / 2;
            var playerBottom = gameObject.y + gameObject.height / 2;
            if (gameObject.stuckable && (other.baseLayer === TileType.MOUNTAIN || other.baseLayer === TileType.VOLCANO ||
                other.upperLayer === TileType.MELTER || other.upperLayer === TileType.SPLITTER ||
                other.upperLayer === TileType.SUN_BATERY || other.upperLayer === TileType.STORAGE)) {
                if (gameObject.speedX !== 0) {
                    var side = void 0;
                    var wallSide = void 0;
                    if (gameObject.speedX > 0) {
                        side = playerRight;
                        wallSide = wallLeft;
                    }
                    else {
                        side = playerLeft;
                        wallSide = wallRight;
                    }
                    if (!(playerRight + gameObject.speedX <= wallLeft ||
                        playerLeft + gameObject.speedX >= wallRight ||
                        playerTop >= wallBottom ||
                        playerBottom <= wallTop)) {
                        gameObject.speedX = 0;
                        gameObject.x -= side - wallSide;
                    }
                }
                if (gameObject.speedY !== 0) {
                    var side = void 0;
                    var wallSide = void 0;
                    if (gameObject.speedY > 0) {
                        side = playerBottom;
                        wallSide = wallTop;
                    }
                    else {
                        side = playerTop;
                        wallSide = wallBottom;
                    }
                    if (!(playerRight <= wallLeft ||
                        playerLeft >= wallRight ||
                        playerTop + gameObject.speedY >= wallBottom ||
                        playerBottom + gameObject.speedY <= wallTop)) {
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
    function randomFloat(firstNumber, lastNumber) {
        var randomFloat = firstNumber + (lastNumber - firstNumber) * Math.random();
        return (randomFloat);
    }
    function randomInt(firstNumber, lastNumber) {
        var randomInt = Math.round(randomFloat(firstNumber, lastNumber));
        return (randomInt);
    }
    function addTimer(timerLength) {
        var timerIndex = timers.length;
        timers.push(timerLength);
        return timerIndex;
    }
    function updateTimers() {
        for (var timerIndex = 0; timerIndex < timers.length; timerIndex++) {
            if (timers[timerIndex] > 0) {
                timers[timerIndex]--;
            }
        }
    }
    function rotateVector(x, y, angle) {
        var sin = Math.sin(angle);
        var cos = Math.cos(angle);
        var resultX = x * cos - y * sin;
        var resultY = -y * cos - x * sin;
        return [
            resultX,
            resultY,
        ];
    }
    function angleBetweenPoints(x1, y1, x2, y2) {
        var result = Math.atan2(y2 - y1, x2 - x1) + Math.PI;
        return result;
    }
    function addParticle(x, y, color, speed, size, decrease, accel) {
        var randomAngle = randomFloat(0, Math.PI * 2);
        var randomSpeed = randomFloat(Math.abs(speed - 0.5), speed + 0.5);
        var _a = rotateVector(randomSpeed, 0, randomAngle), speedX = _a[0], speedY = _a[1];
        var randomRadius = randomInt(size - 3, size + 3);
        var _b = rotateVector(accel, 0, randomAngle), accelX = _b[0], accelY = _b[1];
        var randomSizeDecrease = randomFloat(Math.abs(decrease - 0.15), decrease + 0.15);
        var particle = {
            x: x,
            y: y,
            color: color,
            radius: randomRadius,
            speedX: speedX,
            speedY: speedY,
            accelX: accelX,
            accelY: accelY,
            sizeDecrease: randomSizeDecrease
        };
        particles.push(particle);
    }
    function burstParticles(_a) {
        var x = _a.x, y = _a.y, color = _a.color, speed = _a.speed, size = _a.size, count = _a.count, decrease = _a.decrease, accel = _a.accel;
        for (var particleIndex = 0; particleIndex < count; particleIndex++) {
            addParticle(x, y, color, speed, size, decrease, accel);
        }
    }
    function drawParticles() {
        for (var particleIndex = 0; particleIndex < particles.length; particleIndex++) {
            var particle_1 = particles[particleIndex];
            drawCircle(particle_1.x, particle_1.y, particle_1.radius, particle_1.color, false, drawing_2.Layer.PARTICLES);
            particle_1.radius -= particle_1.sizeDecrease;
            particle_1.x += particle_1.speedX;
            particle_1.y += particle_1.speedY;
            particle_1.speedX += particle_1.accelX;
            particle_1.speedY += particle_1.accelY;
            if (particle_1.radius <= 0) {
                removeParticle(particleIndex);
            }
        }
    }
    function removeParticle(particleIndex) {
        var lastParticle = particles[particles.length - 1];
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
    function screenToWorld(x, y) {
        var result = [
            x + camera.x - camera.width * 0.5,
            y + camera.y - camera.height * 0.5,
        ];
        return result;
    }
    exports_3("screenToWorld", screenToWorld);
    function worldToScreen(x, y) {
        var result = [
            x - camera.x + camera.width * 0.5,
            y - camera.y + camera.height * 0.5,
        ];
        return result;
    }
    exports_3("worldToScreen", worldToScreen);
    function distanceBetweenPoints(x1, y1, x2, y2) {
        var distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
        return distance;
    }
    function moveToTile(mouseTile) {
        var _a = tilesToPixels(mouseTile.x, mouseTile.y), x = _a[0], y = _a[1];
        var angle = angleBetweenPoints(x, y, globalPlayer.x, globalPlayer.y);
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
        }
        else if (globalPlayer.angle - globalPlayer.rotationSpeed < angle && globalPlayer.angle > angle) {
            globalPlayer.angle = angle;
        }
        else if (globalPlayer.angle > angle) {
            globalPlayer.goLeft = true;
        }
        else if (globalPlayer.angle < angle) {
            globalPlayer.goRight = true;
        }
        if (!(globalPlayer.x > x - (TILE.width / 2 + 51) &&
            globalPlayer.x < x + (TILE.width / 2 + 51) &&
            globalPlayer.y > y - (TILE.height / 2 + 51) &&
            globalPlayer.y < y + (TILE.height / 2 + 51))) {
            globalPlayer.goForward = true;
        }
    }
    function updateTile(tileType, tile) {
        var sprite = drawing_2.imgNone;
        switch (tileType) {
            case TileType.GEYSER:
                {
                    sprite = drawing_2.imgGeyser;
                    if (tile.upperLayer === TileType.NONE) {
                        if (tile.x * TILE.width > camera.x - camera.width / 2 - tile.width / 2
                            && tile.x * TILE.width < camera.x + camera.width / 2 + tile.width / 2
                            && tile.y * TILE.height > camera.y - camera.height / 2 - tile.height / 2
                            && tile.y * TILE.height < camera.y + camera.height / 2 + tile.height / 2) {
                            if (globalPlayer.cameraLvl === 1 && timers[tile.specialTimer] < 200 && timers[tile.specialTimer] > 150) {
                                drawSprite(tile.x * tile.width, tile.y * tile.height, drawing_2.imgAlert, 0, tile.width, tile.height, drawing_2.Layer.ON_TILE);
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
                                    count: 1
                                });
                            }
                        }
                    }
                }
                break;
            case TileType.EARTH_1:
                {
                    sprite = drawing_2.imgEarth1;
                }
                break;
            case TileType.EARTH_2:
                {
                    sprite = drawing_2.imgEarth2;
                }
                break;
            case TileType.EARTH_3:
                {
                    sprite = drawing_2.imgEarth3;
                }
                break;
            case TileType.EARTH_4:
                {
                    sprite = drawing_2.imgEarth4;
                }
                break;
            case TileType.EARTH_5:
                {
                    sprite = drawing_2.imgEarth5;
                }
                break;
            case TileType.LAVA:
                {
                    drawLight(tile.x * TILE.width, tile.y * TILE.height, 200);
                    sprite = drawing_2.imgAbyss;
                    var wallLeft = tile.x * TILE.width - TILE.width / 2;
                    var wallRight = tile.x * TILE.width + TILE.width / 2;
                    var wallTop = tile.y * TILE.height - TILE.height / 2;
                    var wallBottom = tile.y * TILE.height + TILE.height / 2;
                    if (globalPlayer.x - globalPlayer.width / 4 < wallRight &&
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
                        globalPlayer.y + globalPlayer.height / 4 < wallBottom) {
                        globalPlayer.exists = false;
                    }
                }
                break;
            case TileType.MELTER:
                {
                    drawLight(tile.x * TILE.width, tile.y * TILE.height, 150);
                    sprite = drawing_2.imgMelter;
                    if (timers[tile.specialTimer] > 0) {
                        drawText(tile.x * TILE.width - 10, tile.y * TILE.height, 'blue', "" + Math.round(timers[tile.specialTimer] / 60), 30, drawing_2.Layer.UI);
                    }
                    if (!controls_1.mouse.isDown) {
                        tile.toughness = tile.firstToughness;
                    }
                }
                break;
            case TileType.SPLITTER:
                {
                    sprite = drawing_2.imgSplitter;
                    if (!controls_1.mouse.isDown) {
                        tile.toughness = tile.firstToughness;
                    }
                }
                break;
            case TileType.SUN_BATERY:
                {
                    sprite = drawing_2.imgSunBattery;
                }
                break;
            case TileType.IRON:
                {
                    if (tile.toughness <= tile.firstToughness && tile.toughness > tile.firstToughness / 5 * 4) {
                        sprite = drawing_2.imgIron1;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 4 && tile.toughness > tile.firstToughness / 5 * 3) {
                        sprite = drawing_2.imgIron2;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 3 && tile.toughness > tile.firstToughness / 5 * 2) {
                        sprite = drawing_2.imgIron3;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 2 && tile.toughness > tile.firstToughness / 5 * 1) {
                        sprite = drawing_2.imgIron4;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 1 && tile.toughness > 0) {
                        sprite = drawing_2.imgIron5;
                    }
                }
                break;
            case TileType.AURIT:
                {
                    if (tile.toughness <= tile.firstToughness && tile.toughness > tile.firstToughness / 5 * 4) {
                        sprite = drawing_2.imgAurit1;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 4 && tile.toughness > tile.firstToughness / 5 * 3) {
                        sprite = drawing_2.imgAurit2;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 3 && tile.toughness > tile.firstToughness / 5 * 2) {
                        sprite = drawing_2.imgAurit3;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 2 && tile.toughness > tile.firstToughness / 5 * 1) {
                        sprite = drawing_2.imgAurit4;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 1 && tile.toughness > 0) {
                        sprite = drawing_2.imgAurit5;
                    }
                }
                break;
            case TileType.CRYSTAL:
                {
                    if (tile.toughness <= tile.firstToughness && tile.toughness > tile.firstToughness / 5 * 4) {
                        sprite = drawing_2.imgCrystal1;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 4 && tile.toughness > tile.firstToughness / 5 * 3) {
                        sprite = drawing_2.imgCrystal2;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 3 && tile.toughness > tile.firstToughness / 5 * 2) {
                        sprite = drawing_2.imgCrystal3;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 2 && tile.toughness > tile.firstToughness / 5 * 1) {
                        sprite = drawing_2.imgCrystal4;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 1 && tile.toughness > 0) {
                        sprite = drawing_2.imgCrystal5;
                    }
                }
                break;
            case TileType.SILIKON:
                {
                    if (tile.toughness <= tile.firstToughness && tile.toughness > tile.firstToughness / 5 * 4) {
                        sprite = drawing_2.imgSilicon1;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 4 && tile.toughness > tile.firstToughness / 5 * 3) {
                        sprite = drawing_2.imgSilicon2;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 3 && tile.toughness > tile.firstToughness / 5 * 2) {
                        sprite = drawing_2.imgSilicon3;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 2 && tile.toughness > tile.firstToughness / 5 * 1) {
                        sprite = drawing_2.imgSilicon4;
                    }
                    if (tile.toughness <= tile.firstToughness / 5 * 1 && tile.toughness > 0) {
                        sprite = drawing_2.imgSilicon5;
                    }
                }
                break;
            case TileType.MOUNTAIN:
                {
                    sprite = drawing_2.imgMountain;
                }
                break;
            case TileType.VOLCANO:
                {
                    sprite = drawing_2.imgVolcano;
                    drawLight(tile.x * tile.width, tile.y * tile.height, tile.width * 1.2);
                    if (distanceBetweenPoints(camera.x, camera.y, tile.x * TILE.width, tile.y * TILE.width) < VOLCANO_RADIUS) {
                        if (timers[tile.specialTimer] === 0) {
                            addGameObject(GameObjectType.MAGMA_BALL, tile.x * TILE.width, tile.y * TILE.height);
                            timers[tile.specialTimer] = randomInt(50, 500);
                        }
                    }
                }
                break;
            case TileType.STORAGE:
                {
                    sprite = drawing_2.imgStorage;
                    if (!controls_1.mouse.isDown) {
                        tile.toughness = tile.firstToughness;
                    }
                    drawLight(tile.x * tile.width, tile.y * tile.height, tile.width * 1.2);
                }
                break;
        }
        var _a = tilesToPixels(tile.x, tile.y), spriteX = _a[0], spriteY = _a[1];
        drawSprite(spriteX, spriteY, sprite, 0, tile.width, tile.height, drawing_2.Layer.TILE);
    }
    function updateTileMap() {
        for (var y = 0; y < TILE.chunkCountY * TILE.chunkSizeY; y++) {
            for (var x = 0; x < TILE.chunkCountX * TILE.chunkSizeX; x++) {
                var tile = map[getIndexFromCoords(x, y)];
                updateTile(tile.baseLayer, tile);
                updateTile(tile.upperLayer, tile);
            }
        }
    }
    function updateGameObject(gameObject) {
        var mouseTile = getTileUnderMouse();
        if (timers[gameObject.unhitableTimer] > 0) {
            gameObject.doNotDraw = !gameObject.doNotDraw;
        }
        if (timers[gameObject.unhitableTimer] === 0) {
            gameObject.doNotDraw = false;
        }
        if (!gameObject.doNotDraw) {
            if (gameObject.sprite) {
                if (gameObject.type === GameObjectType.MAGMA_BALL) {
                    drawSprite(gameObject.x, gameObject.y, gameObject.sprite, gameObject.angle + Math.PI / 180 * gameObject.lifeTime, gameObject.width, gameObject.height, drawing_2.Layer.PLAYER);
                }
                else
                    drawSprite(gameObject.x, gameObject.y, gameObject.sprite, gameObject.angle, gameObject.width, gameObject.height, drawing_2.Layer.PLAYER);
            }
            else {
                drawRect(gameObject.x, gameObject.y, gameObject.width, gameObject.height, -gameObject.angle, gameObject.color, false);
            }
        }
        if (gameObject.type === GameObjectType.PLAYER) {
            controlPlayer(gameObject);
            drawLight(gameObject.x, gameObject.y, 250);
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
            for (var slotIndex = 0; slotIndex < slotCount; slotIndex++) {
                drawRect(camera.x - slotCount * 40 / 2 + slotIndex * 50, camera.y + camera.height / 2 - 50, 50, 50, 0, 'grey', true, drawing_2.Layer.UI);
            }
            drawSprite(camera.x - camera.width / 2 + 10, camera.y - camera.height / 4, drawing_2.imgArrow, 0, 30, 50, drawing_2.Layer.UI);
            var STRIPE_WIDTH = 200;
            var STRIPE_HEIGHT = 50;
            var width = gameObject.hitpoints / gameObject.maxHitpoints * STRIPE_WIDTH;
            drawRect(camera.x - camera.width / 2 + width / 2 + 50, camera.y - camera.height / 2 + 50, width, STRIPE_HEIGHT, 0, 'green', false, drawing_2.Layer.UI);
            width = timers[gameObject.energy] / gameObject.maxEnergy * STRIPE_WIDTH;
            drawRect(camera.x - camera.width / 2 + width / 2 + 300, camera.y - camera.height / 2 + 50, width, STRIPE_HEIGHT, 0, 'blue', false, drawing_2.Layer.UI);
            var hour = ONE_DAY / (24 + 37 / 60);
            var minute = hour / 60;
            drawText(camera.x + camera.width / 2 - 100, camera.y - camera.height / 2 + 50, 'blue', Math.floor((ONE_DAY - timers[dayTimer]) / hour) + " : " + Math.floor((ONE_DAY - timers[dayTimer]) / minute) % 60, 25, drawing_2.Layer.UI);
            drawText(camera.x + camera.width / 2 - 100, camera.y - camera.height / 2 + 100, 'blue', "x: " + Math.round((gameObject.x) / TILE.width), 25, drawing_2.Layer.UI);
            drawText(camera.x + camera.width / 2 - 100, camera.y - camera.height / 2 + 130, 'blue', "y: " + Math.round((gameObject.y) / TILE.height), 25, drawing_2.Layer.UI);
            if (controls_1.qKey.wentDown) {
                inventory[mainSlot] = { item: Item.NONE, count: 0 };
            }
            if (isInventoryFullForItem(Item.NONE)) {
                drawText(camera.x + camera.width / 8, camera.y + camera.height / 2 - 40, 'green', 'Нажмите на Q, чтобы выбросить вещь', 25, drawing_2.Layer.UI);
            }
            for (var particleIndex = 0; particleIndex < particles.length; particleIndex++) {
                var particle_2 = particles[particleIndex];
                if ((particle_2.color === 'grey' || particle_2.color === 'yellow' || particle_2.color === 'lightcoral' || particle_2.color === 'black') &&
                    particle_2.radius < 15) {
                    var particleAngle = angleBetweenPoints(gameObject.x, gameObject.y, particle_2.x, particle_2.y);
                    var particleSpeed = rotateVector(6, 0, particleAngle);
                    particle_2.accelX = 0;
                    particle_2.accelY = 0;
                    particle_2.x += particleSpeed[0] - particle_2.speedX;
                    particle_2.y -= particleSpeed[1] + particle_2.speedY;
                    if (distanceBetweenPoints(particle_2.x, particle_2.y, gameObject.x, gameObject.y) <= 5) {
                        removeParticle(particleIndex);
                    }
                }
                drawLight(particle_2.x + particle_2.radius, particle_2.y + particle_2.radius, particle_2.radius * 4);
                if (gameObject.width / 2 + particle_2.radius >= distanceBetweenPoints(gameObject.x, gameObject.y, particle_2.x, particle_2.y) &&
                    timers[gameObject.unhitableTimer] <= 0) {
                    if (particle_2.color === 'red') {
                        gameObject.hitpoints -= 50;
                        timers[gameObject.unhitableTimer] = 180;
                    }
                }
            }
            for (var itemIndex = 0; itemIndex <= inventory.length; itemIndex++) {
                if (inventory[itemIndex]) {
                    var x = camera.x - slotCount * 20;
                    var y = camera.y + camera.height / 2 - 50;
                    var sprite = null;
                    if (inventory[itemIndex].item === Item.NONE) {
                        sprite = drawing_2.imgNone;
                    }
                    if (inventory[itemIndex].item === Item.IRON) {
                        sprite = drawing_2.imgIronItem;
                    }
                    if (inventory[itemIndex].item === Item.MELTER) {
                        sprite = drawing_2.imgMelter;
                    }
                    if (inventory[itemIndex].item === Item.IRON_INGOT) {
                        sprite = drawing_2.imgIronIngot;
                    }
                    if (inventory[itemIndex].item === Item.AURIT) {
                        sprite = drawing_2.imgAuritItem;
                    }
                    if (inventory[itemIndex].item === Item.AURIT_INGOT) {
                        sprite = drawing_2.imgAuritIngot;
                    }
                    if (inventory[itemIndex].item === Item.CRYSTAL) {
                        sprite = drawing_2.imgCrystalItem;
                    }
                    if (inventory[itemIndex].item === Item.SPLITTER) {
                        sprite = drawing_2.imgSplitter;
                    }
                    if (inventory[itemIndex].item === Item.TOOLKIT) {
                        sprite = drawing_2.imgToolkit;
                    }
                    if (inventory[itemIndex].item === Item.SUN_BATERY) {
                        sprite = drawing_2.imgSunBatteryItem;
                    }
                    if (inventory[itemIndex].item === Item.SILIKON) {
                        sprite = drawing_2.imgSiliconItem;
                    }
                    if (inventory[itemIndex].item === Item.STORAGE) {
                        sprite = drawing_2.imgStorage;
                    }
                    if (inventory[itemIndex].item === Item.GOLDEN_CAMERA) {
                        sprite = drawing_2.imgGoldenCamera;
                    }
                    if (inventory[itemIndex].item === Item.EXTRA_SLOT) {
                        sprite = drawing_2.imgExtraSlotItem;
                    }
                    if (inventory[itemIndex].item === Item.SHOCKPROOF_BODY) {
                        sprite = drawing_2.imgShockProofBody;
                    }
                    if (itemIndex === mainSlot) {
                        drawRect(x + 50 * itemIndex, y, 50, 50, 0, 'green', true, drawing_2.Layer.UI);
                    }
                    drawSprite(x + 50 * itemIndex, y, sprite, 0, 40, 40, drawing_2.Layer.UI);
                    if (inventory[itemIndex].count !== 0) {
                        drawText(x - 5 + 50 * itemIndex, y - 34, 'green', "" + inventory[itemIndex].count, 25, drawing_2.Layer.UI);
                    }
                }
            }
            for (var slotIndex = 0; slotIndex < slotCount; slotIndex++) {
                var slotX = camera.x - slotCount * 40 / 2 + slotIndex * 50;
                var slotY = camera.y + camera.height / 2 - 50;
                if (controls_1.mouse.wentDown &&
                    controls_1.mouse.worldX > slotX - 20 &&
                    controls_1.mouse.worldX < slotX + 20 &&
                    controls_1.mouse.worldY > slotY - 20 &&
                    controls_1.mouse.worldY < slotY + 20) {
                    mainSlot = slotIndex;
                    if (controlledStorage && !isStoraggeFullForItem(inventory[mainSlot].item, controlledStorage)) {
                        addItemToStorage(inventory[mainSlot].item, inventory[mainSlot].count, controlledStorage);
                        removeItem(inventory[mainSlot].item, inventory[mainSlot].count);
                    }
                }
            }
            if (controls_1.mouse.wentDown && controls_1.mouse.worldX > camera.x - camera.width / 2 - 10 &&
                controls_1.mouse.worldX < camera.x - camera.width / 2 + 25 &&
                controls_1.mouse.worldY > camera.y - camera.height / 4 - 25 &&
                controls_1.mouse.worldY < camera.y - camera.height / 4 + 25) {
                craftMode = !craftMode;
            }
            else if (craftMode) {
                drawSprite(camera.x - camera.width / 2 + 150, camera.y - camera.height / 4 + 200 + 25, drawing_2.imgCrafts, 0, 300, 400, drawing_2.Layer.UI);
                drawSprite(camera.x - camera.width / 2 + 150, camera.y - camera.height / 4 + 15, drawing_2.imgArrow1, 0, 40, 26, drawing_2.Layer.UI);
                drawSprite(camera.x - camera.width / 2 + 150, camera.y - camera.height / 4 + 435, drawing_2.imgArrow1, 1 * Math.PI, 40, 26, drawing_2.Layer.UI);
                for (var itemIndex = 0; itemIndex < 3; itemIndex++) {
                    drawSprite(camera.x - camera.width / 2 + 60, camera.y - camera.height / 4 + 90 + 133 * itemIndex, recipes[firstRecipeIndex + itemIndex].sprite, 0, 70, 70, drawing_2.Layer.UI);
                    drawText(camera.x - camera.width / 2 + 100, camera.y - camera.height / 4 + 50 + 133 * itemIndex, 'black', recipes[firstRecipeIndex + itemIndex].name, 25, drawing_2.Layer.UI);
                    for (var partIndex = 0; partIndex < recipes[firstRecipeIndex + itemIndex].parts.length; partIndex++) {
                        var row = 0;
                        if (partIndex > 2) {
                            row = 1;
                        }
                        drawSprite(camera.x - camera.width / 2 + 130 + 50 * partIndex - 150 * row, camera.y - camera.height / 4 + 90 + 133 * itemIndex + 50 * row, recipes[firstRecipeIndex + itemIndex].parts[partIndex].sprite, 0, 30, 30, drawing_2.Layer.UI);
                        drawText(camera.x - camera.width / 2 + 120 + 50 * partIndex - 150 * row, camera.y - camera.height / 4 + 70 + 133 * itemIndex + 50 * row, 'black', "" + recipes[firstRecipeIndex + itemIndex].parts[partIndex].count, 15, drawing_2.Layer.UI);
                    }
                    if (controls_1.mouse.worldX >= camera.x - camera.width / 2 &&
                        controls_1.mouse.worldX <= camera.x - camera.width / 2 + 300 &&
                        controls_1.mouse.worldY >= camera.y - camera.height / 4 + 25 + 133 * itemIndex &&
                        controls_1.mouse.worldY <= camera.y - camera.height / 4 + 133 + 25 + 133 * itemIndex) {
                        drawText(camera.x + camera.width / 2 - 425, camera.y - 50, 'green', recipes[firstRecipeIndex + itemIndex].description1, 25, drawing_2.Layer.UI);
                        drawText(camera.x + camera.width / 2 - 425, camera.y, 'green', recipes[firstRecipeIndex + itemIndex].description2, 25, drawing_2.Layer.UI);
                        drawText(camera.x + camera.width / 2 - 425, camera.y + 50, 'green', recipes[firstRecipeIndex + itemIndex].description3, 25, drawing_2.Layer.UI);
                        if (controls_1.mouse.wentDown) {
                            craftRecipe(recipes[firstRecipeIndex + itemIndex]);
                        }
                    }
                }
            }
            else {
                if (mouseTile && controls_1.mouse.wentDown && mouseTile.upperLayer === TileType.MELTER &&
                    distanceBetweenPoints(gameObject.x, gameObject.y, mouseTile.x * TILE.width, mouseTile.y * TILE.height) <=
                        TILE.width + gameObject.width) {
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
                if (mouseTile && controls_1.mouse.wentDown && mouseTile.upperLayer === TileType.SPLITTER &&
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
                if ((controlledStorage
                    &&
                        distanceBetweenPoints(gameObject.x, gameObject.y, controlledStorage.x * TILE.width, controlledStorage.y * TILE.width)
                            > TILE.width + gameObject.width) || (mouseTile && mouseTile && controls_1.mouse.wentDown && mouseTile === controlledStorage)) {
                    controlledStorage = null;
                }
                else if (mouseTile && controls_1.mouse.wentDown && mouseTile.upperLayer === TileType.STORAGE &&
                    distanceBetweenPoints(gameObject.x, gameObject.y, mouseTile.x * TILE.width, mouseTile.y * TILE.width)
                        <= TILE.width + gameObject.width && !controlledStorage) {
                    controlledStorage = mouseTile;
                }
                if (controls_1.mouse.wentDown && inventory[mainSlot]) {
                    if (inventory[mainSlot].item === Item.TOOLKIT &&
                        gameObject.hitpoints !== gameObject.maxHitpoints) {
                        gameObject.hitpoints += 100;
                        if (gameObject.hitpoints > gameObject.maxHitpoints) {
                            gameObject.hitpoints = gameObject.maxHitpoints;
                        }
                        removeItem(inventory[mainSlot].item, 1);
                    }
                    if (controls_1.mouse.worldX >= gameObject.x - gameObject.width / 2 &&
                        controls_1.mouse.worldX <= gameObject.x + gameObject.width / 2 &&
                        controls_1.mouse.worldY >= gameObject.y - gameObject.height / 2 &&
                        controls_1.mouse.worldY <= gameObject.y + gameObject.height / 2) {
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
                        }
                        else if (inventory[mainSlot].item === Item.EXTRA_SLOT) {
                            if (slotCount === 5) {
                                slotCount++;
                                inventory[slotCount - 1] = { item: Item.NONE, count: 0 };
                                removeItem(Item.EXTRA_SLOT, 1);
                            }
                        }
                        else if (inventory[mainSlot].item === Item.SHOCKPROOF_BODY) {
                            if (gameObject.sprite !== drawing_2.imgShockProofBody) {
                                gameObject.hitpoints = 150;
                                gameObject.maxHitpoints = 150;
                                gameObject.sprite = drawing_2.imgShockProofBody;
                                removeItem(Item.SHOCKPROOF_BODY, 1);
                            }
                        }
                        else {
                            if (gameObject.sunBateryLvl === 1 && !isInventoryFullForItem(Item.SUN_BATERY)) {
                                gameObject.sunBateryLvl = 0;
                                timers[gameObject.energy] *= 100 / 25;
                                gameObject.maxEnergy *= 100 / 25;
                                addItem(Item.SUN_BATERY, 1);
                            }
                        }
                    }
                }
                if (mouseTile && controls_1.mouse.wentDown && !mouseTile.upperLayer &&
                    distanceBetweenPoints(gameObject.x, gameObject.y, mouseTile.x * TILE.width, mouseTile.y * TILE.height)
                        <= TILE.width + gameObject.width + 50 &&
                    !(craftMode &&
                        controls_1.mouse.worldX >= camera.x - camera.width / 2 &&
                        controls_1.mouse.worldX <= camera.x - camera.width / 2 + 300 &&
                        controls_1.mouse.worldY >= camera.y - camera.height / 4 + 25 + 133 * 3 &&
                        controls_1.mouse.worldY <= camera.y - camera.height / 4 + 133 + 25 + 133 * 3) &&
                    !(controls_1.mouse.worldX >= camera.x - 145 &&
                        controls_1.mouse.worldX <= camera.x + 145 &&
                        controls_1.mouse.worldY >= camera.y + camera.height / 2 - 70 &&
                        controls_1.mouse.worldY <= camera.y + camera.height / 2 - 30)) {
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
                        if (inventory[mainSlot] && inventory[mainSlot].item === Item.SPLITTER &&
                            !(mouseTile.baseLayer === TileType.LAVA || mouseTile.baseLayer === TileType.MOUNTAIN || mouseTile.baseLayer === TileType.NONE)) {
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
                        if (inventory[mainSlot] && inventory[mainSlot].item === Item.STORAGE &&
                            !(mouseTile.baseLayer === TileType.LAVA || mouseTile.baseLayer === TileType.MOUNTAIN || mouseTile.baseLayer === TileType.NONE)) {
                            mouseTile.upperLayer = TileType.STORAGE;
                            mouseTile.toughness = 200;
                            mouseTile.firstToughness = 200;
                            for (var i = 0; i < STORAGE_SLOT_COUNT; i++) {
                                mouseTile.inventory[i] = { item: Item.NONE, count: 0 };
                            }
                            removeItem(Item.STORAGE, 1);
                        }
                    }
                }
                if (mouseTile && controls_1.mouse.isDown && mouseTile.toughness) {
                    if (gameObject.goForward === false && gameObject.goBackward === false &&
                        gameObject.goLeft === false && gameObject.goRight === false) {
                        var isThereAnItem = false;
                        for (var slotIndex = 0; slotIndex < mouseTile.inventory.length; slotIndex++) {
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
                            var color = null;
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
                                    x: controls_1.mouse.worldX,
                                    y: controls_1.mouse.worldY,
                                    color: color,
                                    speed: 1,
                                    size: 20,
                                    decrease: 0,
                                    accel: 0,
                                    count: 5
                                });
                            }
                        }
                    }
                    if (mouseTile.toughness <= 0) {
                        var x = mouseTile.x;
                        var y = mouseTile.y;
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
                    var stripeWidth = 300;
                    var width_1 = stripeWidth * (mouseTile.toughness / mouseTile.firstToughness);
                    drawRect(camera.x + width_1 / 2 - 150, camera.y + camera.height / 4, width_1, 50, 0, 'green', false, drawing_2.Layer.UI);
                }
                if (controls_1.mouse.isDown && mouseTile) {
                    moveToTile(mouseTile);
                }
            }
            if (craftMode && controls_1.mouse.wentDown && controls_1.mouse.worldX > camera.x - camera.width / 2 + 130 &&
                controls_1.mouse.worldX < camera.x - camera.width / 2 + 170 &&
                controls_1.mouse.worldY > camera.y - camera.height / 4 + 2 &&
                controls_1.mouse.worldY < camera.y - camera.height / 4 + 30 &&
                recipes[firstRecipeIndex - 1]) {
                firstRecipeIndex--;
            }
            if (craftMode && controls_1.mouse.wentDown && controls_1.mouse.worldX > camera.x - camera.width / 2 + 130 &&
                controls_1.mouse.worldX < camera.x - camera.width / 2 + 170 &&
                controls_1.mouse.worldY > camera.y - camera.height / 4 + 422 &&
                controls_1.mouse.worldY < camera.y - camera.height / 4 + 450 &&
                recipes[firstRecipeIndex + 3]) {
                firstRecipeIndex++;
            }
            if (controlledStorage) {
                for (var slotIndex = 0; slotIndex < STORAGE_SLOT_COUNT; slotIndex++) {
                    var x = void 0;
                    var y = void 0;
                    if (slotIndex <= Math.round(STORAGE_SLOT_COUNT / 2 - 1)) {
                        x = camera.x + camera.width / 2 - 50 * STORAGE_SLOT_COUNT / 2 - 20 + slotIndex * 50;
                        y = camera.y;
                    }
                    else {
                        x = camera.x + camera.width / 2 - 50 * STORAGE_SLOT_COUNT / 2 - 20 + slotIndex * 50 - 50 * STORAGE_SLOT_COUNT / 2;
                        y = camera.y + 100;
                    }
                    drawRect(x, y, 50, 50, 0, 'grey', true, drawing_2.Layer.UI);
                    var sprite = null;
                    if (controlledStorage.inventory[slotIndex].item === Item.NONE) {
                        sprite = drawing_2.imgNone;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.IRON) {
                        sprite = drawing_2.imgIronItem;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.MELTER) {
                        sprite = drawing_2.imgMelter;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.IRON_INGOT) {
                        sprite = drawing_2.imgIronIngot;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.AURIT) {
                        sprite = drawing_2.imgAuritItem;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.AURIT_INGOT) {
                        sprite = drawing_2.imgAuritIngot;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.CRYSTAL) {
                        sprite = drawing_2.imgCrystalItem;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.SPLITTER) {
                        sprite = drawing_2.imgSplitter;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.TOOLKIT) {
                        sprite = drawing_2.imgToolkit;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.SUN_BATERY) {
                        sprite = drawing_2.imgSunBatteryItem;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.SILIKON) {
                        sprite = drawing_2.imgSiliconItem;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.STORAGE) {
                        sprite = drawing_2.imgStorage;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.GOLDEN_CAMERA) {
                        sprite = drawing_2.imgGoldenCamera;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.EXTRA_SLOT) {
                        sprite = drawing_2.imgExtraSlotItem;
                    }
                    if (controlledStorage.inventory[slotIndex].item === Item.SHOCKPROOF_BODY) {
                        sprite = drawing_2.imgShockProofBody;
                    }
                    drawSprite(x, y, sprite, 0, 40, 40, drawing_2.Layer.UI);
                    if (controlledStorage.inventory[slotIndex].count !== 0) {
                        drawText(x, y - 50, 'green', "" + controlledStorage.inventory[slotIndex].count, 25, drawing_2.Layer.UI);
                    }
                    if (controls_1.mouse.wentDown &&
                        controls_1.mouse.worldX > x - 20 &&
                        controls_1.mouse.worldX < x + 20 &&
                        controls_1.mouse.worldY > y - 20 &&
                        controls_1.mouse.worldY < y + 20) {
                        if (controlledStorage.inventory[slotIndex].item !== Item.NONE && !isInventoryFullForItem(controlledStorage.inventory[slotIndex].item)) {
                            addItem(controlledStorage.inventory[slotIndex].item, controlledStorage.inventory[slotIndex].count);
                            removeItemFromStorage(controlledStorage.inventory[slotIndex].item, controlledStorage.inventory[slotIndex].count, controlledStorage);
                        }
                    }
                }
            }
            if (!gameObject.doNotDraw && gameObject.sunBateryLvl === 1) {
                drawSprite(gameObject.x, gameObject.y, drawing_2.imgSunBatteryAdd, gameObject.angle, gameObject.width, gameObject.height, drawing_2.Layer.PLAYER);
            }
            var angle = angleBetweenPoints(controls_1.mouse.worldX, controls_1.mouse.worldY, gameObject.x, gameObject.y);
            var cameraSprite = drawing_2.imgNone;
            if (gameObject.cameraLvl === 0) {
                cameraSprite = drawing_2.imgCamera;
            }
            if (gameObject.cameraLvl === 1) {
                cameraSprite = drawing_2.imgGoldenCamera;
            }
            if (!gameObject.doNotDraw) {
                drawSprite(gameObject.x, gameObject.y, cameraSprite, angle, 30, 30, drawing_2.Layer.PLAYER);
            }
            var _a = rotateVector(46, 40, -gameObject.angle), wheel1X = _a[0], wheel1Y = _a[1];
            var _b = rotateVector(9, 45, -gameObject.angle), wheel2X = _b[0], wheel2Y = _b[1];
            var _c = rotateVector(-48, 45, -gameObject.angle), wheel3X = _c[0], wheel3Y = _c[1];
            var _d = rotateVector(46, -40, -gameObject.angle), wheel4X = _d[0], wheel4Y = _d[1];
            var _e = rotateVector(9, -45, -gameObject.angle), wheel5X = _e[0], wheel5Y = _e[1];
            var _f = rotateVector(-48, -45, -gameObject.angle), wheel6X = _f[0], wheel6Y = _f[1];
            if (gameObject.goForward) {
                gameObject.leftWeel++;
                gameObject.rightWeel++;
            }
            else {
                if (gameObject.goBackward) {
                    gameObject.leftWeel--;
                    gameObject.rightWeel--;
                }
                else {
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
                    drawSprite(gameObject.x + wheel1X, gameObject.y + wheel1Y, drawing_2.imgWheel1, gameObject.angle, 25, 12, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel2X, gameObject.y + wheel2Y, drawing_2.imgWheel1, gameObject.angle, 25, 12, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel3X, gameObject.y + wheel3Y, drawing_2.imgWheel1, gameObject.angle, 25, 12, drawing_2.Layer.PLAYER);
                }
                if (gameObject.leftWeel === 2) {
                    drawSprite(gameObject.x + wheel1X, gameObject.y + wheel1Y, drawing_2.imgWheel2, gameObject.angle, 25, 12, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel2X, gameObject.y + wheel2Y, drawing_2.imgWheel2, gameObject.angle, 25, 12, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel3X, gameObject.y + wheel3Y, drawing_2.imgWheel2, gameObject.angle, 25, 12, drawing_2.Layer.PLAYER);
                }
                if (gameObject.leftWeel === 3) {
                    drawSprite(gameObject.x + wheel1X, gameObject.y + wheel1Y, drawing_2.imgWheel3, gameObject.angle, 25, 12, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel2X, gameObject.y + wheel2Y, drawing_2.imgWheel3, gameObject.angle, 25, 12, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel3X, gameObject.y + wheel3Y, drawing_2.imgWheel3, gameObject.angle, 25, 12, drawing_2.Layer.PLAYER);
                }
                if (gameObject.leftWeel === 4) {
                    drawSprite(gameObject.x + wheel1X, gameObject.y + wheel1Y, drawing_2.imgWheel4, gameObject.angle, 25, 12, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel2X, gameObject.y + wheel2Y, drawing_2.imgWheel4, gameObject.angle, 25, 12, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel3X, gameObject.y + wheel3Y, drawing_2.imgWheel4, gameObject.angle, 25, 12, drawing_2.Layer.PLAYER);
                }
                if (gameObject.leftWeel === 5) {
                    drawSprite(gameObject.x + wheel1X, gameObject.y + wheel1Y, drawing_2.imgWheel5, gameObject.angle, 25, 12, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel2X, gameObject.y + wheel2Y, drawing_2.imgWheel5, gameObject.angle, 25, 12, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel3X, gameObject.y + wheel3Y, drawing_2.imgWheel5, gameObject.angle, 25, 12, drawing_2.Layer.PLAYER);
                }
                if (gameObject.leftWeel === 6) {
                    drawSprite(gameObject.x + wheel1X, gameObject.y + wheel1Y, drawing_2.imgWheel6, gameObject.angle, 25, 12, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel2X, gameObject.y + wheel2Y, drawing_2.imgWheel6, gameObject.angle, 25, 12, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel3X, gameObject.y + wheel3Y, drawing_2.imgWheel6, gameObject.angle, 25, 12, drawing_2.Layer.PLAYER);
                }
                if (gameObject.rightWeel === 1) {
                    drawSprite(gameObject.x + wheel4X, gameObject.y + wheel4Y, drawing_2.imgWheel1, gameObject.angle, 25, 12, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel5X, gameObject.y + wheel5Y, drawing_2.imgWheel1, gameObject.angle, 25, 12, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel6X, gameObject.y + wheel6Y, drawing_2.imgWheel1, gameObject.angle, 25, 12, drawing_2.Layer.PLAYER);
                }
                if (gameObject.rightWeel === 2) {
                    drawSprite(gameObject.x + wheel4X, gameObject.y + wheel4Y, drawing_2.imgWheel2, gameObject.angle, 25, 12, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel5X, gameObject.y + wheel5Y, drawing_2.imgWheel2, gameObject.angle, 25, 12, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel6X, gameObject.y + wheel6Y, drawing_2.imgWheel2, gameObject.angle, 25, 12, drawing_2.Layer.PLAYER);
                }
                if (gameObject.rightWeel === 3) {
                    drawSprite(gameObject.x + wheel4X, gameObject.y + wheel4Y, drawing_2.imgWheel3, gameObject.angle, 25, 12, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel5X, gameObject.y + wheel5Y, drawing_2.imgWheel3, gameObject.angle, 25, 12, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel6X, gameObject.y + wheel6Y, drawing_2.imgWheel3, gameObject.angle, 25, 12, drawing_2.Layer.PLAYER);
                }
                if (gameObject.rightWeel === 4) {
                    drawSprite(gameObject.x + wheel4X, gameObject.y + wheel4Y, drawing_2.imgWheel4, gameObject.angle, 25, 12, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel5X, gameObject.y + wheel5Y, drawing_2.imgWheel4, gameObject.angle, 25, 12, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel6X, gameObject.y + wheel6Y, drawing_2.imgWheel4, gameObject.angle, 25, 12, drawing_2.Layer.PLAYER);
                }
                if (gameObject.rightWeel === 5) {
                    drawSprite(gameObject.x + wheel4X, gameObject.y + wheel4Y, drawing_2.imgWheel5, gameObject.angle, 25, 12, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel5X, gameObject.y + wheel5Y, drawing_2.imgWheel5, gameObject.angle, 25, 12, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel6X, gameObject.y + wheel6Y, drawing_2.imgWheel5, gameObject.angle, 25, 12, drawing_2.Layer.PLAYER);
                }
                if (gameObject.rightWeel === 6) {
                    drawSprite(gameObject.x + wheel4X, gameObject.y + wheel4Y, drawing_2.imgWheel6, gameObject.angle, 25, 12, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel5X, gameObject.y + wheel5Y, drawing_2.imgWheel6, gameObject.angle, 25, 12, drawing_2.Layer.PLAYER);
                    drawSprite(gameObject.x + wheel6X, gameObject.y + wheel6Y, drawing_2.imgWheel6, gameObject.angle, 25, 12, drawing_2.Layer.PLAYER);
                }
            }
            moveGameObject(gameObject);
        }
        if (gameObject.type === GameObjectType.MAGMA_BALL) {
            gameObject.x += gameObject.speedX;
            gameObject.y += gameObject.speedY;
            gameObject.lifeTime++;
            var speedZ = MAGMA_BALL_SPEED * Math.sin(gameObject.angleZ);
            var speedXY = MAGMA_BALL_SPEED * Math.cos(gameObject.angleZ);
            var speedVector = rotateVector(speedXY, 0, gameObject.angle);
            gameObject.speedX = speedVector[0];
            gameObject.speedY = speedVector[1];
            var height = VOLCANO_HEIGHT + speedZ * gameObject.lifeTime - GRAVITATION / 2 * gameObject.lifeTime * gameObject.lifeTime;
            var range = MAGMA_BALL_SPEED * MAGMA_BALL_SPEED * Math.sin(2 * gameObject.angleZ) / GRAVITATION;
            var rangeProjections = rotateVector(range, 0, gameObject.angle);
            if (globalPlayer.cameraLvl === 1) {
                drawCircle(gameObject.firstX + rangeProjections[0], gameObject.firstY + rangeProjections[1], 50, 'red', true, drawing_2.Layer.ON_TILE);
                drawSprite(gameObject.firstX + rangeProjections[0], gameObject.firstY + rangeProjections[1], drawing_2.imgAlert, 0, 90, 90, drawing_2.Layer.ON_TILE);
            }
            drawLight(gameObject.x, gameObject.y, gameObject.width * 1.2);
            gameObject.width = 100 + height;
            gameObject.height = 100 + height;
            if (height <= 0) {
                gameObject.exists = false;
                burstParticles({ x: gameObject.x, y: gameObject.y, color: 'red', speed: 5, size: 45, count: 15, decrease: 0.35, accel: 0 });
                var x = Math.round(gameObject.x / TILE.width);
                var y = Math.round(gameObject.y / TILE.height);
                var tileIndex = getIndexFromCoords(x, y);
                var chance = randomInt(1, 2);
                if (map[tileIndex]) {
                    if (map[tileIndex].upperLayer !== TileType.NONE) {
                        if (chance === 1 && map[tileIndex].upperLayer !== TileType.VOLCANO) {
                            map[tileIndex].upperLayer = TileType.NONE;
                        }
                    }
                    else {
                        if (chance === 1 && map[tileIndex].baseLayer !== TileType.NONE && map[tileIndex].baseLayer !== TileType.GEYSER
                            && map[tileIndex].baseLayer !== TileType.VOLCANO) {
                            map[tileIndex].baseLayer = TileType.LAVA;
                        }
                    }
                }
            }
        }
        if ((gameObject.hitpoints <= 0 || timers[gameObject.energy] <= 0) && gameObject.type === GameObjectType.PLAYER) {
            gameObject.exists = false;
        }
    }
    function loop() {
        var _a;
        drawQueue = [];
        drawing_2.ctx.clearRect(0, 0, drawing_2.canvas.width, drawing_2.canvas.height);
        drawing_2.ctx.save();
        drawing_2.ctx.rotate(-camera.angle);
        drawing_2.ctx.translate(-camera.x + camera.width / 2, -camera.y + camera.height / 2);
        _a = screenToWorld(controls_1.mouse.x, controls_1.mouse.y), controls_1.mouse.worldX = _a[0], controls_1.mouse.worldY = _a[1];
        drawing_2.backCtx.save();
        drawing_2.backCtx.clearRect(0, 0, drawing_2.canvas.width, drawing_2.canvas.height);
        drawing_2.backCtx.fillStyle = "rgba(0,0,0," + alpha + ")";
        drawing_2.backCtx.fillRect(0, 0, drawing_2.canvas.width, drawing_2.canvas.height);
        updateTileMap();
        for (var gameObjectIndex = 0; gameObjectIndex < gameObjects.length; gameObjectIndex++) {
            var gameObject = gameObjects[gameObjectIndex];
            if (gameObject.exists) {
                updateGameObject(gameObject);
            }
        }
        drawParticles();
        if (timers[dayTimer] === 0) {
            timers[dayTimer] = ONE_DAY;
        }
        drawSprite(camera.x, camera.y, drawing_2.backBuffer, 0, drawing_2.canvas.width, drawing_2.canvas.height, drawing_2.Layer.FORGROUND);
        drawQueue.sort(function (a, b) { return b.layer - a.layer; });
        for (var itemIndex = 0; itemIndex < drawQueue.length; itemIndex++) {
            var item = drawQueue[itemIndex];
            drawing_2.renderItem(item);
        }
        drawing_2.backCtx.restore();
        drawing_2.ctx.restore();
        updateTimers();
        controls_1.clearAllKeys();
        requestAnimationFrame(loop);
    }
    return {
        setters: [
            function (controls_1_1) {
                controls_1 = controls_1_1;
            },
            function (drawing_2_1) {
                drawing_2 = drawing_2_1;
            }
        ],
        execute: function () {
            (function (GameObjectType) {
                GameObjectType[GameObjectType["NONE"] = 0] = "NONE";
                GameObjectType[GameObjectType["PLAYER"] = 1] = "PLAYER";
                GameObjectType[GameObjectType["MAGMA_BALL"] = 2] = "MAGMA_BALL";
                GameObjectType[GameObjectType["METEORITE"] = 3] = "METEORITE";
            })(GameObjectType || (GameObjectType = {}));
            (function (TileType) {
                TileType[TileType["NONE"] = 0] = "NONE";
                TileType[TileType["EARTH_1"] = 1] = "EARTH_1";
                TileType[TileType["EARTH_2"] = 2] = "EARTH_2";
                TileType[TileType["EARTH_3"] = 3] = "EARTH_3";
                TileType[TileType["EARTH_4"] = 4] = "EARTH_4";
                TileType[TileType["EARTH_5"] = 5] = "EARTH_5";
                TileType[TileType["MOUNTAIN"] = 6] = "MOUNTAIN";
                TileType[TileType["GEYSER"] = 7] = "GEYSER";
                TileType[TileType["VOLCANO"] = 8] = "VOLCANO";
                TileType[TileType["LAVA"] = 9] = "LAVA";
                TileType[TileType["IRON"] = 10] = "IRON";
                TileType[TileType["AURIT"] = 11] = "AURIT";
                TileType[TileType["CRYSTAL"] = 12] = "CRYSTAL";
                TileType[TileType["MELTER"] = 13] = "MELTER";
                TileType[TileType["SPLITTER"] = 14] = "SPLITTER";
                TileType[TileType["SUN_BATERY"] = 15] = "SUN_BATERY";
                TileType[TileType["SILIKON"] = 16] = "SILIKON";
                TileType[TileType["STORAGE"] = 17] = "STORAGE";
            })(TileType || (TileType = {}));
            TILE = {
                width: 200,
                height: 200,
                firstX: 0,
                firstY: 0,
                chunkSizeX: 8,
                chunkSizeY: 8,
                chunkCountX: 20,
                chunkCountY: 20
            };
            InventorySlot = (function () {
                function InventorySlot() {
                    this.item = Item.NONE;
                    this.count = 0;
                }
                return InventorySlot;
            }());
            Tile = (function () {
                function Tile() {
                }
                return Tile;
            }());
            map = [];
            chunkPrototypes = [
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
            ];
            (function (Item) {
                Item[Item["NONE"] = 0] = "NONE";
                Item[Item["IRON"] = 1] = "IRON";
                Item[Item["MELTER"] = 2] = "MELTER";
                Item[Item["SPLITTER"] = 3] = "SPLITTER";
                Item[Item["IRON_INGOT"] = 4] = "IRON_INGOT";
                Item[Item["AURIT"] = 5] = "AURIT";
                Item[Item["AURIT_INGOT"] = 6] = "AURIT_INGOT";
                Item[Item["CRYSTAL"] = 7] = "CRYSTAL";
                Item[Item["TOOLKIT"] = 8] = "TOOLKIT";
                Item[Item["SUN_BATERY"] = 9] = "SUN_BATERY";
                Item[Item["SILIKON"] = 10] = "SILIKON";
                Item[Item["STORAGE"] = 11] = "STORAGE";
                Item[Item["GOLDEN_CAMERA"] = 12] = "GOLDEN_CAMERA";
                Item[Item["EXTRA_SLOT"] = 13] = "EXTRA_SLOT";
                Item[Item["SHOCKPROOF_BODY"] = 14] = "SHOCKPROOF_BODY";
            })(Item || (Item = {}));
            RecipePart = (function () {
                function RecipePart() {
                }
                return RecipePart;
            }());
            Recipe = (function () {
                function Recipe() {
                }
                return Recipe;
            }());
            recipes = [
                {
                    result: Item.MELTER,
                    parts: [{ item: Item.IRON, count: 20, sprite: drawing_2.imgIronItem },],
                    sprite: drawing_2.imgMelter,
                    name: 'Плавильня',
                    description1: 'Бегать с железом - это одно,',
                    description2: 'а с железными слитками - другое.',
                    description3: 'Можно поставить только на лаву'
                },
                {
                    result: Item.SPLITTER,
                    parts: [{ item: Item.IRON_INGOT, count: 5, sprite: drawing_2.imgIronIngot }, { item: Item.CRYSTAL, count: 10, sprite: drawing_2.imgCrystalItem }],
                    sprite: drawing_2.imgSplitter,
                    name: 'Расщепитель',
                    description1: 'Если сломать кристалл пополам,',
                    description2: 'много энергии не выделится.',
                    description3: 'Нужно что-то посерьёзнее'
                },
                {
                    result: Item.STORAGE,
                    parts: [{ item: Item.IRON_INGOT, count: 20, sprite: drawing_2.imgIronIngot }],
                    sprite: drawing_2.imgStorage,
                    name: 'Хранилище',
                    description1: 'Это сундук из Майнкрафта,',
                    description2: 'ни больше, ни меньше.',
                    description3: 'Хватит вопросов!'
                },
                {
                    result: Item.TOOLKIT,
                    parts: [{ item: Item.IRON_INGOT, count: 5, sprite: drawing_2.imgIronIngot }],
                    sprite: drawing_2.imgToolkit,
                    name: 'Ремнабор',
                    description1: 'Все травмы можно залатать,',
                    description2: 'если они не душевные.',
                    description3: 'Восполняет жизни (расходник)'
                },
                {
                    result: Item.EXTRA_SLOT,
                    parts: [{ item: Item.IRON_INGOT, count: 40, sprite: drawing_2.imgIronIngot }],
                    sprite: drawing_2.imgExtraSlotItem,
                    name: 'Допслот',
                    description1: 'Как же замечательно иметь ещё',
                    description2: 'чуть-чуть места под рукой! Сюда',
                    description3: 'можно положить немного счастья.'
                },
                {
                    result: Item.SUN_BATERY,
                    parts: [{ item: Item.SILIKON, count: 15, sprite: drawing_2.imgSiliconItem }, { item: Item.CRYSTAL, count: 30, sprite: drawing_2.imgCrystalItem }],
                    sprite: drawing_2.imgSunBatteryItem,
                    name: 'Сол панель ур.1',
                    description1: 'Без батарей, как без рук!',
                    description2: 'Позволяет получать энергию днём;',
                    description3: 'уменьшает запас энергии в 2 раза...'
                },
                {
                    result: Item.GOLDEN_CAMERA,
                    parts: [{ item: Item.AURIT_INGOT, count: 40, sprite: drawing_2.imgAuritIngot }],
                    sprite: drawing_2.imgGoldenCamera,
                    name: 'Зоркая камера',
                    description1: 'Действительно ауритовая вещь!',
                    description2: 'Позволяет видеть опасности,',
                    description3: 'если хорошо приглядеться.'
                },
                {
                    result: Item.SHOCKPROOF_BODY,
                    parts: [{ item: Item.SILIKON, count: 30, sprite: drawing_2.imgSiliconItem },
                        { item: Item.AURIT_INGOT, count: 30, sprite: drawing_2.imgAuritIngot }],
                    sprite: drawing_2.imgShockProofBody,
                    name: 'Крепкое тело',
                    description1: 'Красивый ауритовый корпус говорит',
                    description2: 'о непрочности, но слой силикона',
                    description3: 'говорит обратное. Больше жизней'
                },
            ];
            slotCount = 5;
            inventory = [];
            for (var i = 0; i < slotCount; i++) {
                inventory.push(new InventorySlot());
            }
            addItem(Item.IRON_INGOT, 20);
            addItem(Item.IRON, 20);
            addItem(Item.AURIT, 20);
            addItem(Item.AURIT_INGOT, 20);
            addItem(Item.SILIKON, 20);
            drawQueue = [];
            alpha = 0;
            MORNING_LENGTH = 6000;
            DAY_LENGTH = 6000;
            AFTERNOON_LENGTH = 6000;
            NIGHT_LENGTH = 6000;
            ONE_DAY = MORNING_LENGTH + DAY_LENGTH + AFTERNOON_LENGTH + NIGHT_LENGTH;
            camera = {
                x: TILE.firstX - TILE.width / 2 + drawing_2.canvas.width / 2,
                y: TILE.firstY - TILE.height / 2 + drawing_2.canvas.height / 2,
                width: drawing_2.canvas.width,
                height: drawing_2.canvas.height,
                angle: 0
            };
            timers = [];
            gameObjects = [];
            GameObject = (function () {
                function GameObject() {
                    this.type = GameObjectType.NONE;
                }
                return GameObject;
            }());
            particles = [];
            particle = (function () {
                function particle() {
                }
                return particle;
            }());
            for (var chunkY = 0; chunkY < TILE.chunkCountY; chunkY++) {
                for (var chunkX = 0; chunkX < TILE.chunkCountX; chunkX++) {
                    var protoIndex = randomInt(0, chunkPrototypes.length - 1);
                    var proto = chunkPrototypes[protoIndex];
                    console.assert(TILE.chunkSizeY === proto.length);
                    console.assert(TILE.chunkSizeX === proto[0].length);
                    for (var tileY = 0; tileY < proto.length; tileY++) {
                        var line = proto[tileY];
                        for (var tileX = 0; tileX < line.length; tileX++) {
                            var char = line[tileX];
                            var downTileType = null;
                            var upTileType = TileType.NONE;
                            var x = (chunkX * TILE.chunkSizeX + tileX);
                            var y = (chunkY * TILE.chunkSizeX + tileY);
                            var index = getIndexFromCoords(x, y);
                            map[index] = {
                                baseLayer: downTileType, upperLayer: upTileType, x: x, y: y, specialTimer: null, toughness: null,
                                firstToughness: null, inventory: [], width: TILE.width, height: TILE.height
                            };
                            if (char === '0') {
                                downTileType = TileType.NONE;
                            }
                            else if (char === ' ') {
                                var chance = randomInt(1, 10);
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
                            }
                            else if (char === '#') {
                                downTileType = TileType.MOUNTAIN;
                                upTileType = TileType.MOUNTAIN;
                            }
                            else if (char === '@') {
                                downTileType = TileType.GEYSER;
                                map[index].specialTimer = addTimer(randomInt(500, 1400));
                            }
                            else if (char === '*') {
                                downTileType = TileType.VOLCANO;
                                map[index].width = TILE.width * 3;
                                map[index].height = TILE.height * 3;
                                map[index].specialTimer = addTimer(randomInt(50, 500));
                            }
                            else if (char === '!') {
                                downTileType = TileType.LAVA;
                            }
                            else if (char === 'F') {
                                downTileType = TileType.EARTH_1;
                                upTileType = TileType.IRON;
                                map[index].toughness = 999;
                                map[index].firstToughness = 999;
                            }
                            else if (char === 'A') {
                                downTileType = TileType.EARTH_1;
                                upTileType = TileType.AURIT;
                                map[index].toughness = 999;
                                map[index].firstToughness = 999;
                            }
                            else if (char === 'C') {
                                downTileType = TileType.EARTH_1;
                                upTileType = TileType.CRYSTAL;
                                map[index].toughness = 999;
                                map[index].firstToughness = 999;
                            }
                            else if (char = 'S') {
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
            globalPlayer = addGameObject(GameObjectType.PLAYER, 0, 0);
            craftMode = false;
            firstRecipeIndex = 0;
            mainSlot = 0;
            controlledStorage = null;
            dayTimer = addTimer(ONE_DAY);
            VOLCANO_RADIUS = TILE.width * TILE.chunkSizeX * 1.5;
            MAGMA_BALL_SPEED = 35;
            VOLCANO_HEIGHT = 100;
            GRAVITATION = 0.5;
            MAX_RANGE = MAGMA_BALL_SPEED * MAGMA_BALL_SPEED / GRAVITATION;
            STORAGE_SLOT_COUNT = 10;
            requestAnimationFrame(loop);
        }
    };
});
//# sourceMappingURL=index.js.map