const { tokenTypes } = require(__dirname + '/../tokens.js')
const { printToken } = require(__dirname + '/../utils.js')

const printVariableValue = {
	pattern: tokens => {
		if (tokens.length === 3 && tokens[1].type === tokenTypes.equal && tokens[2].type === tokenTypes.questionMark)
			return [0, 3]
		return [-1, -1]
	},
	evaluate: ([_pos, _len], tokens, variables) => {
		printToken(tokens[0], variables)
		return null
	}
}

module.exports = printVariableValue
