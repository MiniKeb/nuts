function Hand(firstCard, secondCard){
	if (firstCard.equals(secondCard))
		throw Error("Same cards");
	this.firstCard = firstCard;
	this.secondCard = secondCard;
}

module.exports = Hand;
