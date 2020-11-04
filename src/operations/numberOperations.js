const { tokenTypes, NumberType } = require(__dirname + '/../tokens.js')

//Generic Pattern for all operations: 1 operation between two numbers
function findTokens(tokens, operationType) {
	let i = 2;
	while (i < tokens.length) {
		if (tokens[i].type === tokenTypes.complexNumber
			&& tokens[i - 1].type === operationType
			&& tokens[i - 2].type === tokenTypes.complexNumber)
			return [i - 2, 3];
		i++;
	}
	return [-1, -1];
}

/**
 * Standard operations: addition (+), substraction (-), multiplication (*), division (/), modulo (%) and power (^)
 * a multiplication is implicit when tho numbers are not separated by anything (variables are replace by their content, so 2 6 => 2 * 6 => 12)
 * We can not divide or modulo by 0
 */

const numberAddition = {
	pattern: tokens => findTokens(tokens, tokenTypes.plus),
	evaluate: ([pos, _len], tokens, _variables) => {
		let a = tokens[pos];
		let b = tokens[pos + 2]
		return new NumberType(a.real + b.real, a.complex + b.complex)
	}
}

const numberSubstraction = {
	pattern: tokens =>  findTokens(tokens, tokenTypes.minus),
	evaluate: ([pos, _len], tokens, _variables) => {
		let a = tokens[pos];
		let b = tokens[pos + 2]
		return new NumberType(a.real - b.real, a.complex - b.complex)
	}
}

// (a + ib)(c + id) = (real part)ac - bd, (complex part)ad + bc
function complexMultiplication(a, b) {
	return new NumberType(
		(a.real * b.real) - (a.complex * b.complex),
		(a.real * b.complex) + (a.complex * b.real)
	)
}

const numberMultiplication = {
	pattern: tokens => {
		let [pos, nb] = findTokens(tokens, tokenTypes.mult);
		if (pos !== -1 && nb !== -1)
			return [pos, nb]
		//Special case: Multiplication is implicit when two numbers are next to each other
		let i = 1;
		while (i < tokens.length) {
			if (tokens[i].type === tokenTypes.complexNumber && tokens[i - 1].type === tokenTypes.complexNumber)
				return [i - 1, 2]
			i++;
		}
		return [-1 , -1]
	},
	evaluate: ([pos, len], tokens, _variables) => {
		let a = tokens[pos];
		let b = tokens[pos + len - 1]
		return complexMultiplication(a, b)
	}
}

function complexDivisionByReal(a, b) {
	return new NumberType(a.real / b.real, a.complex / b.real)
}

const numberDivision = {
	pattern: tokens =>  findTokens(tokens, tokenTypes.div),
	evaluate: ([pos, _len], tokens, _variables) => {
		let a = tokens[pos]
		let b = tokens[pos + 2]
		// Conjugate of a complex = same real part, opposite complex part
		let bConjugate = new NumberType(b.real, -b.complex)
		if (b.real === 0 && b.complex === 0) {
			console.error("Can't divide by zero")
			return null
		}
		if (a.complex === 0 && b.complex === 0)
			return new NumberType(a.real / b.real, 0)
		if (a.complex === 0)
			return complexDivisionByReal(a, b)
		return complexDivisionByReal(
			complexMultiplication(a, bConjugate),
			complexMultiplication(b, bConjugate) // Multiplication of a complex by its conjugate is always a real
		)
	}
}

const numberPower = {
	pattern: tokens => findTokens(tokens, tokenTypes.power),
	evaluate: ([pos, _len], tokens, _variables) => {
		let a = tokens[pos]
		let b = tokens[pos + 2]
		if (a.complex !== 0 || b.complex !== 0) {
			console.error("Power of complex numbers is not (yet) supported")
			return null;
		}
		return new NumberType(Math.pow(a.real, b.real), 0)
	}
}

const numberModulo = {
	pattern: tokens => findTokens(tokens, tokenTypes.mod),
	evaluate: ([pos, _len], tokens, _variables) => {
		let a = tokens[pos]
		let b = tokens[pos + 2]
		if (a.complex !== 0 || b.complex !== 0) {
			console.error("Modulo of complex numbers is not (yet) supported")
			return null;
		}
		if (b.real === 0) {
			console.error("Can't modulo by zero")
			return null
		}
		return new NumberType(a.real % b.real, 0)
	}
}

module.exports = {
	numberAddition,
	numberSubstraction,
	numberMultiplication,
	numberDivision,
	numberModulo,
	numberPower
}
