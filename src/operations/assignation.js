const { tokenTypes } = require(__dirname + '/../tokens.js')

// Assignation of something (number, matrix or other variable) to a variable
const variableAssignation = {
	pattern: tokens => {
		if (tokens.length === 3
			&& tokens[0].type === tokenTypes.variable
			&& tokens[1].type === tokenTypes.equal
			&& (tokens[2].type === tokenTypes.complexNumber
				|| tokens[2].type === tokenTypes.matrix
				|| tokens[2].type === tokenTypes.variable))
			return [0, 3]
		return [-1, -1]
	},
	evaluate: (_posLen, tokens, variables) => {
		if (!variables[tokens[0].name])
			variables[tokens[0].name] = tokens[0]
		if (tokens[2].type === tokenTypes.variable) {
			variables[tokens[0].name].value = tokens[2].value !== null ? tokens[2].value : null
		}
		else
			variables[tokens[0].name].value = tokens[2]
		return variables[tokens[0].name]
	}
}

module.exports = variableAssignation
