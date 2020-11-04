const readline = require('readline')
const tokenize = require(__dirname + '/src/tokenizer.js')
const evaluateTokens = require(__dirname + '/src/evaluator.js')
const { tokenTypes } = require(__dirname + '/src/tokens.js')

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

let variables = {}

function printLastToken(token, variables) {
	if (token.type === tokenTypes.variable) {
		if (!variables[tokens[0].name])
			console.error(`Unknown variable name : ${ tokens[0].name }`)
		else
			console.log(variables[token.name].toString())
	}
	else
		console.log(token.toString())
}

function readUserInput() {
	rl.question("> ", line => {
		
		if (line.startsWith('#'))
			return readUserInput()

		tokens = tokenize(line);

		//Comments starts with #

		let ret = evaluateTokens(tokens, variables)

		if (ret.length === 1)
			printLastToken(ret[0], variables)
		else if (ret.length > 1)
			console.log(`Can't further evaluate tokens : ${ret.map(t => t.toString()).join(' ')}`)

		readUserInput()
	})
}

readUserInput()
