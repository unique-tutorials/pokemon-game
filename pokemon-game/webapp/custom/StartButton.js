sap.ui.define([
    "sap/ui/core/Control"
], function (Control) {
    "use strict";

    return Control.extend("com.pokemon.ux.pokemongame.custom.StartButton", {
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
            jQuery.sap.includeStyleSheet(sLibraryPath + "/custom/StartButton.css");
        },

        renderer: function (oRM, oControl) {

            oRM.openStart("div", oControl)
               .class("buttonContainer")
               .openEnd();

            oRM.openStart("button", oControl)
                .class("customStartButton")
                .openEnd();

            oRM.openStart("span")
                .class("customIcon")
                .openEnd()
                .icon("sap-icon://play") 
                .close("span");

            oRM.text(" " + oControl.getText()); 
            oRM.close("button"); 
            oRM.close("div"); 
        },

        onAfterRendering: function () {
            const oButton = this.getDomRef();
            const oControl = this;

            oButton.addEventListener("click", function () {
                oControl.firePress();
            });
        }
    });
});
