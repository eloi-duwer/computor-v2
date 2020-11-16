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
 * Functions for standard operations, outside of the operation object for reusability with matrixes operations
 */

function addComplex(a, b) {
	return new NumberType(a.real + b.real, a.complex + b.complex)
}

function subComplex(a, b) {
	return new NumberType(a.real - b.real, a.complex - b.complex)
}

// (a + ib)(c + id) = (real part)ac - bd, (complex part)ad + bc
function multComplex(a, b) {
	return new NumberType(
		(a.real * b.real) - (a.complex * b.complex),
		(a.real * b.complex) + (a.complex * b.real)
	)
}

function complexDivisionByReal(a, b) {
	return new NumberType(a.real / b.real, a.complex / b.real)
}

function divComplex(a, b) {
	// Conjugate of a complex = same real part, opposite complex part
	if (b.real === 0 && b.complex === 0) {
		console.error("Can't divide by zero")
		return null
	}
	if (a.complex === 0 && b.complex === 0)
		return new NumberType(a.real / b.real, 0)
	if (b.complex === 0)
		return complexDivisionByReal(a, b)
	let bConjugate = new NumberType(b.real, -b.complex)
	return complexDivisionByReal(
		multComplex(a, bConjugate),
		multComplex(b, bConjugate) // Multiplication of a complex by its conjugate is always a real
	)
}

//TODO add support for complex number for a (at least), this case can occur in polynomials
function powComplex(a, b) {
	if (a.complex !== 0 || b.complex !== 0) {
		console.error("Power of complex numbers is not supported")
		return null;
	}
	return new NumberType(Math.pow(a.real, b.real), 0)
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
		return addComplex(a, b)
	}
}

const numberSubstraction = {
	pattern: tokens =>  findTokens(tokens, tokenTypes.minus),
	evaluate: ([pos, _len], tokens, _variables) => {
		let a = tokens[pos];
		let b = tokens[pos + 2]
		return subComplex(a, b)
	}
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
		return multComplex(a, b)
	}
}


const numberDivision = {
	pattern: tokens =>  findTokens(tokens, tokenTypes.div),
	evaluate: ([pos, _len], tokens, _variables) => {
		let a = tokens[pos]
		let b = tokens[pos + 2]
		return divComplex(a, b)
	}
}

const numberPower = {
	//Special case: Power is right associative, so we check the tokens in reverse order
	pattern: tokens => {
		let i = tokens.length - 3
		while (i >= 0) {
			if (tokens[i].type === tokenTypes.complexNumber
				&& tokens[i + 1].type === tokenTypes.power
				&& tokens[i + 2].type === tokenTypes.complexNumber)
				return [i, 3];
			i--
		}
		return [-1, -1]
	},
	evaluate: ([pos, _len], tokens, _variables) => {
		let a = tokens[pos]
		let b = tokens[pos + 2]
		return powComplex(a, b)
	}
}

const numberModulo = {
	pattern: tokens => findTokens(tokens, tokenTypes.mod),
	evaluate: ([pos, _len], tokens, _variables) => {
		let a = tokens[pos]
		let b = tokens[pos + 2]
		if (a.complex !== 0 || b.complex !== 0) {
			console.error("Modulo of complex numbers is not supported")
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
	numberPower,
	addComplex,
	subComplex,
	multComplex,
	divComplex,
	powComplex
}
