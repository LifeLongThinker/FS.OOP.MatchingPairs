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
    constructor(gameBoardElement, size = 4)
    {
        this.element = gameBoardElement;
        this.tiles = Array.from({ length: size * size }, () => new Tile(this));
    }
    
    start()
    {
        let pictos = PictoDictionary.pickRandomSet(this.tiles.length / 2);
        let doubledPictos = pictos.concat(pictos.slice()).sort((a, b) => 0.5 - Math.random());

        for(let i = 0; i < doubledPictos.length; i++)
        {
            this.tiles[i].char = doubledPictos[i];
        }
    }
    checkForMatches()
    {
        let selectedTiles = this.tiles.filter((t) => t.isSelected && !t.isMatched && !t.isFailedMatch);
        console.log('selectedTiles', selectedTiles);

        if(selectedTiles.length == 1)
        {
            // remove failed matched
            this.tiles.filter((t) => t.isFailedMatch).forEach((t) => t.clearState());
        }
        else if(selectedTiles.length == 2)
        {
            if(selectedTiles[0].char == selectedTiles[1].char)
            {
                console.log("MATCH!");
                selectedTiles[0].setMatched();
                selectedTiles[1].setMatched();
            }
            else
            {
                selectedTiles[0].setFailedMatch();
                selectedTiles[1].setFailedMatch();
            }
        }
        else if(selectedTiles.length == 3)
        {

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
        this.board.checkForMatches();
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

const gameBoardElement = document.getElementById("board");
const gameBoard = new GameBoard(gameBoardElement);
gameBoard.start();