/**
 * All operations MUST be an object with properties pattern and evaluate
 * pattern is a function that MUST return the position and number (in form of an array) of operations cunsumed by the operation (they must be near each other)
 * 		and it must return [-1, -1] if this operation is not applicable for this list of tokens
 * evaluate is called if pattern returned something else than [-1, -1], it must return a DataType (or class specialization),
 * 		that will replace the consumed tokens (1 + 2 evaluates to 3 for example)
 * 		evaluate can return null if no token needs to be created, or in case or an error
 * 
 * There are two categories of operations : "parsing" operations and "evaluation" operations
 * Parsing operations condenses tokens into more complex ones, eg function definition / call, matrix creation, replacement of variables by their values.
 * Evaluations make operations on the more complex tokens, like addition or substraction
 */
const assignation = require(__dirname + '/operations/assignation.js')
const variableEvaluation = require(__dirname + '/operations/variableEvaluation.js')
const negativeEvaluation = require(__dirname + '/operations/negativeEvaluation.js')
const matrixParser = require(__dirname + "/operations/matrixParsing")
const {
	numberAddition,
	numberSubstraction,
	numberMultiplication,
	numberDivision,
	numberModulo,
	numberPower
} = require(__dirname + '/operations/numberOperations.js')
const {
	matrixAddition,
	matrixSubstraction,
	matrixClassicMultiplication,
	matrixDivision,
	matrixMultiplication,
} = require(__dirname + '/operations/matrixOperations.js')
const { printVars, printFullVars } = require(__dirname + '/operations/printVariables.js')
const printVariableValue = require(__dirname + '/operations/printVariableValue.js')
const parenthesisEvaluation = require(__dirname + '/operations/parenthesisEvaluation.js')
const functionAssignation = require(__dirname + '/operations/functionAssignation.js')
const functionEvaluation = require(__dirname + '/operations/functionEvaluation.js')

/**
 * Here are defined operator precedence
 * First there are be "parsing" operations like function call / definition, matrixes parser...
 * Then we can put all classic operations, with classic operator precedence : * and / before + and - ...
 */
const operations = [
	printFullVars,
	printVars,
	printVariableValue,
	functionEvaluation,
	functionAssignation,
	variableEvaluation,
	negativeEvaluation,
	matrixParser,
	parenthesisEvaluation,
	assignation,
	numberPower,
	[matrixMultiplication, matrixClassicMultiplication, numberMultiplication, numberDivision, matrixDivision, numberModulo],
	[numberAddition, matrixAddition, numberSubstraction, matrixSubstraction]
]

function findOp(tokens, operations) {
	let pos = -1, length = -1, evalutateFunc = null;
	if (!Array.isArray(operations))
		operations = [operations]
	operations.forEach(op => {
		let [p, l] = op.pattern(tokens)
		if (pos === -1 || (p !== -1 && p < pos)) {
			pos = p;
			length = l
			evalutateFunc = op.evaluate
		}
	})
	return [pos, length, evalutateFunc]
}

function evaluateTokens(tokens, variables) {
	while (tokens.length > 0) {
		foundOperation = operations.find(op => {
			let [pos, length, evaluateFunc] = findOp(tokens, op)
			if (pos === -1 || length == -1)
				return false
			//console.log(`Found operation ${i}, ${pos}, ${length}`)
			//console.log(tokens)
			//console.log(variables)
			let ret = evaluateFunc([pos, length], tokens, variables, evaluateTokens)
			//console.log({ret})
			if (Array.isArray(ret))
				tokens.splice(pos, length, ...ret)
			else if (ret != null)
				tokens.splice(pos, length, ret)
			else
				tokens.splice(pos, length)
			return true
		})
		//The set of tokens can't be evaluated further
		if (!foundOperation)
			return tokens
	}
	//We consumed all tokens
	return tokens
}

module.exports = evaluateTokens
