sap.ui.define([
    "sap/ui/core/Control"
], function (Control) {
    "use strict";

    return Control.extend("com.pokemon.ux.pokemongame.custom.DifficultySelect", {
        metadata: {
            properties: {
                selectedDifficulty: { type: "string", defaultValue: "" }
            },
            events: {
                change: {}
            }
        },
        init: function () {
            const sLibraryPath = jQuery.sap.getModulePath("com.pokemon.ux.pokemongame");
            jQuery.sap.includeStyleSheet(sLibraryPath + "/custom/DifficultySelect.css");
        },

        renderer: function (oRM, oControl) {
            oRM.openStart("div", oControl)
                .class("customDifficultySelect")
                .openEnd();
        
            oRM.openStart("div", oControl.getId() + "-header")
                .class("difficultyHeader")
                .openEnd()
                .text("Select difficulty level:")
                .close("div");
        
            ["easy", "medium", "hard"].forEach(function (difficulty) {
                oRM.openStart("button", oControl.getId() + "-" + difficulty + "Button")
                    .class("difficultyButton");
        
                if (oControl.getSelectedDifficulty() === difficulty) {
                    oRM.class("selected");
                }
        
                oRM.attr("data-difficulty", difficulty)
                    .openEnd();
        

                oRM.text(difficulty === "easy" ? "Easy" : (difficulty === "medium" ? "Medium" : "Hard"));
        
                if (oControl.getSelectedDifficulty() === difficulty) {
                    oRM.openStart("span")
                        .class("difficultyIcon") 
                        .openEnd()
                        .icon("sap-icon://accept") 
                        .close("span");
                }
                oRM.close("button");
            });
        
            oRM.close("div");
        },
        
        onAfterRendering: function () {
            const oControl = this;
            const buttons = this.getDomRef().querySelectorAll("button");
        
            buttons.forEach(function (button) {
                button.addEventListener("click", function () {
                    const selectedDifficulty = this.getAttribute("data-difficulty");
                    oControl.setSelectedDifficulty(selectedDifficulty);
                    oControl.fireChange({ selectedDifficulty: selectedDifficulty });
                    oControl.invalidate();
        
                    buttons.forEach(btn => btn.classList.remove("selected"));
                    this.classList.add("selected");
                });
            });
        },
        
        ontap: function (oEvent) {
            oEvent.preventDefault();
            const selectedDifficulty = this.getSelectedDifficulty();
            
            const oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.publish("DifficultySelect", "DifficultyChanged", {
                selectedDifficulty: selectedDifficulty
            });
        }
        
        
    });
});
