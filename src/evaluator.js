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
 * First there MUST be "complex" types parsers, like function call / definition, matrixes parser...
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
