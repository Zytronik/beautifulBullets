import { challenger, boss, currentFPS, canvasRenderTime, gameLogicTime, totalFrameCalculationTime, characterPlayer1, characterPlayer2 } from "../main.js";
import { CHARACTER_DATA } from "../data/characters.js";
import { CANVAS_UNIT } from "./canvas.js";
import { goToState, GAMESTATE } from "../gameStateManager.js";

export function frontend_closePauseScreen() {
    document.querySelector("article.game .pauseScreen").classList.remove("paused");
}

export function frontend_showPauseScreen() {
    document.querySelector("article.game .pauseScreen").classList.add("paused");
}

export function frontend_setupGameUI() {
    setupChallengerHealthBar();
    setupChallengerSpecialChargeBar();
    setupBossHealthBar();
    setupBossAbilities();
}

export function updateGameUI() {
    updateBossChallengerHealthbarPosition();
    updateChallengerSpecialCharge();
    updateDebugUI();
    updateChallengerHealthbar();
    updateBossHealthbar();
    updateBossAbilitiesUI();
}

export function frontend_switchSidesAnimations() {
    fadeOutUI();
    setTimeout(() => {
        document.querySelector("article.game .switchingSides").classList.add("active");
        setTimeout(() => {
            document.querySelector("article.game .switchingSides").classList.remove("active");
            switchUI();
            setTimeout(() => {
                fadeInUI();
                setTimeout(() => {
                    goToState(GAMESTATE.GAMESTART_CUTSCENE);
                }, 900);
            }, 500);
        }, 6000);
    }, 900);
}

export function frontend_showRoundEndScreen(scoreP1, scoreP2, firstTo) {
    document.querySelector("article.game .roundEndScreen .generalStats span").innerHTML = firstTo;
    document.querySelector("article.game .roundEndScreen .roundStatsPlayer1 .score").innerHTML = scoreP1;
    document.querySelector("article.game .roundEndScreen .roundStatsPlayer2 .score").innerHTML = scoreP2;
    document.querySelector("article.game .roundEndScreen .roundStatsPlayer1 h4").innerHTML = CHARACTER_DATA[player1Character].name;
    document.querySelector("article.game .roundEndScreen .roundStatsPlayer2 h4").innerHTML = CHARACTER_DATA[player2Character].name;
    document.querySelector("article.game .roundEndScreen").classList.add("active");
    setTimeout(() => {
        document.querySelector("article.game .roundEndScreen").classList.remove("active");
    }, 3000);
}

function switchUI() {
    let oldChallenger = document.querySelector("article.game .challenger");
    let oldBoss = document.querySelector("article.game .boss");
    oldChallenger.classList.remove("challenger");
    oldBoss.classList.remove("boss");
    oldChallenger.classList.add("boss");
    oldBoss.classList.add("challenger");
    setupChallengerHealthBar();
}

function fadeOutUI() {
    let players = document.querySelectorAll("article.game .player");
    Array.prototype.forEach.call(players, function (player) {
        player.querySelector("article.game .challenger-healthbar").classList.add("fadeOut");
        player.querySelector("article.game .boss-healthbar").classList.add("fadeOut");
        player.querySelector("article.game .challenger-abilitie").classList.add("fadeOut");
        player.querySelector("article.game .boss-abilities").classList.add("fadeOut");
    });
}

function fadeInUI() {
    let players = document.querySelectorAll("article.game .player");
    Array.prototype.forEach.call(players, function (player) {
        player.querySelector("article.game .challenger-healthbar").classList.remove("fadeOut");
        player.querySelector("article.game .boss-healthbar").classList.remove("fadeOut");
        player.querySelector("article.game .challenger-abilitie").classList.remove("fadeOut");
        player.querySelector("article.game .boss-abilities").classList.remove("fadeOut");
    });
}

function updateChallengerHealthbar() {
    let playersHealthBars = document.querySelectorAll("article.game .player .challenger-healthbar");
    Array.prototype.forEach.call(playersHealthBars, function (hBar) {
        Array.prototype.forEach.call(hBar.children, function (h) {
            h.classList.remove("life");
        });
        for (let i = 0; i < challenger.currentHealth; i++) {
            hBar.children[i].classList.add("life");
        }
    });
}

function updateBossHealthbar() {
    var colors = getHealthbarColors('rgb(255, 0, 0)', 'rgb(0, 128, 0)', 100);
    let playersHealthBars = document.querySelectorAll("article.game .player .boss-healthbar");
    Array.prototype.forEach.call(playersHealthBars, function (hBar) {
        var life = 100 / boss.maxHealth * boss.currentHealth;
        if (life >= 0) {
            hBar.querySelector(".life-bar > div").style.width = life + "%";
            hBar.querySelector(".boss-desc > span").innerHTML = Math.round(life) + "%";
            hBar.querySelector(".life-bar > div").style.backgroundColor = Object.keys(colors)[Math.floor(life)]
        }
    });
}

function updateChallengerSpecialCharge() {
    let ChargeBarWidth = 100 / challenger.specialMaxCharge * challenger.specialCharge
    if (ChargeBarWidth <= 100) {
        document.querySelector("article.game .challenger .challenger-abilitie .grace-bar > div").style.height = ChargeBarWidth + "%";
    }
}

function updateDebugUI() {
    document.querySelector('#currentFPS > span').innerHTML = currentFPS;
    document.querySelector('#canvasRenderTime > span').innerHTML = canvasRenderTime;
    document.querySelector('#gameLogicTime > span').innerHTML = gameLogicTime;
    document.querySelector('#totalFrameCalculationTime > span').innerHTML = totalFrameCalculationTime;
}


function updateBossChallengerHealthbarPosition() {
    document.querySelector(':root').style.setProperty('--bossChallengerHealthX', challenger.x * CANVAS_UNIT + 'px');
    document.querySelector(':root').style.setProperty('--bossChallengerHealthY', challenger.y * CANVAS_UNIT + 'px');
}

function updateBossAbilitiesUI() {
    let bossAbilities = document.querySelectorAll("article.game .boss .boss-abilities > div");
    Array.prototype.forEach.call(bossAbilities, function (bossAbility, index) {
        let height = 100 - (100 / boss["ability" + (index + 1) + "CoolDownRequired"] * boss["ability" + (index + 1) + "CoolDown"]);
        bossAbility.querySelector(".ability-wrapper .overlay > div").style.height = height + "%"
    });
}

function setupChallengerHealthBar() {
    let healthCount = CHARACTER_DATA[characterPlayer1]["challenger"]["stats"]["health"];
    let playersHealthBar = document.querySelectorAll("article.game .player .challenger-healthbar");
    Array.prototype.forEach.call(playersHealthBar, function (hBar) {
        hBar.innerHTML = "";
    });
    Array.prototype.forEach.call(playersHealthBar, function (hBar) {
        var hearts = "";
        for (let i = 0; i < healthCount; i++) {
            hearts += '<div class="heart"></div>';
        }
        hBar.innerHTML = hearts;
    });
}

function setupChallengerSpecialChargeBar() {
    let barCount = Math.floor(challenger.specialMaxCharge / challenger.specialChargeRequired);
    for (let i = 0; i < barCount; i++) {
        document.querySelector("article.game .challenger .challenger-abilitie .grace-bar").innerHTML += '<span style="height:' + 100 / barCount + '%"></span>';
    }
}

function setupBossAbilities() {
    for (var index in CHARACTER_DATA[characterPlayer2].boss.abilities) {
        document.querySelector("article.game .boss .boss-abilities").innerHTML +=
            '<div class="ability-wrapper" data-ability="' + index + '">' +
            '<img src="' + CHARACTER_DATA[characterPlayer2].boss.abilities[index].iconUrl + '" alt="' + CHARACTER_DATA[characterPlayer2].boss.abilities[index].abilityName + '">' +
            '<div class="overlay">' +
            '<span></span>' +
            '<div></div>' +
            '</div>' +
            '</div>';
    }

    for (var index in CHARACTER_DATA[characterPlayer1].boss.abilities) {
        document.querySelector("article.game .challenger .boss-abilities").innerHTML +=
            '<div class="ability-wrapper" data-ability="' + index + '">' +
            '<img src="' + CHARACTER_DATA[characterPlayer1].boss.abilities[index].iconUrl + '" alt="' + CHARACTER_DATA[characterPlayer1].boss.abilities[index].abilityName + '">' +
            '<div class="overlay">' +
            '<span></span>' +
            '<div></div>' +
            '</div>' +
            '</div>';
    }
}

function setupBossHealthBar() {
    let playersHealthBar = document.querySelectorAll("article.game .player .boss-healthbar");
    Array.prototype.forEach.call(playersHealthBar, function (hBar) {
        hBar.innerHTML = '<div class="boss-desc">' +
            '<div>' +
            '<img src="' + CHARACTER_DATA[characterPlayer1]["spriteUrl"] + '">' +
            '<p>' + CHARACTER_DATA[characterPlayer1]["name"] + '</p>' +
            '</div>' +
            '<span>0%</span>' +
            '</div>' +
            '<div class="life-bar">' +
            '<div></div>' +
            '</div>';
    });
}

function convert_color(c) {
    var color;
    if (c.indexOf('rgb') == -1) {
        color = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(c);
        color = color ? [
            parseInt(color[1], 16),
            parseInt(color[2], 16),
            parseInt(color[3], 16)
        ] : [255, 255, 255];
    } else {
        color = c.split('(')[1].split(')')[0].split(',');
        for (var i = 0; i < color.length; i++) {
            color[i] = parseInt(color[i]);
        }
    }
    return color;
};

function getHealthbarColors(c1, c2, st) {
    c1 = convert_color(c1);
    c2 = convert_color(c2);
    var s_r = Math.floor((c1[0] - c2[0]) / st);
    var s_g = Math.floor((c1[1] - c2[1]) / st);
    var s_b = Math.floor((c1[2] - c2[2]) / st);
    var steps = {};
    var cth = function (c) {
        var h = c.toString(16);
        return h.length == 1 ? "0" + h : h;
    };
    var toHEX = function (v) {
        return "#" + cth(v[0]) + cth(v[1]) + cth(v[2]);
    };
    var toRGB = function (v) {
        return 'rgb(' + v.join(',') + ')';
    };
    steps[toRGB(c1)] = {
        hex: toHEX(c1).toUpperCase(),
        rgb: toRGB(c1)
    };
    for (var i = 0; i < st; i++) {
        if ((c1[0] - s_r) > 0) c1[0] -= s_r;
        if ((c1[1] - s_g) > 0) c1[1] -= s_g;
        if ((c1[2] - s_b) > 0) c1[2] -= s_b;
        c1[0] = (c1[0] > 255) ? 255 : c1[0];
        c1[1] = (c1[1] > 255) ? 255 : c1[1];
        c1[2] = (c1[2] > 255) ? 255 : c1[2];
        if (!steps[toRGB(c1)]) steps[toRGB(c1)] = {
            hex: toHEX(c1).toUpperCase(),
            rgb: toRGB(c1)
        };
    }
    return steps;
};