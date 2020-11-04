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
const printOneVar = require(__dirname + '/operations/printOneVar')
const variableEvaluation = require(__dirname + '/operations/variableEvaluation.js')
const negativeEvaluation = require(__dirname + '/operations/negativeEvaluation.js')
const {
	numberAddition,
	numberSubstraction,
	numberMultiplication,
	numberDivision,
	numberModulo,
	numberPower
} = require(__dirname + '/operations/numberOperations.js')

/**
 * Here are defined operator precedence
 * First there MUST be "parsing" operations like function call / definition, matrixes parser...
 * Then we can put all classic operations, with classic operator precedence : * and / before + and - ...
 */
const operations = [
	variableEvaluation,
	negativeEvaluation,
	assignation,
	printOneVar,
	numberPower,
	numberMultiplication,
	numberDivision,
	numberModulo,
	numberAddition,
	numberSubstraction
]

function evaluateTokens(tokens, variables) {
	while (tokens.length > 0) {
		let foundOperation = operations.find(op => {
			let [pos, length] = op.pattern(tokens)
			if (pos === -1 || length == -1)
				return false
			let ret = op.evaluate(pos, tokens, variables)
			if (Array.isArray(ret))
				tokens.splice(pos, length, ...ret)
			else if (ret != null)
				tokens.splice(pos, length, ret)
			else
				tokens.splice(pos, length)
			return true
		})
		if (!foundOperation) {
			console.log(`Can't further evaluate tokens : ${tokens.map(t => t.toString()).join(' ')}`)
			return
		}
	}
}

module.exports = evaluateTokens
