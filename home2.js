let blackjackgame={
    'you':{'scorespan':'#your-blackjack-result','div':'#your-box','score':0},
    'dealer':{'scorespan':'#dealer-blackjack-result','div':'#dealer-box','score':0},
    'cards':['2','3','4','5','6','7','8','9','10','J','Q','K','A'],
    'cardsmap':{'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'J':11,'Q':12,'K':13,'A':[1,11]},
    'wins':0,
    'loss':0,
    'draw':0,
    'isstand':false,
    'turnover':false,
};

const hitsound= new Audio('sounds/swish.m4a');
const lostsound= new Audio('sounds/aww.mp3');
const winsound= new Audio('sounds/cash.mp3');

const YOU=blackjackgame['you'];
const DEALER=blackjackgame['dealer'];
document.querySelector('#hit').addEventListener('click',blackjackhit);
document.querySelector('#stand').addEventListener('click',dealerlogic);

document.querySelector('#deal').addEventListener('click',blackjackdeal);

function blackjackhit(){
    if (blackjackgame['isstand']===false){
        let card=randomcard();
        console.log(card);
        showcard(card,YOU);
        updatescore(card,YOU);
        showscore(YOU);
    }
    
}
function showcard(card,activeplayer){
    if(activeplayer['score']<=21){
        let cardImage=document.createElement('img');
        cardImage.src=`images/${card}.png`;
        document.querySelector(activeplayer['div']).appendChild(cardImage);
        hitsound.play();
    }
    
}
//deal
function blackjackdeal(){
    if(blackjackgame['turnover']===true){
        blackjackgame['isstand']=false;
        let yourimages=document.querySelector('#your-box').querySelectorAll('img');
        for(i=0;i<yourimages.length;i++){
            yourimages[i].remove()
        }
        let dealerimages=document.querySelector('#dealer-box').querySelectorAll('img');
        for(i=0;i<dealerimages.length;i++){
            dealerimages[i].remove()
        }
        YOU['score']=0;
        DEALER['score']=0;
        document.querySelector('#your-blackjack-result').textContent=0;
        document.querySelector('#dealer-blackjack-result').textContent=0;
    
        document.querySelector('#your-blackjack-result').style.color='white';
        document.querySelector('#dealer-blackjack-result').style.color='white';
     
        document.querySelector('#blackjack-result').textContent='Lets Play';
        document.querySelector('#blackjack-result').style.color='black';
        blackjackgame['turnover']=true;
    }
    
    
}
//random card
function randomcard(){
    let randomindex=Math.floor(Math.random()*13);
    return blackjackgame['cards'][randomindex];   
}

function updatescore(card,activeplayer){
    if(card==='A'){
        if(activeplayer['score']+blackjackgame['cardsmap'][card][1] <=21){
            activeplayer['score']+=blackjackgame['cardsmap'][card][1];
        }
        else{
            activeplayer['score']+=blackjackgame['cardsmap'][card][0]
        }
    }
    else{
    activeplayer['score'] += blackjackgame['cardsmap'][card];
    }
}
function showscore(activeplayer){
    if(activeplayer['score']>21){
        document.querySelector(activeplayer['scorespan']).textContent='BUST';
        document.querySelector(activeplayer['scorespan']).style.color='red';
    }
    else{
    document.querySelector(activeplayer['scorespan']).textContent=activeplayer['score'];
    }
}
function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}

async function dealerlogic(){
    blackjackgame['isstand']=true;
    while(DEALER['score']<16 && blackjackgame['isstand']===true){
        let card=randomcard();
        showcard(card,DEALER);
        updatescore(card,DEALER);
        showscore(DEALER);
        await sleep(500);
}
        blackjackgame['turnover']=true;
        let winner=computewinner();
        showresult(winner);
    }



function computewinner(){
    let winner;
    if(YOU['score']<=21){
        if(YOU['score']>DEALER['score'] || (DEALER['score']>21)){
            blackjackgame['wins']++;
            winner=YOU;
            
        }
        else if(YOU['score']<DEALER['score']){
            blackjackgame['loss']++;
            winner=DEALER;

        }
        else if(YOU['score']===DEALER['score']){
            blackjackgame['draw']++;
        }
    }
    else if(YOU['score']>21 && DEALER['score']<=21){
        blackjackgame['loss']++;
        winner=DEALER;
    }
    else if(YOU['score']>21 && DEALER['score']>21){
        blackjackgame['draw']++;
    }
    console.log('winner is',winner);
    return winner;
}

function showresult(winner){
    let message,messagecolor;
    if(blackjackgame['turnover']===true){
        if(winner===YOU){
            document.querySelector('#wins').textContent=blackjackgame['wins'];
            message="you won";
            messagecolor='green';
            winsound.play();
        }
        else if(winner===DEALER){
            document.querySelector('#looses').textContent=blackjackgame['loss'];
            message='you lost';
            messagecolor='red';
            lostsound.play();
        }
        else{
            document.querySelector('#draws').textContent=blackjackgame['draw'];
            message='DRAW'
            messagecolor='black';
        }
        document.querySelector('#blackjack-result').textContent=message;
        document.querySelector('#blackjack-result').style.color=messagecolor;        
    }
}