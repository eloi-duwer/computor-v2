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


const { tokenTypes } = require(__dirname + '/tokens.js')
/**
 * Evaluates the inner most set of parenthesis
 * Calls evaluateTokens recursively, sending only tokens inside the parenthesis and returing the result of the evaluation
 * Not in a separate file because it would cause circular dependency, and I didn't manage to deal with it...
 */
const parenthesisEvaluation = {
	pattern: tokens => {
		let openParIndex = -1
		let i = 0;
		while (i < tokens.length) {
			if (tokens[i].type === tokenTypes.openParenthesis)
				openParIndex = i
			else if (openParIndex >= 0 && tokens[i].type === tokenTypes.closeParenthesis)
				return [openParIndex, i - openParIndex + 1]
			i++
		}
		return [-1, -1]
	},
	evaluate: ([pos, len], tokens, variables) => {
		if (len <= 2) {
			console.error("Can't evaluate empty parenthesis")
			return null
		}
		return evaluateTokens(tokens.slice(pos + 1, pos + len - 1), variables);
	}
}

/**
 * Here are defined operator precedence
 * First there MUST be "parsing" operations like function call / definition, matrixes parser...
 * Then we can put all classic operations, with classic operator precedence : * and / before + and - ...
 */
//TODO: Some operations MUST have the same operator precedence, like + and - : 1 - 5 + 7 : if - is evaluated before : result is 3, if + before : -11
// - and + MUST have the same precedence, * / % too
const operations = [
	printFullVars,
	printVars,
	parenthesisEvaluation,
	variableEvaluation,
	negativeEvaluation,
	matrixParser,
	assignation,
	numberPower,
	matrixMultiplication,
	numberMultiplication,
	matrixClassicMultiplication,
	numberDivision,
	matrixDivision,
	numberModulo,
	numberAddition,
	matrixAddition,
	numberSubstraction,
	matrixSubstraction
]

/**
 * TODO Possible optimization: Once a given operation returns [-1, 1], it MIGHT (i'm not sure) be impossible for it to not return [-1, -1],
 * meaning that we might not have to check the pattern again
 */
function evaluateTokens(tokens, variables) {
	while (tokens.length > 0) {
		let foundOperation = operations.find(op => {
			let [pos, length] = op.pattern(tokens)
			if (pos === -1 || length == -1)
				return false
			let ret = op.evaluate([pos, length], tokens, variables)
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
