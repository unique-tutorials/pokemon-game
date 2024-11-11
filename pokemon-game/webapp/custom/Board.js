sap.ui.define([
    "sap/ui/core/Control"
], function (Control) {
    "use strict";

    return Control.extend("com.pokemon.ux.pokemongame.custom.Board", {
        metadata: {
            aggregations: {
                items: { type: "com.pokemon.ux.pokemongame.custom.Card", multiple: true, singularName: "item" }
            }
        },
        removeAllItems: function () {
            this.destroyItems();
        },
        renderer: {
          
            render: function (oRM, oControl) {
                oRM.write("<div class='pokemonBoard'>");
                oControl.getItems().forEach(function (oItem) {
                    oRM.renderControl(oItem);
                });
                oRM.write("</div>");
            }
        }
    });
});
