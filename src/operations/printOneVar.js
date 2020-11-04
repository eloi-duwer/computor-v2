const { tokenTypes } = require(__dirname + '/../tokens.js')

/**
 * Used for printing the content of a variable or the result of an operation
 * Triggered when only one token is remaining, to print it
 */
const printOneVar = {
	pattern: tokens => {
		if (tokens.length === 1)
			return [0, 1]
		return [-1, -1]
	},
	evaluate: (_pos, tokens, variables) => {
		if (tokens[0].type === tokenTypes.variable) {
			if (!variables[tokens[0].name])
				console.error(`Unknown variable name : ${ tokens[0].name }`)
			else
				console.log(variables[tokens[0].name].toString())
		}
		else
			console.log(tokens[0].toString())
		return null
	}
}

module.exports = printOneVar
