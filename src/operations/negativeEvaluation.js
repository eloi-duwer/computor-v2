const { tokenTypes, NumberType } = require(__dirname + '/../tokens.js')

/**
 * negative numbers are parsed as two tokens: - and the number
 * If the - doesn't describe a substraction (if it is not preceded by an other number),
 * We must negate the number
 */
const negativeEvaluation = {
	pattern: tokens => {
		let i = 1;
		while (i < tokens.length) {
			if (tokens[i].type === tokenTypes.complexNumber
				&& tokens[i - 1].type === tokenTypes.minus
				&& (i === 1 || tokens[i - 2].type !== tokenTypes.complexNumber))
				return [i - 1, 2]
			i++;
		}
		return [-1, -1]
	},
	evaluate: ([pos, _len], tokens, _variables) => {
		return new NumberType(-tokens[pos + 1].real, -tokens[pos + 1].complex)
	}
}

module.exports = negativeEvaluation
