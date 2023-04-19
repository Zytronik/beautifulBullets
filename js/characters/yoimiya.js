import { challenger, boss, bulletTexture } from "../main.js";
import { allBullets, Bullet } from "../gameElements/bullet.js";
import { BOARD_HEIGHT, BOARD_WIDTH, FPS } from "../settings/gameSettings.js";
import { convertMouseCoordinatesToCanvasCoordinates } from "../view/canvas.js";
import { sounds } from "../sound/sound.js";
import { BULLET_ORIGIN, BULLET_TAG, createBulletTexture, EXAMPLE_BULLET_PROPERTIES } from "../data/bulletPresets.js";
import { HitableCircle } from "../gameElements/hitableObjects.js";

export const yoimiya = {
    "name": "Yoimiya Naganohara",
    "spriteUrl": "./img/yoimiya/portrait.png",

    // C H A L L E N G E R
    "challenger": {

        // V I S U A L S
        "sprites": {
            "idle": {
                "urls": [
                    "./img/yoimiya/challenger.png"
                ],
                "framerate": 20,
            },
            "left": {
                "urls": [
                    "./img/yoimiya/challenger_left.png"
                ],
                "framerate": 20,
            },
            "right": {
                "urls": [
                    "./img/yoimiya/challenger_right.png"
                ],
                "framerate": 20,
            }
        },
        "spriteScaling": 110,
        "radius": 8,
        "hitboxColor": "black",
        "bulletVisuals": {
            "radius": 5,
            "color": "blue"
        },

        // S T A T S 
        "stats": {
            "health": 3,
            "homing": 1.3,
            "fireRate": 12, // Bullets per Second
            "bulletDamage": 2.3,
            "moveSpeed": 7,
        },
        "shiftSpeed": 1.5,
        "bulletSpeed": 1.3,

        // S P E C I A L
        "special": {
            "use": function () {
                challenger.bullets = 4;
                challenger.bulletDamage = 1.4;
            },
            "deactivate": function () {
                challenger.bullets = 1;
                challenger.bulletDamage = this.stats.bulletDamage;
            },
            "chargeRequired": 25,
            "graceChargeSpeed": 30, // Charge per second in grace
            "passiveChargeSpeed": 2, // Charge per second
            "duration": 3,
            "coolDown": 1, // cooldown after duration in seconds

            "abilityName": "Machine Gun Bow",
            "description": "Shoots more Bullets at once for a limited Time.",
            "iconUrl": "img/yoimiya/Machine_Gun_Bow.png",
        },
    },

    // B O S S
    "boss": {
        // V I S U A L S
        "sprites": {
            "idle": {
                "urls": [
                    "./img/yoimiya/boss.png"
                ],
                "framerate": 20,
            },
            "left": {
                "urls": [
                    "./img/yoimiya/boss_left.png"
                ],
                "framerate": 20,
            },
            "right": {
                "urls": [
                    "./img/yoimiya/boss_right.png"
                ],
                "framerate": 20,
            }
        },
        "spriteScaling": 110,
        "healthBarSpriteUrl": "./img/yoimiya/portrait.png",
        "healthBarName": "Yoimiya Naganohara",

        // S T A T S 
        "stats": {
            "radius": 70,
            "moveSpeed": 2,
            "maxHealth": 1100,
        },

        // A B I L I T I E S
        "abilities": {
            "ability1": {
                "use": function () {
                    new DualChakram();
                },
                "deactivate": function () {

                },
                "coolDown": 1, //in seconds
                "duration": 0, //in seconds
                "abilityName": "Blazing Chakram",
                "description": "Throw two Chakrams burned by Blaze.",
                "iconUrl": "img/yoimiya/Blazing_Chakram.svg",

                //optional attributes for ability
            },
            "ability2": {
                "use": function () {
                    new Grenade();
                },
                "deactivate": function () {

                },
                "coolDown": 1, //in seconds
                "duration": 0, //in seconds
                "abilityName": "The Fire of Grenades",
                "description": "A fire that explodes after being hit by a Chakram.",
                "iconUrl": "img/yoimiya/Firework.png",
            },
            "ability3": {
                "use": function () {
                    let coords;
                    if (boss.canBeControlled) {

                        coords = convertMouseCoordinatesToCanvasCoordinates();
                        let x = coords[0],
                            y = coords[1];
                        if (x < 0) {
                            coords[0] = 0;
                        } else if (x > BOARD_WIDTH) {
                            coords[0] = BOARD_WIDTH;
                        }
                        if (y < 0) {
                            coords[1] = 0;
                        } else if (y > BOARD_HEIGHT) {
                            coords[1] = BOARD_HEIGHT;
                        }

                        this.originalBossCoords.push(boss.x, boss.y);
                        this.path.push(coords[0], coords[1]);
                    }
                    let firstSegment = (this.duration - 1) * FPS,
                        secondSegment = (this.duration * FPS - firstSegment),
                        bossOriginalX = this.originalBossCoords[0],
                        bossOriginalY = this.originalBossCoords[1];
                    boss.canBeControlled = false;

                    if (boss.ability3ActiveFor <= firstSegment) {

                        let x = (this.path[0] - bossOriginalX) / firstSegment,
                            y = (this.path[1] - bossOriginalY) / firstSegment;
                        boss.x += x;
                        boss.y += y;
                        boss.xSpeedNormalized = x;
                        boss.ySpeedNormalized = y;

                        if (Math.random() <= 0.15) {
                            sounds["firecracker"].play();
                            let angle = Math.atan2((this.path[1] - bossOriginalY), (this.path[0] - bossOriginalX));
                            for (let i = 0; i <= 1; i++) {
                                let lifetime = 15,
                                    length = Math.sqrt((this.path[0] - bossOriginalX) ** 2 + (this.path[1] - bossOriginalY) ** 2),
                                    random = Math.random() * 1 + 0.5,
                                    attributes = [i, length, angle, random, 0, this.path, this.originalBossCoords],
                                    bullet = new Bullet(boss.x, boss.y, bulletTexture, EXAMPLE_BULLET_PROPERTIES, trajectory, attributes, lifetime);
                                allBullets.push(bullet);
                            }
                        }

                    } else {

                        let x = -(this.path[0] - bossOriginalX) / secondSegment,
                            y = -(this.path[1] - bossOriginalY) / secondSegment;
                        boss.x += x;
                        boss.y += y;
                        boss.xSpeedNormalized = x;
                        boss.ySpeedNormalized = y;

                    }

                    function trajectory() {
                        let bulletNumber = this.trajectoryAttributes[0],
                            length = this.trajectoryAttributes[1],
                            angle = this.trajectoryAttributes[2],
                            random = this.trajectoryAttributes[3],
                            accelerator = this.trajectoryAttributes[4],
                            mouseX = this.trajectoryAttributes[5][0],
                            mouseY = this.trajectoryAttributes[5][1],
                            bossOriginalX = this.trajectoryAttributes[6][0],
                            bossOriginalY = this.trajectoryAttributes[6][1],
                            multiplier = 2,
                            divider = 4,
                            x = 0,
                            y = 0;

                        if (angle >= Math.PI / 2 || (angle >= -Math.PI / 2 && angle <= 0)) {
                            // /v /^
                            if (bulletNumber % 2 == 1) {
                                y = -(mouseX - bossOriginalX) / length * multiplier * random + accelerator;
                                x = (mouseY - bossOriginalY) / length * multiplier * random / divider;
                            } else {
                                y = (mouseX - bossOriginalX) / length * multiplier * random + accelerator;
                                x = -(mouseY - bossOriginalY) / length * multiplier * random / divider;
                            }
                        } else {
                            // \v \^
                            if (bulletNumber % 2 == 1) {
                                y = (mouseX - bossOriginalX) / length * multiplier * random + accelerator;
                                x = -(mouseY - bossOriginalY) / length * multiplier * random / divider;
                            } else {
                                y = -(mouseX - bossOriginalX) / length * multiplier * random + accelerator;
                                x = (mouseY - bossOriginalY) / length * multiplier * random / divider;
                            }
                        }

                        if (accelerator <= 5) {
                            this.trajectoryAttributes[8] += 0.006;
                        }

                        let maxSpeed = 3;
                        if (y >= maxSpeed) {
                            y = maxSpeed;
                        }
                        return [x, y];
                    }
                },
                "deactivate": function () {
                    this.path = [];
                    this.originalBossCoords = [];
                    boss.canBeControlled = true;
                },
                "coolDown": 5, //in seconds
                "duration": 4, //in seconds
                "abilityName": "Path of Destruction",
                "description": "Mark two points in your playfield and watch your enemies stumble",
                "iconUrl": "img/yoimiya/Path_of_Destruction.png",

                //optional attributes for ability
                "secondCast": false,
                "hasDuration": false,
                "path": [],
                "originalBossCoords": [],
            },
        },
        "passive": {
            "use": function () {
                let bulletAmount = 45;
                let lifetime = 20;
                let bool = false;
                for (let i = 0; i < bulletAmount; i++) {
                    let spawnBulletX = boss.x + Math.sin(Math.PI * 2 / bulletAmount * i) * 100;
                    let spawnBulletY = boss.y + Math.cos(Math.PI * 2 / bulletAmount * i) * 100;
                    let attributes = [i, bulletAmount, 0, lifetime, bool, boss.x, boss.y, spawnBulletX, spawnBulletY, 0.03];
                    new Bullet(spawnBulletX, spawnBulletY, new CatherineWheelTextureFactory().getTexture(), getBulletProperties(), trajectory, attributes, lifetime);
                }

                function getBulletProperties() {
                    let bulletProperty = {
                        origin: BULLET_ORIGIN.BOSS,
                        tag: BULLET_TAG.NONE,
                        showTrail: true,
                        trailColor: "#75757575",
                        trailEndWidth: 4,
                        trailLength: 4,
                    }
                    return bulletProperty;
                }
                
                function trajectory() {
                    let currentBulletID = this.trajectoryAttributes[0];
                    let totalBullets = this.trajectoryAttributes[1];
                    let shiftCounter = this.trajectoryAttributes[2];
                    let lifetime = this.trajectoryAttributes[3];
                    let bool = this.trajectoryAttributes[4];
                    let bossX = this.trajectoryAttributes[5];
                    let bossY = this.trajectoryAttributes[6];
                    let bulletPosX = this.trajectoryAttributes[7];
                    let bulletPosY = this.trajectoryAttributes[8];
                    let accelerator = this.trajectoryAttributes[9];
                    let shiftMovement = shiftCounter / lifetime;
                    let x = 0;
                    let y = 0;
                    
                    if (Math.random() <= 0.997 && bool == false) {
                        x = Math.sin(Math.PI * 2 / (totalBullets) * currentBulletID + shiftMovement + Math.PI / 2) * 2 + boss.xSpeedNormalized;
                        y = Math.cos(Math.PI * 2 / (totalBullets) * currentBulletID + shiftMovement + Math.PI / 2) * 2 + boss.ySpeedNormalized;
                        this.trajectoryAttributes[7] = this.logicX;
                        this.trajectoryAttributes[8] = this.logicY;
                        this.trajectoryAttributes[2] += 0.4;
                    } else {
                        if (!this.soundBool) {
                            sounds["pop"].play();
                            this.soundBool = true;
                        }
                        x = Math.cos(Math.atan2(bossY - bulletPosY, bossX - bulletPosX) + Math.PI) / accelerator;
                        y = Math.sin(Math.atan2(bossY - bulletPosY, bossX - bulletPosX) + Math.PI) * 2 + accelerator;

                        if (y >= 1.75) {
                            y = 1.75;
                        }

                        this.trajectoryAttributes[4] = true;
                        if (accelerator <= 6) {
                            this.trajectoryAttributes[9] += 0.03
                        }
                    }
                    return [x, y];
                }
            },
            "frequency": 2, //in seconds
            "soundBool": false,

            "abilityName": "Catherine Wheel (Passive)",
            "description": "Around your Boss-Character spawns a halo of bullets that occasionally sprinkle outwards and fall down",
            "iconUrl": "img/yoimiya/Catherine_Wheel_Passive.png",
        },
        "enrage": {
            "use": function () {
                let bulletAmount = 55,
                    lifetime = 20,
                    bool = false;

                for (let i = 0; i < bulletAmount; i++) {
                    let spawnBulletX = boss.x + Math.sin(Math.PI * 2 / bulletAmount * i) * 100,
                        spawnBulletY = boss.y + Math.cos(Math.PI * 2 / bulletAmount * i) * 100,
                        attributes = [i, bulletAmount, 0, lifetime, bool, boss.x, boss.y, spawnBulletX, spawnBulletY, 0.03],
                        bullet = new Bullet(spawnBulletX, spawnBulletY, bulletTexture, EXAMPLE_BULLET_PROPERTIES, trajectory, attributes, lifetime);
                    allBullets.push(bullet);
                }

                function trajectory() {
                    let currentBulletID = this.trajectoryAttributes[0],
                        totalBullets = this.trajectoryAttributes[1],
                        shiftCounter = this.trajectoryAttributes[2],
                        lifetime = this.trajectoryAttributes[3],
                        bool = this.trajectoryAttributes[4],
                        bossX = this.trajectoryAttributes[5],
                        bossY = this.trajectoryAttributes[6],
                        bulletPosX = this.trajectoryAttributes[7],
                        bulletPosY = this.trajectoryAttributes[8],
                        accelerator = this.trajectoryAttributes[9],
                        shiftMovement = shiftCounter / lifetime,
                        x = 0,
                        y = 0;

                    if (Math.random() <= 0.996 && bool == false) {
                        x = Math.sin(Math.PI * 2 / (totalBullets) * currentBulletID + shiftMovement + Math.PI / 2) * 2 + boss.xSpeedNormalized;
                        y = Math.cos(Math.PI * 2 / (totalBullets) * currentBulletID + shiftMovement + Math.PI / 2) * 2 + boss.ySpeedNormalized;
                        this.trajectoryAttributes[7] = this.logicX;
                        this.trajectoryAttributes[8] = this.logicY;
                        this.trajectoryAttributes[2] += 0.4;
                    } else {
                        x = Math.cos(Math.atan2(bossY - bulletPosY, bossX - bulletPosX) + Math.PI) / accelerator;
                        y = Math.sin(Math.atan2(bossY - bulletPosY, bossX - bulletPosX) + Math.PI) * 2 + accelerator;
                        if (y >= 2) {
                            y = 2;
                        }
                        this.trajectoryAttributes[4] = true;
                        if (accelerator <= 6) {
                            this.trajectoryAttributes[9] += 0.03
                        }
                    }
                    return [x, y];
                }
            },
            "frequency": 1.3, //trigger once every [] seconds

            "abilityName": "Catherine Wheel (Passive)",
            "description": "Around your Boss-Character spawns a halo of bullets that occasionally sprinkle outwards and fall down",
            "iconUrl": "img/yoimiya/Catherine_Wheel_Passive.png",
        },
    }
}


function getRandomColorSet() {
    let redFull = ["#ff0000", "#ff4000", "#ff0040"];
    let redPastel = ["#ffbbbb", "#ffcbbb", "#ffbbcb", "#ffe0e0"];
    let redDark = ["#770000", "#773000", "#770030", "#330000"];

    
    let blueFull = ["#00fff2", "#009dff", "#00ffd9"];
    let bluePastel = ["#b3fffb", "#abdfff", "#a9fff2"];
    let blueDark = ["#007771", "#00436d", "#007664", "#330000"];

    let colors = [[redFull, redPastel, redDark]];
    colors.push([blueFull, bluePastel, blueDark]);

    let randomColor = colors[Math.floor(Math.random() * colors.length)];
    let randomFull = randomColor[0][Math.floor(Math.random() * randomColor[0].length)];
    let randomPastel = randomColor[1][Math.floor(Math.random() * randomColor[1].length)];
    let randomDark = randomColor[2][Math.floor(Math.random() * randomColor[2].length)];
    return { full: randomFull, pastel: randomPastel, dark: randomDark };
}

let loadDualChakramTextureOnFirstCall = true;
let chakramTexture;
class DualChakram {
    constructor() {
        if (loadDualChakramTextureOnFirstCall) {
            chakramTexture = createBulletTexture(this.#getTexture());
        }

        let bulletAmount = 2
        let lifetime = 10;
        for (let i = 0; i < bulletAmount; i++) {
            let x = boss.x + Math.sin(Math.PI * 2 / bulletAmount * i) * 100;
            let y = boss.y + Math.cos(Math.PI * 2 / bulletAmount * i) * 100;
            let attributes = [i, bulletAmount, 0, lifetime, boss.x, boss.y,];
            new Bullet(x, y, chakramTexture, this.#getProperties(), this.#getTrajectory(), attributes, lifetime);
        }
    }
    #getTexture() {
        return {
            radius: 16,
            mainColor: "#ff7b0000",
            outerBorderColor: "#e8ded2ee",
            outerBorderWidth: 4,
            innerBorderColor: "#ff7b00",
            innerborderWidth: 5,
        }
    }
    #getProperties() {
        return {
            origin: BULLET_ORIGIN.BOSS,
            tag: BULLET_TAG.REGULAR_SHOT,
            showTrail: true,
            trailColor: "#d0c0acee",
            trailEndWidth: 4,
            trailLength: 4,
        }
    }
    #getTrajectory() {
        return function () {
            let x = 0,
                y = 1,
                patternID = this.trajectoryAttributes[0],
                bulletAmount = this.trajectoryAttributes[1],
                rotationCounter = this.trajectoryAttributes[2],
                lifetime = this.trajectoryAttributes[3],
                bossX = this.trajectoryAttributes[4],
                bossY = this.trajectoryAttributes[5],
                rotationTranslation = rotationCounter / lifetime;

            if (this.framesAlive <= 30) {
                x = 2.7 * Math.sin(Math.PI * 2 / bulletAmount * patternID + Math.PI) + boss.xSpeedNormalized;
                y = 2.7 * Math.cos(Math.PI * 2 / bulletAmount * patternID + Math.PI) + boss.ySpeedNormalized;
                let lengthX = convertMouseCoordinatesToCanvasCoordinates()[0] - boss.x,
                    lengthY = convertMouseCoordinatesToCanvasCoordinates()[1] - boss.y,
                    length = Math.sqrt(lengthX ** 2 + lengthY ** 2);
                this.trajectoryAttributes[4] = lengthX / length;
                this.trajectoryAttributes[5] = lengthY / length;
            } else {
                x = Math.sin(Math.PI * 2 / bulletAmount * patternID + rotationTranslation + Math.PI / 2) + bossX * 5;
                y = Math.cos(Math.PI * 2 / bulletAmount * patternID + rotationTranslation + Math.PI / 2) + bossY * 5;
                this.trajectoryAttributes[2] += 0.7;
            }
            return [x, y];
        }
    }
}

class Grenade extends Bullet {
    constructor() {
        let colorSet = getRandomColorSet();
        let grenadeTexture = {
            radius: 17,
            mainColor: colorSet.full,
            outerBorderColor: colorSet.pastel,
            outerBorderWidth: 3,
            innerBorderColor: colorSet.dark,
            innerborderWidth: 5,
        }

        let grenadeProperty = {
            origin: BULLET_ORIGIN.BOSS,
            tag: BULLET_TAG.NONE,
            showTrail: true,
            trailColor: "#75757575",
            trailEndWidth: 4,
            trailLength: 4,
        }

        let random1 = (Math.random() * 2 - 1);
        let random2 = (Math.random() * 1.5 + 1);
        function trajectory() {
            let x = random1;
            let y = random2;
            if (boss.ability2ActiveFor >= boss.coolDown - 1) {
                sounds["fireworkFuse"].stop();
            }
            return [x, y];
        }
        sounds["fireworkFuse"].play();
        super(boss.x, boss.y, createBulletTexture(grenadeTexture), grenadeProperty, trajectory)
        this.explosionBulletAmount = 30;
        this.explosionBulletLifetime = 15;
        let hitBoxHealth = 1
        let tag = BULLET_TAG.REGULAR_SHOT;
        let origin = BULLET_ORIGIN.BOSS;
        this.hitBox = new HitableCircle(
            super.x, super.y, super.getRadius(),
            hitBoxHealth, super.getLifetimeInFrame(),
            tag, origin,
            this.#getOnDestroy(), [this, this.explosionBulletAmount, this.explosionBulletLifetime]);
    }
    nextPos() {
        let next = super.nextPos()
        this.hitBox.x = next.xPos;
        this.hitBox.y = next.yPos;
    }
    #getOnDestroy() {
        return function onDestroy() {
            sounds["fireworkFuse"].stop();
            sounds["fireworkBoom"].play();
            this.onDestroyAttributes[0].framesAlive = this.onDestroyAttributes[0].lifetimeInFrames;
            let explosionBulletAmount = this.onDestroyAttributes[1];
            let outerBulletsCount = explosionBulletAmount / 1.5;
            let innerBulletsCount = explosionBulletAmount - outerBulletsCount;
            let isOuterBullet = true;
            let circleDistortionFactor = Math.random() * 15 + 1;
            let initialGravity = 0;
            let colorSet = getRandomColorSet();
            let lifetime = this.onDestroyAttributes[2];
            for (let patternID = 0; patternID < outerBulletsCount; patternID++) {
                circleDistortionFactor = Math.random() * 15 + 1;
                let trajectoryAttributes = [patternID, outerBulletsCount, isOuterBullet, circleDistortionFactor, initialGravity];
                new Bullet(this.x, this.y, getBulletTexture(colorSet), getBulletProperties(), bulletTrajectory, trajectoryAttributes, lifetime);
            }
            isOuterBullet = false;
            for (let patternID = 0; patternID < innerBulletsCount; patternID++) {
                circleDistortionFactor = Math.random() * 15 + 1;
                let trajectoryAttributes = [patternID, innerBulletsCount, isOuterBullet, circleDistortionFactor, initialGravity];
                new Bullet(this.x, this.y, getBulletTexture(colorSet), getBulletProperties(), bulletTrajectory, trajectoryAttributes, lifetime);
            }
            function getBulletTexture(colorset) {
                return createBulletTexture({
                    radius: 8,
                    mainColor: colorSet.pastel,
                    outerBorderColor: colorSet.dark,
                    outerBorderWidth: 2,
                    innerBorderColor: colorSet.full,
                    innerborderWidth: 3,
                });
            }

            function getBulletProperties() {
                let bulletProperty = {
                    origin: BULLET_ORIGIN.BOSS,
                    tag: BULLET_TAG.NONE,
                    showTrail: true,
                    trailColor: "#75757575",
                    trailEndWidth: 4,
                    trailLength: 4,
                }
                return bulletProperty;
            }

            function bulletTrajectory() {
                let x = 0;
                let y = 0;
                let patternID = this.trajectoryAttributes[0];
                let bulletCount = this.trajectoryAttributes[1];
                let isOuterBullet = this.trajectoryAttributes[2];
                let circleDistortionFactor = this.trajectoryAttributes[3];
                let gravity = this.trajectoryAttributes[4];

                if (isOuterBullet) {
                    x = Math.sin((2 * Math.PI) / bulletCount * patternID) * circleDistortionFactor;
                    y = Math.cos((2 * Math.PI) / bulletCount * patternID) * circleDistortionFactor + gravity;
                } else {
                    x = Math.sin((2 * Math.PI) / bulletCount * patternID) * circleDistortionFactor * 0.5;
                    y = Math.cos((2 * Math.PI) / bulletCount * patternID) * circleDistortionFactor * 0.5 + gravity;
                }
                if (y >= 2) {
                    y = 2;
                }
                if (gravity <= 5) {
                    this.trajectoryAttributes[4] += 0.01;
                }
                this.trajectoryAttributes[3] = circleDistortionFactor ** 0.96;
                return [x, y];
            }

        }
    }
}

let loadCatherineWheelTextureOnFirstCall = true;
let catherineWheelTexture;
class CatherineWheelTextureFactory {
    constructor() {
        if (loadCatherineWheelTextureOnFirstCall) {
            catherineWheelTexture = createBulletTexture({
                radius: 5,
                mainColor: "#edc163",
                outerBorderColor: "#8e6101",
                outerBorderWidth: 1,
                innerBorderColor: "#e7a71e",
                innerborderWidth: 2,
            });
        }
    }
    getTexture() {
        return catherineWheelTexture;
    }
}