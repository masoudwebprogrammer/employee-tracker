// This object holds the validation properties for the prompts that accept a Number as a response. They will be spread over their respective objects using ...
const reqNumberInputValidation = {
  validate: (input) => {
    if (!input) {
      console.log(`
!!!!! Please enter a number !!!!!`);
      return false;
    } else {
      return true;
    }
  },
  filter: (input) => {
    if (Number.isNaN(input) || Number(input) <= 0) {
      // this clears the NaN from the input area.
      return "";
    } else {
      return Number(input);
    }
  },
};

// This object holds the validation properties for prompts that accept a number or null
// It will set any invalid input to null by default
const optNumberInputValidation = {
  filter: (number) => {
    valid = /^[0-9]*$/.test(number);
    if (valid) {
      return number;
    } else {
      number = null;
      return number;
    }
  },
};

const emailInputValidation = {
  validate: function (email) {
    // Might consider increasing the domain range, but this accommodates the most common email domains
    valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);

    if (valid) {
      return true;
    } else {
      console.log(`
    !!!!! Please enter a valid email !!!!!`);
      return false;
    }
  },
};

module.exports = {
  reqNumberInputValidation,
  emailInputValidation,
  optNumberInputValidation,
};
