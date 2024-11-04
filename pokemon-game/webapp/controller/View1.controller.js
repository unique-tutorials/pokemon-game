sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/Dialog",
    "sap/m/MessageToast",
    "sap/m/Image",
    "sap/m/HBox",
    "sap/m/Text",
    "sap/m/List",
    "sap/m/Button",
    "com/pokemon/ux/pokemongame/custom/Card"
], function (Controller, JSONModel, Dialog, MessageToast, Image, HBox, Text, List, Button, Card) {
    "use strict";

    return Controller.extend("com.pokemon.ux.pokemongame.controller.View1", {
        onInit: function () {
            this._checkLocalStorage();

            const oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.subscribe("DifficultySelect", "DifficultyChanged", this.onDifficultyChanged, this);
        },

        _checkLocalStorage: function () {
            var username = localStorage.getItem("username");
            if (username) {
                this.getView().byId("usernameInput").setValue(username);
            }
        },

        onStartGame: function () {
            var username = this.getView().byId("usernameInput").getValue();
            if (!username) {
                MessageToast.show("Please enter your nick-name.");
                return;
            }
        
            localStorage.setItem("username", username);

            var selectedDifficulty = this._selectedDifficulty;
            if (!selectedDifficulty) {
                MessageToast.show("Please select difficulty level!");
            }
            console.log("seçilen zorluk seviyesi:", selectedDifficulty);
            
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("PokemonDetail", { difficulty: selectedDifficulty });
        },
        onDifficultyChanged: function (sChannel, sEvent, oData) {
            console.log(sChannel);
            console.log(sEvent);
            this._selectedDifficulty = oData.selectedDifficulty; 
            console.log("eventbus zorluk seviyesi:", this._selectedDifficulty);
        },
      
    });
});
