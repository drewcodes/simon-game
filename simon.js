$(document).ready(function () {
    // Game Configuration
    // Audio files
    var audio1 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3');
    var audio2 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3');
    var audio3 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3');
    var audio4 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3');
    var audioBuzzer = new Audio('https://s3-us-west-2.amazonaws.com/guylemon/Buzzer.mp3');
    // Win or Lose
    var win = false;   // Array for player to input their moves.
    var player = [];
    // Computer sequence used to animate, play game and compare player seq against
    var compMoves = [];
    // Holds array interval position for var computer, pushing the one move at a time into compMoves;
    var compPosition = 0;
    // Array for random generated sequence to push into
    var computer = [];
    // Counter / Current Round
    var counter = 0;
    // Strict Toggle
    var strict = false;
    // Game Speed Time
    var speed = 1000;
    // Color Light Speed
    var light = 500;
    // Power Button
    var power = false;
    $('.power-button').click(function () {
        if (power === false) {
            power = true;
            $('.power-light').css('background', "red");
        }
        else {
            power = false;
            $('.power-light').css('background', "black");
            powerOff();
        }
    });

    function powerOff() {
        win = false;
        computer = [];
        compMoves = [];
        player = [];
        light = 500;
        $('.counter').html("--");
        strict = false;
        $('.strict-light').css('background', "black");
        $('.game-button').removeClass('active');
    }
    // Start Button
    $('.start-button').click(function () {
        if (power === true) {
            startRestart();
        }
    });
    // Start/Restart Function
    function startRestart() {
        win = false;
        computer = [];
        generate20Moves();
        compMoves = [];
        player = [];
        light = 500;
        counter = 0;
        $('.counter').html(counter);
        $('.game-button').removeClass('active');
        setTimeout(function () {
            compMove();
            animate();
            counter += 1;
            $('.counter').html(counter);
        }, 1500);
    }
    // Strict Button
       // When strict is on, if wrong input, call strict() to reset everything
    $('.strict-button').click(function () {
        if (power === true) {
            if (strict == false) {
                startRestart();
                $('.strict-light').css('background', "red");
                strict = true;
            }
            else {
                startRestart();
                $('.strict-light').css('background', "black");
                strict = false;
            }
        }
        else {
            $('.strict-light').css('background', "black");
            strict = false;
        }
    });
    //Generate Computer Moves
    function generate20Moves() {
        for (var i = 0; i < 20; i++) {
            computer.push(Math.floor(Math.random() * 4 + 1));
        }
    }
    // Pushes random move into computer sequence array
    function compMove() {
        if (compPosition <= 19) {       // Pushes just ONE value from computer arr into compMoves
            compMoves.push(computer[compPosition]);       // Increments to the next interval position  when function is called again
            compPosition += 1;
        }
    }
    // Colored buttons configurations
    function red() {
        if (counter >= 4) light = 350;
        if (counter >= 8) light = 225;
        if (counter >= 12) light = 175;
        $(".red").addClass("brighten");
        window.setTimeout(function () {
            $(".red").removeClass("brighten");
        }, light);
        audio1.play();
    }

    function green() {
        if (counter >= 4) light = 350;
        if (counter >= 8) light = 225;
        if (counter >= 12) light = 175;
        $(".green").addClass("brighten");
        window.setTimeout(function () {
            $(".green").removeClass("brighten");
        }, light);
        audio2.play();
    }

    function blue() {
        if (counter >= 4) light = 350;
        if (counter >= 8) light = 225;
        if (counter >= 12) light = 175;
        $(".blue").addClass("brighten");
        window.setTimeout(function () {
            $(".blue").removeClass("brighten");
        }, light);
        audio3.play();
    }

    function yellow() {
        if (counter >= 4) light = 350;
        if (counter >= 8) light = 225;
        if (counter >= 12) light = 175;
        $(".yellow").addClass("brighten");
        window.setTimeout(function () {
            $(".yellow").removeClass("brighten");
        }, light);
        audio4.play();
    }
    // Decides which color lights up
    function playSounds(num) {
        if (num === 1) {
            red();
        }
        else if (num === 2) {
            green();
        }
        else if (num === 3) {
            blue();
        }
        else if (num === 4) {
            yellow();
        }
    }
    // Animate computer sequence and play
    function animate() {
        if (win === false) {
            if (counter >= 4) speed = 800;
            if (counter >= 8) speed = 600;
            if (counter >= 12) speed = 400;
            $.each(compMoves, function (i, number) {
                setTimeout(function () {
                    playSounds(compMoves[i]);
                }, i * speed);
            });
        }
        // Prevents color buttons from being active while animation plays
        setTimeout(function () {
            $('.game-button').addClass('active');
        }, (compMoves.length) * speed);
    }
    // Config for player sequence input. Runs check() logic.
    $('.red').click(function () {
        player.push(1);
        red();
        check();
    });
    $('.green').click(function () {
        player.push(2);
        green();
        check();
    });
    $('.blue').click(function () {
        player.push(3);
        blue();
        check();
    });
    $('.yellow').click(function () {
        player.push(4);
        yellow();
        check();
    });
    // Main Simon logic. Checks player's sequence against computer's sequence.
    function check() {
        // Compare player's inputs
        if (player[player.length - 1] == compMoves[player.length - 1]) {
            // Length check - Delays the next animation/round until player finishes inputting a sequence of equal length
            if (player.length === compMoves.length) {
                // If true, player passes round
                $('.game-button').removeClass('active');
                setTimeout(function () {
                    player = [];
                    if (win === false) {
                        counter += 1;
                        $('.counter').html(counter);
                    }
                    compMove();
                    animate();
                }, 1500);
                // Checks for winner after 20 rounds
                if (counter === 20) {
                    win = true;
                    audioBuzzer.play();
                    alert("You win!");
                    setTimeout(function(){
                        startRestart();
                    }, 2000);
                }
            }
        }
        else {
            // Strict mode ON - Any wrong player input, game restarts from round one.
            $('.game-button').removeClass('active');
            audioBuzzer.play();
            if (strict === true) {
                setTimeout(function () {
                    startRestart();
                }, 1500);
            }
            else {
                // Strict mode OFF - Player makes wrong input, animation replays. Player gets another chance.
                setTimeout(function () {
                    player = [];
                    animate();
                }, 1500);
            }
        }
    }
});