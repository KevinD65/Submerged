import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Level1 from "./SwimLevel1";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Layer from "../../Wolfie2D/Scene/Layer";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import Input from "../../Wolfie2D/Input/Input";
import Level2 from "./SwimLevel2";
import Level3 from "./SwimLevel3";
import BossLevel from "./BossLevel";
import Level4 from "./SwimLevel4";
import Level5 from "./SwimLevel5";


export default class MainMenu extends Scene {

    animatedSprite: AnimatedSprite;
    private bg1: Sprite;
	private bg2: Sprite;
    private lg1: Sprite;
    private lg2: Sprite;
    private splash: Layer;
    private main: Layer;
    private abouts: Layer;
    private control: Layer;
    private levels: Layer;
    private logoLayer: Layer;
    private splashPress: boolean;
    private isGameOver: boolean;
    private hasWon: boolean;
    private gameOver: Layer;
    private winScreen: Layer;
    

    initScene(init: Record<string, any>): void {
        if(init != null)
        {
            this.isGameOver = init.isGameOver;
            this.hasWon = init.hasWon;
        }
        else{
            this.isGameOver = false;
            this.hasWon = false;
        }
    }

    loadScene(): void {
        // Load the menu song
        this.load.audio("menu", "hw5_assets/music/menu.mp3");
        this.load.image("splash", "hw5_assets/images/splash.png");
        this.load.image("logo", "hw5_assets/images/logo.png");
    }

    startScene(): void {
        this.viewport.setCenter(1024,512);
        this.viewport.follow(null);
        console.log(this.viewport.getCenter());
        //SPLASH SCREEN
        this.splashPress = false;
        Input.enableInput();

        this.addLayer("background",0);

        this.logoLayer = this.addLayer("logolayer", 1);

        this.bg1 = this.add.sprite("splash", "background");
		this.bg2 = this.add.sprite("splash", "background");
		this.bg1.scale.set(2.5, 2);
		this.bg1.position.copy(this.viewport.getCenter());

		this.bg2.scale.set(2.5, 2);
		this.bg2.position = this.bg1.position.clone();
		this.bg2.position.add(this.bg1.sizeWithZoom.scale(0, -2));

        this.lg1 = this.add.sprite("logo", "logolayer");
		this.lg1.scale.set(1,1);
		this.lg1.position = new Vec2(this.viewport.getCenter().x,this.viewport.getCenter().y+75);

        this.splash = this.addUILayer("Splash");
        if(this.isGameOver || this.hasWon)
        {
            this.splash.setHidden(true);
        }
        else{
            this.splash.setHidden(false);
        }

        // Center the viewport
        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);

        this.viewport.setZoomLevel(1);

        // Create a play button
        const playGame = <Label>this.add.uiElement(UIElementType.LABEL, "Splash", {position: new Vec2(size.x, size.y + 200), text: "Click any where to start"});
        playGame.textColor = Color.fromStringHex("BB0070");
        playGame.fontSize = 32;

        //Title Label
        const title1 = <Label>this.add.uiElement(UIElementType.LABEL, "Splash", {position: new Vec2(size.x, size.y - 100), text: "Submerged"});
        title1.textColor = Color.fromStringHex("BB0070");
        title1.fontSize = 100;

        //MAIN SCREEN
        this.main = this.addUILayer("Main");
        this.main.setHidden(true);

        //Level Select Button
        const lvlSlct = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x, size.y), text: "Level Select"});
        lvlSlct.backgroundColor = Color.fromStringHex("00BDF9");
        lvlSlct.borderColor = Color.fromStringHex("00BDF9");
        lvlSlct.borderRadius = 20;
        lvlSlct.setPadding(new Vec2(50, 10));
        lvlSlct.font = "PixelSimple";
        lvlSlct.textColor = Color.fromStringHex("BB0070");

        //Controls Button
        const controls = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x, size.y + 100), text: "Controls"});
        controls.backgroundColor = Color.fromStringHex("00BDF9");
        controls.borderColor = Color.fromStringHex("00BDF9");
        controls.borderRadius = 20;
        controls.setPadding(new Vec2(50, 10));
        controls.font = "PixelSimple";
        controls.textColor = Color.fromStringHex("BB0070");

        //About Button
        const about = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x, size.y + 200), text: "About"});
        about.backgroundColor = Color.fromStringHex("00BDF9");
        about.borderColor = Color.fromStringHex("00BDF9");
        about.borderRadius = 20;
        about.setPadding(new Vec2(50, 10));
        about.font = "PixelSimple";
        about.textColor = Color.fromStringHex("BB0070");

        //Title Label
        const title2 = <Label>this.add.uiElement(UIElementType.LABEL, "Main", {position: new Vec2(size.x, size.y - 100), text: "Submerged"});
        title2.textColor = Color.fromStringHex("BB0070");
        title2.fontSize = 100;

        //ABOUT SCREEN
        this.abouts = this.addUILayer("About");
        this.abouts.setHidden(true);

        //Title Label
        const title3 = <Label>this.add.uiElement(UIElementType.LABEL, "About", {position: new Vec2(size.x, size.y - 100), text: "About"});
        title3.textColor = Color.fromStringHex("BB0070");
        title3.fontSize = 100;

        //About Story
        const storyText1 = "Story: You are an overly curious deep sea diver who has probably bitten off more than he can chew.";
        const info1 = <Label>this.add.uiElement(UIElementType.LABEL, "About", {position: new Vec2(size.x, size.y-20), text: storyText1});
        info1.textColor = Color.fromStringHex("BB0070");
        info1.fontSize = 20;

        const storyText2 = "In pursuit of deep sea anomalies, you find yourself swimming for your life as a maneating monster chases";
        const info2 = <Label>this.add.uiElement(UIElementType.LABEL, "About", {position: new Vec2(size.x, size.y), text: storyText2});
        info2.textColor = Color.fromStringHex("BB0070");
        info2.fontSize = 20;

        const storyText3 = "you into an underwater cave. Without any weapons you do anything you can to shake your pursuer...";
        const info3 = <Label>this.add.uiElement(UIElementType.LABEL, "About", {position: new Vec2(size.x, size.y+20), text: storyText3});
        info3.textColor = Color.fromStringHex("BB0070");
        info3.fontSize = 20;

        //Dev Info
        const devText = "Developers: Kevin Duong, Chris Riordan, Steven Huynh";
        const info4 = <Label>this.add.uiElement(UIElementType.LABEL, "About", {position: new Vec2(size.x, size.y+60), text: devText});
        info4.textColor = Color.fromStringHex("BB0070");
        info4.fontSize = 20;

        //Cheat Codes
        const cheatText1 = "Cheat Codes: X (invincible to obstacles), S (skip to boss), M (skip to middle of level), K (insta-kill boss)";
        const info5 = <Label>this.add.uiElement(UIElementType.LABEL, "About", {position: new Vec2(size.x, size.y+100), text: cheatText1});
        info5.textColor = Color.fromStringHex("BB0070");
        info5.fontSize = 20;

        //Back Button
        const back1 = <Button>this.add.uiElement(UIElementType.BUTTON, "About", {position: new Vec2(size.x, size.y + 200), text: "Back To Menu"});
        back1.backgroundColor = Color.fromStringHex("00BDF9");
        back1.borderColor = Color.fromStringHex("00BDF9");
        back1.borderRadius = 20;
        back1.setPadding(new Vec2(50, 10));
        back1.font = "PixelSimple";
        back1.textColor = Color.fromStringHex("BB0070");

        //CONTROLS SCREEN
        this.control = this.addUILayer("Controls");
        this.control.setHidden(true);

        //Title Label
        const title4 = <Label>this.add.uiElement(UIElementType.LABEL, "Controls", {position: new Vec2(size.x, size.y - 100), text: "Controls"});
        title4.textColor = Color.fromStringHex("BB0070");
        title4.fontSize = 100;

        //Control Labels
        const controlText1 = "Swim/Walk Right: D";
        const control1 = <Label>this.add.uiElement(UIElementType.LABEL, "Controls", {position: new Vec2(size.x, size.y-20), text: controlText1});
        control1.textColor = Color.fromStringHex("BB0070");
        control1.fontSize = 20;

        const controlText2 = "Swim/Walk Left: A";
        const control2 = <Label>this.add.uiElement(UIElementType.LABEL, "Controls", {position: new Vec2(size.x, size.y+20), text: controlText2});
        control2.textColor = Color.fromStringHex("BB0070");
        control2.fontSize = 20;

        const controlText3 = "Swim Up: W";
        const control3 = <Label>this.add.uiElement(UIElementType.LABEL, "Controls", {position: new Vec2(size.x, size.y+60), text: controlText3});
        control3.textColor = Color.fromStringHex("BB0070");
        control3.fontSize = 20;

        const controlText4 = "Swim Down: S";
        const control4 = <Label>this.add.uiElement(UIElementType.LABEL, "Controls", {position: new Vec2(size.x, size.y+100), text: controlText4});
        control4.textColor = Color.fromStringHex("BB0070");
        control4.fontSize = 20;

        const controlText5 = "Pause Game: Q";
        const control5 = <Label>this.add.uiElement(UIElementType.LABEL, "Controls", {position: new Vec2(size.x, size.y+140), text: controlText5});
        control5.textColor = Color.fromStringHex("BB0070");
        control5.fontSize = 20;

        const controlText6 = "Resume Game: R";
        const control6 = <Label>this.add.uiElement(UIElementType.LABEL, "Controls", {position: new Vec2(size.x, size.y+180), text: controlText6});
        control6.textColor = Color.fromStringHex("BB0070");
        control6.fontSize = 20;

        //Back Button
        const back2 = <Button>this.add.uiElement(UIElementType.BUTTON, "Controls", {position: new Vec2(size.x, size.y + 240), text: "Back To Menu"});
        back2.backgroundColor = Color.fromStringHex("00BDF9");
        back2.borderColor = Color.fromStringHex("00BDF9");
        back2.borderRadius = 20;
        back2.setPadding(new Vec2(50, 10));
        back2.font = "PixelSimple";
        back2.textColor = Color.fromStringHex("BB0070");

        //LEVEL SELECT SCREEN
        this.levels = this.addUILayer("Levels");
        this.levels.setHidden(true);

        //Title Label
        const title5 = <Label>this.add.uiElement(UIElementType.LABEL, "Levels", {position: new Vec2(size.x, size.y - 100), text: "Levels"});
        title5.textColor = Color.fromStringHex("BB0070");
        title5.fontSize = 100;

        //Level Buttons
        const level1 = <Button>this.add.uiElement(UIElementType.BUTTON, "Levels", {position: new Vec2(size.x - 150, size.y), text: "Level 1"});
        level1.backgroundColor = Color.fromStringHex("00BDF9");
        level1.borderColor = Color.fromStringHex("00BDF9");
        level1.borderRadius = 20;
        level1.setPadding(new Vec2(50, 5));
        level1.font = "PixelSimple";
        level1.textColor = Color.fromStringHex("BB0070");

        const level2 = <Button>this.add.uiElement(UIElementType.BUTTON, "Levels", {position: new Vec2(size.x - 150, size.y + 75), text: "Level 2"});
        level2.backgroundColor = Color.fromStringHex("00BDF9");
        level2.borderColor = Color.fromStringHex("00BDF9");
        level2.borderRadius = 20;
        level2.setPadding(new Vec2(50, 5));
        level2.font = "PixelSimple";
        level2.textColor = Color.fromStringHex("BB0070");

        const level3 = <Button>this.add.uiElement(UIElementType.BUTTON, "Levels", {position: new Vec2(size.x - 150, size.y + 150), text: "Level 3"});
        level3.backgroundColor = Color.fromStringHex("00BDF9");
        level3.borderColor = Color.fromStringHex("00BDF9");
        level3.borderRadius = 20;
        level3.setPadding(new Vec2(50, 5));
        level3.font = "PixelSimple";
        level3.textColor = Color.fromStringHex("BB0070");

        const level4 = <Button>this.add.uiElement(UIElementType.BUTTON, "Levels", {position: new Vec2(size.x + 150, size.y), text: "Level 4"});
        level4.backgroundColor = Color.fromStringHex("00BDF9");
        level4.borderColor = Color.fromStringHex("00BDF9");
        level4.borderRadius = 20;
        level4.setPadding(new Vec2(50, 5));
        level4.font = "PixelSimple";
        level4.textColor = Color.fromStringHex("BB0070");

        const level5 = <Button>this.add.uiElement(UIElementType.BUTTON, "Levels", {position: new Vec2(size.x + 150, size.y + 75), text: "Level 5"});
        level5.backgroundColor = Color.fromStringHex("00BDF9");
        level5.borderColor = Color.fromStringHex("00BDF9");
        level5.borderRadius = 20;
        level5.setPadding(new Vec2(50, 5));
        level5.font = "PixelSimple";
        level5.textColor = Color.fromStringHex("BB0070");

        //LEVEL 6 IS THE BOSS BATTLE
        const level6 = <Button>this.add.uiElement(UIElementType.BUTTON, "Levels", {position: new Vec2(size.x + 150, size.y + 150), text: "Level 6"});
        level6.backgroundColor = Color.fromStringHex("00BDF9");
        level6.borderColor = Color.fromStringHex("00BDF9");
        level6.borderRadius = 20;
        level6.setPadding(new Vec2(50, 5));
        level6.font = "PixelSimple";
        level6.textColor = Color.fromStringHex("BB0070");

        //Back Button
        const back3 = <Button>this.add.uiElement(UIElementType.BUTTON, "Levels", {position: new Vec2(size.x, size.y + 225), text: "Back To Menu"});
        back3.backgroundColor = Color.fromStringHex("00BDF9");
        back3.borderColor = Color.fromStringHex("00BDF9");
        back3.borderRadius = 20;
        back3.setPadding(new Vec2(50, 10));
        back3.font = "PixelSimple";
        back3.textColor = Color.fromStringHex("BB0070");

        //GAME OVER SCREEN
        this.gameOver = this.addUILayer("GameOver");
        if(this.isGameOver)
        {
            this.gameOver.setHidden(false);
        }
        else
        {
            this.gameOver.setHidden(true);
        }
        //Title Label
        const title6 = <Label>this.add.uiElement(UIElementType.LABEL, "GameOver", {position: new Vec2(size.x, size.y - 100), text: "Game Over"});
        title6.textColor = Color.fromStringHex("BB0070");
        title6.fontSize = 100;

        //Back Button
        const back4 = <Button>this.add.uiElement(UIElementType.BUTTON, "GameOver", {position: new Vec2(size.x, size.y + 225), text: "Back To Menu"});
        back4.backgroundColor = Color.fromStringHex("00BDF9");
        back4.borderColor = Color.fromStringHex("00BDF9");
        back4.borderRadius = 20;
        back4.setPadding(new Vec2(50, 10));
        back4.font = "PixelSimple";
        back4.textColor = Color.fromStringHex("BB0070");

        //WIN SCREEN
        this.winScreen = this.addUILayer("WinScreen");
        if(this.hasWon)
        {
            this.winScreen.setHidden(false);
        }
        else
        {
            this.winScreen.setHidden(true);
        }
        //Title Label
        const title7 = <Label>this.add.uiElement(UIElementType.LABEL, "WinScreen", {position: new Vec2(size.x, size.y - 100), text: "You Beat The Terrible Shark!"});
        title7.textColor = Color.fromStringHex("BB0070");
        title7.fontSize = 100;

        //Back Button
        const back5 = <Button>this.add.uiElement(UIElementType.BUTTON, "WinScreen", {position: new Vec2(size.x, size.y + 225), text: "Back To Menu"});
        back5.backgroundColor = Color.fromStringHex("00BDF9");
        back5.borderColor = Color.fromStringHex("00BDF9");
        back5.borderRadius = 20;
        back5.setPadding(new Vec2(50, 10));
        back5.font = "PixelSimple";
        back5.textColor = Color.fromStringHex("BB0070");



        //THIS IS NEEDED FOR COLLISION DETECTION
        let sceneOptions = {
            physics: {
                groupNames: ["ground", "player", "mine"],
                collisions:
                [
                    [0, 1, 1],
                    [1, 0, 0],
                    [1, 0, 0]
                ]
            }
        }

        //Button Clicks
        level1.onClick = () => {
            this.sceneManager.changeToScene(Level1, {}, sceneOptions);
        }

        level2.onClick = () => {
            this.sceneManager.changeToScene(Level2, {}, sceneOptions);
        }

        level3.onClick = () => {
            this.sceneManager.changeToScene(Level3, {}, sceneOptions);
        }

        level4.onClick = () => {
            this.sceneManager.changeToScene(Level4, {}, sceneOptions);
        }

        level5.onClick = () => {
            this.sceneManager.changeToScene(Level5, {}, sceneOptions);
        }

        level6.onClick = () => {
            this.sceneManager.changeToScene(BossLevel, {}, sceneOptions)
        }

        back5.onClick = () => {
            this.main.setHidden(false);
            this.winScreen.setHidden(true);
            this.hasWon = false;
        }

        back4.onClick = () => {
            this.main.setHidden(false);
            this.gameOver.setHidden(true);
            this.isGameOver = false;
        }

        back3.onClick = () => {
            this.main.setHidden(false);
            this.levels.setHidden(true);
        }

        back2.onClick = () => {
            this.main.setHidden(false);
            this.control.setHidden(true);
        }

        back1.onClick = () => {
            this.main.setHidden(false);
            this.abouts.setHidden(true);
        }

        lvlSlct.onClick = () => {
            this.main.setHidden(true);
            this.levels.setHidden(false);
        }

        controls.onClick = () => {
            this.main.setHidden(true);
            this.control.setHidden(false);
        }

        about.onClick = () => {
            this.main.setHidden(true);
            this.abouts.setHidden(false);
        }

        // Scene has started, so start playing music
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "menu", loop: true, holdReference: true});
    }

    updateScene(deltaT: number): void {
        if(Input.isMousePressed(0))
        {
            if(!this.splashPress && !this.isGameOver)
            {
                this.splashPress = true;
                this.main.setHidden(false);
                this.splash.setHidden(true);
                this.logoLayer.setHidden(true);
            }
        }
    }

    unloadScene(): void {
        // The scene is being destroyed, so we can stop playing the song
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "menu"});
        this.resourceManager.unloadAllResources();
    }
}

