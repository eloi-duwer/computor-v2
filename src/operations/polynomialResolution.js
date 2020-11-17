const { multComplex } = require("./numberOperations")

const { tokenTypes, NumberType } = require(__dirname + '/../tokens.js')
const { subComplex, addComplex, divComplex } = require(__dirname + '/numberOperations.js')

function zeroDegreePolynomial(monomes) {
	if (monomes['0'].real === 0)
		console.log("Every natural real is a root")
	else
		console.log("No root")
}

//ax + b
function firstDegreePolynomial(monomes) {
	let a = monomes['1'] || new NumberType(0, 0)
	let b = monomes['0'] || new NumberType(0 ,0)
	if (a.real === 0) {
		if (b.real === 0)
			console.log("EEvery natural is a root")
		else
			console.log("No root")
	}
	else {
		let res = -b.real / a.real
		console.log(`One root on R: ${res.toString()}`)
	}
}

//ax^2 + bx + c
function secondDegreePolynomial(monomes) {
	let a = monomes['2'] || new NumberType(0, 0)
	let b = monomes['1'] || new NumberType(0, 0)
	let c = monomes['0'] || new NumberType(0, 0)
	let delta = (b.real * b.real) - 4 * a.real * c.real
	if (delta > 0) {
		delta = Math.sqrt(delta)
		console.log(`Two roots on R: ${(-b.real - delta) / (2 * a.real)} and ${(-b.real + delta) / (2 * a.real)}`)
	}
	else if (delta === 0) {
		console.log(`One root on R: ${-b.real / (2 * a.real)}`)
	}
	else {
		delta = new NumberType(0, -Math.sqrt(-delta))
		//console.log(multComplex(new NumberType(2, 0), a))
		//console.log(new NumberType(-b.real, 0), delta)
		divComplex(subComplex(new NumberType(-b.real, 0), delta), multComplex(new NumberType(2, 0), a)).toString()
		console.log(`Two roots on C: ${
			divComplex(subComplex(new NumberType(-b.real, 0), delta), multComplex(new NumberType(2, 0), a)).toString()
		} and ${
			divComplex(addComplex(new NumberType(-b.real, 0), delta), new NumberType(2 * a.real, 0)).toString()
		}`)
	}
}

const polynomialResolution = {
	pattern: tokens => {
		//Strict format: f(x)=0?
		if (tokens.length === 7
			&& (tokens[0].type === tokenTypes.polynomial
				|| (tokens[0].type === tokenTypes.variable && tokens[0].value && tokens[0].value.type === tokenTypes.polynomial))
			&& tokens[1].type === tokenTypes.openParenthesis
			&& tokens[2].type === tokenTypes.variable
			&& tokens[3].type === tokenTypes.closeParenthesis
			&& tokens[4].type === tokenTypes.equal
			&& (tokens[5].type === tokenTypes.complexNumber
				|| (tokens[5].type === tokenTypes.variable && tokens[5].value && tokens[5].value.type === tokenTypes.complexNumber))
			&& tokens[6].type === tokenTypes.questionMark)
			return [0, tokens.length]
		return [-1, -1]
	},
	evaluate: ([_pos, _len], tokens, variables) => {
		let polynomial = tokens[0]
		let nb = tokens[5]
		if (polynomial.type === tokenTypes.variable)
			polynomial = polynomial.value
		if (nb.type === tokenTypes.variable)
			nb = nb.value
		console.log(variables[tokens[0].name].value.toString() + ' = ' + nb.toString())
		let maxPow = Object.keys(polynomial.monomes).reduce((acc, val) => +val > acc ? +val : acc, 0)
		if (maxPow > 2) {
			console.error("Cannot find the root of a polynomial whose degree is > 2")
		}
		else if (Object.keys(polynomial.monomes).some(m => polynomial.monomes[m].complex !== 0) || nb.complex !== 0) {
			console.error("Cannot find the root of a polynomial whose coefficients are complex numbers")
		}
		else {
			let monomes = {...polynomial.monomes}
			if (!monomes['0'])
				monomes['0'] = new NumberType(0, 0)
			monomes['0'] = subComplex(monomes['0'], nb)
			if (maxPow === 0)
				zeroDegreePolynomial(monomes)
			else if (maxPow === 1)
				firstDegreePolynomial(monomes)
			else
				secondDegreePolynomial(monomes)
		}
		return null
	}
}

module.exports = polynomialResolution
