import { loadGame, challenger, boss, currentFPS, canvasRenderTime, gameLogicTime, totalFrameCalculationTime } from "./main.js";
import { CHARACTER_DATA } from "./characters.js";
import { CANVAS_UNIT } from "./canvas.js";

window.onload = function () {
    //https://stackoverflow.com/questions/1223764/how-to-trap-double-key-press-in-javascript in game leave

    document.querySelector("#play").addEventListener("click", function (e) {
        e.preventDefault();
        showPage("characterSelection");
    });

    document.querySelector("#config").addEventListener("click", function (e) {
        e.preventDefault();
        showPage("config");
    });

    document.querySelector("#rdyButton1").addEventListener("click", function (e) {
        rdyUpPlayer1(this);
    });

    document.querySelector("#rdyButton2").addEventListener("click", function (e) {
        rdyUpPlayer2(this);
    });

    document.querySelector("#pageBack").addEventListener("click", function (e) {
        rdyUpd = [false, false];
        unRdyUpButton();
        showPage("titleScreen");
    });

    document.querySelector("#resumeGame").addEventListener("click", function (e) {
        resumeGame();
    });

    document.querySelector("#quitGame").addEventListener("click", function (e) {
        quitGame();
    });

    loadCharacterSelectionScreen();

    document.onkeydown = function (evt) {
        evt = evt || window.event;
        var isEscape = false;
        if ("key" in evt) {
            isEscape = (evt.key === "Escape" || evt.key === "Esc");
        } else {
            isEscape = (evt.keyCode === 27);
        }
        if (isEscape) {
            let currentPage = getCurrentPage();
            if(currentPage.classList.contains("characterSelection")){
                rdyUpd = [false, false];
                unRdyUpButton();
                showPage("titleScreen");
            }else if(currentPage.classList.contains("game")){
                if(currentPage.querySelector(".pauseScreen").classList.contains("paused")){
                    resumeGame();
                }else{
                    pauseGame();
                } 
            } 
        }
    };
}

let rdyUpd = [false, false];
export let gamePaused = false;

function quitGame(){
    showPage("titleScreen");
}

function pauseGame(){
    gamePaused = true;
    document.querySelector("article.game .pauseScreen").classList.add("paused");
}

function resumeGame(){
    gamePaused = false;
    document.querySelector("article.game .pauseScreen").classList.remove("paused");
}

function getSelectedCharacterPlayer1() {
    return document.querySelector("article.characterSelection #player1 .characters").children[1].dataset.character;
}

function getSelectedCharacterPlayer2() {
    return document.querySelector("article.characterSelection #player2 .characters").children[1].dataset.character;
}

function updateBossChallengerHealthbarPosition() {
    document.querySelector(':root').style.setProperty('--bossChallengerHealthX', challenger.x * CANVAS_UNIT + 'px');
    document.querySelector(':root').style.setProperty('--bossChallengerHealthY', challenger.y * CANVAS_UNIT + 'px');
}

export function updateGameUI() {
    updateBossChallengerHealthbarPosition();
    updateChallengerSpecialCharge();
    updateDebugUI();
    updateChallengerHealthbar();
    updateBossHealthbar()
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

function setupChallengerSpecialChargeBar() {
    let barCount = Math.floor(challenger.specialMaxCharge / challenger.specialChargeRequired);
    for (let i = 0; i < barCount; i++) {
        document.querySelector("article.game .challenger .challenger-abilitie .grace-bar").innerHTML += '<span style="height:' + 100 / barCount + '%"></span>';
    }
}

function setupChallengerHealthBar() {
    let healthCount = CHARACTER_DATA[getSelectedCharacterPlayer1()]["challenger"]["stats"]["health"];
    let playersHealthBar = document.querySelectorAll("article.game .player .challenger-healthbar");
    Array.prototype.forEach.call(playersHealthBar, function (hBar) {
        var hearts = "";
        for (let i = 0; i < healthCount; i++) {
            hearts += '<div class="heart"></div>';
        }
        hBar.innerHTML = hearts;
    });
}

function updateDebugUI() {
    document.querySelector('#currentFPS > span').innerHTML = currentFPS;
    document.querySelector('#canvasRenderTime > span').innerHTML = canvasRenderTime;
    document.querySelector('#gameLogicTime > span').innerHTML = gameLogicTime;
    document.querySelector('#totalFrameCalculationTime > span').innerHTML = totalFrameCalculationTime;
}

function setupGame() {
    setupChallengerHealthBar();
    setupChallengerSpecialChargeBar();
    setupBossHealthBar();
    setupBossAbilities();
}

function startGame() {
    showPage("game");
    loadGame(getSelectedCharacterPlayer1(), getSelectedCharacterPlayer2());
    setupGame();
}

function setupBossAbilities(){
    let bossAbilitiesPlayers = document.querySelectorAll("article.game .player .boss-abilities");
    Array.prototype.forEach.call(bossAbilitiesPlayers, function (bossAbilities) {
        for (var  index in boss.abilities) {/* 
            console.log(boss.abilities[index]) */
            bossAbilities.innerHTML += 
            '<div class="ability-wrapper">'+
            '<img src="'+boss.abilities[index].iconUrl+'" alt="'+boss.abilities[index].abilityName+'">'+
            '</div>';
            bossAbilities.innerHTML += 
            '<div class="ability-wrapper">'+
            '<img src="'+boss.abilities[index].iconUrl+'" alt="'+boss.abilities[index].abilityName+'">'+
            '</div>';
            bossAbilities.innerHTML += 
            '<div class="ability-wrapper">'+
            '<img src="'+boss.abilities[index].iconUrl+'" alt="'+boss.abilities[index].abilityName+'">'+
            '</div>';
        }
    });
}

function setupBossHealthBar() {
    let playersHealthBar = document.querySelectorAll("article.game .player .boss-healthbar");
    Array.prototype.forEach.call(playersHealthBar, function (hBar) {
        hBar.innerHTML = '<div class="boss-desc">' +
            '<div>' +
            '<img src="' + CHARACTER_DATA[getSelectedCharacterPlayer2()]["spriteUrl"] + '">' +
            '<p>' + CHARACTER_DATA[getSelectedCharacterPlayer2()]["name"] + '</p>' +
            '</div>' +
            '<span>0%</span>' +
            '</div>' +
            '<div class="life-bar">' +
            '<div></div>' +
            '</div>';
    });
}

function showPage(pageClass) {
    var pages = document.querySelectorAll("main > article");
    Array.prototype.forEach.call(pages, function (page) {
        page.classList.add("hidePage");
    });
    document.querySelector("article." + pageClass).classList.remove("hidePage");
}

function getCurrentPage() {
    var pages = document.querySelectorAll("main > article");
    var r = ""
    Array.prototype.forEach.call(pages, function (page) {
        if (!page.classList.contains("hidePage")) {
            r = page;
        }
    });
    return r;
}

function unRdyUpButton() {
    document.querySelector("#rdyButton1").classList.remove("ready");
    document.querySelector("#rdyButton2").classList.remove("ready");
}

function rdyUpPlayer1(rdyButton) {
    rdyUpd[0] = !rdyUpd[0];
    rdyButton.classList.toggle("ready");
    checkRdyButton();
}

function rdyUpPlayer2(rdyButton) {
    rdyUpd[1] = !rdyUpd[1];
    rdyButton.classList.toggle("ready");
    checkRdyButton();
}

function checkRdyButton() {
    if (rdyUpd[0] && rdyUpd[1]) {
        startGame()
    }
}

function loadCharacterSelectionScreen() {
    var players = document.querySelectorAll("article.characterSelection .player");
    Array.prototype.forEach.call(players, function (player, index) {
        loadCharactersUI(player);
        let slides = player.querySelector(".characters .character");
        let slidesContainer = player.querySelector(".characters");
        let playerContainer = player;
        let slideCount = slidesContainer.children.length;
        let slideWidth = slides.offsetWidth;
        let slideHeight = slides.offsetHeight;
        let sliderUlWidth = slideCount * slideWidth;

        playerContainer.style.width = slideWidth + "px";
        playerContainer.style.height = slideHeight + "px";

        slidesContainer.style.width = sliderUlWidth + "px";
        slidesContainer.style.marginLeft = -slideWidth + "px";

        slidesContainer.prepend(slidesContainer.children[slideCount - 1]);

        function moveLeft() {
            slidesContainer.animate(
                { left: [slidesContainer.style.left + "px", slideWidth + "px"] },
                { duration: 200, iterations: 1, easing: "ease-out" }
            ).onfinish = (e) => {
                e.target.effect.target.style.left = slideWidth + "px";
                slidesContainer.prepend(slidesContainer.children[slideCount - 1]);
                slidesContainer.style.left = "0px";
            };
        };

        function moveRight() {
            slidesContainer.animate(
                { left: [slidesContainer.style.left + "px", -slideWidth + "px"] },
                { duration: 200, iterations: 1, easing: "ease-out" }
            ).onfinish = (e) => {
                e.target.effect.target.style.left = -slideWidth + "px";
                slidesContainer.append(slidesContainer.children[0]);
                slidesContainer.style.left = "0px";
            };
        };

        player.querySelector("a.control_prev").addEventListener("click", function (e) {
            e.preventDefault();
            if (!rdyUpd[index]) {
                moveLeft()
            }
        });
        player.querySelector("a.control_next").addEventListener("click", function (e) {
            e.preventDefault();
            if (!rdyUpd[index]) {
                moveRight()
            }
        });
    });
}

const highestStats = getHighestStats();

function getHighestStats() {
    let stats = {
        "challenger": [],
        "boss": [],
    };
    for (var key in CHARACTER_DATA) {
        for (const k in CHARACTER_DATA[key]["challenger"]["stats"]) {
            if (stats["challenger"][k] !== undefined) {
                if (CHARACTER_DATA[key]["challenger"]["stats"][k] >= stats["challenger"][k]) {
                    stats["challenger"][k] = CHARACTER_DATA[key]["challenger"]["stats"][k];
                }
            } else {
                stats["challenger"][k] = CHARACTER_DATA[key]["challenger"]["stats"][k];
            }
        }
        for (const k in CHARACTER_DATA[key]["boss"]["stats"]) {
            if (stats["boss"][k] !== undefined) {
                if (CHARACTER_DATA[key]["boss"]["stats"][k] >= stats["boss"][k]) {
                    stats["boss"][k] = CHARACTER_DATA[key]["boss"]["stats"][k];
                }
            } else {
                stats["boss"][k] = CHARACTER_DATA[key]["boss"]["stats"][k];
            }
        }
    }
    return stats;
}

function calculateStat(stat, value, player) {
    return 100 / highestStats[player][stat] * value;
}

function loadCharactersUI(player) {
    let characters = "";
    for (const key in CHARACTER_DATA) {
        characters +=
            '<div class="character" data-character="' + key + '">' +
            '<div class="character-wrapper">' +
            '<h3>' + CHARACTER_DATA[key]["name"] + '</h3>' +
            '<div class="img-wrapper">' +
            '<img src="' + CHARACTER_DATA[key]["spriteUrl"] + '">' +
            '</div>' +
            '<div class="character-desc">' +
            '<div class="challanger">' +
            '<h4>Challenger</h4>';

        for (const i in CHARACTER_DATA[key]["challenger"]["stats"]) {
            let challengerStat = CHARACTER_DATA[key]["challenger"]["stats"][i];
            characters +=
                //stats challenger
                '<div class="stat ' + i + '">' +
                '<p>' + i + ' | ' + challengerStat + '</p>' +
                '<div class="stat-bar">' +
                '<div style="width: ' + calculateStat(i, challengerStat, "challenger") + '%"></div>' +
                '<span></span><span></span><span></span><span></span><span></span>' +
                '</div>' +
                '</div>';
        }
        characters +=
            //special challenger
            '<div class="challengerSpecial">' +
            '<h5>' + CHARACTER_DATA[key]["challenger"]["special"]["abilityName"] + '</h5>' +
            '<p>' + CHARACTER_DATA[key]["challenger"]["special"]["description"] + '</p>' +
            '</div>';
        characters +=
            '</div>' +
            '<div class="boss">' +
            '<h4>Boss</h4>';
        for (const i in CHARACTER_DATA[key]["boss"]["stats"]) {
            let bossStat = CHARACTER_DATA[key]["boss"]["stats"][i];
            characters +=
                //stats boss
                '<div class="stat ' + i + '">' +
                '<p>' + i + ' | ' + bossStat + '</p>' +
                '<div class="stat-bar">' +
                '<div style="width: ' + calculateStat(i, bossStat, "boss") + '%"></div>' +
                '<span></span><span></span><span></span><span></span><span></span>' +
                '</div>' +
                '</div>';
        }
        characters +=
            '<div class="icon-wrapper">';
        characters +=
            //passive boss
            '<div class="abilty-wrapper">' +
            '<img class="icon" src="' + CHARACTER_DATA[key]["boss"]["passive"]["iconUrl"] + '" alt="' + CHARACTER_DATA[key]["boss"]["passive"]["abilityName"] + '">' +
            '<div class="passive">' +
            '<h5>' + CHARACTER_DATA[key]["boss"]["passive"]["abilityName"] + '</h5>' +
            '<p>' + CHARACTER_DATA[key]["boss"]["passive"]["description"] + '</p>' +
            '</div>' +
            '</div>';
        for (const i in CHARACTER_DATA[key]["boss"]["abilities"]) {
            let ability = CHARACTER_DATA[key]["boss"]["abilities"][i];
            characters +=
                //abilities boss
                '<div class="abilty-wrapper">' +
                '<img class="icon" src="' + ability["iconUrl"] + '" alt="' + ability["abilityName"] + '">' +
                '<div class="ability">' +
                '<h5>' + ability["abilityName"] + '</h5>' +
                '<p>' + ability["description"] + '</p>' +
                '</div>' +
                '</div>' +

                '<div class="abilty-wrapper">' +
                '<img class="icon" src="' + ability["iconUrl"] + '" alt="' + ability["abilityName"] + '">' +
                '<div class="ability">' +
                '<h5>' + ability["abilityName"] + '</h5>' +
                '<p>' + ability["description"] + '</p>' +
                '</div>' +
                '</div>' +

                '<div class="abilty-wrapper">' +
                '<img class="icon" src="' + ability["iconUrl"] + '" alt="' + ability["abilityName"] + '">' +
                '<div class="ability">' +
                '<h5>' + ability["abilityName"] + '</h5>' +
                '<p>' + ability["description"] + '</p>' +
                '</div>' +
                '</div>';
        }
        characters +=
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
    }
    player.querySelector(".characters").innerHTML = characters;
}