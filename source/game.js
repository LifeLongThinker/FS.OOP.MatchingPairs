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
    constructor(gameBoardElement, alert, size = 4)
    {
        this.element = gameBoardElement;
        this.alert = alert;
        this.tiles = Array.from({ length: size * size }, () => new Tile(this));
    }

    assignPictosToTiles()
    {
        let pictos = PictoDictionary.pickRandomSet(this.tiles.length / 2);
        let doubledPictos = pictos.concat(pictos.slice()).sort(() => 0.5 - Math.random());

        for(let i = 0; i < doubledPictos.length; i++)
        {
            this.tiles[i].char = doubledPictos[i];
        }
    }
    checkForMatch()
    {
        let selectedTiles = this.tiles.filter(
            (t) => t.isSelected && !t.isMatched && !t.isFailedMatch
        );
        
        if(selectedTiles.length == 1)
        {
            this.removeFailedMatches();
        }
        else if(selectedTiles.length == 2)
        {
            this.evaluateSelectedPairForMatch();
        }
    }
    removeFailedMatches()
    {
        this.tiles.filter((t) => t.isFailedMatch).forEach((t) => t.clearState());
    }
    evaluateSelectedPairForMatch()
    {
        if(selectedTiles[0].char == selectedTiles[1].char)
        {
            selectedTiles[0].setMatched();
            selectedTiles[1].setMatched();
            this.alert.show("Match!");
        }
        else
        {
            selectedTiles[0].setFailedMatch();
            selectedTiles[1].setFailedMatch();
            this.alert.show("No Match!");
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

    get char()
    {
        return this.element.textContent;
    }
    set char(value)
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

    onClick(e)
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
        this.removeClassStates(Tile.CLASS_SELECTED, Tile.CLASS_MATCHED, Tile.CLASS_FAILED_MATCH);
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
class Alert
{
    constructor(alertElement)
    {
        this.element = alertElement;
    }

    show(message, removeAfterMs = 2000)
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
    constructor(gameBoardElement, alertElement)
    {
        this.alert = new Alert(alertElement);
        this.board = new GameBoard(gameBoardElement, this.alert);
    }

    startNewGame()
    {
        this.board.assignPictosToTiles();
    }
}

const alertElement = document.getElementById("alert");
const gameBoardElement = document.getElementById("board");
const game = new Game(gameBoardElement, alertElement);
game.startNewGame();