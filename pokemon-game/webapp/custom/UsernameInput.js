sap.ui.define([
    "sap/ui/core/Control"
], function (Control) {
    "use strict";

    return Control.extend("com.pokemon.ux.pokemongame.custom.UsernameInput", {
        metadata: {
            properties: {
                value: { 
                    type: "string",
                    defaultValue: "" 
                },
                placeholder: { 
                    type: "string", 
                    defaultValue: "" 
                }
            },
            events: {
                change: {}
            }
        },
        init: function () {
            const sLibraryPath = jQuery.sap.getModulePath("com.pokemon.ux.pokemongame");
            jQuery.sap.includeStyleSheet(sLibraryPath + "/custom/UsernameInput.css");
        },

        renderer: function (oRM, oControl) {
            oRM.openStart("div", oControl)
                .class("customUsernameInput")
                .openEnd()
                .openStart("input", oControl.getId() + "-input")
                .attr("type", "text")
                .attr("placeholder", oControl.getPlaceholder())
                .class("sapMInputBaseInner")
                .openEnd()
                .close("input")
                .close("div");
        },

        onAfterRendering: function () {
            var oInput = this.getDomRef("input");
            var oControl = this;

            oInput.value = oControl.getValue();

            oInput.focus();

            oInput.addEventListener("input", function () {
                oControl.setValue(oInput.value);
                oControl.fireChange({ value: oInput.value });
            });
        }
    });
});
