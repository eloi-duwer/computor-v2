const readline = require('readline')
const tokenize = require(__dirname + '/src/tokenizer.js')
const evaluateTokens = require(__dirname + '/src/evaluator.js')

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

let variables = {}

function readUserInput() {
	rl.question("> ", line => {
		
		tokens = tokenize(line);

		//console.log(tokens)

		evaluateTokens(tokens, variables)

		//console.log(variables)

		readUserInput()
	})
}

readUserInput()
