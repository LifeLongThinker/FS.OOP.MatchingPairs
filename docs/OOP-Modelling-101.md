# Short into to OOP Modelling and Development using Vanilla JS

Following up on my last [tweet on OOP design and development](https://twitter.com/LifeLongThinker/status/1538193675099979786), we are going to build a very tiny example web app using only vanilla JS.

We are going to build a "Matching Pairs" game. You can see the game in action here:

![The Matching Pairs game in action](./game_in_action.gif)


## Step 1: Analysing the Problem Domain: Components

First, we will analyze the problem domain.

Remember that OOP is all about "building larger parts from smaller parts and their communication among each other". To design the game, we go backwards: How is the overall problem composed of smaller problems.

What smaller parts are involved here? Let's drill the game design down into ist (visible) components:

![The Game is made up of separate components](./components_drill_down.png)


## Step 2: Analysing the Problem Domain II: Responsibilities

Now that we have figured out the components involved, lets see what kind of responsibilities they have:

![The game components and their responsibilities](./responsibilities.png)

These are, of course, only the most visible responsibilities. We will see shortly that other, hidden duties are involved and model them accordingly.


## Step 3: Modelling Classes

Now let's extract classes from our components. We can start by mapping one component to one class. We need to figure out their two key parts: state and behavior, i.e. we have to model their properties and methods (functions).

## Step 3.1: Modelling the 'Tile' Class
