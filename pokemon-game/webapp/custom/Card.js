sap.ui.define([
    "sap/ui/core/Control",
    "sap/m/Image"
], function (Control, Image) {
    "use strict";

    return Control.extend("com.pokemon.ux.pokemongame.custom.Card", {
        metadata: {
            properties: {
                closedImageUrl: { type: "string", bindable: true, defaultValue:"" },
                openImageUrl: { type: "string", bindable: true, defaultValue:"" },
                // pokemonTitle: { type: "string" },
            },
            events: {
                press: {}
            }
        },

        init: function () {
            const sLibraryPath = jQuery.sap.getModulePath("com.pokemon.ux.pokemongame");
            jQuery.sap.includeStyleSheet(sLibraryPath + "/custom/Card.css");

            this._closedImage = new Image({
                src: this.getClosedImageUrl(),
                press: this.firePress.bind(this)
            });

            this._openImage = new Image({
                src: this.getOpenImageUrl(),
                visible: false,
                press: this.firePress.bind(this)
            });

            this.addDependent(this._closedImage);
            this.addDependent(this._openImage);
        },
        
        reset: function () {
 
            this._closedImage.setVisible(true);
            this._openImage.setVisible(false);
        
            const inner = this.$().find(".flip-card-inner");
            inner.removeClass("flipped");
            
            
        },
        renderer: function (oRM, oControl) {
            oRM.openStart("div", oControl);
            oRM.class("flip-card");
            oRM.openEnd();

            oRM.openStart("div", oControl.getId() + "-inner");
            oRM.class("flip-card-inner");
            oRM.openEnd();

            oRM.openStart("div", oControl.getId() + "-front");
            oRM.class("flip-card-front");
            oRM.openEnd();
            oRM.renderControl(oControl._closedImage);
            oRM.close("div");

            oRM.openStart("div", oControl.getId() + "-back");
            oRM.class("flip-card-back");
            oRM.openEnd();
            oRM.renderControl(oControl._openImage);

            // oRM.openStart("div", oControl.getId() + "-title")
            // oRM.class("title-pokemon") 
            // oRM.openEnd();
            // oRM.text(oControl.getPokemonTitle()); 
            // oRM.close("div");

            oRM.close("div");

            oRM.close("div");
            oRM.close("div"); 
        },
        setClosedImageUrl: function (sUrl) {
            this.setProperty("closedImageUrl", sUrl, true);
            this._closedImage.setSrc(sUrl);
        },

        setOpenImageUrl: function (sUrl) {
            this.setProperty("openImageUrl", sUrl, true);
            this._openImage.setSrc(sUrl);
        },
        flip: function () {
            const isFaceUp = this._openImage.getVisible();
            this._closedImage.setVisible(isFaceUp);
            this._openImage.setVisible(!isFaceUp);

            const inner = this.$().find(".flip-card-inner");
            inner.toggleClass("flipped");
        }
    });
});
