// Матрица коэффициентов ti
const matrixOfKoefs = [
  [-0.57735, 0.57735],
  [-0.707107, 0, 0.707107],
  [-0.794654, -0.187592, 0.187592, 0.794654],
  [-0.832498, -0.374541, 0, 0.374541, 0.832498],
  [-0.866247, -0.422519, -0.266635, 0.266635, 0.422519, 0.866247],
  [-0.883862, -0.529657, -0.323912, 0, 0.323912, 0.529657, 0.883862],
];
// Максимальное кол-во узлов разбиения (7)
const NODES = 6;

const integralFunc = (x) => {
  return x * Math.log(x);
  //return 1 / Math.sqrt(1 + x * x);
};

// поиск решения интеграла по квадратурной формуле Чебышева
const quadratureFormula = (a, b) => {
  let xValue, funcValue, sum, koefsOfNode, integralValue;
  let result = [];

  for (let node = 0; node < NODES; node++) {
    sum = 0;
    koefsOfNode = matrixOfKoefs[node]; // коэффициенты матрицы для текущего узла

    // считаем сумму значений функции для текущего узла по формуле Чебышева
    koefsOfNode.forEach((koef) => {
      xValue = (b + a) / 2 + ((b - a) / 2) * koef;
      funcValue = integralFunc(xValue);

      sum += funcValue;
    });

    integralValue = ((b - a) / (node + 2)) * sum; // вычисляем интеграл для текущего узла

    result.push(integralValue);
  }

  return result;
};

// поиск решения интеграла по формуле трапеций
const trapezeFormula = (a, b) => {
  let h, sum, funcValue;
  let result = [];

  for (let node = 0; node < NODES; node++) {
    sum = 0;
    h = (b - a) / (node + 2); // вычисление шага
    funcValue = integralFunc(a) / 2;
    sum += funcValue;

    for (let i = a + h; i < b - 2 * Number.EPSILON; i = i + h) {
      funcValue = integralFunc(i);
      sum += funcValue;
    }

    funcValue = integralFunc(b) / 2;
    sum += funcValue;

    result.push(sum * h); // вычисление значения интеграла
  }

  return result;
};

// проверка на существование таблицы и ее удаление
const checkHavingSolution = () => {
  const solutionTable = document.querySelector(".solution table");
  if (solutionTable) solutionTable.remove();
};

// вывод результатов в таблицу
const showTableWithResults = (
  quadratureFormulaResult,
  trapezeFormulaResult
) => {
  checkHavingSolution();

  let table = document.createElement("table");
  table.insertAdjacentHTML(
    "afterbegin",
    "<tr><th>Кол-во узлов разбиения</th><th>Значение интеграла по формуле Чебышева</th><th>Значение интеграла по формуле трапеций</th>"
  );

  for (let node = 0; node < NODES; node++) {
    table.insertAdjacentHTML(
      "beforeend",
      `<tr><td>${node + 2}</td>
		<td>${quadratureFormulaResult[node].toFixed(7)}</td>
		<td>${trapezeFormulaResult[node].toFixed(7)}</td>`
    );
  }

  document.querySelector(".solution").prepend(table);
};

// главная функция поиска решения интеграла
const solveIntegral = () => {
  const b = Number(document.querySelector(".integral__limit--top").value);
  const a = Number(document.querySelector(".integral__limit--bottom").value);

  const arrayOfIntegralsChebyshev = quadratureFormula(a, b);
  const arrayOfIntegralsTrapeze = trapezeFormula(a, b);

  showTableWithResults(arrayOfIntegralsChebyshev, arrayOfIntegralsTrapeze);
};

// вызов функции решения интеграла при клике на кнопку
document
  .querySelector(".integral__button")
  .addEventListener("click", function () {
    solveIntegral();
  });
