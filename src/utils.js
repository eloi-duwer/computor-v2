const { tokenTypes } = require(__dirname + '/tokens.js')

function printToken(token, variables) {
	if (token.type === tokenTypes.variable) {
		if (!variables[tokens[0].name])
			console.error(`Unknown variable name : ${ tokens[0].name }`)
		else
			console.log(variables[token.name].toString())
	}
	else
		console.log(token.toString())
}

module.exports = {
	printToken
}
