sap.ui.define(["sap/ui/core/Control"], function (Control) {
    "use strict";
  
    return Control.extend("com.pokemon.ux.pokemongame.custom.CTimer", {
      metadata: {
        properties: {
          header:{ type: "string", defaultValue:"Pokemon Card Game"},
          description:{ type:"string", defaultValue: "Match the same Pokémon and complete the game!"},
          title: { type: "string", bindable: true, defaultValue: "Time:" },
          hours: { type: "int", bindable: true, defaultValue: 0 },
          minutes: { type: "int", bindable: true, defaultValue: 0 },
          seconds: { type: "int", bindable: true, defaultValue: 0 },
          _started: { type: "boolean", bindable: false, defaultValue: true },
          difficulty: { type: "string", bindable: true },
        },
        aggregations: {
          _playButton: {
            type: "sap.m.Button",
            multiple: false,
          },
          _restartButton: {
            type: "sap.m.Button",
            multiple: false,
          },
        },
        events: {
          pauseGame: {},
          resumeGame: {},
          restartGame: {},
        },
      },
      init: function () {
        const sLibraryPath = jQuery.sap.getModulePath("com.pokemon.ux.pokemongame");
        jQuery.sap.includeStyleSheet(sLibraryPath + "/custom/CTimer.css");
    
        var oPB = new sap.m.Button({
            icon: "sap-icon://media-pause",
            type: "Reject",
            press: this.toggleTimer.bind(this),
            tooltip: "Start/Stop",
        });
        this.setAggregation("_playButton", oPB);
    
        var oRB = new sap.m.Button({
            icon: "sap-icon://restart",
            type: "Default",
            press: this.restartGame.bind(this), 
            tooltip: "Restart",
        });
        this.setAggregation("_restartButton", oRB);
    },
    

      toggleTimer: function (oEvent) {
        var bStarted = this.getProperty("_started");
        var oPB = this.getAggregation("_playButton");

        this.setProperty("_started", !bStarted);

   
        oPB.setIcon(bStarted ? "sap-icon://media-play" : "sap-icon://media-pause");
        oPB.setType(bStarted ? "Accept" : "Reject");

        if (!bStarted) {
          this.startTimer();
          // oRB.setEnabled(true);
          this.fireResumeGame();
        } else {
          this.stopTimer();
          // oRB.setEnabled(false);
          this.firePauseGame();
        }
      },
  
      startTimer: function () {
        var h = this.getHours();
        var m = this.getMinutes();
        var s = this.getSeconds();
  
        if (!this._timerInterval) {
          this._timerInterval = setInterval(function () {
            s++;
            if (s === 60) { m++; s = 0; }
            if (m === 60) { h++; m = 0; }
            
            this.setHours(h);
            this.setMinutes(m);
            this.setSeconds(s);
          }.bind(this), 1000);
        }
      },
  
      stopTimer: function () {
        if (this._timerInterval) {
          clearInterval(this._timerInterval);
          this._timerInterval = null;
        }
      },
      
      restartGame: function () {
        this.stopTimer(); 
        this.setHours(0); 
        this.setMinutes(0); 
        this.setSeconds(0);
        this.setProperty("_started", false); 
        this.fireRestartGame();
  
       
    },

  
      renderer: function (oRM, oControl) {
        var oPB = oControl.getAggregation("_playButton");
        var oRB = oControl.getAggregation("_restartButton");

        oRM.openStart("div", oControl)
        .class("timer-container")
        .openEnd();


        oRM.openStart("div", oControl.getId() + "-header")
            .class("timer-header")
            .openEnd();

        oRM.openStart("div")
            .class("title-container") 
            .openEnd();

        // oRM.openStart("img")
        //     .attr("src", "../images/icons8-pikachu-48.png") 
        //     .class("timer-image")
        //     .close(); 

        // Başlık 
        oRM.openStart("h2")
            .class("timer-title")
            .openEnd()
            .text(oControl.getHeader())
            .close("h2");
        oRM.close("div"); 
        
        // Açıklama
        oRM.openStart("p")
            .class("timer-description")
            .openEnd()
            .text(oControl.getDescription())
            .close("p");

        oRM.close("div");

        oRM.openStart("div", oControl);
        oRM.class("smod-timer");
        oRM.openEnd();
  
        // oRM.openStart("div", oControl).class("smod-timer-title").openEnd();
        // oRM.text(oControl.getTitle());
        // oRM.close("div");

        oRM.openStart("div", oControl).class("smod-timer-content-digits").openEnd();
        var sTimer =
          oControl.pad2Digits(oControl.getHours()) +
          ":" + oControl.pad2Digits(oControl.getMinutes()) +
          ":" + oControl.pad2Digits(oControl.getSeconds());
        oRM.text(sTimer);
        oRM.close("div");
  
        oRM.openStart("div", oControl).class("smod-timer-content").openEnd();
  
  
        oRM.openStart("div", oControl).class("smod-timer-content-buttons").openEnd();
        oRM.renderControl(oPB);
        oRM.renderControl(oRB); 
        oRM.close("div");
  
        oRM.close("div");
        oRM.close("div");
        oRM.close("div");
      },
  
      pad2Digits: function (n) {
        return n.toString().padStart(2, "0");
      },
    });
});
