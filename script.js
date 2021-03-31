'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};
const account5 = {
  owner: 'Geury Roustand',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const accounts = [account1, account2, account3, account4, account5];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// display movements in the DOM
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = ' ';

  // se hace una copia de los movimentos con slice , si sort es verdadero
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value"> ${mov}€ </div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// displayMovements(account1.movements);

// console.log(displayMovements(account1.movements));

//display balence in the DOM html en el total
const calcDisplayBalance = function (acc) {
  acc.balence = acc.movements.reduce((acc, cur) => acc + cur, 0);
  // acc.balence = acc.movements;

  labelBalance.textContent = ` ${acc.balence}€`;
};

// calcDisplayBalance(account1.movements);

const calcDisplaySummery = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${incomes}€`;

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = `${Math.abs(outcomes)}€`;

  const interest = acc.movements
    .filter(deposits => deposits > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = ` ${interest}€`;
};

// calcDisplaySummery(account1.movements);

// compute the users

const createUserNames = function (accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUserNames(accounts);
// console.log(accounts);

// UpgradeUI
const upgradeUI = acc => {
  //Display Movements
  displayMovements(acc.movements);

  // Display Balence
  calcDisplayBalance(acc);

  // Display Summery
  calcDisplaySummery(acc);
};

// event handler

let currentAccount;

btnLogin.addEventListener('click', e => {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  // console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // console.log('loging');

    // Display UI and Welcome Messege
    labelWelcome.textContent = `Welcome Back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 100;

    // Clear the input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    // inputLoginUsername = '';
    // inputLoginPin = '';

    inputLoginPin.blur();

    // upgrade UI
    upgradeUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', e => {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(amount, receiverAcc);
  // Limpiar los input
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balence >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer

    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // console.log('Transfer valid');
    // upgrade UI
    upgradeUI(currentAccount);
  }
});

btnLoan.addEventListener('click', e => {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);

    // Upgrade UI
    upgradeUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', e => {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    // console.log(index);
    //  Delate account
    accounts.splice(index, 1);

    // hide UI
    containerApp.style.opacity = 0;

    labelWelcome.textContent = '';
  }
});

let sorted = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  // esto hace que la funcion cambie cade vez que se da click de verdaro a falso de falso a verdadero
  sorted = !sorted;
});

// // // // // // // // // // // // // // // // //
//               Coding Challenge #4
// // // // // // // // // // // // // // // // //

// Julia and Kate are still studying dogs, and this time they are studying if dogs are
// eating too much or too little.
// Eating too much means the dog's current food portion is larger than the
// recommended portion, and eating too little is the opposite.
// Eating an okay amount means the dog's current food portion is within a range 10%
// above and 10% below the recommended portion (see hint).
// Your tasks:

// 1. Loop over the 'dogs' array containing dog objects, and for each dog, calculate
// the recommended food portion and add it to the object as a new property. Do
// not create a new array, simply loop over the array. Forumla:
// recommendedFood = weight ** 0.75 * 28. (The result is in grams of
// food, and the weight needs to be in kg)

// 2. Find Sarah's dog and log to the console whether it's eating too much or too
// little. Hint: Some dogs have multiple owners, so you first need to find Sarah in
// the owners array, and so this one is a bit tricky (on purpose) �

//3. Create an array containing all owners of dogs who eat too much
// ('ownersEatTooMuch') and an array with all owners of dogs who eat too little
// ('ownersEatTooLittle').

// 4. Log a string to the console for each array created in 3., like this: "Matilda and
// Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat
// too little!"

// 5. Log to the console whether there is any dog eating exactly the amount of food
// that is recommended (just true or false)
// 6. Log to the console whether there is any dog eating an okay amount of food
// (just true or false)

// 7. Create an array containing the dogs that are eating an okay amount of food (try
// to reuse the condition used in 6.)

// 8. Create a shallow copy of the 'dogs' array and sort it by recommended food
// portion in an ascending order (keep in mind that the portions are inside the
// array's objects

// Hints:
// § Use many different tools to solve these challenges, you can use the summary
// lecture to choose between them �
// § Being within a range 10% above and below the recommended portion means:
// current > (recommended * 0.90) && current < (recommended *
// 1.10). Basically, the current portion should be between 90% and 110% of the
// recommended portion

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

dogs.forEach(dog => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));

// console.log(dog);

const sarahDog = dogs.find(dog => dog.owners.includes('Sarah'));

console.log(
  `Sarah dog is eating too ${
    sarahDog.recFood > sarahDog.curFood ? 'much' : 'little'
  }`
);

const ownersEatTooMuch = dogs
  .filter(dog => dog.recFood < dog.curFood)
  .map(dog => dog.owners)
  .flat(2);

const ownersEatTooLittle = dogs
  .filter(dog => dog.recFood > dog.curFood)
  .map(dog => dog.owners)
  .flat(2);

console.log(` ${ownersEatTooMuch.join(' ')}'s dogs eat too much!

`);
console.log(` ${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);

console.log(dogs.some(dog => dog.recFood == dog.curFood));

const checkEatingOK = dog =>
  dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1;

console.log(dogs.some(checkEatingOK));

// 7.
console.log(dogs.filter(checkEatingOK));

// 8.

const dogsSorted = [...dogs].sort((a, b) => a.recFood - b.recFood);

console.log(dogsSorted);

/*


// // // // // // // // // // // // // // // // //
//               METODO SORT
// // // // // // // // // // // // // // // // //

const arrr = [1, 2, 3, 4, 5, 6, 7, 8];
const x = new Array(7);

x.fill(1);
console.log(x);

arrr.fill(23, 2, 6);
console.log(arrr);

// // // // // // // // // // // // // // // // //
//               METODO ARRAY.FROM
// // // // // // // // // // // // // // // // //

const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 100 }, (acur, index) => index + 1);
console.log(z);



// // // // // // // // // // // // // // // // //
//               METODO SORT
// // // // // // // // // // // // // // // // //

// ordena los elementos de un arreglo  localmente y devuelve el arreglo ordenado. mutua el arreglo origna
// para ordenar numeros se necesita tener una funcion con dos parametros
// with String

const owners = ['Geury', 'Manuel', 'Luis', 'Jose', 'Adam', 'Maria'];

console.log(owners.sort());

// con numero

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements);
console.log(movements.sort());

// return < 0  si se retorna algo menos que 0 A, es primero B , keep order
// return > 0  si se retorna algo mayor que 0 B es primero que A ,  Switch order

// Ascending
movements.sort((a, b) => {
  // console.log(a);

  if (a > b) return 1; // este numero no importa siempre que sea mayor a cero
  if (b > a) return -1; // este numero debe de ser negativo siempre
});

console.log(movements);

// movements.sort((a, b) => a - b);

// Descending
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (a > b) return -1;
// });

// movements.sort((a, b) => b - a);
// console.log(movements);



// // // // // // // // // // // // // // // // //
//               METODO FLATMAP
// // // // // // // // // // // // // // // // //

// El método flatMap() primero mapea cada elemento usando una función de mapeo,
// luego aplana el resultado en una nueva matriz.  es una combinacion de los metodos map and flat

const accountMovementsFlatMap = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);

console.log(accountMovementsFlatMap);


// // // // // // // // // // // // // // // // //
//               METODO FLAT
// // // // // // // // // // // // // // // // //
// El método flat() crea una nueva matriz con todos los elementos de sub-array concatenados
// recursivamente hasta la profundidad especificada.

const arr = [1, 2, [3, 4], [5, 6], [7, 8]];
const arrDeep = [
  [[1], 2],
  [3, 4],
  [5, 6],
  [[7], 8],
];
console.log(arr);
console.log(arr.flat());
console.log(arrDeep.flat(2));

const accountMovements = accounts.map(acc => acc.movements);

console.log(accountMovements);

const allMovements = accountMovements.flat();
console.log(allMovements);

const overalBalence = allMovements.reduce((acc, mov) => acc + mov, 0);

console.log(overalBalence);

// con encandenamiento de metodos
const accountMovements2 = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);

console.log(accountMovements2);



// // // // // // // // // // // // // // // // //
//               METODO EVERY
// // // // // // // // // // // // // // // // //

// Determina si todos los elementos en el array satisfacen una condición.

// Precaución: ¡Llamar este método en un array vacío devuelve true para cualquier condición!

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));

//  SEPARATE CALLBACK

const deposit = mov => mov > 0;

console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));




// // // // // // // // // // // // // // // // //
//               METODO INCLUD
// // // // // // // // // // // // // // // // //

// El método includes() determina si un arreglo incluye un determinado elemento, devuelve true o false según corresponda.


// // // // // // // // // // // // // // // // //
//               METODO SOME
// // // // // // // // // // // // // // // // //
// El método some() comprueba si al menos un elemento del array cumple con la condición
//  implementada por la función proporcionada. devuelve true o false


// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// Igualda al valor pasado 
console.log(movements.includes(-130));

// condicion 
const anyDeposits = movements.some(mov => mov > 0);

console.log(anyDeposits);


// // // // // // // // // // // // // // // // //
//               METODO FIND
// // // // // // // // // // // // // // // // //

// El método find() devuelve el valor del primer elemento del array que cumple la función de prueba proporcionada.

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const firstWithDrawal = movements.find(mov => mov < 0);
console.log(firstWithDrawal);

console.log(accounts);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');

console.log(account);

const addM = [];

for (const account of accounts) {
  if (account.owner === 'Jessica Davis') {
    addM.push(account);
    // console.log(`Welcome ${account}`);
  }
  // const add = account.owner.filter(acc => acc === 'Jessica Davis');
  // console.log(account.owner.filter(acc => acc === 'Jessica Davis'));
}

console.log(addM);


// // // // // // // // // // // // // // // // ////////////////
//               Coding Challenge #3
// // // // // // // // // // // // // // // // ///////////////

// Rewrite the 'calcAverageHumanAge' function from Challenge #2, but this time
// as an arrow function, and using chaining!
// Test data:
// § Data 1: [5, 2, 4, 1, 15, 8, 3]
// § Data 2: [16, 6, 10, 5, 6, 1, 4]

const calcAverageHumanAge2 = ages =>
  ages
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

const avg10 = calcAverageHumanAge2([5, 2, 4, 1, 15, 8, 3]);
const avg11 = calcAverageHumanAge2([16, 6, 10, 5, 6, 1, 4]);

console.log(avg10, avg11);




// // // // // // // // // // // // // // // // ////////////////
//               The Magic of Chaining Methods
// // // // // // // // // // // // // // // // ////////////////
const eurToUsd = 1.1;

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  .map(mov => mov * eurToUsd)
  .reduce((total, cur) => total + cur, 0);
console.log(totalDepositsUSD);




// // // // // // // // // // // // // // // // //
//               Coding Challenge #2
// // // // // // // // // // // // // // // // //

// Let's go back to Julia and Kate's study about dogs. This time, they want to convert
// dog ages to human ages and calculate the average age of the dogs in their study.
// Your tasks:
// Create a function 'calcAverageHumanAge', which accepts an arrays of dog's
// ages ('ages'), and does the following things in order:
// 1. Calculate the dog age in human years using the following formula: if the dog is
// <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old,
// humanAge = 16 + dogAge * 4
// 2. Exclude all dogs that are less than 18 human years old (which is the same as
// keeping dogs that are at least 18 years old)
// 3. Calculate the average human age of all adult dogs (you should already know
// from other challenges how we calculate averages �)
// 4. Run the function for both test datasets
// Test data:
// § Data 1: [5, 2, 4, 1, 15, 8, 3]
// § Data 2: [16, 6, 10, 5, 6, 1, 4]

const dogEges1 = [5, 2, 4, 1, 15, 8, 3];
const dogEges2 = [16, 6, 10, 5, 6, 1, 4];

const calcAverageHumanAge = function (ages) {
  const humanAges = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));

  const adults = humanAges.filter(age => age >= 18);

  const average = adults.reduce((acc, age) => acc + age, 0) / adults.length;
  return average;
};

const avg1 = calcAverageHumanAge(dogEges1);

console.log(avg1);

const avg2 = calcAverageHumanAge(dogEges2);
console.log(avg2);



// // // // // // // // // // // // // // // // //
//               METODO REDUCE
// // // // // // // // // // // // // // // // //

// devuelve el total , recibe 4 parametros  hay que ponerle el valor inicial

//    Acumulador (acc)  El acumulador acumula el valor devuelto por la función callback. Es el valor acumulado devuelto en la última invocación de callback, o el valorInicial
//    Valor Actual (cur) El elemento actual que está siendo procesado en el array
//    Índice Actual (idx)
//    Array (src)

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

console.log(movements);
const balence = movements.reduce((acc, cur, idx, src) => {
  console.log(` Interation ${idx} : ${acc} : ${cur}`);
  return acc + cur;
}, 0);

console.log(balence);

// El mismo ejemplo con for

let balence2 = 0;

for (const mov of movements) {
  balence2 += mov;
}

console.log(balence2);



// // // // // // // // // // // // // // // // //
//               METODO FILTER
// // // // // // // // // // // // // // // // //


// Filter metodo crea un nuevo arreglo con los elementos filtrado

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const deposits = movements.filter(mov => {
  return mov > 0;
});

console.log(deposits);

// ejemplo de filtar valor con el for

const depositFor = [];

for (const mov of movements) {
  if (mov > 0) {
    depositFor.push(mov);
  }
}

console.log(depositFor);

const withdrawals = movements.filter(mov => mov < 0);

console.log(withdrawals);



// ejemplo agreando el username al objecto y asignandole el nombre
account1.username = account1.owner;
console.log(account1);

// // // // // // // // // // // // // // // // //
//                    METODO MAP
// // // // // // // // // // // // // // // // //

// ejemplo con el metodo map

const user = 'Steven Thomas Williams';
const username = user
  .toLowerCase()
  .split(' ')
  .map(name => name[0])
  .join('');

console.log(username);

// metodo map crea un nuevo arreglo

const eurToUsd = 1.1;
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const movementsUSD = movements.map(mov => {
//   return mov * eurToUsd;
// });

// map con funcion de flecha

const movementsUSD = movements.map(mov => mov * eurToUsd);

console.log(movementsUSD);
console.log(movements);

// el mismo prceso pero con el medoto for of
const movementsUSDFor = [];

for (const movement of movements) {
  movementsUSDFor.push(movement * eurToUsd);
}

console.log(movementsUSDFor);

// con el operador ternario

const movementsDescription = movements.map(
  (mov, i) =>
    `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'}  ${Math.abs(
      mov
    )}`
);

// const movementsDescription = movements.map((mov, i) => {
//   if (mov > 0) {
//     return `Movement ${i + 1}: You deposited ${Math.abs(mov)}`;
//   } else {
//     return `Movement ${i + 1}: You withdrew ${Math.abs(mov)}`;
//   }
// });

console.log(movementsDescription);

// // // // // // // // // // // // // // // // //
// FINAL LECION DEL METODO MAP
// // // // // // // // // // // // // // // // //


// // // // // // // // // // // // // // // // //////////////////////////////////
//               Coding Challenge #1 Working With Arrays
// // // // // // // // // // // // // // // // //////////////////////////////////


// Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners
// about their dog's age, and stored the data into an array (one array for each). For
// now, they are just interested in knowing whether a dog is an adult or a puppy.
// A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years
// old.
// Your tasks:
// Create a function 'checkDogs', which accepts 2 arrays of dog's ages
// ('dogsJulia' and 'dogsKate'), and does the following things:
// 1. Julia found out that the owners of the first and the last two dogs actually have
// cats, not dogs! So create a shallow copy of Julia's array, and remove the cat
// ages from that copied array (because it's a bad practice to mutate function
// parameters)
// 2. Create an array with both Julia's (corrected) and Kate's data
// 3. For each remaining dog, log to the console whether it's an adult ("Dog number 1
// is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy
// ")
// 4. Run the function for both test datasets
// Test data:
// § Data 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
// § Data 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]
// Hints: Use tools from all lectures in this section so far �

const juliadata = [3, 5, 2, 12, 7];
const katedata = [4, 1, 15, 8, 3];

// slice devuelve los elementos cortado se le pone el inicio hasta donde se quiere cortar

function checkDogs(dogsJulia, dogsKate) {
  // primera manera para cortar los elementos del arreglo
  // const dogSlice = dogsJulia.slice(1, 3);
  // console.log(dogSlice);

  const dogsJuliaCorrect = dogsJulia.slice();

  dogsJuliaCorrect.splice(0, 1);
  dogsJuliaCorrect.splice(-2);

  const finalJuliaCorrect = [...dogsJuliaCorrect, ...dogsKate];
  console.log(finalJuliaCorrect);
  // secunda opcion para unir dos arreglos
  // const dogs = dogsJuliaCorrect.concat(dogsKate);
  // console.log(dogs);

  finalJuliaCorrect.forEach((dog, i) => {
    if (dog >= 3) {
      console.log(`Dog number ${i + 1} is an adult, and is ${dog} years old `);
    } else {
      console.log(`Dog number ${i + 1} is still a puppy `);
    }
  });
}

checkDogs(juliadata, katedata);



/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////


// // // // // // // // // // // // // // // // //
//               METODO SLICE
// // // // // // // // // // // // // // // // //

let arr = ['a', 'b', 'c', 'd', 'e'];

console.log(arr, ' arreglo completo');
// el metodo slice devuelve los elementos  cortado
console.log(arr.slice(1));

console.log(arr);
// console.log(arr.slice(2, 4));

// cuando se usa con valor negativo empieza a cortar desde la ultima cadena y devuelve los elemento sefun especificado
console.log(arr.slice(-1));
console.log(arr.slice(-2));

// aqui empieza a cortar desde la posicion numero 0 y la dos ultima posiciones

console.log(arr.slice(1, -2));

// para hacer una copia del arreglo

console.log(arr.slice());
console.log([...arr]);

// const nombre = 'Geury Roustand';

// const nombreCortado = nombre.slice(1);

// console.log(nombreCortado);

// Splice


// // // // // // // // // // // // // // // // //
//               METODO SPLICE
// // // // // // // // // // // // // // // // //

console.log('Splice');
// console.log(arr.splice(1));
arr.splice(-1);
console.log(arr);

arr.splice(1, 2);
console.log(arr);

// console.log(arr.splice(-1));

// reverse

// // // // // // // // // // // // // // // // //
//               METODO REVERSE
// // // // // // // // // // // // // // // // //

console.log('reverse');
arr = ['a', 'b', 'c', 'd', 'e'];

const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());

// contat

// // // // // // // // // // // // // // // // //
//               METODO CONCAT 
// // // // // // // // // // // // // // // // //

console.log('contat');

const letters = arr.concat(arr2);

console.log(letters);

const letra = [...arr, ...arr2];
console.log(letra);

// Join

// // // // // // // // // // // // // // // // //
//               METODO JOIN
// // // // // // // // // // // // // // // // //

console.log(letters.join(' -'));

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const movement of movements) {
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: You deposited ${Math.abs(movement)}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
  }
}


// // // // // // // // // // // // // // // // //
//               METODO FOREACH
// // // // // // // // // // // // // // // // //

console.log('FOREACH');
movements.forEach((movement, index, arreglo) => {
  if (movement > 0) {
    console.log(`Movement ${index + 1}: You deposited ${Math.abs(movement)} `);
  } else {
    console.log(`Movement ${index + 1}: You withdrew ${Math.abs(movement)}`);
  }
});

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach((value, key) => {
  console.log(` ${key}: ${value}`);
});

const currenciesUni = new Set(['USD', 'EUR', 'GBP', 'USD']);
currenciesUni.forEach((value, _) => {
  console.log(` ${value}: ${value}`);
});




*/
