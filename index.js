const readline = require('readline')
const tokenize = require(__dirname + '/src/tokenizer.js')

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

function readUserInput() {
	rl.question("> ", line => {
		
		tokens = tokenize(line);

		console.log(tokens)

		readUserInput()
	})
}

readUserInput()
