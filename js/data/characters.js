import { boss, bossBullets, challenger } from "../main.js";
import { Bullet } from "../gameElements/bullet.js";
import { FPS } from "../settings/gameSettings.js";

export const CHARACTER_DATA = {
    "johnCena": {
        "name": "Nabil",
        "spriteUrl": "./img/nabil.jpg",

        // C H A L L E N G E R
        "challenger": {

            // V I S U A L S
            "spriteUrl": "./img/nabil.jpg",
            "spriteScaling": 30,
            "radius": 5,
            "hitboxColor": "red",
            "bulletVisuals": {
                "radius": 5,
                "color": "white"
            },

            // S T A T S 
            "stats": {
                "health": 2,
                "homing": 1.3,
                "fireRate": 12, // Bullets per Second
                "bulletDamage": 2.8,
                "moveSpeed": 8,
            },
            "bulletSpeed": 1,
            "shiftSpeed": 1,

            // S P E C I A L
            "special": {
                "use": function () {
                    bossBullets.length = 0;
                },
                "chargeRequired": 10,
                "graceChargeSpeed": 30, // Charge per second in grace
                "passiveChargeSpeed": 2, // Charge per second
                "duration": 0,

                "abilityName": "Blankbomb",
                "description": "Destroys all bullets on the screen.",
                "iconUrl": "img/special.png",
            },
        },

        // B O S S
        "boss": {
            // V I S U A L S
            "spriteUrl": "./img/nabil.jpg",
            "spriteScaling": 30,
            "healthBarSpriteUrl": "./img/nabil.jpg",
            "healthBarName" : "Nabil",

            // S T A T S 
            "stats": {
                "radius": 70,
                "moveSpeed": 3,
                "maxHealth": 1000,
            },

            // A B I L I T I E S
            "abilities": {
                "ability1": {
                    "use": function () {
                        if (this.fancyStuff) {
                            let bulletAmount = 70;
                            let lifetime = 10
                            for (let i = 0; i < bulletAmount; i++) {
                                let attributes = [i, bulletAmount, 0, lifetime * FPS]
                                let bullet = new Bullet(boss.x, boss.y, this.bulletVisuals, trajectory1, lifetime, attributes);
                                this.mybullets.push(bullet)
                                bossBullets.push(bullet);
                            }
                            this.fancyStuff = !this.fancyStuff;
                        }
                        else if (!this.fancyStuff) {
                            this.mybullets.forEach(bullet => {
                                bullet.trajectoryFunction = trajectory2;
                            })
                            this.fancyStuff = !this.fancyStuff;
                            this.mybullets = []
                        }

                        function trajectory1() {
                            let currentBulletID = this.attributes[0];
                            let totalBullets = this.attributes[1];
                            let shiftMovement = this.attributes[2] / this.attributes[3];
                            let x = Math.sin(Math.PI * 2 / (totalBullets) * currentBulletID + shiftMovement) * 2;
                            let y = Math.cos(Math.PI * 2 / (totalBullets) * currentBulletID + shiftMovement) * 2;
                            this.attributes[2]++;
                            return [x, y];
                        }

                        function trajectory2() {
                            return [0, 6];
                        }
                    },
                    "bulletVisuals": {
                        "radius": 4,
                        "color": "white"
                    },
                    "coolDown": 2, //in seconds
                    "fancyStuff": true,
                    "mybullets": [],

                    "abilityName": "Ability 1",
                    "description": "This is a description DEAL WITH IT",
                    "iconUrl": "img/bg.png",
                },
            },
            "passive": {
                "use": function () {
                    let bulletAmount = 20;
                    let lifetime = 10
                    for (let i = 0; i < bulletAmount; i++) {
                        let attributes = [i, bulletAmount, 0, lifetime * FPS]
                        let bullet = new Bullet(boss.x, boss.y, this.bulletVisuals, trajectory, lifetime, attributes);
                        bossBullets.push(bullet);
                    }

                    function trajectory() {
                        let currentBulletID = this.attributes[0];
                        let totalBullets = this.attributes[1];
                        let shiftMovement = this.attributes[2] / this.attributes[3];
                        let x = Math.sin(Math.PI * 2 / (totalBullets) * currentBulletID + shiftMovement) * 2;
                        let y = Math.cos(Math.PI * 2 / (totalBullets) * currentBulletID + shiftMovement) * 2;
                        this.attributes[2]++;
                        return [x, y];
                    }
                },
                "bulletVisuals": {
                    "radius": 7,
                    "color": "white"
                },
                "frequency": 2, //in seconds

                "abilityName": "Passive",
                "description": "This is a description for a Passive Ability.",
                "iconUrl": "img/passive.png",
            },
        }
    },

    "alice": {
        "name": "Alice Security",
        "spriteUrl": "./img/challenger.png",

        // C H A L L E N G E R
        "challenger": {

            // V I S U A L S
            "spriteUrl": "./img/challenger.png",
            "spriteScaling": 100,
            "radius": 5,
            "hitboxColor": "red",
            "bulletVisuals": {
                "radius": 5,
                "color": "blue"
            },

            // S T A T S 
            "stats": {
                "health": 5,
                "homing": 2,
                "fireRate": 4, // Bullets per Second
                "bulletDamage": 5,
                "moveSpeed": 3,
            },
            "bulletSpeed": 2,
            "shiftSpeed": 1.6,

            // S P E C I A L
            "special": {
                "use": function () {
                    bossBullets.length = 0;
                },
                "chargeRequired": 50,
                "graceChargeSpeed": 30, // Charge per second in grace
                "passiveChargeSpeed": 2, // Charge per second
                "duration": 0,

                "abilityName": "Blankbomb",
                "description": "Destroys all bullets on the screen.",
                "iconUrl": "img/special.jpg",
            },
        },

        // B O S S
        "boss": {
            // V I S U A L S
            "spriteUrl": "./img/challenger.png",
            "spriteScaling": 100,
            "healthBarSpriteUrl": "./img/challenger.png",
            "healthBarName" : "Alice Security",

            // S T A T S 
            "stats": {
                "radius": 6,
                "moveSpeed": 8.6,
                "maxHealth": 2000,
            },

            // A B I L I T I E S
            "abilities": {
                "ability1": {
                    "use": function () {
                        if (this.fancyStuff) {
                            let bulletAmount = 70;
                            let lifetime = 10
                            for (let i = 0; i < bulletAmount; i++) {
                                let attributes = [i, bulletAmount, 0, lifetime * FPS]
                                let bullet = new Bullet(boss.x, boss.y, this.bulletVisuals, trajectory1, lifetime, attributes);
                                this.mybullets.push(bullet)
                                bossBullets.push(bullet);
                            }
                            this.fancyStuff = !this.fancyStuff;
                        }
                        else if (!this.fancyStuff) {
                            this.mybullets.forEach(bullet => {
                                bullet.trajectoryFunction = trajectory2;
                            })
                            this.fancyStuff = !this.fancyStuff;
                            this.mybullets = []
                        }

                        function trajectory1() {
                            let currentBulletID = this.attributes[0];
                            let totalBullets = this.attributes[1];
                            let shiftMovement = this.attributes[2] / this.attributes[3];
                            let x = Math.sin(Math.PI * 2 / (totalBullets) * currentBulletID + shiftMovement) * 2;
                            let y = Math.cos(Math.PI * 2 / (totalBullets) * currentBulletID + shiftMovement) * 2;
                            this.attributes[2]++;
                            return [x, y];
                        }

                        function trajectory2() {
                            return [0, 6];
                        }
                    },
                    "bulletVisuals": {
                        "radius": 4,
                        "color": "white"
                    },
                    "coolDown": 2, //in seconds
                    "fancyStuff": true,
                    "mybullets": [],

                    "abilityName": "Ability 1",
                    "description": "This is a description DEAL WITH IT",
                    "iconUrl": "img/ability1.png",
                },
            },
            "passive": {
                "use": function () {
                    let bulletAmount = 10;
                    let lifetime = 10
                    for (let i = 0; i < bulletAmount; i++) {
                        let attributes = [i, bulletAmount, 0, lifetime * FPS]
                        let bullet = new Bullet(boss.x, boss.y, this.bulletVisuals, trajectory, lifetime, attributes);
                        bossBullets.push(bullet);
                    }

                    function trajectory() {
                        let currentBulletID = this.attributes[0];
                        let totalBullets = this.attributes[1];
                        let shiftMovement = this.attributes[2] / this.attributes[3];
                        let x = Math.sin(Math.PI * 2 / (totalBullets) * currentBulletID + shiftMovement) * 2;
                        let y = Math.cos(Math.PI * 2 / (totalBullets) * currentBulletID + shiftMovement) * 2;
                        this.attributes[2]++;
                        return [x, y];
                    }
                },
                "bulletVisuals": {
                    "radius": 7,
                    "color": "white"
                },
                "frequency": 2, //in seconds

                "abilityName": "Passive",
                "description": "This is a description for a Passive Ability.",
                "iconUrl": "img/passive.png",
            },
        }
    },

    "yoimiya": {
        "name": "Yoimiya Naganohara",
        "spriteUrl": "./img/yoimiya/portrait.png",

        // C H A L L E N G E R
        "challenger": {

            // V I S U A L S
            "spriteUrl": "./img/yoimiya/challenger.png",
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
                "homing": 1.1,
                "fireRate": 12, // Bullets per Second
                "bulletDamage": 4.1,
                "moveSpeed": 9,
            },
            "shiftSpeed": 1.2,
            "bulletSpeed": 1.3,

            // S P E C I A L
            "special": {
                "use": function () {
                    challenger.bullets = 9;
                },
                "chargeRequired": 50,
                "graceChargeSpeed": 30, // Charge per second in grace
                "passiveChargeSpeed": 2, // Charge per second
                "duration": 3,

                "abilityName": "Machine Gun Bow",
                "description": "Shoots Bullets faster for a limited Time.",
                "iconUrl": "img/yoimiya/special.jpg",
            },
        },

        // B O S S
        "boss": {
            // V I S U A L S
            "spriteUrl": "./img/yoimiya/boss.png",
            "spriteScaling": 110,
            "healthBarSpriteUrl": "./img/yoimiya/portrait.png",
            "healthBarName" : "Yoimiya Naganohara",

            // S T A T S 
            "stats": {
                "radius": 10,
                "moveSpeed": 6,
                "maxHealth": 4000,
            },

            // A B I L I T I E S
            "abilities": {
                "ability2": {
                    "use": function () {
                        if (this.fancyStuff) {
                            let bulletAmount = 30,
                                lifetime = 20,
                                random1 = Math.random(),
                                random2 = Math.random();
                            for (let i = 0; i < bulletAmount; i++) {
                                let attributes = [i, bulletAmount, random1, random2, 0, Math.random()*15+1, bulletAmount]
                                let bullet = new Bullet(boss.x, boss.y, this.bulletVisuals, trajectory1, lifetime, attributes);
                                this.mybullets.push(bullet)
                                bossBullets.push(bullet);
                            }
                            for (let i = 0; i < Math.round(bulletAmount/1.5); i++) {
                                let attributes = [i, Math.round(bulletAmount/1.5), random1, random2, 0, Math.random()*15+1, bulletAmount]
                                let bullet = new Bullet(boss.x, boss.y, this.bulletVisuals, trajectory1, lifetime, attributes);
                                this.mybullets.push(bullet)
                                bossBullets.push(bullet);
                            }

                            this.fancyStuff = !this.fancyStuff;
                        }
                        else if (!this.fancyStuff) {
                            this.mybullets.forEach(bullet => {
                                bullet.trajectoryFunction = trajectory2;
                            })
                            this.fancyStuff = !this.fancyStuff;
                            this.mybullets = []
                        }

                        function trajectory1() {
                            let x = this.attributes[2]*5-2.5,
                                y = 1;
                            return [x, y];
                        }

                        function trajectory2() {
                            let x = 0,
                                y = 0;
                            if (this.attributes[1] == this.attributes[6]) {
                                x = Math.sin((2*Math.PI) / this.attributes[1] * this.attributes[0])*this.attributes[5],
                                y = Math.cos((2*Math.PI) / this.attributes[1] * this.attributes[0])*this.attributes[5]+this.attributes[4];
                            } else {
                                x = Math.sin((2*Math.PI) / this.attributes[1] * this.attributes[0])*this.attributes[5]*0.5,
                                y = Math.cos((2*Math.PI) / this.attributes[1] * this.attributes[0])*this.attributes[5]*0.5+this.attributes[4];
                            }
                            if (y >= 3) {
                                y = 3;
                            }
                            if(this.attributes[4] <= 5) {
                                this.attributes[4] += 0.01;
                            }
                            this.attributes[5] = this.attributes[5]**0.96;
                            return [x, y];
                        }
                    },
                    "bulletVisuals": {
                        "radius": 4,
                        "color": "white"
                    },
                    "coolDown": 1, //in seconds
                    "fancyStuff": true,
                    "mybullets": [],

                    "abilityName": "Fireworks",
                    "description": "One Bullet explodes into a lot of Bullets, what did you expect?",
                    "iconUrl": "img/ability1.png",
                },

                "ability1": {
                    "use": function () {
                        if (this.fancyStuff) {
                            let bulletAmount = 30,
                                lifetime = 20,
                                random1 = Math.random(),
                                random2 = Math.random();
                            for (let i = 0; i < bulletAmount; i++) {
                                let attributes = [i, bulletAmount, random1, random2, 0, Math.random()*15+1, bulletAmount]
                                let customBulletVisuals = {radius: 10, color: "yellow"}
                                let bullet = new Bullet(boss.x, boss.y, customBulletVisuals, trajectory1, lifetime, attributes);
                                this.mybullets.push(bullet)
                                bossBullets.push(bullet);
                            }
                            for (let i = 0; i < Math.round(bulletAmount/1.5); i++) {
                                let attributes = [i, Math.round(bulletAmount/1.5), random1, random2, 0, Math.random()*15+1, bulletAmount]
                                let customBulletVisuals = {radius: 10, color: "yellow"}
                                let bullet = new Bullet(boss.x, boss.y, customBulletVisuals, trajectory1, lifetime, attributes);
                                this.mybullets.push(bullet)
                                bossBullets.push(bullet);
                            }
                            
                            this.fancyStuff = !this.fancyStuff;
                        }
                        else if (!this.fancyStuff) {
                            this.mybullets.forEach(bullet => {
                                bullet.trajectoryFunction = trajectory2;
                                bullet.radius = 4;
                                bullet.color = "rgb("+(Math.random()*100+155)+", 0, 0)";
                            })
                            this.fancyStuff = !this.fancyStuff;
                            this.mybullets = []
                        }

                        function trajectory1() {
                            let x = this.attributes[2]*5-2.5,
                                y = 1;
                            return [x, y];
                        }

                        function trajectory2() {
                            let x = 0,
                                y = 0;
                            if (this.attributes[1] == this.attributes[6]) {
                                x = Math.sin((2*Math.PI) / this.attributes[1] * this.attributes[0])*this.attributes[5],
                                y = Math.cos((2*Math.PI) / this.attributes[1] * this.attributes[0])*this.attributes[5]+this.attributes[4];
                            } else {
                                x = Math.sin((2*Math.PI) / this.attributes[1] * this.attributes[0])*this.attributes[5]*0.5,
                                y = Math.cos((2*Math.PI) / this.attributes[1] * this.attributes[0])*this.attributes[5]*0.5+this.attributes[4];
                            }
                            if (y >= 2) {
                                y = 2;
                            }
                            if(this.attributes[4] <= 5) {
                                this.attributes[4] += 0.01;
                            }
                            this.attributes[5] = this.attributes[5]**0.96;
                            return [x, y];
                        }
                    },
                    "bulletVisuals": {
                        "radius": 4,
                        "color": "white"
                    },
                    "coolDown": 1, //in seconds
                    "fancyStuff": true,
                    "mybullets": [],

                    "abilityName": "Fireworks",
                    "description": "One Bullet explodes into a lot of Bullets, what did you expect?",
                    "iconUrl": "img/ability1.png",
                },
            },
            "passive": {
                "use": function () {
                    let bulletAmount = 50,
                        lifetime = 20,
                        randoBool1 = false;

                    for (let i = 0; i < bulletAmount; i++) {
                        let attributes = [i, bulletAmount, 0, lifetime, randoBool1, boss.x, boss.y, boss.x+Math.sin(Math.PI*2/bulletAmount*i)*100,boss.y+Math.cos(Math.PI*2/bulletAmount*i)*100, 0]
                        let bullet = new Bullet(boss.x+Math.sin(Math.PI*2/bulletAmount*i)*100, boss.y+Math.cos(Math.PI*2/bulletAmount*i)*100, this.bulletVisuals, trajectory, lifetime, attributes);
                        bossBullets.push(bullet);
                    }

                    function trajectory() {
                        let currentBulletID = this.attributes[0],
                            totalBullets = this.attributes[1],
                            shiftMovement = this.attributes[2] / this.attributes[3],
                            x = 0,
                            y = 0;
                        if (Math.random() <= 0.997 && this.attributes[4] == false) {
                            x = Math.sin(Math.PI * 2 / (totalBullets) * currentBulletID + shiftMovement + Math.PI/2) * 2 + boss.xSpeedNormalized;
                            y = Math.cos(Math.PI * 2 / (totalBullets) * currentBulletID + shiftMovement + Math.PI/2) * 2 + boss.ySpeedNormalized;
                            this.attributes[7] = this.x;
                            this.attributes[8] = this.y;
                            this.attributes[2] += 0.4;
                        } else {
                            x = Math.cos(Math.atan2(this.attributes[6]-this.attributes[8], this.attributes[5]-this.attributes[7])+Math.PI);
                            if (y >= 1.5) {
                                y = 1.5;
                            } else {
                                y = Math.sin(Math.atan2(this.attributes[6]-this.attributes[8], this.attributes[5]-this.attributes[7])+Math.PI) * 2 + this.attributes[9];
                            }
                            this.attributes[4] = true;
                            if (this.attributes[9] <= 6) {
                                this.attributes[9] += 0.03
                            }
                        }
                        return [x, y];
                    }
                },
                "bulletVisuals": {
                    "radius": 5,
                    "color": "orange"
                },
                "frequency": 2, //in seconds

                "abilityName": "Passive",
                "description": "This is a description for a Passive Ability.",
                "iconUrl": "img/yoimiya/special.jpg",
            },
        }
    },
}