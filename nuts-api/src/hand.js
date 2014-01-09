function Hand(firstCard, secondCard){
	if (firstCard.equals(secondCard))
		throw Error("Same cards");
	
	if (firstCard.compareTo(secondCard) < 0){
		this.firstCard = secondCard;
		this.secondCard = firstCard;
	}else{
		this.firstCard = firstCard;
		this.secondCard = secondCard;
	}
}
Hand.prototype = {
	isPair : function(){
		return this.firstCard.compareTo(this.secondCard) === 0;
	}
};

module.exports = Hand;
