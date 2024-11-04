/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "com/pokemon/ux/pokemongame/model/models",
  ],
  function (UIComponent, Device, JSONModel, MessageToast, models) {
    "use strict";

    return UIComponent.extend("com.pokemon.ux.pokemongame.Component", {
      metadata: {
        manifest: "json",
      },

      /**
       * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
       * @public
       * @override
       */
      init: function () {
        // call the base component's init function
        UIComponent.prototype.init.apply(this, arguments);

        // enable routing
        this.getRouter().initialize();

        // set the device model
        this.setModel(models.createDeviceModel(), "device");
        this._initModel();
      },

      _initModel: function () {
        var oModel = new JSONModel({
          pokemonData: [],
          selectedCards: [],
        });
        this.setModel(oModel, "pokemon");
        this._fetchPokemonData();
      },

      _fetchPokemonData: function () {
        var that = this;
        $.ajax({
          url: "https://pokeapi.co/api/v2/pokemon?limit=151",
          method: "GET",
          success: function (data) {
            that._preparePokemonData(data.results);
          },
          error: function () {
            MessageToast.show("pokemon verisi yok.");
          },
        });
      },

      _preparePokemonData: function (pokemonList) {
        var pokemonData = pokemonList.map(function (pokemon) {
          return {
            name: pokemon.name,
            imageUrl:
              "https://img.pokemondb.net/sprites/home/normal/2x/" +
              pokemon.name +
              ".jpg",
          };
        });
        this.getModel("pokemon").setProperty("/pokemonData", pokemonData);
      },
    });
  }
);
