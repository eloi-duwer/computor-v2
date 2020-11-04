const { tokenTypes } = require(__dirname + '/../tokens.js')

/**
 * Used to replace a variable type by it's content
 * should NOT be triggered when it is an assignation, eg a = 2
 * It is assumed that it is not an assignation when the second token is not an equal
 */
const variableEvaluation = {
	pattern: tokens => {
		let i = 0
		while(i < tokens.length) {
			if ((i !== 0 || (tokens.length >= 2 && tokens[1].type !== tokenTypes.equal)) && tokens[i].type === tokenTypes.variable)
				return [i, 1]
			i++;
		}
		return [-1, -1]
	},
	evaluate: (pos, tokens, variables) => {
		let variable = variables[tokens[pos].name];
		if (!variable) {
			console.log(`Variable ${tokens[pos].name} doesn't exist`)
			return null;
		}
		return variable.value
	}
}

module.exports = variableEvaluation
