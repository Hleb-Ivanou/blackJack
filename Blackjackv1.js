// I need a function that once hit will just .pop the first card off the deck and into the array of either playerCards or dealerCards.
// Then another function might evaluate the weight component of the object of the array and will know the score
// First start by writing a function that will take the deck and will just pop the first card off of it, then figure out how to pop exactly two cards to player, 1 to dealer
// Popping the card by the hit clicker should be easy; the good thing about stand is that it should be the same function that pops the cards to the dealer array, one at a time, and a function that checks the weight


// Deck of Cards variables
const cardSuits = ["&clubs;", "&hearts;", "&diams;", "&spades;"];
const cardValues = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
let cardDiv = $('.card');
let deck = [];
let playerWeights = 0;
let dealerWeights = 0;
let playerScore = 0;
let dealerScore = 0;
let playerCardsCounter = 0;
let dealerCardsCounter = 0;
let currentCard = null;
let isGameStop = false;

$(document).ready(function () {  
  bindEvents();
});

function restartGame() {
  $('.card').empty();
  deck = [];
  playerWeights = 0;
  dealerWeights = 0;
  showScore(true);
  showScore();
  $('#gameResult').empty();
  playerScore = 0;
  dealerScore = 0;
  playerCardsCounter = 0;
  dealerCardsCounter = 0;
  currentCard = null;
  isGameStop = false;
  $('#startButton').text('Start Game!');
  $('#gameResult').removeClass('alert-danger alert-success');
  cardDiv.removeClass('card-selected');
}

function startGame() {
  $('#startButton').prop("disabled", true);
  generateTable();
  dealCard(1, true);
  dealCard(0, false);
  $('#hitButton').prop("disabled", false);
  $('#standButton').prop("disabled", false);
}

function stopGame() {
  isGameStop = true;
  compareResult();
  $('#startButton').prop("disabled", false);
  $('#startButton').text('New Game');
}

function compareResult() {
  let message = '';
  let messageColorClass = '';
  if (playerWeights > 21) {
    message = 'You Lose!';
    messageColorClass = 'alert-danger';
  } else {
    if(dealerWeights > 21 || playerWeights > dealerWeights) {
      message = 'You Win!';
      messageColorClass = 'alert-success';
    } else {
      message = 'You Lose!';
      messageColorClass = 'alert-danger';
    }
  }
  $('#gameResult').addClass(messageColorClass);
  $('#gameResult').text(message);
}

function bindEvents() {
  $('#startButton').bind("click", function () {
    if(!isGameStop) {
      
      startGame();
    } else {
      
      restartGame();
    }    
  });
  $('#hitButton').bind("click", function () {
    dealCard(playerCardsCounter, true);
  });
  $('#standButton').bind("click", function () {
    $('#standButton').prop("disabled", true);
    $('#hitButton').prop("disabled", true);
    while (!isGameStop) {
      dealCard(dealerCardsCounter, false);     
    }          
  });
}

function showScore(isHitMeBtn) {
  isHitMeBtn ? $('#playerScore').text(playerWeights) : $('#dealerScore').text(dealerWeights);
}

function generateTable() {
  deckCreate();
  shuffle();
  $('#playerScore').text(playerScore);
  $('#dealerScore').text(dealerScore);
};

// Creation of the deck
function deckCreate() {
  for (let i = 0; i < cardSuits.length; i++) {
    for (let j = 0; j < cardValues.length; j++) {
      let cardWeight = parseInt(cardValues[j]);
      if (cardValues[j] === "J" || cardValues[j] === "Q" || cardValues[j] === "K") {
        cardWeight = 10;
      }
      if (cardValues[j] === "A") {
        cardWeight = 11;
      }
      let card = {
        Suit: cardSuits[i],
        Value: cardValues[j],
        Weight: cardWeight
      };
      deck.push(card);
    }
  }
  return deck;
}

// Shuffling the deck
function shuffle() {
  for (let i = 0; i < 1000; i++) {
    let loc1 = Math.floor((Math.random() * deck.length));
    let loc2 = Math.floor((Math.random() * deck.length));
    let loc3 = deck[loc1];
    deck[loc1] = deck[loc2];
    deck[loc2] = loc3;
  }
}

function showCard(index) {
  cardDiv.eq(index).html(`${currentCard.Suit} <br /> ${currentCard.Value}`).addClass('card-selected flip');
}

// Dealing the player's cards
function dealCard(toIndex, isHitMeBtn) {
  isHitMeBtn ? playerTurn(toIndex) : dealerTurn(toIndex);
};

function checkWeightLimit(cardIndex, isHitMeBtn) {
  if (isHitMeBtn) {
    if (playerWeights > 21 ) {
      showCard(cardIndex);
      playerWeights = checkAceWeight(currentCard, playerWeights);
      showScore(true);
      $('#hitButton').prop("disabled", true);
      stopGame();
    } else {
      showCard(cardIndex);
      showScore(true);    
    }
  } else {
    if (dealerWeights < 17 ) {
      showCard(cardIndex);
      showScore();
    } else {
      showCard(cardIndex);
      showScore(); 
      stopGame();
    }
  }
}

function checkAceWeight(lastCard, currentScore) {
  if(lastCard.Value === 'A' && currentScore >= 21) {
    currentScore -= lastCard.Weight;
    lastCard.Weight = 1;
    return currentScore += lastCard.Weight;
  } 
  return currentScore
}

function playerTurn(toIndex) {
  if (playerCardsCounter < cardDiv.length / 2) {
    for (let i = playerCardsCounter; i <= toIndex; i++) {
      currentCard = deck.pop();
      playerCardsCounter++;
      playerWeights += currentCard.Weight;
      checkWeightLimit(i, true);
    }
  }
}

function dealerTurn(toIndex) {
  if (dealerCardsCounter < cardDiv.length / 2) {
    const lastIndex = cardDiv.length - 1;
    for (let i = lastIndex - dealerCardsCounter; i >= lastIndex - toIndex; i--) {
      currentCard = deck.pop();
      dealerCardsCounter++;
      dealerWeights += currentCard.Weight;
      checkWeightLimit(i, false);
    }
  } 
}