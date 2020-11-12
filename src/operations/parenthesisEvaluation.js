const { tokenTypes } = require(__dirname + '/../tokens.js')

/**
 * Evaluates the inner most set of parenthesis
 * Calls evaluateTokens recursively, sending only tokens inside the parenthesis and returing the result of the evaluation
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
	evaluate: ([pos, len], tokens, variables, evaluateTokens) => {
		if (len <= 2) {
			console.error("Can't evaluate empty parenthesis")
			return null
		}
		return evaluateTokens(tokens.slice(pos + 1, pos + len - 1), variables);
	}
}

module.exports = parenthesisEvaluation
