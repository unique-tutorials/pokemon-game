sap.ui.define([
    "sap/ui/core/Control",
    "sap/m/List",
    "sap/m/StandardListItem",
    "sap/m/Button",
    "sap/m/MessageToast"
], function (Control, List, StandardListItem, Button, MessageToast) {
    "use strict";

    return Control.extend("com.pokemon.ux.pokemongame.custom.ScoreSortButton", {
        metadata: {
            properties: {
                text: { type: "string" }
            },
            events: {
                press: {}
            }
        },
        init: function () {
            const sLibraryPath = jQuery.sap.getModulePath("com.pokemon.ux.pokemongame");
            jQuery.sap.includeStyleSheet(sLibraryPath + "/custom/ScoreSortButton.css");
            this._createDialog();
        },
        renderer: function (oRM, oControl) {
            oRM.openStart("div", oControl)
                .class("customScoreSortButton")
                .openEnd();

            oRM.openStart("button", oControl)
                .attr("type", "button")
                .openEnd();

            oRM.openStart("span")
                .class("customIcon")
                .openEnd()
                .icon("sap-icon://competitor") 
                .close("span");

            oRM.text(oControl.getText())
            oRM.close("button");

            oRM.close("div");
        },

        onAfterRendering: function () {
            const oControl = this;
            const button = this.getDomRef().querySelector("button");
            button.addEventListener("click", function () {
                oControl._toggleDialog();
                oControl.firePress();
            });
        },

        _createDialog: function () {
            this._overlay = document.createElement("div");
            this._overlay.classList.add("overlay");
        
            this._dialog = document.createElement("div");
            this._dialog.classList.add("customDialog");
          
        
            const header = document.createElement("div");
            header.classList.add("dialogHeader");
            header.innerText = "Scores";
            
            const footer = document.createElement("div");
            footer.classList.add("dialogFooter");
        
            const content = document.createElement("div");
            content.classList.add("dialogContent");
            this._dialog.appendChild(header);
            this._dialog.appendChild(content);
        
        
        
            const closeButton = document.createElement("button");
            closeButton.innerText = "Close";
            closeButton.onclick = () => {
                this._toggleDialog();
            };
            footer.appendChild(closeButton);
        
            this._dialog.appendChild(footer);
            this._overlay.appendChild(this._dialog);
            document.body.appendChild(this._overlay);
            this._overlay.style.display = "none";
        },
        
        _toggleDialog: function () {
            if (this._overlay.style.display === "none") {
                this._overlay.style.display = "flex";
                this._overlay.classList.add("show");
                this._populateScores();
            } else {
                this._overlay.style.display = "none";
                this._overlay.classList.remove("show");
            }
        },

        _populateScores: function () {
            const content = this._dialog.querySelector(".dialogContent");
            content.innerHTML = ""; 
            const username = localStorage.getItem("username") || "Unknown";
            const scores = JSON.parse(localStorage.getItem("scores_" + username)) || [];
        

            const scoresInSeconds = scores.map(time => {
                const [hours, minutes, seconds] = time.split(":").map(Number);
                return (hours * 3600) + (minutes * 60) + seconds;
            });
        
            scoresInSeconds.sort((a, b) => a - b);
        
    
            const formattedScores = scoresInSeconds.map(totalSeconds => {
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;
                return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            });
        
            if (formattedScores.length > 0) {
                formattedScores.forEach((formattedTime, index) => {
                    const listItem = document.createElement("div");
                    listItem.classList.add("scoreItem");
                    listItem.innerText = `#${index + 1}: ${formattedTime}`;
                    content.appendChild(listItem);
                });
            } else {
                const noScoreItem = document.createElement("div");
                noScoreItem.classList.add("scoreItem");
                noScoreItem.innerText = "No score yet.";
                content.appendChild(noScoreItem);
            }
        },
        

        _getScores: function () {
            const username = localStorage.getItem("username");
            const scores = JSON.parse(localStorage.getItem("scores_" + username)) || [];
            return scores.length > 0 
            ? scores.map(score => ({ username: username, score: score })).sort((a, b) => a.score - b.score) 
            : [];
        }
    });
});
