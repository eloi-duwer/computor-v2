const readline = require('readline');
const tokenize = require(__dirname + '/src/tokenizer.js')
const evaluateTokens = require(__dirname + '/src/evaluator.js')
const { printToken, addVarsToVarTokens } = require(__dirname + '/src/utils');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

let variables = {}

function readUserInput() {
	rl.question("> ", line => {
		
		//Comments starts with #
		if (line.startsWith('#'))
			return readUserInput()
		//To stop reading lines
		else if (line === "quit") {
			rl.close()
			return;
		}
		tokens = tokenize(line);
		addVarsToVarTokens(tokens, variables)
		let ret = evaluateTokens(tokens, variables)
		if (ret.length === 1)
			printToken(ret[0], variables)
		else if (ret.length > 1)
			console.log(`Can't further evaluate tokens : ${ret.map(t => t.toString()).join(' ')}`)
		return readUserInput()
	})
}

readUserInput()
