"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProblemGenerator = void 0;
class ProblemGenerator {
    constructor() {
        this.operators = ['+', '-', '*', '/'];
    }
    generate() {
        const operator = this.getRandomOperator();
        let operand1, operand2, answer;
        switch (operator) {
            case '+':
                // Addition: (2 to 100) + (2 to 100)
                operand1 = this.getRandomInt(2, 100);
                operand2 = this.getRandomInt(2, 100);
                answer = operand1 + operand2;
                break;
            case '-':
                // Subtraction: Addition problems in reverse
                operand1 = this.getRandomInt(2, 100);
                operand2 = this.getRandomInt(2, 100);
                answer = operand1;
                operand1 = operand1 + operand2; // Make sure result is positive
                break;
            case '*':
                // Multiplication: (2 to 12) × (2 to 100)
                operand1 = this.getRandomInt(2, 12);
                operand2 = this.getRandomInt(2, 100);
                answer = operand1 * operand2;
                break;
            case '/':
                // Division: Multiplication problems in reverse
                operand1 = this.getRandomInt(2, 12);
                operand2 = this.getRandomInt(2, 100);
                answer = operand1;
                operand1 = operand1 * operand2; // dividend = quotient * divisor
                break;
        }
        // Use proper mathematical symbols
        let displayOperator = operator;
        if (operator === '*') {
            displayOperator = '×';
        }
        else if (operator === '/') {
            displayOperator = '÷';
        }
        const question = `${operand1} ${displayOperator} ${operand2}`;
        return {
            question,
            answer,
            operator,
            operand1,
            operand2
        };
    }
    getRandomOperator() {
        const randomIndex = Math.floor(Math.random() * this.operators.length);
        return this.operators[randomIndex];
    }
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    // Method to generate problems with specific constraints
    generateWithConstraints(operators, minValue = 1, maxValue = 100) {
        const operator = operators[Math.floor(Math.random() * operators.length)];
        let operand1, operand2, answer;
        switch (operator) {
            case '+':
                operand1 = this.getRandomInt(minValue, maxValue);
                operand2 = this.getRandomInt(minValue, maxValue);
                answer = operand1 + operand2;
                break;
            case '-':
                operand1 = this.getRandomInt(minValue, maxValue);
                operand2 = this.getRandomInt(minValue, Math.min(operand1, maxValue));
                answer = operand1 - operand2;
                break;
            case '*':
                const maxMult = Math.min(25, maxValue);
                operand1 = this.getRandomInt(Math.max(2, minValue), maxMult);
                operand2 = this.getRandomInt(Math.max(2, minValue), maxMult);
                answer = operand1 * operand2;
                break;
            case '/':
                const maxDiv = Math.min(25, maxValue);
                operand2 = this.getRandomInt(Math.max(2, minValue), maxDiv);
                const quotient = this.getRandomInt(Math.max(2, minValue), maxDiv);
                operand1 = operand2 * quotient;
                answer = quotient;
                break;
        }
        const question = `${operand1} ${operator} ${operand2}`;
        return {
            question,
            answer,
            operator,
            operand1,
            operand2
        };
    }
}
exports.ProblemGenerator = ProblemGenerator;
//# sourceMappingURL=problemGenerator.js.map