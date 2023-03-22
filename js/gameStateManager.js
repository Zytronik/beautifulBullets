import { showPage, resetRdyUps, getSelectedCharacters, setupGameUI, showPauseScreen, closePauseScreen, showRoundEndScreen, switchSidesAnimations } from "./view/frontend.js";
import { loadGame, match, pauseGameLogic, resumeGameLogic, setGameStateRegular } from "./main.js";

export let currentGameState;
export const GAMESTATE = {
    MAIN_MENU: "MAIN_MENU",
    SETTINGS: "SETTINGS",
    CHARACTER_SELECTION: "CHARACTER_SELECTION",
    GAMESTART_CUTSCENE: "GAMESTART_CUTSCENE",
    GAMEPLAY_REGULAR: "GAME_REGULAR",
    PAUSE_SCREEN: "PAUSE_SCREEN",
    TIME_OVER_CUTSCENE: "TIME_OVER_CUTSCENE",
    BOSS_DEATH_CUTSCENE: "BOSS_DEATH_CUTSCENE",
    GAMEPLAY_ENRAGED: "GAME_ENRAGED",
    CHALLENGER_DEATH: "CHALLENGER_DEATH",
    SWITCHING_SIDES_CUTSCENE: "SWITCHING_SIDES_CUTSCENE",
    ROUNDOVER_CUTSCENE: "ROUNDOVER_CUTSCENE",
    GAMEOVER_CUTSCENE: "GAMEOVER_CUTSCENE",
    RESULT_SCREEN: "STATS_GAMEOVER",
}
const STATE_TRANSITION_MAP = new Map();
STATE_TRANSITION_MAP.set(GAMESTATE.MAIN_MENU + GAMESTATE.SETTINGS, mainMenuToSettings)
STATE_TRANSITION_MAP.set(GAMESTATE.MAIN_MENU + GAMESTATE.CHARACTER_SELECTION, mainMenuToCharacterSelection)
STATE_TRANSITION_MAP.set(GAMESTATE.SETTINGS + GAMESTATE.MAIN_MENU, settingsToMainMenu)
STATE_TRANSITION_MAP.set(GAMESTATE.CHARACTER_SELECTION + GAMESTATE.MAIN_MENU, characterSelectionToMainMenu)
STATE_TRANSITION_MAP.set(GAMESTATE.CHARACTER_SELECTION + GAMESTATE.GAMESTART_CUTSCENE, characterSelectionToGameStartCutscene)
STATE_TRANSITION_MAP.set(GAMESTATE.GAMESTART_CUTSCENE + GAMESTATE.GAMEPLAY_REGULAR, gameStartCutsceneToGameplayRegular)
STATE_TRANSITION_MAP.set(GAMESTATE.GAMEPLAY_REGULAR + GAMESTATE.TIME_OVER_CUTSCENE, gameplayRegularToTimeOverCutscene)
STATE_TRANSITION_MAP.set(GAMESTATE.GAMEPLAY_REGULAR + GAMESTATE.BOSS_DEATH_CUTSCENE, gameplayRegularToBossDeathCutscene)
STATE_TRANSITION_MAP.set(GAMESTATE.GAMEPLAY_REGULAR + GAMESTATE.PAUSE_SCREEN, gameplayRegularToPauseScreen)
STATE_TRANSITION_MAP.set(GAMESTATE.GAMEPLAY_REGULAR + GAMESTATE.CHALLENGER_DEATH, gameplayToChallengerDeath)
STATE_TRANSITION_MAP.set(GAMESTATE.TIME_OVER_CUTSCENE + GAMESTATE.GAMEPLAY_ENRAGED, timeOverCutsceneToGameplayEnraged)
STATE_TRANSITION_MAP.set(GAMESTATE.BOSS_DEATH_CUTSCENE + GAMESTATE.GAMEPLAY_ENRAGED, bossDeathCutsceneToGameplayEnraged)
STATE_TRANSITION_MAP.set(GAMESTATE.GAMEPLAY_ENRAGED + GAMESTATE.CHALLENGER_DEATH, gameplayToChallengerDeath)
STATE_TRANSITION_MAP.set(GAMESTATE.GAMEPLAY_ENRAGED + GAMESTATE.PAUSE_SCREEN, gameplayEnragedToPauseScreen)
STATE_TRANSITION_MAP.set(GAMESTATE.PAUSE_SCREEN + GAMESTATE.GAMEPLAY_REGULAR, pauseScreenToGameplayRegular)
STATE_TRANSITION_MAP.set(GAMESTATE.PAUSE_SCREEN + GAMESTATE.GAMEPLAY_ENRAGED, pauseScreenToGameplayEnraged)
STATE_TRANSITION_MAP.set(GAMESTATE.PAUSE_SCREEN + GAMESTATE.MAIN_MENU, pauseScreenToMainMenu)
STATE_TRANSITION_MAP.set(GAMESTATE.CHALLENGER_DEATH + GAMESTATE.SWITCHING_SIDES_CUTSCENE, challengerDeathToSwitchingSidesCutscene)
STATE_TRANSITION_MAP.set(GAMESTATE.CHALLENGER_DEATH + GAMESTATE.ROUNDOVER_CUTSCENE, challengerDeathToRoundOverCutscene)
STATE_TRANSITION_MAP.set(GAMESTATE.CHALLENGER_DEATH + GAMESTATE.GAMEOVER_CUTSCENE, challengerDeathToGameOverCutscene)
STATE_TRANSITION_MAP.set(GAMESTATE.SWITCHING_SIDES_CUTSCENE + GAMESTATE.GAMESTART_CUTSCENE, switchingSidesCutsceneToGameStartCutscene)
STATE_TRANSITION_MAP.set(GAMESTATE.ROUNDOVER_CUTSCENE + GAMESTATE.GAMESTART_CUTSCENE, roundOverCutsceneToGameStartCutscene)
STATE_TRANSITION_MAP.set(GAMESTATE.GAMEOVER_CUTSCENE + GAMESTATE.RESULT_SCREEN, gameOverCutsceneToResultScreen)
STATE_TRANSITION_MAP.set(GAMESTATE.RESULT_SCREEN + GAMESTATE.CHARACTER_SELECTION, resultScreenToCharacterSelection)


currentGameState = GAMESTATE.MAIN_MENU;
export function goToState(GAMESTATE) {
    // Helps with finding where the spaghetti begans :)
    try { throw Error(); }
    catch (e) {
        console.debug("Function callstack:\n", e.stack);
    }
    let transitionMethod = STATE_TRANSITION_MAP.get(currentGameState + GAMESTATE);
    if (transitionMethod == null) {
        console.error(`Illegal GameStateTransition. CurrentGameState: ${currentGameState}, desired next GameState: ${GAMESTATE}. 
        \nNo transition-method found for ${currentGameState} -> ${GAMESTATE}.`)
    } else {
        console.debug(`${currentGameState} -> ${GAMESTATE}`)
        currentGameState = GAMESTATE;
        transitionMethod();
    }
}
function mainMenuToSettings() {
    showPage("config");
}
function mainMenuToCharacterSelection() {
    showPage("characterSelection");
}
function settingsToMainMenu() {
    showPage("titleScreen");
}
function characterSelectionToMainMenu() {
    showPage("titleScreen");
    resetRdyUps();
}
function characterSelectionToGameStartCutscene() {
    showPage("game");
    loadGame(getSelectedCharacters());
    setupGameUI();

    //TODO isch nur temporär
    //showGameStartCutscene()
    goToState(GAMESTATE.GAMEPLAY_REGULAR);
}
function gameStartCutsceneToGameplayRegular() {
    resumeGameLogic();
    setGameStateRegular();
}
function gameplayRegularToTimeOverCutscene() {
    //TODO
}
function gameplayRegularToBossDeathCutscene() {
    //TODO
}
function gameplayRegularToPauseScreen() {
    pauseGameLogic();
    showPauseScreen();
}
function gameplayToChallengerDeath() {
    match.updateStats();
    if (match.hasMatchFinished()) {
        goToState(GAMESTATE.RESULT_SCREEN)
    } else {
        if (match.hasRoundFinished()) {
            match.decideRoundWinner();
            goToState(GAMESTATE.SWITCHING_SIDES_CUTSCENE);
        } else {
            goToState(GAMESTATE.ROUNDOVER_CUTSCENE);
        }
    }
}
function timeOverCutsceneToGameplayEnraged() {
    //TODO
}
function bossDeathCutsceneToGameplayEnraged() {
    //TODO
}
function gameplayEnragedToPauseScreen() {
    //TODO
}
function pauseScreenToGameplayRegular() {
    closePauseScreen();
    resumeGameLogic();
}
function pauseScreenToGameplayEnraged() {
    //TODO
}
function pauseScreenToMainMenu() {
    showPage("titleScreen");
}
function challengerDeathToSwitchingSidesCutscene() {
    pauseGameLogic();
    switchSidesAnimations();
    match.swapSides();
}
function challengerDeathToRoundOverCutscene() {
    showRoundEndScreen(match.scoreP1, match.scoreP2, match.matchSettings.firstTo);
}
function challengerDeathToGameOverCutscene() {
    //TODO
}
function switchingSidesCutsceneToGameStartCutscene() {
    //TODO isch nur temporär
    goToState(GAMESTATE.GAMEPLAY_REGULAR);
}
function roundOverCutsceneToGameStartCutscene() {
    //TODO
}
function gameOverCutsceneToResultScreen() {
    //TODO
}
function resultScreenToCharacterSelection() {
    //TODO
}




/*
    states:
    
    login/title
    mainmenu
        character selection
            gamesettings
        stage selection
            gamestart cutscene
            game
                pausescreen
            timeover/bossdeath
            challenger death
            switching sides cutscene
            gamestart cutscene
            timeover/bossdeath
            challenger death
            statscreen

            loop / finish


        config

*/