sap.ui.define([
    "sap/ui/core/Control"
], function (Control) {
    "use strict";

    return Control.extend("com.pokemon.ux.pokemongame.custom.DetailContainer", {
        metadata: {
            aggregations: {
                items: {
                    type: "sap.ui.core.Control",
                    multiple: true,
                    singularName: "item"
                }
            },
            defaultAggregation: "items"
        },

        init: function () {
            const sLibraryPath = jQuery.sap.getModulePath("com.pokemon.ux.pokemongame");
            jQuery.sap.includeStyleSheet(sLibraryPath + "/custom/DetailContainer.css");
        },

        renderer: function (oRM, oControl) {

            oRM.openStart("div", oControl)
               .class("smod-ux-detail-container")
               .openEnd();
        

            oRM.openStart("div")
               .class("smod-ux-content")
               .openEnd();
        

            const aItems = oControl.getItems();
            aItems.forEach(function (oItem) {
                oRM.renderControl(oItem);
            });
        

            oRM.close("div");
        

            oRM.close("div");
        }
        
    });
});
