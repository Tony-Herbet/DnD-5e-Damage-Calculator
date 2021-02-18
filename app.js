const app = Vue.createApp({
  data() {
    return {
      advantage: false,
      elvenAccuracy: false,
      perHitDmgMod: 0,
      criticalChance: 0.95,
      hitModifier: 0,
      dice: "",
      diceAvgDmg: 0,
    };
  },
  methods: {
    diceMath() {
      const diceTrim = this.dice.trim();
      const diceLowerCase = diceTrim.toLowerCase();
      const diceTypeSplit = diceLowerCase.split("+");
      const diceTypeValueSplit = diceTypeSplit.map((diceType) =>
        diceType.split("d")
      );
      const diceAvg = diceTypeValueSplit.map((diceTypes) => {
        const numberOfDice = diceTypes[0];
        const diceType = diceTypes[1];
        return numberOfDice * (diceType / 2 + 0.5);
      });
      const reducer = (accumulator, currentValue) => accumulator + currentValue;
      const diceAvgAddition = diceAvg.reduce(reducer);
      this.diceAvgDmg = diceAvgAddition;
    },
    toggleAdvantage() {
      this.advantage = !this.advantage;
    },
    toggleElvenAccuracy() {
      this.elvenAccuracy = !this.elvenAccuracy;
    },
    damageCalculation(AC) {
      const initialDmg =
        parseFloat(this.diceAvgDmg, 10) + parseFloat(this.perHitDmgMod, 10);

      const dmgPerHit =
        parseFloat(initialDmg, 10) * parseFloat(this.hitCalculation(AC), 10);

      const dmgAvg =
        parseFloat(dmgPerHit, 10) + parseFloat(this.critCalculation(), 10);

      return Math.round(dmgAvg);
    },
    hitCalculation(AC) {
      if (this.advantage === true && this.elvenAccuracy === true) {
        const hitPourcentage =
          1 - this.hitVsAc(AC) * this.hitVsAc(AC) * this.hitVsAc(AC);
        return hitPourcentage;
      } else if (this.advantage === true && this.elvenAccuracy === false) {
        const hitPourcentage = 1 - this.hitVsAc(AC) * this.hitVsAc(AC);
        return hitPourcentage;
      } else {
        const hitPourcentage = 1 - this.hitVsAc(AC);
        return hitPourcentage;
      }
    },
    hitVsAc(AC) {
      const hitChance = AC - (parseFloat(this.hitModifier, 10) + 1);
      if (hitChance <= 19 && hitChance >= 1) {
        const result = hitChance / 20;
        return result;
      } else if (hitChance < 1) {
        const result = 1 / 20;
        return result;
      } else {
        const result = 19 / 20;
        return result;
      }
    },
    critCalculation() {
      if (this.advantage === true && this.elvenAccuracy === true) {
        const critDmg =
          parseFloat(this.diceAvgDmg, 10) *
          (1 -
            parseFloat(this.criticalChance, 10) *
              parseFloat(this.criticalChance, 10) *
              parseFloat(this.criticalChance, 10));
        return critDmg;
      } else if (this.advantage === true && this.elvenAccuracy === false) {
        const critDmg =
          parseFloat(this.diceAvgDmg, 10) *
          (1 -
            parseFloat(this.criticalChance, 10) *
              parseFloat(this.criticalChance, 10));
        return critDmg;
      } else {
        const critDmg =
          parseFloat(this.diceAvgDmg, 10) *
          (1 - parseFloat(this.criticalChance, 10));
        return critDmg;
      }
    },
  },
});

app.mount("#app");
