class DOMHelper
{
    constructor(element)
    {
        this.element = element;
    }

    static createElement(tagName)
    {
        const element = document.createElement(tagName);
        return new DOMHelper(element);
    }

    inside(parent)
    {
        parent.append(this.element);
        return this;
    }
    withClass(className)
    {
        this.element.classList.add(className);
        return this;
    }
    withTextContent(text)
    {
        this.element.textContent = text;
        return this;
    }
    get()
    {
        return this.element;
    }
}
class PictoDictionary
{
    static PICTOS =`💈|🔠|🖲|🎳|🐂|📉|🎌|🏐|🍒|🏛|🍯|🎢|🐭|💧|🐽|🚿|👮|👜|🍊|🍓|🕝|👙|👂|📊|🏝|🎡|📂|⛎|🐣|😙|🌁|👽|😨|🖐|⚔|🚪|💜|📺|📔|🌴|🕛|🎂|🚅|💀|👇|🍦|🐷|🏖|📞|🎆|🕷|💓|💹|👌|😗|😅|🎿|📮`;

    static pickRandomSet(count)
    {
        const pictos = PictoDictionary.parsePictosStringIntoArray();
        var selectedPictos = [];

        for(let i = 0; i < count; i++)
        {
            const randomPicto = PictoDictionary.getRandomPictoFromArray(pictos);
            selectedPictos.push(randomPicto);
        }

        return selectedPictos;
    }

    static parsePictosStringIntoArray()
    {
        return PictoDictionary.PICTOS.split("|");
    }
    static getRandomPictoFromArray(pictosArray)
    {
        const randomIndex = Math.floor(Math.random() * pictosArray.length);
        return pictosArray.splice(randomIndex, 1)[0];
    }
}
class GameBoard
{
    constructor(gameBoardElement, alertBox, size = 4)
    {
        this.element = gameBoardElement;
        this.alertBox = alertBox;
        this.tiles = Array.from({ length: size * size }, () => new Tile(this));
    }
    
    assignPictosToTiles()
    {
        const pictos = PictoDictionary.pickRandomSet(this.tiles.length / 2);
        const doubledPictos = pictos.concat(pictos.slice());
        const shuffledPictos = doubledPictos.sort(() => 0.5 - Math.random());

        for(let i = 0; i < shuffledPictos.length; i++)
        {
            this.tiles[i].picto = shuffledPictos[i];
        }
    }
    checkForMatch()
    {
        let selectedTiles = this.tiles.filter(
            (t) => t.isSelected && !t.isMatched && !t.isFailedMatch
        );
        
        if(selectedTiles.length == 1)
        {
            // when only one tile is selected, clear previously failed match pair
            this.clearFailedMatches();
        }
        else if(selectedTiles.length == 2)
        {
            // when two tiles are selected, check for match
            this.checkSelectedPairForMatchOrFail(selectedTiles);
        }
    }
    clearFailedMatches()
    {
        this.tiles
            .filter((t) => t.isFailedMatch)
            .forEach((t) => t.clearState());
    }
    checkSelectedPairForMatchOrFail(selectedTilesPair)
    {
        if(selectedTilesPair[0].picto == selectedTilesPair[1].picto)
        {
            selectedTilesPair[0].setMatched();
            selectedTilesPair[1].setMatched();
            this.alertBox.show("Match found!");
        }
        else
        {
            selectedTilesPair[0].setFailedMatch();
            selectedTilesPair[1].setFailedMatch();
            this.alertBox.show("Match failed!");
        }
    }
}
class Tile
{
    static CLASS_SELECTED = "selected";
    static CLASS_MATCHED = "matched";
    static CLASS_FAILED_MATCH = "failed";

    constructor(gameBoard)
    {
        this.board = gameBoard;
        this.element = this.createAndInjectTileElement(gameBoard.element);
    }
    createAndInjectTileElement(gameBoardElement)
    {
        const element = DOMHelper.createElement("div")
            .withClass('tile')    
            .inside(gameBoardElement)
            .get();

        element.addEventListener('click', () => this.onClick());
        return element;
    }

    get picto()
    {
        return this.element.textContent;
    }
    set picto(value)
    {
        this.element.textContent = value;
    }
    get isSelected()
    {
        return this.hasClassState(Tile.CLASS_SELECTED);
    }
    get isMatched()
    {
        return this.hasClassState(Tile.CLASS_MATCHED);
    }
    get isFailedMatch()
    {
        return this.hasClassState(Tile.CLASS_FAILED_MATCH);
    }

    onClick()
    {
        // ignore if already selected
        if(this.isSelected)
        {
            return;
        }

        this.setSelected();
        this.board.checkForMatch();
    }

    clearState()
    {
        this.removeClassStates(
            Tile.CLASS_SELECTED,
            Tile.CLASS_MATCHED,
            Tile.CLASS_FAILED_MATCH);
    }
    setSelected()
    {
        this.setClassState(Tile.CLASS_SELECTED);
    }
    setMatched()
    {
        this.setClassState(Tile.CLASS_MATCHED);
    }
    setFailedMatch()
    {
        this.setClassState(Tile.CLASS_FAILED_MATCH);
    }
    setClassState(className)
    {
        this.element.classList.add(className);
    }
    hasClassState(className)
    {
        return this.element.classList.contains(className);
    }
    removeClassState(className)
    {
        return this.element.classList.remove(className);
    }
    removeClassStates(...classNames)
    {
        for(const className of classNames)
        {
            this.removeClassState(className);
        }
    }
}
class AlertBox
{
    constructor(alertBoxElement)
    {
        this.element = alertBoxElement;
    }

    show(message, removeAfterMs = 60000)
    {
        const messageElement = this.createNewMessageElement(message);
        this.queueMessageElementForRemoval(messageElement, removeAfterMs);
    }

    createNewMessageElement(message)
    {
        return DOMHelper.createElement("div")
            .withClass('message')
            .withTextContent(message)
            .inside(this.element)
            .get();
    }
    queueMessageElementForRemoval(messageElement, removeAfterMs)
    {
        setTimeout(() => {
            messageElement.remove();
        }, removeAfterMs);
    }
}
class Game
{
    constructor(gameBoardElement, alertBoxElement)
    {
        this.alertBox = new AlertBox(alertBoxElement);
        this.gameBoard = new GameBoard(gameBoardElement, this.alertBox);
    }

    startNewGame()
    {
        this.gameBoard.assignPictosToTiles();
    }
}

const alertBoxElement = document.getElementById("alert");
const gameBoardElement = document.getElementById("board");

const game = new Game(gameBoardElement, alertBoxElement);
game.startNewGame();