const { tokenTypes } = require(__dirname + '/tokens.js')

function printToken(token, variables) {
	if (token.type === tokenTypes.variable) {
		if (!variables[tokens[0].name])
			console.error(`Unknown variable name : ${ tokens[0].name }`)
		else {
			let val = variables[token.name].value
			if (val === undefined || val === null)
				console.log('')
			else
				console.log(val.toString())
		}
	}
	else
		console.log(token.toString())
}

//Adding the value for the variables that are defined
function addVarsToVarTokens(tokens, variables) {
	tokens.forEach(token => {
		if (token.type === tokenTypes.variable && variables[token.name]) {
			token.value = variables[token.name].value
		}
	})
}

module.exports = {
	printToken,
	addVarsToVarTokens
}
