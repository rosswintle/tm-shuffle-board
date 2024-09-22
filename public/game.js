document.addEventListener('alpine:init', () => {
    Alpine.data('shuffleboard', () => ({
        boardItems: [
            { name: "-6", f: (scores, player) => -6 },
            { name: "2", f: (scores, player) => 2 },
            { name: "&div;2", f: (scores, player) => 0 - (Math.round(scores[player] / 2)) },
            { name: "4", f: (scores, player) => 4 },
            { name: "x2", f: (scores, player) => scores[player] },
            {
                name: "SWAP SCORES", f: (scores, player) => {
                    debugger;
                    tmp = scores[1];
                    scores[1] = scores[0];
                    scores[0] = tmp;
                    return "SWAP!";
                }
            },
            { name: "-10", f: (scores, player) => -10 },
            { name: "6", f: (scores, player) => 6 },
            { name: "BACK TO 0", f: (scores, player) => -scores[player] },
            { name: "8", f: (scores, player) => 8 },
            { name: "???", f: (scores, player) => Math.floor(Math.random() * 10) - 5 },
            { name: "-8", f: (scores, player) => -8 }
        ],

        turn: 0,
        player: 0,
        scores: [0, 0],
        strength: 0,
        addStrengthInterval: null,
        moveDuckInterval: null,
        duckSpeed: 0,
        duckPos: 0,
        duckItemPos: 0,
        scoreToShow: null,

        startAddStrength() {
            console.log('startAddStrength');
            this.addStrengthInterval = setInterval(() => {
                this.addStrength()
            }, 20)
        },

        stopAddStrength() {
            clearInterval(this.addStrengthInterval);
            this.throwDuck();
        },

        addStrength() {
            if (this.strength >= 100) {
                this.clearStrength();
                return;
            }
            this.strength += 2;
            this.$refs.strengthBar.style.width = `${this.strength}%`;
        },

        clearStrength() {
            console.log('clearStrength');
            clearInterval(this.addStrengthInterval);
            this.strength = 0;
            this.$refs.strengthBar.style.width = '0%';
        },

        throwDuck() {
            console.log('throwDuck');
            this.duckSpeed = this.strength / 10;
            // Add some randomness between -1 and 1
            const randomness = Math.random() * 2 - 1;
            console.log('Randomness:', randomness);
            this.duckSpeed += randomness
            this.moveDuckInterval = setInterval(() => {
                this.moveDuck()
            }, 20)
        },

        moveDuck() {
            if (this.duckSpeed <= 0.1) {
                this.endDuck();
            }

            // Duck moves vertically down the page
            this.duckPos += this.duckSpeed;
            this.$refs.duck.style.top = `${this.duckPos}px`;
            this.duckSpeed = this.duckSpeed * 0.98;

            // Calculate the duck's position on the board
            const duckHeight = this.$refs.duck.clientHeight;
            const boardHeight = this.$refs.board.clientHeight;
            const itemHeight = boardHeight / this.boardItems.length;
            const duckHeightPercent = (duckHeight / boardHeight) * 100;
            const itemIndex = Math.floor((this.duckPos - (duckHeight / 2)) / itemHeight);
            console.log(duckHeight, boardHeight, itemHeight, duckHeightPercent, this.duckPos, itemIndex);
            this.duckItemPos = itemIndex;
        },

        endDuck() {
            clearInterval(this.moveDuckInterval);
            setTimeout(this.scoreDuck.bind(this), 2000);
        },

        scoreDuck() {
            // Check if the duck has landed on a board item
            console.log('Item index:', this.duckItemPos);
            const item = this.boardItems[this.duckItemPos];
            console.log('Item:', item);

            // Execute the board item's function
            let thisScore = 0;
            if (item) {
                thisScore = item.f(this.scores, this.player);
            }

            // Check is the score is a string or a number
            if (typeof thisScore === 'string') {
                this.scoreToShow = thisScore;
            } else {
                this.scores[this.player] += thisScore;
                this.scoreToShow = thisScore;
            }

            // Swap players
            this.player = this.player === 0 ? 1 : 0;

            setTimeout(() => {
                this.scoreToShow = null;
                // Reset speed and position
                this.duckSpeed = 0;
                this.duckPos = 0;
                this.duckItemPos = 0;
                this.$refs.duck.style.top = '0px';
                this.clearStrength();
            }, 2000);
        }
    }))

})
