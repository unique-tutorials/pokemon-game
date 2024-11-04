sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "com/pokemon/ux/pokemongame/custom/Card",

], function (Controller, JSONModel, MessageToast, Card) {
    "use strict";

    return Controller.extend("com.pokemon.ux.pokemongame.controller.PokemonDetail", {
        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("PokemonDetail").attachPatternMatched(this._onRouteMatched, this);
            
            var oModel = this.getOwnerComponent().getModel("pokemon");
            this.getView().setModel(oModel);
        
            this._initializeTimer();
            var oGameTimer = this.byId("gameTimer");
            oGameTimer.attachPauseGame(this._disableCards.bind(this));
            oGameTimer.attachResumeGame(this._enableCards.bind(this));
            oGameTimer.attachEvent("restartGame", this._onRestartGame.bind(this));
        },
         setDifficulty: function (difficulty) {
            var container = document.querySelector('.smod-ux-detail-container');
            if (container) {
                if (difficulty === 'hard') {
                    container.classList.add('hard');
                } else {
                    container.classList.remove('hard');
                }
            }
        },
        _onRestartGame: function (oEvent) {
            var oSource = oEvent.getSource(); 
            MessageToast.show("Game is restarting");
            
            var difficulty = this.getView().getModel("pokemon").getProperty("/currentDifficulty");
            if (!difficulty) {
                console.warn("'easy'.");
                difficulty = "easy";
                this.getView().getModel("pokemon").setProperty("/currentDifficulty", difficulty);
            }
            
            this._resetCards(difficulty);
        },
                
        _resetCards: function (difficulty) {
            var oModel = this.getView().getModel("pokemon");
        
            oModel.setProperty("/currentDifficulty", difficulty);
            
            this.getView().byId("gameTimer").startTimer();


            oModel.setProperty("/selectedCards", []);
        
            this.byId("pokemonBoard").getItems().forEach(function (card) {
                if (card.reset) {
                    card.reset(); 
                }
                card.removeStyleClass("matched"); 
            });
           
            var selectedPokemons = this._selectPokemons(difficulty);
        
        },
        
        
        _disableCards: function () {
            this.byId("pokemonBoard").getItems().forEach(function (card) {
                card.addStyleClass("paused");
            });
            MessageToast.show("The game is paused!"); 
        },
        
        _enableCards: function () {
            this.byId("pokemonBoard").getItems().forEach(function (card) {
                card.removeStyleClass("paused");
            });
            MessageToast.show("The game continues..."); 
        },
        
        
        _onRouteMatched: function (oEvent) {
            var difficulty = oEvent.getParameter("arguments").difficulty;
             this.setDifficulty(difficulty); 
            var oModel = this.getOwnerComponent().getModel("pokemon"); 
            this.getView().setModel(oModel); 
            this._startGame(difficulty);
            this._resetCards(difficulty);
        },

        _initializeTimer: function () {
            this.getView().byId("gameTimer").setHours(0); 
            this.getView().byId("gameTimer").setMinutes(0); 
            this.getView().byId("gameTimer").setSeconds(0); 
        },

        _startGame: function (difficulty) {
          
            if (!this.getView().getModel("pokemon").getProperty("/currentDifficulty")) {
                this.getView().getModel("pokemon").setProperty("/currentDifficulty", difficulty);
            }

            this.getView().byId("pokemonBoard").removeAllItems();
        
            MessageToast.show("The game begins...");
            this.getView().byId("gameTimer").startTimer();
            this.getView().getModel("pokemon").setProperty("/selectedCards", []);
            this._renderPokemonBoard(this._selectPokemons(difficulty));
            this.getView().byId("pokemonBoard").setVisible(true);
        },
        _selectPokemons: function (difficulty) {
            var pokemons = this.getView().getModel("pokemon").getProperty("/pokemonData");
            var count = difficulty === "easy" ? 4 : difficulty === "medium" ? 6 : 8;
            var selectedPokemons = [];

            while (selectedPokemons.length < count) {
                var randomIndex = Math.floor(Math.random() * pokemons.length);
                var pokemon = pokemons[randomIndex];
                if (!selectedPokemons.includes(pokemon)) {
                    selectedPokemons.push(pokemon);
                }
            }

            return selectedPokemons.flatMap(pokemon => [pokemon, pokemon]);
        },

        _renderPokemonBoard: function (selectedPokemons) {
            var oBoard = this.getView().byId("pokemonBoard");
             
            //Sıfırla ?
            oBoard.removeAllItems(); 

            console.log("Seçilen Pokémonlar:", selectedPokemons); 

            if (oBoard instanceof com.pokemon.ux.pokemongame.custom.Board) {
                oBoard.removeAllItems(); 
            } else {
                console.error("pokemonBoard kontrolü bir Board kontrolü değil");
                return; 
            }

            selectedPokemons.sort(() => Math.random() - 0.5);
            selectedPokemons.forEach(pokemon => {
                var oCard = new Card({
                    closedImageUrl: "../images/pokeball.svg",
                    openImageUrl: pokemon.imageUrl,
                    // pokemonTitle: pokemon.name,
                    press: (oEvent) => this._onCardClick(pokemon, oEvent)
                });
                oBoard.addItem(oCard);
            });
            
        },
        _onCardClick: function (pokemon, oEvent) {
          
            var oCard = oEvent.getSource();
            
            oCard.flip();
            console.log("Pokemon:", pokemon);
            var selectedCards = this.getView().getModel("pokemon").getProperty("/selectedCards") || [];
            selectedCards.push({ card: oCard, pokemon: pokemon }); 

            if (selectedCards.length === 2) {
                this._checkMatch(selectedCards);
                this.getView().getModel("pokemon").setProperty("/selectedCards", []); 
            } else {
                this.getView().getModel("pokemon").setProperty("/selectedCards", selectedCards);
            }
        },
        _checkMatch: function (selectedCards) {
            var [firstCard, secondCard] = selectedCards;

            if (firstCard.pokemon.name === secondCard.pokemon.name) {
                firstCard.card.addStyleClass("matched");
                secondCard.card.addStyleClass("matched");
                MessageToast.show("Match found!");
            } else {
                setTimeout(() => {
                    firstCard.card.flip(false); 
                    secondCard.card.flip(false);
                }, 1000);
            }

            this._checkGameEnd();
        },

        _checkGameEnd: function () {
            var matchedCards = this.getView().byId("pokemonBoard").getItems().filter(card => {
                return card.hasStyleClass("matched");
            });
            var totalCards = this.getView().byId("pokemonBoard").getItems().length;

            if (matchedCards.length === totalCards) {
                this._onGameComplete();
            }
        },

        _saveScore: function (score) {
            var username = localStorage.getItem("username"); 
            if (!username) {
                MessageToast.show("Please enter your username.");
                return;
            }
        
            var scores = JSON.parse(localStorage.getItem("scores_" + username)) || [];
            scores.push(score);
            scores.sort((a, b) => a - b);
            localStorage.setItem("scores_" + username, JSON.stringify(scores));
         
        },

        _onGameComplete: function () {
            this.getView().byId("gameTimer").stopTimer(); 
            var hours = this.getView().byId("gameTimer").getHours(); 
            var minutes = this.getView().byId("gameTimer").getMinutes();
            var seconds = this.getView().byId("gameTimer").getSeconds(); 
 
            var formattedScore = this.formatTime(hours, minutes, seconds);

            this._showCompletionDialog(formattedScore);
        
            this._saveScore(formattedScore); 
        },
        onNavBack: function () {
    
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteView1");
        },
        
        _showCompletionDialog: function (formattedScore) {
            var oTitle = new sap.m.Text({
                text: "Game Completed"
            }).addStyleClass("dialogTitle"); 
        
            var oContent = new sap.m.VBox({
                alignItems: "Center", 
                items: [
                    new sap.m.Text({
                        text: "Congratulations! Your Score: " + formattedScore
                    }).addStyleClass("customText") 
                ]
            });
        
            var oDialog = new sap.m.Dialog({
                customHeader: new sap.m.Toolbar({
                    content: [
                        new sap.m.ToolbarSpacer(), 
                        oTitle,
                        new sap.m.ToolbarSpacer() 
                    ]
                }),
                content: oContent,
                endButton: new sap.m.Button({
                    text: "Home",
                    icon: "sap-icon://home",
                    type: "Accept",
                    press: function () {
                   
                        this.onNavBack();
                    }.bind(this)
                }),
                afterClose: function () {
                    oDialog.destroy();
                }
            });
        
            oDialog.open();
        },
        
        
        
        formatTime: function (hours, minutes, seconds) {
            return this.pad2Digits(hours) + ":" + this.pad2Digits(minutes) + ":" + this.pad2Digits(seconds);
        },
        
        pad2Digits: function (n) {
            return n.toString().padStart(2, "0");
        },
        

    });
});