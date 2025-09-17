import { Problem } from './types';
export declare class ProblemGenerator {
    private operators;
    generate(): Problem;
    private getRandomOperator;
    private getRandomInt;
    generateWithConstraints(operators: Array<'+' | '-' | '*' | '/'>, minValue?: number, maxValue?: number): Problem;
}
//# sourceMappingURL=problemGenerator.d.ts.map