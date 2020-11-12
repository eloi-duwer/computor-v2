const { tokenTypes, FunctionType } = require(__dirname + '/../tokens.js')

const variableEvaluation = require(__dirname + '/variableEvaluation.js')

function errorFuncAssign(msg, tokens) {
	console.error("Function declaration syntax is invalid: " + msg)
	console.error("Tokens: " + tokens.map(t => t.toString()).join(' '))
	return null
}

const functionAssignation = {
	pattern: tokens => {
		if (tokens.length <= 5
			|| tokens[0].type !== tokenTypes.variable
			|| tokens[1].type !== tokenTypes.openParenthesis)
			return [-1, -1]
		let indexFinPar = tokens.findIndex(t => t.type === tokenTypes.closeParenthesis)
		if (indexFinPar === -1 || indexFinPar === tokens.length - 1)
			return [-1, -1];
		if (tokens[indexFinPar + 1].type !== tokenTypes.equal)
			return [-1, -1]
		return [0, tokens.length]
	},
	evaluate: ([_pos, _len], tokens, variables) => {
		let name = tokens[0].name
		let vars = []
		let i = 2
		while (i < tokens.length && tokens[i].type !== tokenTypes.closeParenthesis) {
			if (tokens[i].type !== tokenTypes.variable)
				return errorFuncAssign(`Expected a variable at token n°${i + 1}`, tokens)
			vars.push(tokens[i])
			i++
			if (tokens[i].type === tokenTypes.closeParenthesis)
				continue
			if (tokens[i].type !== tokenTypes.comma)
				return errorFuncAssign(`Expected a comma at token n°${i + 1}`, tokens)
			i++
		}
		i++
		if (i >= tokens.length || tokens[i].type !== tokenTypes.equal)
			return errorFuncAssign(`Expected an equal at token n°${i + 1}`, tokens)
		let funcTokens = tokens.slice(i + 1)
		if (funcTokens.length === 0)
			return errorFuncAssign("Expected tokens after the equal", tokens)
		
		if (funcTokens.length === 0)
			return errorFuncAssign("Function definition tokens evaluated to nothing, there is likely an error above that caused this error", funcTokens)
		let ret = new FunctionType(name, vars, funcTokens)
		variables[name] = ret
		return ret
	}
}

module.exports = functionAssignation
