import { canvas, camera } from './resources';

export let mouseX: number = 0;
export let mouseY: number = 0;

export enum KeyCode {
    RIGHT = 68,
    LEFT = 65,
    DOWN = 83,
    UP = 87,
    Q = 81,
    SHIFT = 16,
    R = 82,
    ESC = 27,
    KEY_1 = 49,
    KEY_2 = 50,
    KEY_3 = 51,
    KEY_4 = 52,
    KEY_5 = 53,
    KEY_6 = 54,
}

export class Key {
    isDown: boolean = false;
    wentDown: boolean = false;
    wentUp: boolean = false;
}

export class Mouse {
    isDown: boolean;
    wentDown: boolean;
    wentUp: boolean;
    x: number;
    y: number;
    worldX: number;
    worldY: number;
}

export const upKey = new Key();
export const leftKey = new Key();
export const downKey = new Key();
export const rightKey = new Key();
export let mouse = new Mouse();
export const qKey = new Key();
export const shiftKey = new Key();
export const rKey = new Key();
export const escKey = new Key();
export const key1 = new Key();
export const key2 = new Key();
export const key3 = new Key();
export const key4 = new Key();
export const key5 = new Key();
export const key6 = new Key();

function handleKeyDown(event: KeyboardEvent, keyCode: KeyCode, key: Key) {
    if (keyCode === event.keyCode) {
        if (!key.isDown) {
            key.wentDown = true;
            key.isDown = true;
        }
    }
}

function handleKeyUp(event: KeyboardEvent, keyCode: KeyCode, key: Key) {
    if (keyCode === event.keyCode) {
        if (key.isDown) {
            key.wentUp = true;
            key.isDown = false;
        }
    }
}

window.onkeydown = function onkeydown(event: KeyboardEvent) {
    handleKeyDown(event, KeyCode.UP, upKey);
    handleKeyDown(event, KeyCode.DOWN, downKey);
    handleKeyDown(event, KeyCode.LEFT, leftKey);
    handleKeyDown(event, KeyCode.RIGHT, rightKey);
    handleKeyDown(event, KeyCode.Q, qKey);
    handleKeyDown(event, KeyCode.SHIFT, shiftKey);
    handleKeyDown(event, KeyCode.R, rKey);
    handleKeyDown(event, KeyCode.ESC, escKey);
    handleKeyDown(event, KeyCode.KEY_1, key1);
    handleKeyDown(event, KeyCode.KEY_2, key2);
    handleKeyDown(event, KeyCode.KEY_3, key3);
    handleKeyDown(event, KeyCode.KEY_4, key4);
    handleKeyDown(event, KeyCode.KEY_5, key5);
    handleKeyDown(event, KeyCode.KEY_6, key6);
};

window.onkeyup = function onkeyup(event: KeyboardEvent) {
    handleKeyUp(event, KeyCode.UP, upKey);
    handleKeyUp(event, KeyCode.DOWN, downKey);
    handleKeyUp(event, KeyCode.LEFT, leftKey);
    handleKeyUp(event, KeyCode.RIGHT, rightKey);
    handleKeyUp(event, KeyCode.Q, qKey);
    handleKeyUp(event, KeyCode.SHIFT, shiftKey);
    handleKeyUp(event, KeyCode.R, rKey);
    handleKeyUp(event, KeyCode.ESC, escKey);
    handleKeyUp(event, KeyCode.KEY_1, key1);
    handleKeyUp(event, KeyCode.KEY_2, key2);
    handleKeyUp(event, KeyCode.KEY_3, key3);
    handleKeyUp(event, KeyCode.KEY_4, key4);
    handleKeyUp(event, KeyCode.KEY_5, key5);
    handleKeyUp(event, KeyCode.KEY_6, key6);
};

window.onmousemove = function onmousemove(event: MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    const scale = canvas.width / camera.width;
    mouse.x = (event.clientX - rect.left) / scale;
    mouse.y = (event.clientY - rect.top) / scale;
}

window.onmousedown = function onmousedown(event: MouseEvent) {
    if (!mouse.isDown) {
        mouse.isDown = true;
        mouse.wentDown = true;
    }
}

window.onmouseup = function onmouseup(event: MouseEvent) {
    if (mouse.isDown) {
        mouse.isDown = false;
        mouse.wentUp = true;
    }
}

function clearKey(key: Key) {
    key.wentDown = false;
    key.wentUp = false;
}

export function clearAllKeys() {
    clearKey(leftKey);
    clearKey(downKey);
    clearKey(upKey);
    clearKey(rightKey);
    clearKey(qKey);
    clearKey(shiftKey);
    clearKey(rKey);
    clearKey(escKey);
    clearKey(key1);
    clearKey(key2);
    clearKey(key3);
    clearKey(key4);
    clearKey(key5);
    clearKey(key6);
    mouse.wentUp = false;
    mouse.wentDown = false;
}
