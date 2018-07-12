jQuery( function ($)
{
    let btnLancer = $('#btnLancer');
    let btnRejouer = $('#btnRejouer');

    let throwResults = [];
    let keepers = [];
    let throwCount = 0;

    let arrayTop = buildArray(6, 4);
    let arrayBottom = buildArray(7, 4);

    let totalTopPart = [];
    let totalBottomPart = [];


    displayScoreboard();
    onClickScoreboardCells(); 
    onClickBottomCells();

    let dices = {           // access json (like arrays) -> dices[1]['value']
        "1":{
            "src":"1.png",
            "value":1
        },
        "2":{
            "src":"2.png",
            "value":2
        },
        "3":{
            "src":"3.png",
            "value":3
        },
        "4":{
            "src":"4.png",
            "value":4
        },
        "5":{
            "src":"5.png",
            "value":5
        },
        "6":{
            "src":"6.png",
            "value":6
        },
    }

    // eventlistener sur le bouton Lancer
    btnLancer.click(function()
    {
        throwCount++;
        getRandomNumbers();
        displayDices();
    });


    // eventlistener to restart the game                            // A terminer
    btnRejouer.click(function()
    {
        resetTurn();       
    });


    /**
     *  resets the arrays for the next turn and reset the throw count to 0
     */
    function resetTurn() {
            throwCount = 0; 
            throwResults = [];
            keepers = [];
            btnLancer.show();
            displayKeepers();
            displayDices();
    }


    /**
     *  Array that contains all the scores
     */
    function buildArray(rows, cols)
    {
        let arr = [];

        for (let y = 0; y < rows; y++) {
            
            arr[y] = [] ;

            for (let x = 0; x < cols; x++) {
                arr[y][x] = "";
            }
        }
        return arr;
    }


    /**
     *  Get a series of random numbers matching the face of a dice
     */
    function getRandomNumbers() {
        if (throwCount<= 3) {
            let iteration = 5 - keepers.length;

            throwResults = [];
        
            for (let i = 0; i < iteration; i++) {
                throwResults.push(Math.floor(Math.random() * 6)+1);  // returns an array of random numbers
            }
        }

        if (throwCount === 3) {
            btnLancer.hide();
        }
    }


    /**
     * Moves a dice from thrown to selected position
     * @param {*} e 
     */
    function selectDice(val)
    {       
        val = parseInt(val);
        keepers.push(val);
        throwResults.splice(throwResults.indexOf(val), 1);
       
        displayDices();
        displayKeepers();
    }


    /**
     * Cancels the selection and moves back the dice to the thrown position
     * @param {*} e 
     */
    function cancelSelection(val)
    {
        val = parseInt(val);
        throwResults.push(val);
        keepers.splice(keepers.indexOf(val), 1);
                
        displayDices();
        displayKeepers();
    }



    /**
     * Adds the scores to the top part of the scroreboard
     * @param {*} y 
     * @param {*} x 
     */
    function addScoreToCell(y, x)
    { 
        return function()
        {       
            console.log("y= " +y+" x= "+ x);    
            
            if (throwCount >=1) {
                // let trId = $(this).closest('tr').first().attr('id'); // recup l'id du tr
                            
                switch (this.classList.value)
                {
                    case "colN":
                    // TOP
                        if (y >= 2 && y <= 7) {
                            if (arrayTop[y-2][x-2] == "") {
                                arrayTop[y-2][x-2] = calculateScoreTop()[y-2];
                            
                                if (getColTotal(arrayTop, x-2) !== -1) {
                                    totalTopPart[x-2] = getColTotal(arrayTop, x-2);  // storing the totl of the top part to calculate the grand total
                                    displayTotalTopScores(totalTopPart[x-2], x-1);
                                }
                                
                                if (isArrayComplete(arrayTop) && isArrayComplete(arrayBottom)) {
                                    displayFinalScore();
                                }
                                
                                resetTurn();
                            }
                    // BOTTOM
                        } else if (y >= 12 && y <= 18) {
                            if (arrayBottom[y-12][x-2] == "") {
                                if (calcResult(y-12) !== -1) {
                                                                        
                                    arrayBottom[y-12][x-2] = calcResult(y-12);
                                    
                                    if (getColTotal(arrayBottom, x-2) !== -1) {
                                        totalBottomPart[x-2] = getColTotal(arrayBottom, x-2);  // storing the totl of the top part to calculate the grand total
                                        displayTotalBottomScore(totalBottomPart[x-2], x-1);
                                    }
                                    
                                    if (isArrayComplete(arrayTop) && isArrayComplete(arrayBottom)) {
                                        displayFinalScore();
                                    }

                                    resetTurn();
                                }
                            }
                        } 
                        break;
                    
                    case "colD":
                    // TOP
                        if (y >= 2 && y <= 7) {
                            if ((y-2 == 0 && arrayTop[y-2][x-2] == "") || (y-2 > 0 && arrayTop[y-3][x-2] !== "")) {
                                if (arrayTop[y-2][x-2] == "") {
                                    arrayTop[y-2][x-2] = calculateScoreTop()[y-2];
                                
                                    if (getColTotal(arrayTop, x-2) > -1) {
                                        totalTopPart[x-2] = getColTotal(arrayTop, x-2);  
                                        displayTotalTopScores(totalTopPart[x-2], x-1);
                                    }

                                    if (isArrayComplete(arrayTop) && isArrayComplete(arrayBottom)) {
                                        displayFinalScore();
                                    }
                                    
                                    resetTurn();
                                }
                            }
                    // BOTTOM
                        } else if (y >= 12 && y <= 18) {
                            if ((y-12 == 0 && arrayBottom[y-12][x-2] == "")||(y-12 > 0 && arrayBottom[y-13][x-2] !== "")) {
                                if (calcResult(y-12) !== -1) {
                                    arrayBottom[y-12][x-2] = calcResult(y-12);   
                                    
                                    if (isArrayComplete(arrayTop) && isArrayComplete(arrayBottom)) {
                                        displayFinalScore();
                                    }
                                    
                                    resetTurn();
                                }
                            }  
                        }
                        break;

                    case "colM":
                    // TOP    
                        if (y >= 2 && y <= 7) {
                            if ((y-1 == arrayTop.length && arrayTop[y-2][x-2] == "") || (y-1 < arrayTop.length && arrayTop[y-1][x-2] !== "")) {
                                if (arrayTop[y-2][x-2] == "") {

                                    arrayTop[y-2][x-2] = calculateScoreTop()[y-2];

                                    if (getColTotal(arrayTop, x-2) > -1) {
                                        totalTopPart[x-2] = getColTotal(arrayTop, x-2); 
                                        displayTotalTopScores(totalTopPart[x-2], x-1);
                                    }
                                    
                                    if (isArrayComplete(arrayTop) && isArrayComplete(arrayBottom)) {
                                        displayFinalScore();
                                    }

                                    resetTurn();
                                }
                            }
                    // BOTTOM
                        } else if (y >= 12 && y <= 18) {
                                if ((y-11 == arrayBottom.length && arrayBottom[y-12][x-2] == "")||(y-11 < arrayBottom.length && arrayBottom[y-11][x-2] !== "")) {
                                    if (calcResult(y-12) !== -1) {
                                        arrayBottom[y-12][x-2] = calcResult(y-12);
                                        
                                        if (isArrayComplete(arrayTop) && isArrayComplete(arrayBottom)) {
                                            displayFinalScore();
                                        }
                                        
                                        resetTurn();
                                    }
                                }               
                            }               
                        break;

                    case "colS":
                    // TOP
                        if (y >= 2 && y <= 7) {
                            if (throwCount == 1) {
                                if (arrayTop[y-2][x-2] == "") {
                                    
                                    arrayTop[y-2][x-2] = calculateScoreTop()[y-2];

                                    if (getColTotal(arrayTop, x-2) > -1) {
                                        totalTopPart[x-2] = getColTotal(arrayTop, x-2);  // storing the totl of the top part to calculate the grand total
                                        displayTotalTopScores(totalTopPart[x-2], x-1);
                                    }
                                    
                                    if (isArrayComplete(arrayTop) && isArrayComplete(arrayBottom)) {
                                        displayFinalScore();
                                    }

                                    resetTurn();
                                }
                            } else if (throwCount > 1) {
                                if (arrayTop[y-2][x-2] == "") {
                                    arrayTop[y-2][x-2] = 0;
                                    
                                    if (isArrayComplete(arrayTop) && isArrayComplete(arrayBottom)) {
                                        displayFinalScore();
                                    }

                                    resetTurn();
                                }
                            }
                    // BOTTOM
                        } else if (y >= 12 && y <= 18) {
                            if (throwCount == 1) {
                                // a terminer
                            }
                        }    
                        break;
                }
                displayScoreboard();
                }
            }
           
    }


    /**
     * Calculates the score for the top part of the scoreboard
     * Returns an array with the score for each dice
     */
    function calculateScoreTop()
    {
        let score = [];
        let diceCount = [0,0,0,0,0,0];

        $(keepers).each(function() {            // counts of each dice   
            diceCount[this-1] += 1;
        });

        $.each(diceCount, (i, val)=>{
            score [i] = val * (i+1);
        });    
        return score;
    }


    function calcResult(valY)
    {
        let score = 0;
        switch (valY) {
            case 0: 
                score = calcBrelan();
                break;
            case 1: 
                score = calcCarre(); 
                break;
            case 2: 
                score = calcFull(); 
                break;
            case 3: 
                score = calcPetiteSuite(); 
                break;
            case 4: 
                score = calcGrandeSuite(); 
                break;
            case 5: 
                score = calcYats(); 
                break;
            case 6: 
                score = dicesSum();
                break;
        }
        return score;
    }

    /**
     * Calculates the score for a brelan 
     */
    function calcBrelan()
    {
        let score = -1;
        let count = getDiceCount();

        if ($.inArray(3, count) !== -1 || $.inArray(4, count) !== -1) {
            score = dicesSum();
        }
        return score;
    }

    /**
     * Calculates the score for a carre
     */
    function calcCarre()
    {
        let score = -1;
        let count = getDiceCount();

        if($.inArray(4, count) > -1){
            score = dicesSum();             
        }         
        return score;
    }

    /**
     * Calculates the score for a full
     */
    function calcFull()
    {
        let score = -1;
        let count = getDiceCount();

        if ($.inArray(3, count) > -1) {
            if ($.inArray(2, count) > -1) {
                score = 25;
            }
        }
        return score;
    }

    /**
     * Calculates Petite suite
     */
    function calcPetiteSuite()         
    {
        let score = -1;
        
        if ($.inArray(1, keepers) !== -1) {         // if we picked a 1 -> check if we have 2,3,4
            
            if ($.inArray(2, keepers) !== -1 &&  $.inArray(3, keepers) !== -1 && $.inArray(4, keepers) !== -1) {
                return score = 30;
            }
        }

        if ($.inArray(2, keepers) !== -1) {         // if we picked a 2 -> check if we have 3,4,5

            if ($.inArray(3, keepers) !== -1 &&  $.inArray(4, keepers) !== -1 && $.inArray(5, keepers) !== -1) {
                return score = 30;
            }
        }

        if ($.inArray(3, keepers) !== -1) {         // if we picked a 3 -> check if we have 4,5,6
            
            if ($.inArray(4, keepers) !== -1 &&  $.inArray(5, keepers) !== -1 && $.inArray(6, keepers) !== -1) {
                return score = 30;
            } 
        }
        
        return score;
    }

    

    /**
     * Calculates Grande suite
     */
    function calcGrandeSuite()
    {
        let score = -1;
        let count = getDiceCount();
        let count1 = 0;

        $.each(count, (i, val)=>{
            if (val == 1) {
                count1++;
            }
        });
        
        count1 == 5 ? score = 40 : score = -1;

        return score;  
    }

    /**
     * Calculates the score for a Yats
     */
    function calcYats()
    {
        let score = -1;
        let count = getDiceCount();



        if($.inArray(5, count) !== -1){
            score = 50;  
        }

        return score;
    }

    /**
     *  Calculates the occurence of each dice in the keepers array
     */
    function getDiceCount()
    {
        let arr = [0,0,0,0,0,0];
        $.each(keepers, (i, val)=>{
            arr[val-1] += 1; 
        });
        return arr;
    }

     /**
     * Calculates the sum of the dices the players kept
     */
    function dicesSum()
    {
        let sum = 0;

        $.each(keepers, function(){
            sum += parseInt(this);
        });

        return sum;
    }

    
    /**
     * Functions returns -1 if the column isn't complete
     * or returns the total of the values in the column
     * @param {*} arr 
     * @param {*} colId 
     */
    function getColTotal(arr, colId)
    {
        let colComplete = false;
        let total = 0;
        
        $.each(arr, (i)=>{    
            if (arr[i][colId] !== "") {
                colComplete = true;
            } else {
               return colComplete = false;
            }
        })

        if (colComplete) {
            $.each(arr, (i, val)=>{
                total += val[colId];
            });
        } else {
            total = -1;
        }
        return total;
    }


    /**
     * checks if the top/bottom part are complete
     */
    function isArrayComplete(arr)
    {      
        let emptyCells = 0;

        $.each(arr, (i, row)=>{
            $.each(row, (i, cell)=>{
    
                if (typeof(cell) !== 'number') {
                    emptyCells++;
                }
            });
        });
        
        console.log('cells : ' + emptyCells);
        
        return (emptyCells == 0) ? true : false ;        
    }




    /**
     * 
     *      FRONT END DISPLAY 
     * 
     */




    /**
     * Display the dices we got from the random
     */
    function displayDices()
    {
        $('#lstDesLances').empty();
  
        throwResults.forEach( function(dice){   
            let img = '<img src="img/'+dices[dice]["src"]+'" data-val="'+ dices[dice]["value"] +'" alt="">';
            $('#lstDesLances').append(img);
        });
        
        $('#lstDesLances img').each(function(){
            $(this).click(function(e){ 
                selectDice(e.target.dataset.val);
            });
        });
    }


    /**
     * Display the dices the player wants to keep
     */
    function displayKeepers()
    {
        $('#lstDesRetenus').empty();
        keepers.forEach(dice => {
            $('#lstDesRetenus').append('<img src="img/'+dices[dice]["src"]+'" data-val="'+ dices[dice]["value"] +'" alt="">');
        });

        $('#lstDesRetenus img').each(function(){
            $(this).click(function(e){ 
                cancelSelection(e.target.dataset.val);
            });
        });
    }



    /**
     *     Fills the scoreboard with the values of the backend array
     */
    function displayScoreboard()
    {
       for (let y = 2; y < arrayTop.length +2; y++) {
           let xLength = $('#secScore tr').eq(y).children().length
               
            for (let x = 2; x < xLength; x++) {
                let cell = $('#secScore tr').eq(y).children().eq(x);
                cell.text(arrayTop[y-2][x-2]);
            }
       } 

       for (let y = 12; y < arrayBottom.length +12; y++) {
        let xLength = $('#secScore tr').eq(y).children().length
            
         for (let x = 2; x < xLength; x++) {
             let cell = $('#secScore tr').eq(y).children().eq(x);
             cell.text(arrayBottom[y-12][x-2]);
         }
        }    
    }

    


    /**
     *  Adds event listener on the cells in the top part of the scoreboard
     */
    function onClickScoreboardCells()
    {
       for (let y = 2; y < arrayTop.length +2; y++) {
           let xLength = $('#secScore tr').eq(y).children().length
               
            for (let x = 2; x < xLength; x++) {
                let cell = $('#secScore tr').eq(y).children().eq(x);
                cell.on("click", addScoreToCell(y, x));
            }
       } 
    }


    /**
     *  Adds event listener on the cells in the top part of the scoreboard
     */
    function onClickBottomCells()
    {    
       for (let y = 12; y < arrayBottom.length+12; y++) {
           let xLength = $('#secScore tr').eq(y).children().length
               
            for (let x = 2; x < xLength; x++) {
                let cell = $('#secScore tr').eq(y).children().eq(x);
                cell.on("click", addScoreToCell(y, x));
            }
       } 
    }


    /**
     * adds scores to the score line and calculates bonuses
     * @param {*} score 
     * @param {*} col 
     */
    function displayTotalTopScores(score, col) 
    {
        let bonus = 0;

        // add total to the first line
        $('#ligneTotalPts').children().eq(col).text(score);
        
        if (score >= 63) {
            bonus = 35;
            score += bonus;
        } 

        $('#ligneTotalPrime').children().eq(col+1).text(bonus);
        $('#ligneTotalPtsPrime').children().eq(col).text(score);
    }


    /**
     * adds scores to the score line and calculates bonuses
     * @param {*} score 
     * @param {*} col 
     */
    function displayTotalBottomScore(score, col) 
    {
        $('#ligneTotalPtsInf').children().eq(col).text(score);        
    }


    /**
     *  Calculates and displays the final score
     */
    function displayFinalScore()
    {
        let grandTotal = 0;
        let arr = $.merge(totalTopPart, totalBottomPart);

        $.each(arr, (i, val)=>{
            grandTotal += val;
        });

        $('#scoreFinal').text(grandTotal);
    }

    


}); // End of function