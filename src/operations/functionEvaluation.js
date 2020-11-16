const { tokenTypes, NumberType, VariableType } = require(__dirname + '/../tokens.js')

const { addComplex, multComplex, powComplex } = require(__dirname + '/numberOperations.js')

/**
 * Final part of parsing: We're looking for a sequence of numbers / matrixes and commas, between parenthesis
 */
function getFuncLength(tokens, pos) {
	if (pos + 2 > tokens.length) //not enough tokens for even a function with 0 parameters
		return [-1, -1]
	let len = 1
	if (tokens[pos + len].type !== tokenTypes.openParenthesis) //We were searching for an open parenthesis, that must be right after the function name
		return [-1, -1]
	if (tokens[pos + len + 1].type === tokenTypes.closeParenthesis) //Function with 0 parameters: f()
		return [pos, 3]
	len++
	while (pos + len < tokens.length) {
		if (tokens[pos + len].type !== tokenTypes.complexNumber && tokens[pos + len].type !== tokenTypes.matrix) //We were expecting a number or a matrix
			return [-1, -1]
		len++
		if (pos + len >= tokens.length)
			return [-1, -1]
		if (tokens[pos + len].type === tokenTypes.closeParenthesis) //Closing parenthesis, the function call is OK
			return [pos, len + 1]
		if (tokens[pos + len].type !== tokenTypes.comma) //We were expecting a comma, but none were found
			return [-1, -1]
		len++
	}
	return [-1, -1] 
}

const functionEvaluation = {
	pattern: (tokens) => {
		//console.log(tokens, variables)
		let i = 0;
		while (i < tokens.length) {
			if (tokens[i].type === tokenTypes.function
				|| tokens[i].type === tokenTypes.polynomial) {
				let ret = getFuncLength(tokens, i)
				if (ret[0] !== -1 && ret[1] !== -1)
					return ret
			}
			i++
		}
		return [-1, -1]
	},
	evaluate: ([pos, len], tokens, variables, evaluateTokens) => {
		if (tokens[pos].type === tokenTypes.function) {
			let vars = { ...variables }
			let nbArgs = 0
			if (len > 3) {
				let i = 2
				while (i < len) {
					if (!vars[tokens[pos].vars[nbArgs].name])
						vars[tokens[pos].vars[nbArgs].name] = new VariableType(tokens[pos].vars[nbArgs].name)
					vars[tokens[pos].vars[nbArgs].name].value = tokens[pos + i]
					nbArgs++
					i += 2
				}
			}
			if (nbArgs !== tokens[pos].vars.length) {
				console.error(`Wrong number of arguments passed to the function ${tokens[pos].name}: expected ${tokens[pos].vars.length}, got ${nbArgs}`)
				return null
			}
			return evaluateTokens([...tokens[pos].tokens], vars)
		}
		else {
			if (len !== 4) {
				console.error(`A polynomial function needs exactly one argument`)
				return null
			}
			if (tokens[pos + 2].type !== tokenTypes.complexNumber) {
				console.error(`The argument passed to a polynomial must be a number, got ${tokens[pos + 2].type}`)
				return null
			}
			let arg = tokens[pos + 2]
			return Object.keys(tokens[pos].monomes).reduce((acc, val) => {
				if (acc === null) //An operation returned an error previously
					return null
				let pow = powComplex(arg, new NumberType(+val, 0))
				if (pow === null)
					return null
				return addComplex(acc, multComplex(pow, tokens[pos].monomes[val]))
			}, new NumberType(0, 0))
		}
	}
}

module.exports = functionEvaluation
