export type Transitions = Record<string, Record<string, string>>;

export default class LexicalAnalyser {
	private _currentState: string;
	private readonly endStates: string[];
	private initialState: string;
	private transitions: Transitions;

	get currentState() {
		return this._currentState;
	}
	private set currentState(state: string) {
		this._currentState = state;
	}

	constructor(transitions: Transitions, endStates: string[], initialState?: string) {
		this.initialState = initialState || "q0";
		this.currentState = this.initialState;
		this.endStates = endStates;
		this.transitions = transitions;
	}

	private verify() {
		if (!this.endStates.includes(this.currentState)) {
			throw new Error("A cadeia dada não foi aceita pelo autômato.");
		}

		return true;
	}

	public test(str: string): boolean {
		this.currentState = this.initialState;

		for (const value of str) {
			const stateTransitions = Object.entries(this.transitions[this.currentState]).map(
				([pattern, destState]) => [new RegExp(pattern, "g"), destState],
			) as [RegExp, string][];

			const transition = stateTransitions.find(([regex]) => regex.test(value));
			if (!transition) {
				throw new Error("Transição não encontrada! A cadeia dada é inválida.");
			}

			this.currentState = transition[1];
		}

		return this.verify();
	}
}
